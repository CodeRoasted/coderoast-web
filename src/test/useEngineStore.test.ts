import { describe, it, expect, beforeEach } from 'vitest'
import { useEngineStore } from '@/store/useEngineStore'

describe('useEngineStore', () => {
    beforeEach(() => {
        // Reset store to initial state between tests
        useEngineStore.setState({
            engineId: null,
            snapshot: null,
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
})
