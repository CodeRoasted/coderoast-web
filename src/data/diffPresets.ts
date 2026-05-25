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
// deterministic and the samples must be stable across loads. Content is plain
// text — the diff page is English-only; these are demo fixtures, not copy.

export interface DiffPreset {
    id: string
    label: string
    description: string
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

// ── CI/CD pipeline: green run vs the run that went red ──────────────────────
function ciPipeline(): Pair {
    const modules = [
        'api', 'worker', 'auth-service', 'billing', 'orders', 'payments', 'notifications',
        'search-indexer', 'gateway', 'scheduler', 'inventory', 'webhooks', 'reporting', 'admin',
    ]
    const suites = [
        'auth', 'orders', 'payments', 'billing', 'users', 'cart', 'checkout', 'search',
        'inventory', 'webhooks', 'sessions', 'reports', 'admin', 'metrics', 'health', 'audit',
    ]
    const failing = new Set(['orders', 'payments'])
    const run = (seed: number, red: boolean): string => {
        const r = rng(seed)
        const o: string[] = []
        o.push('##[group]Install dependencies')
        o.push('INFO  npm ci')
        o.push(`INFO  resolved ${int(r, 405, 419)} packages in ${int(r, 28, 44)}.${int(r, 0, 9)}s`)
        o.push('INFO  cache restored: node_modules')
        o.push('##[endgroup]')
        o.push('##[group]Build (tsc)')
        for (const m of modules) o.push(`INFO  compiled ${m} in ${int(r, 600, 5200)}ms`)
        o.push(`INFO  bundle dist/ written (${int(r, 4, 9)}.${int(r, 0, 9)} MB) in ${int(r, 39, 52)}.${int(r, 0, 9)}s`)
        o.push('##[endgroup]')
        o.push('##[group]Type-check')
        for (const m of modules) o.push(`INFO  tsc --noEmit ${m}: ok in ${int(r, 200, 1800)}ms`)
        o.push('##[endgroup]')
        o.push('##[group]Test (jest)')
        for (const s of suites) {
            const n = 6 + (suites.indexOf(s) % 6) * 3
            if (red && failing.has(s)) {
                o.push(`FAIL  tests/${s}.spec.ts (${n - 2} passed, 2 failed, ${int(r, 200, 1400)}ms)`)
                o.push(`ERROR   ${s} › expected status 200 but received 500`)
                o.push(`ERROR   connection refused to db host ${host(r)} port 5432`)
            } else {
                o.push(`PASS  tests/${s}.spec.ts (${n} tests, ${int(r, 40, 900)}ms)`)
            }
        }
        const total = suites.reduce((a, _s, i) => a + 6 + (i % 6) * 3, 0)
        o.push(
            red
                ? `INFO  ${total - 4} passed, 4 failed in ${int(r, 18, 30)}.${int(r, 0, 9)}s`
                : `INFO  ${total} passed, 0 failed in ${int(r, 15, 22)}.${int(r, 0, 9)}s`
        )
        o.push('##[endgroup]')
        o.push('##[group]Coverage')
        for (const m of modules) o.push(`INFO  coverage ${m}: ${int(r, 71, 96)}.${int(r, 0, 9)}%`)
        o.push('##[endgroup]')
        o.push('##[group]Lint')
        for (const m of modules) o.push(`INFO  eslint ${m}: 0 errors, ${int(r, 0, 2)} warnings`)
        o.push('##[endgroup]')
        if (red) {
            o.push('##[error]Process completed with exit code 1')
        } else {
            o.push('INFO  lint: 0 errors, 0 warnings')
            o.push('INFO  deploy: staging rollout complete')
            o.push(`INFO  job succeeded in ${int(r, 1, 3)}m${int(r, 10, 59)}s`)
        }
        return o.join('\n')
    }
    return { baseline: run(11, false), changed: run(23, true) }
}

// ── Unit tests: clean verbose pytest vs new failures ────────────────────────
function pytest(): Pair {
    const files = [
        'models', 'api', 'billing', 'orders', 'auth', 'cart', 'checkout', 'search',
        'inventory', 'users', 'sessions', 'webhooks', 'reports', 'utils', 'serializers', 'tasks',
    ]
    const verbs = [
        'create', 'update', 'delete', 'list', 'get', 'validate', 'charge', 'refund',
        'expire', 'retry', 'cancel', 'archive', 'restore', 'sync', 'export', 'import',
    ]
    const perFile = 8
    const run = (seed: number, withFailures: boolean): string => {
        const r = rng(seed)
        const o: string[] = []
        o.push('============================= test session starts ==============================')
        o.push('platform linux -- Python 3.11.6, pytest-8.1.1, pluggy-1.4.0')
        o.push('rootdir: /home/runner/work/app, configfile: pyproject.toml')
        o.push(`collected ${files.length * perFile} items`)
        o.push('')
        const fails: string[] = []
        for (const f of files) {
            for (let i = 0; i < perFile; i++) {
                const name = `test_${verbs[(files.indexOf(f) + i) % verbs.length]}_${f}`
                const isFail =
                    withFailures && ((f === 'orders' && i === 3) || (f === 'billing' && i === 5))
                if (isFail) {
                    o.push(`tests/test_${f}.py::${name} FAILED`)
                    fails.push(name)
                } else {
                    o.push(`tests/test_${f}.py::${name} PASSED`)
                }
            }
        }
        const total = files.length * perFile
        if (withFailures) {
            o.push('')
            o.push('=================================== FAILURES ===================================')
            o.push(`______________________________ ${fails[0]} ______________________________`)
            o.push('E   sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) connection refused')
            o.push(`______________________________ ${fails[1]} ______________________________`)
            o.push('E   AssertionError: assert response.status_code == 200, got 500')
            o.push(`========================= ${total - 2} passed, 2 failed in ${int(r, 6, 11)}.${int(r, 0, 9)}s ========================`)
        } else {
            o.push(`============================= ${total} passed in ${int(r, 5, 9)}.${int(r, 0, 9)}s ==============================`)
        }
        return o.join('\n')
    }
    return { baseline: run(5, false), changed: run(17, true) }
}

// ── Load / regression: passing load test vs structural regression ───────────
// Note: Sift is structural — the latency NUMBERS shift but their template is
// unchanged (suppressed). The signal is the new WARN/FAIL templates the
// regression introduces.
function loadTest(): Pair {
    const routes = [
        'GET  /api/orders', 'GET  /api/products', 'POST /api/checkout', 'GET  /api/cart',
        'GET  /api/search', 'POST /api/login', 'GET  /api/user/profile', 'GET  /api/inventory',
        'POST /api/payments', 'GET  /api/recommendations',
    ]
    const slowRoutes = new Set(['GET  /api/orders', 'POST /api/checkout'])
    const run = (seed: number, regressed: boolean): string => {
        const r = rng(seed)
        const o: string[] = []
        o.push('INFO  k6 load test starting: 500 VUs, 300s, target=api.staging')
        o.push('INFO  warmup complete, ramping to 500 VUs')
        for (let t = 30; t <= 300; t += 30) {
            o.push(`INFO  [t=${t}s] ${int(r, 4200, 5100)} req/s, error rate ${int(r, 0, 4)}/10000`)
            for (const route of routes) {
                const slow = regressed && slowRoutes.has(route)
                const p50 = slow ? int(r, 180, 260) : int(r, 6, 45)
                const p95 = slow ? int(r, 1800, 2600) : int(r, 30, 130)
                const p99 = slow ? int(r, 3800, 5400) : int(r, 60, 240)
                o.push(`INFO  ${route}  p50=${p50}ms p95=${p95}ms p99=${p99}ms`)
                if (slow && t % 90 === 0) {
                    o.push(`WARN  slow query ${int(r, 12, 19)}00ms: SELECT * FROM orders WHERE status = ? ORDER BY created_at`)
                }
            }
            if (regressed && t % 120 === 0) {
                o.push(`WARN  db connection pool exhausted, ${int(r, 20, 60)} requests queued`)
            }
        }
        o.push(
            regressed
                ? 'INFO  load test complete: FAIL (p99 budget exceeded on 2 routes)'
                : 'INFO  load test complete: PASS (all p99 within budget)'
        )
        return o.join('\n')
    }
    return { baseline: run(9, false), changed: run(21, true) }
}

// ── Service incident: a calm window vs an error cascade ─────────────────────
function serviceIncident(): Pair {
    const endpoints = [
        'GET  /healthz', 'GET  /api/orders', 'GET  /api/products', 'POST /api/checkout',
        'GET  /api/cart', 'GET  /api/user/profile', 'POST /api/login', 'GET  /api/search',
        'GET  /api/inventory', 'POST /api/payments',
    ]
    const run = (seed: number, incident: boolean): string => {
        const r = rng(seed)
        const o: string[] = []
        for (let i = 0; i < 96; i++) {
            o.push(`INFO  request ${endpoints[i % endpoints.length]} 200 ${int(r, 1, 120)}ms`)
            if (i % 7 === 0) o.push(`INFO  cache hit key=user:${int(r, 1000, 9999)}`)
            if (i % 11 === 0) o.push(`INFO  db.pool acquired connection (${int(r, 2, 12)}/20 in use)`)
            if (incident && i >= 48 && i % 6 === 0) {
                o.push(`ERROR sqlalchemy.exc.OperationalError: connection refused to db host ${host(r)}`)
                o.push('WARN  db.pool exhausted, waiting 5000ms for a free connection')
                o.push(`ERROR request POST /api/checkout 500 ${int(r, 5000, 5200)}ms`)
            }
        }
        if (incident) {
            o.push('WARN  circuit breaker open: orders-db')
            o.push('ERROR worker job=email-dispatch failed: upstream timeout after 30000ms')
        }
        return o.join('\n')
    }
    return { baseline: run(7, false), changed: run(19, true) }
}

const ci = ciPipeline()
const unit = pytest()
const load = loadTest()
const incident = serviceIncident()

export const diffPresets: DiffPreset[] = [
    {
        id: 'ci-cd',
        label: 'CI/CD run',
        description: 'A green pipeline run vs the run that went red.',
        baseline: ci.baseline,
        changed: ci.changed,
    },
    {
        id: 'unit-tests',
        label: 'Unit tests',
        description: 'A clean verbose pytest run vs one with new failures.',
        baseline: unit.baseline,
        changed: unit.changed,
    },
    {
        id: 'load-test',
        label: 'Load / regression',
        description: 'A passing load test vs a structural regression.',
        baseline: load.baseline,
        changed: load.changed,
    },
    {
        id: 'service-incident',
        label: 'Service incident',
        description: 'A calm service window vs an error cascade.',
        baseline: incident.baseline,
        changed: incident.changed,
    },
]
