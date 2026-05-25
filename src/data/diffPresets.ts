// Built-in sample log pairs for the /diff demo, so a first-time visitor can
// see a ranked report in one click without bringing their own logs. Each pair
// is shaped to produce a clear "what changed" result: new errors/failures that
// surface, against a backdrop of unchanged noise that gets suppressed.
//
// Content is plain text (the diff page is English-only); these are demo
// fixtures, not localized copy.

export interface DiffPreset {
    id: string
    label: string
    description: string
    baseline: string
    changed: string
}

export const diffPresets: DiffPreset[] = [
    {
        id: 'ci-cd',
        label: 'CI/CD run',
        description: 'A green pipeline run vs the run that went red.',
        baseline: `##[group]Install dependencies
INFO  resolved 412 packages in 3.1s
INFO  cache restored: node_modules
##[endgroup]
##[group]Build
INFO  compiling api (typescript)
INFO  compiling worker (typescript)
INFO  build succeeded in 42.3s
##[endgroup]
##[group]Test
PASS  tests/auth.spec.ts (14 tests)
PASS  tests/orders.spec.ts (22 tests)
PASS  tests/payments.spec.ts (9 tests)
INFO  45 passed, 0 failed in 18.1s
##[endgroup]
INFO  deploy: staging rollout complete
INFO  job succeeded in 1m24s`,
        changed: `##[group]Install dependencies
INFO  resolved 412 packages in 3.4s
INFO  cache restored: node_modules
##[endgroup]
##[group]Build
INFO  compiling api (typescript)
INFO  compiling worker (typescript)
INFO  build succeeded in 41.8s
##[endgroup]
##[group]Test
PASS  tests/auth.spec.ts (14 tests)
FAIL  tests/orders.spec.ts (20 passed, 2 failed)
ERROR  expected 200 but received 500 at orders.spec.ts:88
ERROR  connection refused to db host 10.0.0.7 port 5432
ERROR  connection refused to db host 10.0.0.7 port 5432
PASS  tests/payments.spec.ts (9 tests)
INFO  43 passed, 2 failed in 22.7s
##[endgroup]
##[error]Process completed with exit code 1`,
    },
    {
        id: 'unit-tests',
        label: 'Unit tests',
        description: 'A clean pytest run vs one with new failures.',
        baseline: `============================= test session starts ==============================
platform linux -- Python 3.11.6, pytest-8.1.1
collected 128 items

tests/test_models.py ........................                            [ 25%]
tests/test_api.py ..............................                         [ 55%]
tests/test_billing.py ......................                            [ 72%]
tests/test_utils.py ....................................                [100%]

============================= 128 passed in 6.42s ==============================`,
        changed: `============================= test session starts ==============================
platform linux -- Python 3.11.6, pytest-8.1.1
collected 128 items

tests/test_models.py ........................                            [ 25%]
tests/test_api.py .............F....F...........                         [ 55%]
tests/test_billing.py ......................                            [ 72%]
tests/test_utils.py ....................................                [100%]

=================================== FAILURES ===================================
___________________________ test_create_order _________________________________
E   sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) connection refused
___________________________ test_charge_card __________________________________
E   AssertionError: assert response.status_code == 200, got 500
========================= 126 passed, 2 failed in 7.88s ========================`,
    },
    {
        id: 'load-test',
        label: 'Load / regression',
        description: 'A passing load test vs a latency regression.',
        baseline: `INFO  load test starting: 500 VUs, 60s, target=api.staging
INFO  GET  /api/orders     p50=12ms  p95=48ms   p99=91ms
INFO  GET  /api/products   p50=8ms   p95=31ms   p99=60ms
INFO  POST /api/checkout   p50=40ms  p95=120ms  p99=210ms
INFO  cache hit ratio 98.7%
INFO  throughput 4820 req/s, error rate 0.01%
INFO  load test complete: PASS (all p99 within budget)`,
        changed: `INFO  load test starting: 500 VUs, 60s, target=api.staging
INFO  GET  /api/orders     p50=14ms  p95=420ms  p99=1850ms
WARN  slow query 1.74s: SELECT * FROM orders WHERE status = ? ORDER BY created_at
INFO  GET  /api/products   p50=9ms   p95=33ms   p99=64ms
INFO  POST /api/checkout   p50=210ms p95=2400ms p99=5200ms
WARN  db connection pool exhausted, 38 requests queued
INFO  cache hit ratio 71.2%
INFO  throughput 1180 req/s, error rate 3.40%
INFO  load test complete: FAIL (p99 budget exceeded on 2 routes)`,
    },
    {
        id: 'service-incident',
        label: 'Service incident',
        description: 'A calm service window vs an error cascade.',
        baseline: `INFO  request GET /healthz 200 1ms
INFO  request GET /api/orders 200 14ms
INFO  request POST /api/checkout 200 88ms
INFO  cache hit key=user:1041
INFO  request GET /api/orders 200 12ms
INFO  db.pool acquired connection (4/20 in use)
INFO  request GET /api/products 200 9ms
INFO  worker processed job=email retries=0
INFO  request GET /healthz 200 1ms`,
        changed: `INFO  request GET /healthz 200 1ms
INFO  request GET /api/orders 200 15ms
ERROR sqlalchemy.exc.OperationalError: connection refused to db host 10.0.0.7
ERROR sqlalchemy.exc.OperationalError: connection refused to db host 10.0.0.8
WARN  db.pool exhausted, waiting 5000ms for free connection
ERROR request POST /api/checkout 500 5021ms
WARN  circuit breaker open: orders-db
ERROR worker job=email failed: upstream timeout
INFO  request GET /healthz 200 1ms`,
    },
]
