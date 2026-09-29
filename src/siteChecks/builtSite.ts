import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import {
    ADMITTED_API_HOST,
    type Load,
    classify,
    describeLoad,
    dispositionOf,
    filesUnder,
    isAdmitted,
    loadsOf,
    parseMarkup,
} from './assetLoads'
import { IDENTITY_META, IDENTITY_VALUE } from './buildIdentity'
import { fontFaults, fontInventory } from './fontInventory'
import { SHOWCASE_DIR, judgeEmittedShowcase, readShowcaseManifest, sha256Hex } from './showcaseDigests'

/**
 * The built site's verdict, arm by arm: what the deploy's build refuses to finish on (`siteGate`
 * in vitePlugin.ts) and what firstPartyAssets.test.ts asserts over a build of its own. One
 * judgment, two callers, so the suite and the deploy cannot disagree about what is clean.
 *
 * Declared limits, which no arm here reaches: a URL the code assembles at runtime from
 * non-literal parts, a src/href written imperatively on a DOM node, an element a dependency
 * creates without jsx(), and response headers set by the host (netlify.toml).
 */

export const ARMS = {
    unread: 'every emitted file has a disposition in assetLoads.ts DISPOSITIONS, so none ships unread',
    scannerReach: 'the load scanner still reaches every construct this build is known to carry; a miss means it went blind, and a clean verdict would be vacuous',
    thirdPartyLoads: `no load or contact names an origin but the site's own (relative references) and ${ADMITTED_API_HOST} (ADR-40.D3)`,
    unresolvedResources: 'every own-origin resource the markup and stylesheets reference is a file the build emitted, not the SPA fallback page',
    fontParity: 'every self-hosted font is emitted byte-identical, and the built stylesheets name exactly the emitted fonts',
    fontInventory: 'src/assets/fonts is complete: every file fonts.css names exists, every font file is named, and none is fetched from elsewhere',
    apiBase: 'the bundle carries the production API base the deploy declares (.env.production and netlify.toml agree), on the admitted API host',
    showcaseLogs: `every emitted data file is a sample ${SHOWCASE_DIR}/MANIFEST.json digests, byte for byte and under its own name (ADR-33.D8, discharge 2)`,
    buildIdentity: `dist/index.html carries exactly one <meta name="${IDENTITY_META}"> naming the commit it was built from`,
} as const

export type ArmName = keyof typeof ARMS
export const ARM_NAMES = Object.keys(ARMS) as ArmName[]

export interface SiteVerdict {
    /** Every emitted file, relative to the output directory. */
    emitted: string[]
    loads: Load[]
    /** Emitted showcase logs whose digest and name matched the manifest. */
    showcaseMatched: string[]
    faults: Record<ArmName, string[]>
}

export interface SiteExpectation {
    /** The identity the build injected; the arm then also requires the served meta to equal it. */
    identity?: string
}

// The label every fault gives a file: the deploy's publish directory, whatever the output was.
const DIST = 'dist/'
const SITE = 'https://own-origin.invalid/'
const FONTS_DIR = join('src', 'assets', 'fonts')

const sha256 = (path: string): string => sha256Hex(readFileSync(path))

function declaredApiBase(root: string, file: string, pattern: RegExp): string | undefined {
    const path = join(root, file)
    return existsSync(path) ? pattern.exec(readFileSync(path, 'utf8'))?.[1] : undefined
}

function scannerReachFaults(loads: Load[]): string[] {
    const judged = loads.filter((load) => load.kind === 'load')
    // The stylesheets' url() reach is witnessed by the font arm, which needs them to name every font.
    const reach: Record<string, [boolean, string]> = {
        htmlScript: [judged.some((load) => load.file === `${DIST}index.html` && load.construct === '<script> src'), 'a <script src> in dist/index.html'],
        htmlStylesheet: [
            judged.some((load) => load.file === `${DIST}index.html` && load.construct === '<link rel="stylesheet"> href'),
            'a <link rel="stylesheet"> in dist/index.html',
        ],
        jsxElement: [judged.some((load) => load.construct.startsWith('jsx <')), "a jsx() element's loading attribute in a bundle"],
        dynamicImport: [judged.some((load) => load.construct === 'import()'), 'an import() in a bundle'],
        foreignNavigation: [
            loads.some((load) => load.kind === 'navigation' && classify(load.url) === 'third-party'),
            'a navigation to another origin (a link out), read and not judged',
        ],
    }
    return Object.entries(reach)
        .filter(([, [reached]]) => !reached)
        .map(([name, [, what]]) => `${name}: no ${what} was read`)
}

function unresolvedFaults(dist: string, loads: Load[]): string[] {
    const ownResources = loads.filter((load) => load.kind === 'load' && load.fetchesResource && classify(load.url) === 'own-origin')
    if (ownResources.length === 0) return ['no own-origin resource was read at all']
    return ownResources
        .filter((load) => {
            const pathname = decodeURIComponent(new URL(load.url, SITE + load.file.slice(DIST.length)).pathname)
            const path = join(dist, pathname.endsWith('/') ? `${pathname}index.html` : pathname)
            return !existsSync(path) || !statSync(path).isFile()
        })
        .map(describeLoad)
}

function fontParityFaults(root: string, dist: string, emitted: string[], loads: Load[]): string[] {
    const fontsDir = join(root, FONTS_DIR)
    const sourceFonts = filesUnder(fontsDir).filter((path) => dispositionOf(path) === 'font')
    if (sourceFonts.length === 0) return [`no font under ${FONTS_DIR}`]
    const emittedFonts = emitted.filter((path) => dispositionOf(path) === 'font')
    const emittedHashes = new Set(emittedFonts.map((path) => sha256(join(dist, path))))
    const sourceHashes = new Set(sourceFonts.map((path) => sha256(join(fontsDir, path))))
    const namedByStylesheets = new Set(
        loads
            .filter((load) => load.file.endsWith('.css') && classify(load.url) === 'own-origin')
            .map((load) => new URL(load.url, SITE + load.file.slice(DIST.length)).pathname.slice(1))
            .filter((path) => dispositionOf(path) === 'font'),
    )
    return [
        ...sourceFonts.filter((path) => !emittedHashes.has(sha256(join(fontsDir, path)))).sort()
            .map((path) => `${FONTS_DIR}/${path}: no byte-identical emitted twin`),
        ...emittedFonts.filter((path) => !sourceHashes.has(sha256(join(dist, path)))).sort()
            .map((path) => `${DIST}${path}: emitted from no source font`),
        ...[...namedByStylesheets].filter((path) => !emittedFonts.includes(path)).sort()
            .map((path) => `${DIST}${path}: named by a built stylesheet, not emitted`),
        ...emittedFonts.filter((path) => !namedByStylesheets.has(path)).sort()
            .map((path) => `${DIST}${path}: emitted, named by no built stylesheet`),
    ]
}

function fontInventoryFaults(root: string): string[] {
    const fonts = fontInventory(join(root, FONTS_DIR))
    if (fonts.named.length === 0) return [`${FONTS_DIR}/fonts.css yielded no url() at all — the reader is blind, not the tree clean`]
    const faults = fontFaults(fonts)
    return [
        ...faults.missing.map((path) => `${FONTS_DIR}/${path}: named by fonts.css, absent on disk`),
        ...faults.unnamed.map((path) => `${FONTS_DIR}/${path}: on disk, named by no url() in fonts.css`),
        ...faults.notSelfHosted.map((url) => `${FONTS_DIR}/fonts.css: url(${url}) is not a file beside it`),
    ]
}

function apiBaseFaults(root: string, dist: string, emitted: string[]): string[] {
    const envProduction = declaredApiBase(root, '.env.production', /^VITE_API_BASE=(\S+)$/m)
    const netlifyToml = declaredApiBase(root, 'netlify.toml', /^\s*VITE_API_BASE\s*=\s*"([^"]+)"/m)
    if (envProduction === undefined) return ['VITE_API_BASE is not declared in .env.production']
    const faults: string[] = []
    if (netlifyToml !== envProduction) {
        faults.push(`the deploy (netlify.toml: ${netlifyToml ?? 'undeclared'}) and the local production build (.env.production: ${envProduction}) disagree`)
    }
    if (classify(envProduction) !== 'admitted-api') {
        faults.push(`${envProduction} is a new recipient: ADR-40.D3 decides, not this check`)
    }
    const shipsIt = emitted
        .filter((path) => dispositionOf(path) === 'js')
        .some((path) => readFileSync(join(dist, path), 'utf8').includes(JSON.stringify(envProduction)))
    if (!shipsIt) faults.push(`no emitted script carries ${envProduction}: this is not the build the deploy runs`)
    return faults
}

function identityFaults(dist: string, expected: string | undefined): string[] {
    const index = join(dist, 'index.html')
    if (!existsSync(index)) return [`${DIST}index.html was not emitted`]
    const metas = Array.from(parseMarkup(readFileSync(index, 'utf8'), 'text/html').querySelectorAll(`meta[name="${IDENTITY_META}"]`))
    if (metas.length !== 1) return [`${DIST}index.html carries ${metas.length} <meta name="${IDENTITY_META}">, not exactly one`]
    const value = metas[0]?.getAttribute('content') ?? ''
    if (!IDENTITY_VALUE.test(value)) return [`${DIST}index.html: content="${value}" is not a 40-hex commit with an optional -dirty`]
    if (expected !== undefined && value !== expected) return [`${DIST}index.html: content="${value}", the build computed ${expected}`]
    return []
}

export function judgeBuiltSite(root: string, dist: string, expect: SiteExpectation = {}): SiteVerdict {
    const emitted = filesUnder(dist).sort()
    const loads = emitted.flatMap((path) => {
        const disposition = dispositionOf(path)
        return disposition === undefined ? [] : loadsOf(`${DIST}${path}`, readFileSync(join(dist, path), 'utf8'), disposition)
    })
    const judged = loads.filter((load) => load.kind === 'load')
    const showcase = judgeEmittedShowcase(dist, emitted, readShowcaseManifest(join(root, SHOWCASE_DIR)))
    return {
        emitted,
        loads,
        showcaseMatched: showcase.matched,
        faults: {
            unread: emitted.filter((path) => dispositionOf(path) === undefined).map((path) => `${DIST}${path}`),
            scannerReach: scannerReachFaults(loads),
            thirdPartyLoads: judged.filter((load) => !isAdmitted(classify(load.url))).map(describeLoad),
            unresolvedResources: unresolvedFaults(dist, loads),
            fontParity: fontParityFaults(root, dist, emitted, loads),
            fontInventory: fontInventoryFaults(root),
            apiBase: apiBaseFaults(root, dist, emitted),
            showcaseLogs: showcase.faults,
            buildIdentity: identityFaults(dist, expect.identity),
        },
    }
}

/** The failing arms as the build prints them: each arm's rule, then each distinct fault once, with its count. */
export function describeFaults(verdict: SiteVerdict): string {
    return ARM_NAMES.filter((arm) => verdict.faults[arm].length > 0)
        .map((arm) => {
            const counts = new Map<string, number>()
            for (const fault of verdict.faults[arm]) counts.set(fault, (counts.get(fault) ?? 0) + 1)
            const lines = [...counts].map(([fault, count]) => `    ${fault}${count > 1 ? ` (x${count})` : ''}`)
            return `  ${arm} — ${ARMS[arm]}\n${lines.join('\n')}`
        })
        .join('\n')
}
