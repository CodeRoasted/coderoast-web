import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { JSDOM } from 'jsdom'
import ts from 'typescript'

/**
 * Every place a shipped file makes the visitor's browser contact an origin, extracted from the
 * file's own grammar: a real HTML/SVG parser for markup, a CSS tokenizer for stylesheets, the
 * TypeScript parser for bundles. A URL is read only where the browser would FETCH or CONTACT it;
 * a navigation (<a href>, <form action>) is recorded separately and never judged, and the prose a
 * bundle carries (log samples, YAML examples, error texts) is not a load position at all.
 *
 * Two callers read the build through this one file: the test suite, and the deploy's own build
 * (`siteGate` in vitePlugin.ts), which refuses to finish on a third-party load.
 *
 * Why the admission list has exactly one host: DN-120.D8 removes the one independent recipient the
 * site had (Google Fonts) and admits only recipients CodeRoast contracts with. The site's own
 * origin is spelled by relative references. `api.coderoast.fr` is CodeRoast's own server, fetched
 * at runtime by design as the production VITE_API_BASE; its host is a processor in that slot's
 * register, not an independent recipient. Admitting a second host is a new recipient, so it is a
 * decision against DN-120.D8, never an edit to make this file green.
 */
export const ADMITTED_API_HOST = 'api.coderoast.fr'

export type LoadKind = 'load' | 'navigation'

export interface Load {
    /** The shipped file the reference was read from, e.g. `dist/index.html`. */
    file: string
    /** The grammar position, e.g. `<link rel="stylesheet"> href`, `url()`, `jsx <img> src`, `fetch()`. */
    construct: string
    url: string
    kind: LoadKind
    /** False for a contact that names no file of its own: a frame's document, a preconnect, a JS call. */
    fetchesResource: boolean
}

export type Verdict = 'inline' | 'own-origin' | 'admitted-api' | 'third-party' | 'unrecognized'

const NETWORK_SCHEMES = new Set(['http:', 'https:', 'ws:', 'wss:'])
const INLINE_SCHEMES = new Set(['data:', 'blob:', 'about:'])

export function classify(url: string): Verdict {
    const trimmed = url.trim()
    if (trimmed.startsWith('#')) return 'inline'
    const scheme = /^([a-z][a-z0-9+.-]*:)/i.exec(trimmed)?.[1]?.toLowerCase()
    if (scheme !== undefined && INLINE_SCHEMES.has(scheme)) return 'inline'
    if (scheme !== undefined && !NETWORK_SCHEMES.has(scheme)) return 'unrecognized'
    if (scheme === undefined && !trimmed.startsWith('//')) return 'own-origin'
    let host: string
    try {
        host = new URL(trimmed, 'https://own-origin.invalid/').hostname
    } catch {
        return 'unrecognized'
    }
    return host === ADMITTED_API_HOST ? 'admitted-api' : 'third-party'
}

export function isAdmitted(verdict: Verdict): boolean {
    return verdict === 'inline' || verdict === 'own-origin' || verdict === 'admitted-api'
}

export function describeLoad(load: Load): string {
    return `${load.file}: ${load.construct} -> ${load.url} [${classify(load.url)}]`
}

// ---------------------------------------------------------------------------------------------
// CSS
// ---------------------------------------------------------------------------------------------

const CSS_COMMENT = /\/\*[\s\S]*?\*\//g
// One left-to-right pass. `@import` is tried before `url(` so `@import url(x)` is ONE load, and
// image-set() consumes its own url() members for the same reason. `@import\s*`, not `\s+`: the
// build's minifier writes `@import"https://…"` with no space.
const CSS_LOAD =
    /@import\s*(?:url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]*))\s*\)|"([^"]*)"|'([^']*)')|(?:-webkit-)?image-set\(((?:[^()]|\([^()]*\))*)\)|url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]*))\s*\)/gi
const IMAGE_SET_MEMBER = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]*))\s*\)|"([^"]*)"|'([^']*)'/g
const CSS_HINT = /url\(|@import|image-set\(/i

function firstDefined(match: RegExpExecArray, from: number, to: number): string | undefined {
    for (let group = from; group <= to; group++) {
        if (match[group] !== undefined) return match[group]
    }
    return undefined
}

export function cssLoads(file: string, css: string, prefix = ''): Load[] {
    const loads: Load[] = []
    const text = css.replace(CSS_COMMENT, '')
    for (const match of text.matchAll(CSS_LOAD)) {
        const imported = firstDefined(match, 1, 5)
        if (imported !== undefined) {
            loads.push({ file, construct: `${prefix}@import`, url: imported, kind: 'load', fetchesResource: true })
            continue
        }
        const imageSet = match[6]
        if (imageSet !== undefined) {
            for (const member of imageSet.matchAll(IMAGE_SET_MEMBER)) {
                const url = firstDefined(member, 1, 5)
                if (url !== undefined && url !== '') {
                    loads.push({ file, construct: `${prefix}image-set()`, url, kind: 'load', fetchesResource: true })
                }
            }
            continue
        }
        const url = firstDefined(match, 7, 9)
        if (url !== undefined && url !== '') {
            loads.push({ file, construct: `${prefix}url()`, url, kind: 'load', fetchesResource: true })
        }
    }
    return loads
}

// ---------------------------------------------------------------------------------------------
// Elements — one table for parsed markup and for the jsx() calls a React bundle makes
// ---------------------------------------------------------------------------------------------

const LOADING_ATTRIBUTES: Record<string, readonly string[]> = {
    script: ['src', 'href', 'xlink:href'],
    link: ['href', 'imagesrcset'],
    img: ['src', 'srcset'],
    iframe: ['src'],
    frame: ['src'],
    source: ['src', 'srcset'],
    video: ['src', 'poster'],
    audio: ['src'],
    track: ['src'],
    embed: ['src'],
    object: ['data'],
    input: ['src'],
    image: ['href', 'xlink:href'],
    use: ['href', 'xlink:href'],
    feimage: ['href', 'xlink:href'],
    base: ['href'],
    body: ['background'],
}
const NAVIGATING_ATTRIBUTES: Record<string, readonly string[]> = {
    a: ['href', 'xlink:href'],
    area: ['href'],
    form: ['action'],
}
// A frame loads a document that may be an SPA route; <base> redirects every relative reference.
// Neither names a file that must exist, but both are judged for origin.
const NO_RESOURCE_TAGS = new Set(['iframe', 'frame', 'base'])
// The only link relations that fetch nothing. Any other value, an unknown one or none at all, is
// judged as a load: a new relation fails closed.
const NON_LOADING_LINK_RELS = new Set([
    'alternate', 'author', 'bookmark', 'canonical', 'external', 'help', 'license', 'me', 'next',
    'nofollow', 'noopener', 'noreferrer', 'opener', 'prev', 'privacy-policy', 'search', 'tag',
    'terms-of-service',
])
const CONTACT_ONLY_LINK_RELS = new Set(['preconnect', 'dns-prefetch'])
const SRCSET_ATTRIBUTES = new Set(['srcset', 'imagesrcset'])

function srcsetUrls(value: string): string[] {
    const urls: string[] = []
    let at = 0
    while (at < value.length) {
        while (at < value.length && /[\s,]/.test(value.charAt(at))) at++
        const start = at
        while (at < value.length && !/\s/.test(value.charAt(at))) at++
        let url = value.slice(start, at)
        if (url.endsWith(',')) {
            url = url.replace(/,+$/, '')
        } else {
            while (at < value.length && value.charAt(at) !== ',') at++
        }
        if (url !== '') urls.push(url)
    }
    return urls
}

function linkRel(attribute: (name: string) => string | undefined): { label: string; loads: boolean; fetchesResource: boolean } {
    const rel = attribute('rel')
    const tokens = (rel ?? '').toLowerCase().split(/\s+/).filter((token) => token !== '')
    const loads = tokens.length === 0 || tokens.some((token) => !NON_LOADING_LINK_RELS.has(token))
    const fetchesResource = !tokens.every((token) => CONTACT_ONLY_LINK_RELS.has(token))
    return { label: rel === undefined ? ' rel=?' : ` rel="${rel}"`, loads, fetchesResource }
}

function elementLoads(file: string, prefix: string, rawTag: string, attribute: (name: string) => string | undefined): Load[] {
    const tag = rawTag.toLowerCase()
    const loads: Load[] = []
    for (const name of NAVIGATING_ATTRIBUTES[tag] ?? []) {
        const url = attribute(name)
        if (url !== undefined && url.trim() !== '') {
            loads.push({ file, construct: `${prefix}<${tag}> ${name}`, url: url.trim(), kind: 'navigation', fetchesResource: false })
        }
    }
    const names = LOADING_ATTRIBUTES[tag]
    if (names === undefined) return loads
    let label = ''
    let fetchesResource = !NO_RESOURCE_TAGS.has(tag)
    if (tag === 'link') {
        const rel = linkRel(attribute)
        if (!rel.loads) return loads
        label = rel.label
        fetchesResource = rel.fetchesResource
    }
    for (const name of names) {
        const value = attribute(name)
        if (value === undefined || value.trim() === '') continue
        const urls = SRCSET_ATTRIBUTES.has(name) ? srcsetUrls(value) : [value.trim()]
        for (const url of urls) {
            loads.push({ file, construct: `${prefix}<${tag}${label}> ${name}`, url, kind: 'load', fetchesResource })
        }
    }
    return loads
}

export type MarkupType = 'text/html' | 'image/svg+xml'

// jsdom's parser, named rather than taken from the environment: the build runs in plain Node,
// which has no DOMParser, and the suite's jsdom environment must not be the reason the two
// callers parse alike.
let parser: DOMParser | undefined

export function parseMarkup(text: string, type: MarkupType): Document {
    parser ??= new (new JSDOM('').window.DOMParser)()
    return parser.parseFromString(text, type)
}

export function markupLoads(file: string, text: string, type: MarkupType): Load[] {
    const document = parseMarkup(text, type)
    if (type === 'image/svg+xml' && document.getElementsByTagName('parsererror').length > 0) {
        throw new Error(`${file}: not well-formed SVG, so its loads cannot be read`)
    }
    const loads: Load[] = []
    for (const element of Array.from(document.querySelectorAll('*'))) {
        const tag = element.localName.toLowerCase()
        const attribute = (name: string): string | undefined => element.getAttribute(name) ?? undefined
        loads.push(...elementLoads(file, '', tag, attribute))
        const style = element.getAttribute('style')
        if (style !== null) loads.push(...cssLoads(file, style, `<${tag} style> `))
        if (tag === 'style') loads.push(...cssLoads(file, element.textContent ?? '', '<style> '))
        if (tag === 'script' && !element.hasAttribute('src') && !element.hasAttribute('href')) {
            loads.push(...scriptLoads(file, element.textContent ?? '', '<script> '))
        }
    }
    return loads
}

// ---------------------------------------------------------------------------------------------
// Bundles
// ---------------------------------------------------------------------------------------------

const JSX_FACTORIES = new Set(['jsx', 'jsxs', 'jsxDEV', 'createElement'])
const CONTACT_CALLEES = new Set(['fetch', 'WebSocket', 'EventSource', 'Worker', 'SharedWorker', 'importScripts', 'sendBeacon'])
const ORIGIN_IN_TEMPLATE_HEAD = /^(?:[a-z][a-z0-9+.-]*:)?\/\/[^/?#]+[/?#]/i

function calleeName(expression: ts.Expression): string | undefined {
    if (ts.isIdentifier(expression)) return expression.text
    if (ts.isPropertyAccessExpression(expression)) return expression.name.text
    return undefined
}

// A template's text with each substitution shown as a hole, so a URL split across `${}` is read
// whole: the origin of `url('https://cdn.example/${name}.png')` is fixed by its literal part.
const TEMPLATE_HOLE = '${…}'

function templateText(node: ts.TemplateExpression): string {
    return node.head.text + node.templateSpans.map((span) => TEMPLATE_HOLE + span.literal.text).join('')
}

// A URL the bundle spells literally. A template counts only when its head alone fixes the origin.
function literalUrl(node: ts.Node | undefined): string | undefined {
    if (node === undefined) return undefined
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
    if (ts.isTemplateExpression(node) && ORIGIN_IN_TEMPLATE_HEAD.test(node.head.text)) return templateText(node)
    return undefined
}

// JSX prop names as the markup attributes they render: srcSet -> srcset, xlinkHref -> xlink:href.
function jsxProps(props: ts.ObjectLiteralExpression): Map<string, string | undefined> {
    const byName = new Map<string, string | undefined>()
    for (const property of props.properties) {
        if (!ts.isPropertyAssignment(property) && !ts.isShorthandPropertyAssignment(property)) continue
        const key = property.name
        const raw = ts.isIdentifier(key) || ts.isStringLiteral(key) ? key.text : undefined
        if (raw === undefined) continue
        const name = raw.toLowerCase() === 'xlinkhref' ? 'xlink:href' : raw.toLowerCase()
        const value = ts.isPropertyAssignment(property) ? literalUrl(property.initializer) : undefined
        byName.set(name, value)
    }
    return byName
}

function callLoads(file: string, prefix: string, node: ts.CallExpression | ts.NewExpression): Load[] {
    const args: readonly ts.Expression[] = node.arguments ?? []
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
        const url = literalUrl(args[0])
        return url === undefined ? [] : [{ file, construct: `${prefix}import()`, url, kind: 'load', fetchesResource: false }]
    }
    const name = calleeName(node.expression)
    if (name === undefined) return []
    const tagNode = args[0]
    const propsNode = args[1]
    if (ts.isCallExpression(node) && JSX_FACTORIES.has(name) && tagNode !== undefined && ts.isStringLiteral(tagNode)
        && propsNode !== undefined && ts.isObjectLiteralExpression(propsNode)) {
        const props = jsxProps(propsNode)
        return elementLoads(file, `${prefix}jsx `, tagNode.text, (attribute) => props.get(attribute))
            .map((load) => ({ ...load, fetchesResource: false }))
    }
    const isServiceWorkerRegister = name === 'register' && ts.isPropertyAccessExpression(node.expression)
        && calleeName(node.expression.expression) === 'serviceWorker'
    if (CONTACT_CALLEES.has(name) || isServiceWorkerRegister) {
        const url = literalUrl(tagNode)
        const construct = `${prefix}${ts.isNewExpression(node) ? 'new ' : ''}${name}()`
        return url === undefined ? [] : [{ file, construct, url, kind: 'load', fetchesResource: false }]
    }
    return []
}

export function scriptLoads(file: string, js: string, prefix = ''): Load[] {
    const source = ts.createSourceFile(file, js, ts.ScriptTarget.Latest, false, ts.ScriptKind.JS)
    const loads: Load[] = []
    const visit = (node: ts.Node): void => {
        const text = ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) ? node.text
            : ts.isTemplateExpression(node) ? templateText(node) : undefined
        if (text !== undefined && CSS_HINT.test(text)) {
            loads.push(...cssLoads(file, text, `${prefix}css-in-js `).map((load) => ({ ...load, fetchesResource: false })))
        }
        if (ts.isCallExpression(node) || ts.isNewExpression(node)) loads.push(...callLoads(file, prefix, node))
        ts.forEachChild(node, visit)
    }
    visit(source)
    return loads
}

// ---------------------------------------------------------------------------------------------
// Shipped files
// ---------------------------------------------------------------------------------------------

/** Every file under `dir`, as `/`-separated paths relative to it. */
export function filesUnder(dir: string, prefix = ''): string[] {
    return readdirSync(join(dir, prefix), { withFileTypes: true }).flatMap((entry) => {
        const path = prefix === '' ? entry.name : `${prefix}/${entry.name}`
        return entry.isDirectory() ? filesUnder(dir, path) : [path]
    })
}

export type Disposition = 'html' | 'svg' | 'css' | 'js' | 'font' | 'data'

// Every file the build emits must have one. A font or a log sample is fetched as bytes and never
// interpreted as markup, so it can name no origin. Anything else, a web manifest or a _headers
// file included, can, and must be given a disposition here before it ships.
const DISPOSITIONS: Record<string, Disposition> = {
    '.html': 'html',
    '.svg': 'svg',
    '.css': 'css',
    '.js': 'js',
    '.woff2': 'font',
    '.log': 'data',
}

export function dispositionOf(path: string): Disposition | undefined {
    const dot = path.lastIndexOf('.')
    const slash = path.lastIndexOf('/')
    return dot > slash ? DISPOSITIONS[path.slice(dot).toLowerCase()] : undefined
}

export function loadsOf(file: string, text: string, disposition: Disposition): Load[] {
    switch (disposition) {
        case 'html':
            return markupLoads(file, text, 'text/html')
        case 'svg':
            return markupLoads(file, text, 'image/svg+xml')
        case 'css':
            return cssLoads(file, text)
        case 'js':
            return scriptLoads(file, text)
        case 'font':
        case 'data':
            return []
    }
}
