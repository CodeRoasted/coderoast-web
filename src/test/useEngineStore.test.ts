import { describe, it, expect, beforeEach } from 'vitest'
import { useEngineStore } from '@/store/useEngineStore'
import type { InsightReport } from '@/types/engine'

const report: InsightReport = {
    headline: 'Checkout cascade detected',
    body: 'postgres latency led checkout retries',
    severity: 'High',
    confidence: 0.91,
    action_hint: 'Throttle retries',
    affected_templates: ['T42'],
    supporting_evidence: ['checkout retry'],
}

describe('useEngineStore', () => {
    beforeEach(() => {
        // Reset store to initial state between tests
        useEngineStore.setState({
            engineId: null,
            snapshot: null,
            liveTail: [],
            liveTailKeys: new Set(),
            insightStatus: null,
            insightReports: [],
            insightReportKeys: new Set(),
            insightLoading: false,
            insightError: null,
            insightLastLinesIngested: 0,
            connected: false,
            selectedScenarioId: null,
            scenarioYaml: '',
            statusMessage: null,
        })
    })

    it('has empty scenarioYaml by default', () => {
        const state = useEngineStore.getState()
        expect(state.scenarioYaml).toBe('')
    })

    it('setScenarioYaml updates the yaml buffer', () => {
        useEngineStore.getState().setScenarioYaml('name: test\nagents: []')
        expect(useEngineStore.getState().scenarioYaml).toBe('name: test\nagents: []')
    })

    it('setSelectedScenarioId updates the selected id', () => {
        useEngineStore.getState().setSelectedScenarioId('simple/hello_world')
        expect(useEngineStore.getState().selectedScenarioId).toBe('simple/hello_world')
    })

    it('reset clears engine state but preserves scenarioYaml', () => {
        useEngineStore.getState().setEngineId('eng-1')
        useEngineStore.getState().setConnected(true)
        useEngineStore.getState().setScenarioYaml('name: test')
        useEngineStore.getState().setStatusMessage('created')

        useEngineStore.getState().reset()

        const state = useEngineStore.getState()
        expect(state.engineId).toBeNull()
        expect(state.connected).toBe(false)
        expect(state.statusMessage).toBeNull()
        // scenarioYaml should persist through reset (user may re-use)
        expect(state.scenarioYaml).toBe('name: test')
    })

    it('setEngineId updates engine id', () => {
        useEngineStore.getState().setEngineId('eng-42')
        expect(useEngineStore.getState().engineId).toBe('eng-42')
    })

    it('appendToLiveTail deduplicates entries by key', () => {
        const entry = { timestamp: '12:00:00', agent: 'auth', level: 'INFO' as const, message: 'login ok' }
        useEngineStore.getState().appendToLiveTail([entry])
        useEngineStore.getState().appendToLiveTail([entry])
        expect(useEngineStore.getState().liveTail).toHaveLength(1)
    })

    it('clearLiveTail empties the display buffer', () => {
        const entry = { timestamp: '12:00:00', agent: 'auth', level: 'INFO' as const, message: 'login ok' }
        useEngineStore.getState().appendToLiveTail([entry])
        useEngineStore.getState().clearLiveTail()
        expect(useEngineStore.getState().liveTail).toHaveLength(0)
    })

    it('clearLiveTail suppresses re-admission of already-seen entries', () => {
        const entry = { timestamp: '12:00:00', agent: 'auth', level: 'INFO' as const, message: 'login ok' }
        useEngineStore.getState().appendToLiveTail([entry])
        useEngineStore.getState().clearLiveTail()
        // Same entry arrives again (server re-sends its rolling tail)
        useEngineStore.getState().appendToLiveTail([entry])
        expect(useEngineStore.getState().liveTail).toHaveLength(0)
    })

    it('clearLiveTail allows genuinely new entries after a clear', () => {
        const old = { timestamp: '12:00:00', agent: 'auth', level: 'INFO' as const, message: 'old' }
        const fresh = { timestamp: '12:00:01', agent: 'auth', level: 'INFO' as const, message: 'fresh' }
        useEngineStore.getState().appendToLiveTail([old])
        useEngineStore.getState().clearLiveTail()
        useEngineStore.getState().appendToLiveTail([fresh])
        expect(useEngineStore.getState().liveTail).toHaveLength(1)
        expect(useEngineStore.getState().liveTail[0]!.message).toBe('fresh')
    })

    it('setInsightReports replaces the local list with server history', () => {
        useEngineStore.getState().setInsightReports([report], 42)
        useEngineStore.getState().setInsightReports([], 84)

        const state = useEngineStore.getState()
        expect(state.insightReports).toHaveLength(0)
        expect(state.insightLastLinesIngested).toBe(84)
    })

    it('setInsightReports accepts revised prose from server history', () => {
        useEngineStore.getState().setInsightReports([report], 42)
        useEngineStore.getState().setInsightReports(
            [
                {
                    ...report,
                    body: 'AI-enriched checkout retry explanation',
                    action_hint: 'Check retry fan-out and PostgreSQL pool saturation',
                },
            ],
            42,
        )

        const state = useEngineStore.getState()
        expect(state.insightReports).toHaveLength(1)
        expect(state.insightReports[0]!.body).toBe('AI-enriched checkout retry explanation')
    })

    it('clearInsightData removes reports and status', () => {
        useEngineStore.getState().setInsightStatus({
            engine_id: 'eng-1',
            running: true,
            lines_ingested: 42,
        })
        useEngineStore.getState().setInsightReports([report], 42)
        useEngineStore.getState().setInsightError('boom')

        useEngineStore.getState().clearInsightData()

        const state = useEngineStore.getState()
        expect(state.insightStatus).toBeNull()
        expect(state.insightReports).toHaveLength(0)
        expect(state.insightError).toBeNull()
    })

    it('reset clears insight data with engine state', () => {
        useEngineStore.getState().setEngineId('eng-1')
        useEngineStore.getState().setInsightReports([report], 42)

        useEngineStore.getState().reset()

        expect(useEngineStore.getState().insightReports).toHaveLength(0)
        expect(useEngineStore.getState().insightLastLinesIngested).toBe(0)
    })
})
