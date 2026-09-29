import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { execFile } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import {
    type Load,
    classify,
    cssLoads,
    dispositionOf,
    isAdmitted,
    markupLoads,
    scriptLoads,
} from '../siteChecks/assetLoads'
import { ARMS, ARM_NAMES, type SiteVerdict, judgeBuiltSite } from '../siteChecks/builtSite'
import { GATE_NAME } from '../siteChecks/vitePlugin'

/**
 * A visitor's browser contacts no third-party origin for the site's own assets (ADR-40.D3), and
 * the build the deploy runs is what refuses otherwise.
 *
 * The subject is the production build, because that is what the browser receives: a dependency's
 * stylesheet, a component's <img> or a bundle's fetch() reaches the visitor only through it, and
 * a scan of index.html alone would be blind to all three. So this file builds the site once,
 * with the repo's own Vite config in production mode, into a scratch directory, and judges every
 * file the build emitted with the same verdict the build itself enforces (src/siteChecks/
 * builtSite.ts). It runs Vite in a child process: esbuild refuses to start inside the jsdom
 * environment the suite uses.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const VITE_BIN = join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js')
const BUILD_TIMEOUT_MS = 240_000

const run = promisify(execFile)

// The deploy builds with no test-runner state: NODE_ENV=test would change React's build, and an
// inherited VITE_* variable would override .env.production.
function productionEnv(): NodeJS.ProcessEnv {
    return Object.fromEntries(
        Object.entries(process.env).filter(([name]) => name !== 'NODE_ENV' && name !== 'TEST' && !name.startsWith('VITE')),
    )
}

// Logged at info level, so the gate's own report is on stdout for the wiring arm to read.
async function buildProduction(outDir: string): Promise<string> {
    const args = [VITE_BIN, 'build', '--mode', 'production', '--outDir', outDir, '--emptyOutDir', '--logLevel', 'info']
    try {
        const { stdout } = await run(process.execPath, args, { cwd: ROOT, env: productionEnv(), maxBuffer: 16 * 1024 * 1024 })
        return stdout
    } catch (error) {
        const failed = error as { stdout?: string; stderr?: string; message: string }
        throw new Error(`vite build failed: ${failed.message}\n--- stdout\n${failed.stdout ?? ''}\n--- stderr\n${failed.stderr ?? ''}`)
    }
}

describe('the production build', () => {
    let dist = ''
    let stdout = ''
    let verdict: SiteVerdict | undefined

    beforeAll(async () => {
        dist = mkdtempSync(join(tmpdir(), 'coderoast-web-dist-'))
        stdout = await buildProduction(dist)
        verdict = judgeBuiltSite(ROOT, dist)
    }, BUILD_TIMEOUT_MS)

    afterAll(() => {
        if (dist !== '') rmSync(dist, { recursive: true, force: true })
    })

    it.each(ARM_NAMES)('passes the %s arm', (arm) => {
        expect(verdict?.faults[arm], `${ARMS[arm]}; ${verdict?.emitted.length ?? 0} files emitted, ${verdict?.loads.length ?? 0} loads read`).toEqual([])
    })

    it('judged itself inside the build: the deploy\'s own build ran every arm and reported them clean', () => {
        const report = stdout.split('\n').find((line) => line.includes(`${GATE_NAME}: `))
        expect(report, `no ${GATE_NAME} line in the build's stdout, so vite.config.ts no longer runs the gate and a deploy checks nothing:\n${stdout}`)
            .toMatch(new RegExp(`${GATE_NAME}: ${ARM_NAMES.length}/${ARM_NAMES.length} arms clean`))
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
