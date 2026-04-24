import { describe, it, expect } from 'vitest'
import { pickScenario } from '@/components/playground/onboarding/scenarioPicker'
import type { ScenarioMeta } from '@/services/api'

const scenarios: ScenarioMeta[] = [
    { id: '01_starter/hello_world', name: 'Hello World', description: '', category: '01_starter', duration: '1m' },
    { id: '01_starter/two_agents', name: 'Two Agents', description: '', category: '01_starter', duration: '1m' },
    { id: '02_daily/ecommerce', name: 'Ecommerce Day', description: '', category: '02_daily', duration: '5m' },
    { id: '02_daily/microservices', name: 'Micro', description: '', category: '02_daily', duration: '5m' },
    { id: '03_real_life/incident_cascade', name: 'Cascade', description: '', category: '03_real_life', duration: '10m' },
    { id: '03_real_life/outage_drill', name: 'Outage Drill', description: '', category: '03_real_life', duration: '10m' },
]

/**
 * The picker is the brain of the onboarding wizard — get this wrong and
 * the user lands on the wrong scenario for their stated intent. We pin
 * the documented behavior so refactoring the maps doesn't silently drift.
 */
describe('scenarioPicker.pickScenario', () => {
    it('returns null for an empty catalog', () => {
        expect(pickScenario([], 'explore', 'simple')).toBeNull()
    })

    it('explore + simple → hello world', () => {
        const pick = pickScenario(scenarios, 'explore', 'simple')
        expect(pick?.id).toBe('01_starter/hello_world')
    })

    it('test + simple → two_agents (keyword + matching category)', () => {
        const pick = pickScenario(scenarios, 'test', 'simple')
        expect(pick?.id).toBe('01_starter/two_agents')
    })

    it('demo + realistic → an ecommerce/micro scenario', () => {
        const pick = pickScenario(scenarios, 'demo', 'realistic')
        expect(pick?.category).toBe('02_daily')
    })

    it('train + chaos → cascade/outage scenario', () => {
        const pick = pickScenario(scenarios, 'train', 'chaos')
        expect(pick?.category).toBe('03_real_life')
        expect(['incident_cascade', 'outage_drill']).toContain(pick?.id.split('/')[1])
    })

    it('falls back to the first scenario in the requested category when no keyword matches', () => {
        // 'demo' keywords don't include "minimal"; only the simple/minimal scenarios are in 01_starter.
        const minimalOnly: ScenarioMeta[] = [
            { id: '01_starter/minimal', name: 'Min', description: '', category: '01_starter', duration: '1m' },
        ]
        expect(pickScenario(minimalOnly, 'demo', 'simple')?.id).toBe('01_starter/minimal')
    })

    it('falls back to hello world when no category matches', () => {
        const noCategoryMatch: ScenarioMeta[] = [
            { id: 'misc/hello_world', name: 'Hello', description: '', category: 'misc', duration: '1m' },
            { id: 'misc/foo', name: 'Foo', description: '', category: 'misc', duration: '1m' },
        ]
        expect(pickScenario(noCategoryMatch, 'demo', 'realistic')?.id).toBe('misc/hello_world')
    })

    it('falls back to the first scenario when no fallback matches', () => {
        const arbitrary: ScenarioMeta[] = [
            { id: 'foo/bar', name: 'Bar', description: '', category: 'foo', duration: '1m' },
            { id: 'foo/baz', name: 'Baz', description: '', category: 'foo', duration: '1m' },
        ]
        expect(pickScenario(arbitrary, 'train', 'chaos')?.id).toBe('foo/bar')
    })
})
