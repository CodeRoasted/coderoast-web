import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import {
    ADMITTED_API_HOST,
    type Load,
    classify,
    cssLoads,
    describeLoad,
    dispositionOf,
    filesUnder,
    isAdmitted,
    loadsOf,
    markupLoads,
    scriptLoads,
} from './assetLoads'

/**
 * A visitor's browser contacts no third-party origin for the site's own assets (DN-120.D8).
 *
 * The subject is the production build, because that is what the browser receives: a dependency's
 * stylesheet, a component's <img> or a bundle's fetch() reaches the visitor only through it, and
 * a scan of index.html alone would be blind to all three. So this file builds the site once,
 * with the repo's own Vite config in production mode, into a scratch directory, and reads every
 * file the build emitted. It runs Vite in a child process: esbuild refuses to start inside the
 * jsdom environment the suite uses.
 *
 * Declared limits, which no arm here reaches: a URL the code assembles at runtime from
 * non-literal parts, a src/href written imperatively on a DOM node, an element a dependency
 * creates without jsx(), and response headers set by the host (netlify.toml).
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const VITE_BIN = join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js')
const BUILD_TIMEOUT_MS = 240_000
const FONTS_DIR = join(ROOT, 'src', 'assets', 'fonts')
const SITE = 'https://own-origin.invalid/'

const run = promisify(execFile)

const sha256 = (path: string): string => createHash('sha256').update(readFileSync(path)).digest('hex')

// The deploy builds with no test-runner state: NODE_ENV=test would change React's build, and an
// inherited VITE_* variable would override .env.production.
function productionEnv(): NodeJS.ProcessEnv {
    return Object.fromEntries(
        Object.entries(process.env).filter(([name]) => name !== 'NODE_ENV' && name !== 'TEST' && !name.startsWith('VITE')),
    )
}

async function buildProduction(outDir: string): Promise<void> {
    const args = [VITE_BIN, 'build', '--mode', 'production', '--outDir', outDir, '--emptyOutDir', '--logLevel', 'warn']
    try {
        await run(process.execPath, args, { cwd: ROOT, env: productionEnv(), maxBuffer: 16 * 1024 * 1024 })
    } catch (error) {
        const failed = error as { stdout?: string; stderr?: string; message: string }
        throw new Error(`vite build failed: ${failed.message}\n--- stdout\n${failed.stdout ?? ''}\n--- stderr\n${failed.stderr ?? ''}`)
    }
}

function declaredApiBase(file: string, pattern: RegExp): string | undefined {
    return pattern.exec(readFileSync(join(ROOT, file), 'utf8'))?.[1]
}

describe('the production build', () => {
    let dist = ''
    let emitted: string[] = []
    let loads: Load[] = []

    beforeAll(async () => {
        dist = mkdtempSync(join(tmpdir(), 'coderoast-web-dist-'))
        await buildProduction(dist)
        emitted = filesUnder(dist).sort()
        loads = emitted.flatMap((path) => {
            const disposition = dispositionOf(path)
            return disposition === undefined ? [] : loadsOf(`dist/${path}`, readFileSync(join(dist, path), 'utf8'), disposition)
        })
    }, BUILD_TIMEOUT_MS)

    afterAll(() => {
        if (dist !== '') rmSync(dist, { recursive: true, force: true })
    })

    it('gives every emitted file a disposition, so none ships unread', () => {
        const unread = emitted.filter((path) => dispositionOf(path) === undefined).map((path) => `dist/${path}`)
        expect(unread, 'give each a disposition in assetLoads.ts DISPOSITIONS: can this file type name an origin?').toEqual([])
    })

    it('names no origin but its own and the admitted API host, in any load or contact', () => {
        const judged = loads.filter((load) => load.kind === 'load')
        // The stylesheets' url() reach is witnessed by the font arm below, which needs them to name every font.
        const reach = {
            htmlScript: judged.some((load) => load.file === 'dist/index.html' && load.construct === '<script> src'),
            htmlStylesheet: judged.some((load) => load.file === 'dist/index.html' && load.construct === '<link rel="stylesheet"> href'),
            jsxElement: judged.some((load) => load.construct.startsWith('jsx <')),
            dynamicImport: judged.some((load) => load.construct === 'import()'),
            foreignNavigation: loads.some((load) => load.kind === 'navigation' && classify(load.url) === 'third-party'),
        }
        expect(reach, 'a false here means the scanner went blind to that construct, so a clean verdict would be vacuous').toEqual({
            htmlScript: true,
            htmlStylesheet: true,
            jsxElement: true,
            dynamicImport: true,
            foreignNavigation: true,
        })
        const offending = judged.filter((load) => !isAdmitted(classify(load.url))).map(describeLoad)
        expect(offending, `admitted: the site's own origin (relative references) and ${ADMITTED_API_HOST}; ${judged.length} loads read`).toEqual([])
    })

    it('resolves every own-origin resource its markup and stylesheets reference to an emitted file', () => {
        const ownResources = loads.filter((load) => load.kind === 'load' && load.fetchesResource && classify(load.url) === 'own-origin')
        expect(ownResources.length, 'no own-origin resource read at all').toBeGreaterThan(0)
        const unresolved = ownResources.filter((load) => {
            const pathname = decodeURIComponent(new URL(load.url, SITE + load.file.slice('dist/'.length)).pathname)
            const path = join(dist, pathname.endsWith('/') ? `${pathname}index.html` : pathname)
            return !existsSync(path) || !statSync(path).isFile()
        })
        expect(unresolved.map(describeLoad), 'each names a file the build did not emit, so the browser gets the SPA fallback page').toEqual([])
    })

    it('emits every self-hosted font byte-identical, and its stylesheets name exactly those fonts', () => {
        const sourceFonts = filesUnder(FONTS_DIR).filter((path) => dispositionOf(path) === 'font')
        const emittedFonts = emitted.filter((path) => dispositionOf(path) === 'font')
        const emittedByHash = new Map(emittedFonts.map((path) => [sha256(join(dist, path)), path]))
        const sourceHashes = new Set(sourceFonts.map((path) => sha256(join(FONTS_DIR, path))))
        expect(sourceFonts.length, 'no font under src/assets/fonts').toBeGreaterThan(0)
        expect({
            notEmitted: sourceFonts.filter((path) => !emittedByHash.has(sha256(join(FONTS_DIR, path)))).sort(),
            emittedFromNoSource: emittedFonts.filter((path) => !sourceHashes.has(sha256(join(dist, path)))).sort(),
        }, 'source fonts with no byte-identical emitted twin, and emitted fonts with no source').toEqual({ notEmitted: [], emittedFromNoSource: [] })
        const namedByStylesheets = new Set(
            loads
                .filter((load) => load.file.endsWith('.css') && classify(load.url) === 'own-origin')
                .map((load) => new URL(load.url, SITE + load.file.slice('dist/'.length)).pathname.slice(1))
                .filter((path) => dispositionOf(path) === 'font'),
        )
        expect([...namedByStylesheets].sort(), 'font files the built stylesheets name, against the font files the build emitted')
            .toEqual([...emittedFonts].sort())
    })

    it('carries the production API base the deploy declares, on the admitted API host', () => {
        const declared = {
            envProduction: declaredApiBase('.env.production', /^VITE_API_BASE=(\S+)$/m),
            netlifyToml: declaredApiBase('netlify.toml', /^\s*VITE_API_BASE\s*=\s*"([^"]+)"/m),
        }
        expect(declared.envProduction, 'VITE_API_BASE not declared in .env.production').toBeDefined()
        expect(declared.netlifyToml, 'the deploy (netlify.toml) and the local production build (.env.production) must agree').toBe(declared.envProduction)
        const base = declared.envProduction ?? ''
        expect(classify(base), `${base} is a new recipient: DN-120.D8 decides, not this test`).toBe('admitted-api')
        const shipsIt = emitted
            .filter((path) => dispositionOf(path) === 'js')
            .some((path) => readFileSync(join(dist, path), 'utf8').includes(JSON.stringify(base)))
        expect(shipsIt, `no emitted script carries ${base}: the build under test is not the one the deploy runs`).toBe(true)
    })
})

describe('the load scanner can fail (fixtures, one fault class each)', () => {
    const judged = (loads: Load[]): string[][] =>
        loads.filter((load) => load.kind === 'load' && !isAdmitted(classify(load.url))).map((load) => [load.construct, load.url])

    it('reds the three Google Fonts tags bd8fb92 removed, re-added to the real index.html', () => {
        const stylesheet = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap'
        const removed = [
            '<link rel="preconnect" href="https://fonts.googleapis.com" />',
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
            `<link href="${stylesheet}" rel="stylesheet" />`,
        ].join('\n')
        const real = readFileSync(join(ROOT, 'index.html'), 'utf8')
        const planted = real.replace('</head>', `${removed}\n</head>`)
        // Relative to the real file's own verdict, so a dirty index.html reds the build arm alone.
        expect(judged(markupLoads('index.html', planted, 'text/html'))).toEqual([
            ...judged(markupLoads('index.html', real, 'text/html')),
            ['<link rel="preconnect"> href', 'https://fonts.googleapis.com'],
            ['<link rel="preconnect"> href', 'https://fonts.gstatic.com'],
            ['<link rel="stylesheet"> href', stylesheet],
        ])
    })

    it('judges loads only: a link, a commented-out tag, a canonical and the API origin do not trip it', () => {
        const html = `<!doctype html><html><head>
            <!-- <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter"> -->
            <link rel="canonical" href="https://coderoast.fr/">
            <link rel="preconnect" href="https://api.coderoast.fr" crossorigin>
            <link rel="dns-prefetch" href="//cdn.example.net">
            </head><body><a href="https://github.com/CodeRoasted">GitHub</a></body></html>`
        const loads = markupLoads('fixture.html', html, 'text/html')
        expect(judged(loads)).toEqual([['<link rel="dns-prefetch"> href', '//cdn.example.net']])
        expect(loads.filter((load) => load.kind === 'navigation').map((load) => load.url)).toEqual(['https://github.com/CodeRoasted'])
        expect(loads.map((load) => classify(load.url))).toContain('admitted-api')
    })

    it('reds a third-party srcset member, inline style, <style> import, inline script and frame', () => {
        const html = `<!doctype html><html><head><style>@import "https://fonts.example/x.css";</style></head><body>
            <img srcset="/a.png 1x, https://img.example/b.png 2x" alt="">
            <div style="background:url(https://img.example/bg.png)"></div>
            <iframe src="https://video.example/embed/1"></iframe>
            <script>fetch("https://tracker.example/p")</script>
            </body></html>`
        expect(judged(markupLoads('fixture.html', html, 'text/html'))).toEqual([
            ['<style> @import', 'https://fonts.example/x.css'],
            ['<img> srcset', 'https://img.example/b.png'],
            ['<div style> url()', 'https://img.example/bg.png'],
            ['<iframe> src', 'https://video.example/embed/1'],
            ['<script> fetch()', 'https://tracker.example/p'],
        ])
    })

    it('reds third-party @import (minified too), url(), image-set() and protocol-relative CSS, and skips comments and data: URIs', () => {
        const css = [
            '@import url("https://fonts.googleapis.com/css2?family=Inter");',
            '@import"https://fonts.googleapis.com/css2?family=Roboto";',
            '/* url(https://comment.example/x.woff2) */',
            "@font-face{font-family:'Inter';src:url(https://fonts.gstatic.com/s/inter.woff2) format('woff2')}",
            '.a{background:url(//cdn.example/x.png)}',
            '.b{background:url(data:image/png;base64,AAAA)}',
            '.c{background-image:image-set("https://img.example/c.png" 1x, url(/c2.png) 2x)}',
            ".d{background:url('/assets/own.png')}",
        ].join('\n')
        expect(judged(cssLoads('fixture.css', css))).toEqual([
            ['@import', 'https://fonts.googleapis.com/css2?family=Inter'],
            ['@import', 'https://fonts.googleapis.com/css2?family=Roboto'],
            ['url()', 'https://fonts.gstatic.com/s/inter.woff2'],
            ['url()', '//cdn.example/x.png'],
            ['image-set()', 'https://img.example/c.png'],
        ])
    })

    it('reds third-party loads a bundle makes, and skips navigation, prose and the API origin', () => {
        const bundle = [
            'x.jsx("link",{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Inter"});',
            'x.jsx("img",{src:"https://images.example/hero.png",alt:""});',
            'x.jsxs("a",{href:"https://github.com/CodeRoasted",children:["GitHub"]});',
            'x.jsx("img",{src:"/mug.svg",alt:"CodeRoast"});',
            'import("https://cdn.example/module.js");',
            'fetch(`https://tracker.example/event?id=${id}`);',
            'navigator.sendBeacon("https://analytics.example/b",data);',
            'new WebSocket("wss://api.coderoast.fr/api/v1/ws/engine");',
            'const face="@font-face{src:url(https://fonts.gstatic.com/s/x.woff2)}";',
            'const hero=`background:url(\'https://cdn.example/${name}.png\')`;',
            'const yaml="sinks:\\n  - endpoint: http://collector:8080";',
        ].join('\n')
        expect(judged(scriptLoads('bundle.js', bundle))).toEqual([
            ['jsx <link rel="stylesheet"> href', 'https://fonts.googleapis.com/css2?family=Inter'],
            ['jsx <img> src', 'https://images.example/hero.png'],
            ['import()', 'https://cdn.example/module.js'],
            ['fetch()', 'https://tracker.example/event?id=${…}'],
            ['sendBeacon()', 'https://analytics.example/b'],
            ['css-in-js url()', 'https://fonts.gstatic.com/s/x.woff2'],
            ['css-in-js url()', 'https://cdn.example/${…}.png'],
        ])
    })

    it('reds a third-party image in an SVG, and does not read a namespace declaration as a load', () => {
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
            + '<image xlink:href="https://img.example/i.png"/><use href="#glyph"/></svg>'
        expect(judged(markupLoads('fixture.svg', svg, 'image/svg+xml'))).toEqual([['<image> xlink:href', 'https://img.example/i.png']])
    })

    it('leaves a file type with no disposition unread, which the build arm reports', () => {
        expect(['site.webmanifest', '_headers', 'assets/app.js', 'assets/inter-latin-Dx4kXJAl.woff2'].map(dispositionOf))
            .toEqual([undefined, undefined, 'js', 'font'])
    })
})
