// Built-in sample log pairs for the /diff (Sift) demo, so a first-time visitor
// can see a ranked report in one click without bringing their own logs.
//
// TWO KINDS, and the difference is disclosed in the picker (t.diff.provenance):
//
//   'real-ci'   — real runs of one of our own CI jobs, published verbatim except
//                 for redacted identity spans. Vendored from coderoast-hub's
//                 showcase/sift/ under src/assets/sift-showcase/, together with
//                 that showcase's MANIFEST.json. They are ~340-440 KB each, so
//                 they are NOT inlined: each is emitted as a standalone asset and
//                 fetched the first time its preset is chosen. A page most
//                 visitors never open must not cost them 1.2 MB of JS.
//   'generated' — deterministic fixtures (seeded PRNG, no Math.random), each
//                 isolating ONE narrative a real log never presents that cleanly:
//                 baseline and changed share the SAME templates and only the
//                 params differ, so a plain text diff sees hundreds of changed
//                 lines while Sift suppresses them all and surfaces only the
//                 injected STRUCTURAL change.
//
// Labelling both kinds is BINDING (PRD-6 § "/diff demo presets — the
// provenance rule"): an unlabelled fixture sitting beside a
// labelled real log invites the visitor to assume the fixture is real too.
//
// BYTE TRACEABILITY. Each real sample pins the sha256 MANIFEST.json publishes for
// it. src/test/diffPresets.test.ts recomputes those digests over the vendored
// files and cross-checks them against the vendored manifest, so a re-vendoring
// that drifts (or a git filter that rewrites a line ending) fails the suite
// instead of silently shipping different bytes than the ones we cite numbers for.
//
// The /diff page chrome is i18n'd EN/FR (picker label, provenance, tooltip and
// narrative, keyed by id under t.diff.presets); the log text itself and the engine
// output stay English by design (the engine emits English regardless of locale).

import greenAUrl from '@/assets/sift-showcase/logcraft__ci-build__green-a.log?url&no-inline'
import greenBUrl from '@/assets/sift-showcase/logcraft__ci-build__green-b.log?url&no-inline'
import redUrl from '@/assets/sift-showcase/logcraft__ci-build__red.log?url&no-inline'

export type DiffProvenance = 'real-ci' | 'generated'

export interface DiffPair {
    baseline: string
    changed: string
}

/**
 * The two numbers a real pair is allowed to headline, taken from MANIFEST.json's
 * `pairs[]` entry — never re-derived here.
 *
 * `significantChanges` is the PUBLISHED pair's count. The raw pair's higher count
 * is not a figure this surface may quote: it includes our own CI's Sift step
 * reporting on itself, which the published pair removes as a declared
 * transformation. The manifest keeps it on the record; the website does not.
 */
export interface DiffPairFigures {
    plainTextDiffLines: number
    significantChanges: number
}

/** One published log, pinned to the exact bytes MANIFEST.json digests. */
export interface RealSample {
    /** MANIFEST.json `samples[].file` basename — also the vendored file's name. */
    file: string
    /** MANIFEST.json `samples[].sha256_published`. */
    sha256: string
    /** Emitted-asset URL for the vendored copy. Fetched on demand, never inlined. */
    url: string
}

interface PresetBase {
    id: string
    /** Resolve the pair's two logs. Idempotent and cached; safe to call repeatedly. */
    load: () => Promise<DiffPair>
}

export interface RealCiPreset extends PresetBase {
    provenance: 'real-ci'
    figures: DiffPairFigures
    samples: { baseline: RealSample; changed: RealSample }
}

export interface GeneratedPreset extends PresetBase {
    provenance: 'generated'
}

export type DiffPreset = RealCiPreset | GeneratedPreset

// ── Real CI samples ─────────────────────────────────────────────────────────

const GREEN_A: RealSample = {
    file: 'logcraft__ci-build__green-a.log',
    sha256: 'f32705481d330a82275bd66500ea516616613b80e47ad51004181930c697d66b',
    url: greenAUrl,
}
const GREEN_B: RealSample = {
    file: 'logcraft__ci-build__green-b.log',
    sha256: 'c0a7a4cbda1cb0fd600e12a4dd55477f26c84ab848c4275cd4445a1b2c5cfbea',
    url: greenBUrl,
}
const RED: RealSample = {
    file: 'logcraft__ci-build__red.log',
    sha256: '7c12fbfaf1aa72307779cc2ec3836ccb7c0939bc3debdebbb82b66402f3b5de4',
    url: redUrl,
}

// Keyed by URL: dedupes concurrent clicks (the promise is cached, not just its
// result) and keeps a second visit to a preset instant. A rejected fetch evicts
// itself so the next click genuinely retries instead of replaying the failure.
const sampleCache = new Map<string, Promise<string>>()

async function readSample(sample: RealSample): Promise<string> {
    const response = await fetch(sample.url)
    if (!response.ok) {
        throw new Error(`${sample.file}: HTTP ${response.status} ${response.statusText}`)
    }
    const bytes = await response.arrayBuffer()
    // Decode with ignoreBOM so the leading U+FEFF the runner actually emitted
    // survives into the text we show and send. Response.text() strips it — which
    // would quietly hand the engine a different first line than the bytes whose
    // sha256 (and whose published change counts) we cite.
    return new TextDecoder('utf-8', { ignoreBOM: true }).decode(bytes)
}

function fetchSample(sample: RealSample): Promise<string> {
    const pending = sampleCache.get(sample.url)
    if (pending) return pending
    const started = readSample(sample).catch((error: unknown) => {
        sampleCache.delete(sample.url)
        throw error
    })
    sampleCache.set(sample.url, started)
    return started
}

function realPair(baseline: RealSample, changed: RealSample): () => Promise<DiffPair> {
    return async () => {
        const [baselineText, changedText] = await Promise.all([
            fetchSample(baseline),
            fetchSample(changed),
        ])
        return { baseline: baselineText, changed: changedText }
    }
}

// ── Generated fixtures ──────────────────────────────────────────────────────

// Small LCG — deterministic per seed.
function rng(seed: number): () => number {
    let state = seed >>> 0 || 1
    return () => ((state = (state * 1664525 + 1013904223) >>> 0) / 0x100000000)
}
const int = (r: () => number, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))
const host = (r: () => number) => `10.0.${int(r, 0, 4)}.${int(r, 2, 250)}`

/** Generate once, on first use, then serve the same strings forever. */
function generated(make: () => DiffPair): () => Promise<DiffPair> {
    let pair: DiffPair | null = null
    return async () => (pair ??= make())
}

// ── Hotfix verification: recovery ⇄ regression in one diff ──────────────────
// The broken run had DB connection errors; the hotfix run CLEARED them (the
// workload held — not idle) but introduced a NEW upstream-timeout error. A
// filter can flag the new error; it can NEVER tell you the old ones recovered.
function hotfix(): DiffPair {
    const endpoints = [
        'GET  /api/orders', 'POST /api/checkout', 'GET  /api/cart', 'GET  /api/products',
        'POST /api/payments', 'GET  /api/user/profile', 'GET  /healthz', 'POST /api/login',
    ]
    const run = (seed: number, fixed: boolean): string => {
        const r = rng(seed)
        const o: string[] = []
        for (let i = 0; i < 72; i++) {
            o.push(`INFO  request ${endpoints[i % endpoints.length]} 200 ${int(r, 2, 90)}ms`)
            if (i % 9 === 0) o.push(`INFO  cache hit key=user:${int(r, 1000, 9999)}`)
            if (!fixed && i % 6 === 0)
                o.push(`ERROR sqlalchemy.exc.OperationalError: connection refused to db host ${host(r)}`)
            if (fixed && i % 14 === 0)
                o.push(`ERROR gateway: upstream payments timed out after 30000ms (req ${int(r, 10000, 99999)})`)
        }
        return o.join('\n')
    }
    return { baseline: run(31, false), changed: run(43, true) }
}

// ── Silent regression: NO error keyword anywhere ────────────────────────────
// The "checkout completed" success marker VANISHED (checkouts silently stopped
// succeeding) and a benign "retrying payment" line SPIKED 2 → 27. `grep ERROR`
// finds nothing; Sift flags the vanished success and the frequency surge.
function silentRegression(): DiffPair {
    const endpoints = [
        'GET  /api/orders', 'GET  /api/products', 'GET  /api/cart', 'GET  /api/user/profile',
        'GET  /api/search', 'GET  /healthz', 'POST /api/login',
    ]
    const run = (seed: number, broken: boolean): string => {
        const r = rng(seed)
        const o: string[] = []
        for (let i = 0; i < 80; i++) {
            o.push(`INFO  request ${endpoints[i % endpoints.length]} 200 ${int(r, 2, 110)}ms`)
            if (!broken && i % 4 === 0) // healthy: checkouts succeed
                o.push(`INFO  checkout completed order=${int(r, 100000, 999999)}`)
            if (!broken && i % 40 === 0) // healthy: the rare retry
                o.push(`INFO  retrying payment gateway (attempt ${int(r, 1, 2)})`)
            if (broken && i % 3 === 0) // broken: retries surge, success line gone
                o.push(`INFO  retrying payment gateway (attempt ${int(r, 1, 5)})`)
        }
        return o.join('\n')
    }
    return { baseline: run(57, false), changed: run(61, true) }
}

// ── Error decoy: SAME errors in both runs; the real regression hides behind them ─
// Both runs carry the identical, ongoing payment-timeout ERRORs — the decoy the
// eye fixates on ("same errors, same problem"). Sift suppresses them (unchanged,
// proportional) and surfaces what REALLY moved: the "order completed" success
// marker silently vanished. `grep ERROR` shows no difference between the two runs.
function errorDecoy(): DiffPair {
    const endpoints = [
        'GET  /api/orders', 'POST /api/checkout', 'GET  /api/cart', 'GET  /api/products',
        'POST /api/payments', 'GET  /api/user/profile', 'GET  /healthz',
    ]
    const run = (seed: number, broken: boolean): string => {
        const r = rng(seed)
        const o: string[] = []
        for (let i = 0; i < 96; i++) {
            o.push(`INFO  request ${endpoints[i % endpoints.length]} 200 ${int(r, 3, 80)}ms`)
            // IDENTICAL in both runs (same template, same count) — the known issue
            // everyone greps for, and the thing that makes the real change invisible.
            if (i % 12 === 0)
                o.push(`ERROR payment gateway timeout after 3000ms (txn ${int(r, 10000, 99999)})`)
            // Healthy: orders complete. Broken: the success marker silently stops —
            // behind the unchanged errors, the eye never notices it's gone.
            if (!broken && i % 4 === 0) o.push(`INFO  order completed total=$${int(r, 12, 480)}`)
        }
        return o.join('\n')
    }
    return { baseline: run(201, false), changed: run(211, true) }
}

// ── Cache silently died: zero errors, but the cache stopped serving ──────────
// Service still returns 200s; no ERROR or WARN anywhere. But "served from cache"
// collapsed and origin fetches surged — a latent p99 cliff. A filter sees nothing.
function cacheDegradation(): DiffPair {
    const routes = [
        'GET  /api/product', 'GET  /api/listing', 'GET  /api/feed', 'GET  /api/profile',
        'GET  /api/search',
    ]
    const run = (seed: number, degraded: boolean): string => {
        const r = rng(seed)
        const o: string[] = ['INFO  edge cache warmup complete']
        for (let i = 0; i < 96; i++) {
            o.push(`INFO  request ${routes[i % routes.length]} 200 ${int(r, 4, 70)}ms`)
            const hit = degraded ? i % 9 === 0 : i % 7 !== 0
            if (hit) o.push('INFO  served from cache')
            else o.push(`INFO  cache miss, fetched from origin in ${int(r, 90, 420)}ms`)
        }
        return o.join('\n')
    }
    return { baseline: run(301, false), changed: run(311, true) }
}

// ── Canary vs stable: same traffic, two builds — what the deploy changed ─────
// No errors either side. The new build swapped the checkout handler (v1 → v2)
// and lit a feature flag. A pure behaviour diff a filter cannot surface.
function canaryDeploy(): DiffPair {
    const routes = [
        'GET  /api/orders', 'GET  /api/cart', 'GET  /api/products', 'GET  /api/user/profile',
        'GET  /healthz',
    ]
    const run = (seed: number, v2: boolean): string => {
        const r = rng(seed)
        const o: string[] = [v2 ? 'INFO  build 4f1a2 (canary) booting' : 'INFO  build 9c33e (stable) booting']
        for (let i = 0; i < 90; i++) {
            o.push(`INFO  request ${routes[i % routes.length]} 200 ${int(r, 4, 75)}ms`)
            if (i % 3 === 0)
                o.push(v2 ? 'INFO  checkout via handler=v2 async-pipeline' : 'INFO  checkout via handler=v1 sync-pipeline')
            if (v2 && i % 5 === 0) o.push('INFO  feature gate fast_checkout=on')
        }
        return o.join('\n')
    }
    return { baseline: run(501, false), changed: run(509, true) }
}

// ── Throttling takes over: a new template appears and dominates the run ───────
// Zero errors — but a new "rate limit" template appears and takes over ~a third of
// the run. The honest signal is its SHARE, not its existence: a text diff sees the
// new lines; only a structural diff ranks the one template now dominating the stream.
// (Per-account concentration — "which key is hammering" — is a future engine beat on
// the field-distribution axis, NOT what fires today; do not claim it in the copy.)
function hotKey(): DiffPair {
    const routes = [
        'GET  /api/feed', 'POST /api/event', 'GET  /api/profile', 'GET  /api/notifications',
        'POST /api/sync',
    ]
    const run = (seed: number, storm: boolean): string => {
        const r = rng(seed)
        const o: string[] = []
        for (let i = 0; i < 100; i++) {
            o.push(`INFO  request ${routes[i % routes.length]} 200 ${int(r, 3, 55)}ms`)
            if (storm && i % 2 === 0)
                o.push(`INFO  rate limit: key=acct:88213 deferring ${int(r, 200, 1900)} queued req`)
        }
        return o.join('\n')
    }
    return { baseline: run(401, false), changed: run(409, true) }
}

// ── Escalating warning: the pre-incident creep ───────────────────────────────
// A pool-pressure WARN that was background noise is now pervasive — the warning
// that goes from rare to constant in the 20 minutes before it pages you. Not a new
// error; a known warning quietly escalating, which a grep for ERROR never catches.
function escalatingWarning(): DiffPair {
    const routes = [
        'GET  /api/orders', 'POST /api/checkout', 'GET  /api/inventory', 'POST /api/payments',
        'GET  /api/search',
    ]
    const run = (seed: number, stressed: boolean): string => {
        const r = rng(seed)
        const o: string[] = []
        for (let i = 0; i < 100; i++) {
            o.push(`INFO  request ${routes[i % routes.length]} 200 ${int(r, 5, 90)}ms`)
            const warn = stressed ? i % 4 === 0 : i % 50 === 0
            if (warn) o.push('WARN  db connection pool near capacity, requests queued')
        }
        return o.join('\n')
    }
    return { baseline: run(601, false), changed: run(607, true) }
}

// id maps to the picker label, provenance-independent copy and narrative in i18n
// (t.diff.presets[id]); only the English log fixtures live here.
//
// The two real pairs lead: they are the ones that carry the credibility, and the
// generated fixtures read as what they are once a visitor has seen a real one.
export const diffPresets: DiffPreset[] = [
    {
        id: 'real-ci-noise',
        provenance: 'real-ci',
        figures: { plainTextDiffLines: 5571, significantChanges: 1 },
        samples: { baseline: GREEN_A, changed: GREEN_B },
        load: realPair(GREEN_A, GREEN_B),
    },
    {
        id: 'real-ci-triage',
        provenance: 'real-ci',
        figures: { plainTextDiffLines: 4889, significantChanges: 13 },
        samples: { baseline: GREEN_A, changed: RED },
        load: realPair(GREEN_A, RED),
    },
    { id: 'hotfix', provenance: 'generated', load: generated(hotfix) },
    { id: 'silent-regression', provenance: 'generated', load: generated(silentRegression) },
    { id: 'error-decoy', provenance: 'generated', load: generated(errorDecoy) },
    { id: 'cache-degradation', provenance: 'generated', load: generated(cacheDegradation) },
    { id: 'canary-deploy', provenance: 'generated', load: generated(canaryDeploy) },
    { id: 'hot-key', provenance: 'generated', load: generated(hotKey) },
    { id: 'escalating-warning', provenance: 'generated', load: generated(escalatingWarning) },
]
