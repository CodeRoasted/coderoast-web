import type { ScenarioMeta } from '@/services/api'

export type Intent = 'test' | 'demo' | 'train' | 'explore'
export type Complexity = 'simple' | 'realistic' | 'chaos'

/**
 * Backend categories are the directory names under
 * `logcraft-playground/scenario/` — keep this mapping aligned with
 * the directory layout, not with display strings.
 */
const CATEGORY_FOR_COMPLEXITY: Record<Complexity, string> = {
    simple: '01_starter',
    realistic: '02_daily',
    chaos: '03_real_life',
}

/**
 * Keywords matched against `{id} {category} {name}` (lowercased) to find
 * a scenario that broadly fits an operator's stated intent. Order doesn't
 * matter — we only check that *any* keyword hits.
 */
const KEYWORDS_FOR_INTENT: Record<Intent, readonly string[]> = {
    explore: ['hello', 'starter', 'simple'],
    test: ['two_agents', 'phases', 'custom_fields', 'outputs', 'http_sinks'],
    demo: ['ecommerce', 'microservices', 'kafka', 'reallife', 'production'],
    train: ['incident', 'failure', 'outage', 'cascade', 'training'],
}

/**
 * Pick a single scenario that best matches an `(intent, complexity)` pair.
 *
 * Strategy (ordered fallback so the wizard never dead-ends):
 *   1. Scenarios whose category matches the requested complexity AND whose
 *      id/category/name contains an intent keyword.
 *   2. Any scenario in the matching category.
 *   3. The classic "hello world" scenario.
 *   4. The first scenario in the catalog.
 *
 * Returns `null` only when the catalog is empty.
 */
export function pickScenario(
    scenarios: readonly ScenarioMeta[],
    intent: Intent,
    complexity: Complexity,
): ScenarioMeta | null {
    if (scenarios.length === 0) return null

    const haystack = (s: ScenarioMeta) =>
        `${s.id} ${s.category} ${s.name}`.toLowerCase()

    const wantedCategory = CATEGORY_FOR_COMPLEXITY[complexity]
    const keywords = KEYWORDS_FOR_INTENT[intent]

    const inCategory = scenarios.filter((s) =>
        (s.category || '').toLowerCase().includes(wantedCategory),
    )
    const targeted = inCategory.find((s) =>
        keywords.some((k) => haystack(s).includes(k)),
    )
    if (targeted) return targeted
    if (inCategory.length > 0) return inCategory[0] ?? null

    const hello = scenarios.find((s) => haystack(s).includes('hello'))
    if (hello) return hello

    return scenarios[0] ?? null
}
