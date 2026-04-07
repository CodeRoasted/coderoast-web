import { create } from 'zustand'
import type { EngineSnapshot } from '@/types/engine'

interface EngineState {
    engineId: string | null
    snapshot: EngineSnapshot | null
    connected: boolean
    selectedScenarioId: string | null
    scenarioYaml: string
    statusMessage: string | null

    setEngineId: (id: string | null) => void
    setSnapshot: (snapshot: EngineSnapshot | null) => void
    setConnected: (connected: boolean) => void
    setSelectedScenarioId: (id: string | null) => void
    setScenarioYaml: (yaml: string) => void
    setStatusMessage: (msg: string | null) => void
    reset: () => void
}

export const useEngineStore = create<EngineState>((set) => ({
    engineId: null,
    snapshot: null,
    connected: false,
    selectedScenarioId: null,
    scenarioYaml: '',
    statusMessage: null,

    setEngineId: (id) => set({ engineId: id }),
    setSnapshot: (snapshot) => set({ snapshot }),
    setConnected: (connected) => set({ connected }),
    setSelectedScenarioId: (id) => set({ selectedScenarioId: id }),
    setScenarioYaml: (yaml) => set({ scenarioYaml: yaml }),
    setStatusMessage: (msg) => set({ statusMessage: msg }),
    reset: () =>
        set({
            engineId: null,
            snapshot: null,
            connected: false,
            statusMessage: null,
        }),
}))
