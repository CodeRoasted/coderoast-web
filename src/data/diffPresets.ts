// Built-in sample log pairs for the /diff (Sift) demo, so a first-time visitor
// can see a ranked report in one click without bringing their own logs.
//
// Each pair is GENERATED, not hand-written, for two reasons:
//   1. Length + realism — real CI/test/service logs are long and repetitive;
//      a 12-line sample can't show noise suppression. These run ~90-140 lines.
//   2. The demo IS the pitch. Baseline and changed share the SAME templates;
//      only the params (ids, timings, hosts, percentiles) differ by seed. So a
//      plain text diff sees hundreds of changed lines, while Sift suppresses
//      them all and surfaces only the injected STRUCTURAL changes (new error
//      templates, failures, a circuit breaker) — "N changed, 3 significant".
//
// Generation is deterministic (seeded PRNG, no Math.random) because Sift is
// deterministic and the samples must be stable across loads. The /diff page
// chrome is i18n'd EN/FR (incl. the picker label + tooltip, keyed by id under
// t.diff.presets); these fixtures + the engine output stay English by design (the
// engine emits English regardless of locale).

export interface DiffPreset {
    id: string
    baseline: string
    changed: string
}

interface Pair {
    baseline: string
    changed: string
}

// Small LCG — deterministic per seed.
function rng(seed: number): () => number {
    let state = seed >>> 0 || 1
    return () => ((state = (state * 1664525 + 1013904223) >>> 0) / 0x100000000)
}
const int = (r: () => number, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))
const host = (r: () => number) => `10.0.${int(r, 0, 4)}.${int(r, 2, 250)}`

// ── Hotfix verification: recovery ⇄ regression in one diff ──────────────────
// The broken run had DB connection errors; the hotfix run CLEARED them (the
// workload held — not idle) but introduced a NEW upstream-timeout error. A
// filter can flag the new error; it can NEVER tell you the old ones recovered.
function hotfix(): Pair {
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
function silentRegression(): Pair {
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
function errorDecoy(): Pair {
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
function cacheDegradation(): Pair {
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
function canaryDeploy(): Pair {
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
function hotKey(): Pair {
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
function escalatingWarning(): Pair {
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

const hotfixPair = hotfix()
const silent = silentRegression()
const decoy = errorDecoy()
const cache = cacheDegradation()
const canary = canaryDeploy()
const hotkey = hotKey()
const escalating = escalatingWarning()

// id maps to the picker label + tooltip in i18n (t.diff.presets[id]); only the
// English log fixtures live here.
export const diffPresets: DiffPreset[] = [
    { id: 'hotfix', baseline: hotfixPair.baseline, changed: hotfixPair.changed },
    { id: 'silent-regression', baseline: silent.baseline, changed: silent.changed },
    { id: 'error-decoy', baseline: decoy.baseline, changed: decoy.changed },
    { id: 'cache-degradation', baseline: cache.baseline, changed: cache.changed },
    { id: 'canary-deploy', baseline: canary.baseline, changed: canary.changed },
    { id: 'hot-key', baseline: hotkey.baseline, changed: hotkey.changed },
    { id: 'escalating-warning', baseline: escalating.baseline, changed: escalating.changed },
]
