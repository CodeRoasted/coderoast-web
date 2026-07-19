import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useEngineStore } from '@/store/useEngineStore'

vi.mock('@/services/api', () => ({
    listScenarios: vi.fn(),
    getScenario: vi.fn(),
}))

import OnboardingModal from '@/components/playground/OnboardingModal'
import { listScenarios, getScenario } from '@/services/api'

const mockedList = vi.mocked(listScenarios)
const mockedGet = vi.mocked(getScenario)

/**
 * Pragmatic coverage:
 *  1. The wizard renders all three steps in sequence and lands on the
 *     "Ready to run" confirmation with a chosen scenario.
 *  2. Picking a scenario updates the engine store (id + yaml), so the rest
 *     of the Lab can render it.
 *  3. The "Launch" button on step 3 fires the onLaunch callback exactly
 *     once — that's the contract the parent relies on to start the engine.
 *
 * We deliberately do NOT test the keyword-match heuristics — they are an
 * implementation detail and re-asserting them in a test would freeze them.
 */
describe('OnboardingModal', () => {
    beforeEach(() => {
        useEngineStore.setState({
            selectedScenarioId: null,
            scenarioYaml: '',
        })
        mockedList.mockReset()
        mockedGet.mockReset()
        mockedList.mockResolvedValue({
            scenarios: [
                { id: 'simple/hello_world', name: 'Hello World', description: 'tiny', category: 'Simple', duration: '1m' },
                { id: 'simple/minimal_db', name: 'Minimal DB', description: 'two services', category: 'Simple', duration: '1m' },
                { id: 'demo/cascade', name: 'Cascade Demo', description: 'incident chain', category: 'Demo', duration: '5m' },
                { id: 'showcase/chaos_train', name: 'Chaos Train', description: 'multi-incident', category: 'Showcase', duration: '10m' },
            ],
        })
        mockedGet.mockResolvedValue({
            yaml: 'seed: 42\nagents: []\n',
            id: 'simple/hello_world',
        })
    })

    it('walks the user through intent → complexity → ready in three steps', async () => {
        const onLaunch = vi.fn()
        render(
            <OnboardingModal
                open
                mode="logcraft"
                onClose={() => undefined}
                onReady={() => undefined}
                onLaunch={onLaunch}
            />,
        )

        // Step 1 — pick "Just explore"
        const exploreBtn = await screen.findByRole('button', { name: /just explore/i })
        fireEvent.click(exploreBtn)
        fireEvent.click(screen.getByRole('button', { name: /next/i }))

        // Step 2 — pick "Simple" (1-2 services, no incidents)
        const simpleBtn = await screen.findByRole('button', { name: /1.2 services/i })
        fireEvent.click(simpleBtn)
        fireEvent.click(screen.getByRole('button', { name: /pick my scenario/i }))

        // Step 3 — engine store should now hold the picked scenario, and the
        // Launch button is visible.
        await waitFor(() => {
            expect(useEngineStore.getState().selectedScenarioId).toBeTruthy()
        })
        expect(useEngineStore.getState().scenarioYaml).toContain('seed: 42')
        expect(mockedList).toHaveBeenCalledWith('logcraft')
        expect(mockedGet).toHaveBeenCalledWith('simple/hello_world', 'logcraft')

        const launchBtn = await screen.findByRole('button', { name: /launch the engine/i })
        fireEvent.click(launchBtn)
        expect(onLaunch).toHaveBeenCalledTimes(1)
    })

    it('blocks advancing from step 1 until an intent is picked', async () => {
        render(
            <OnboardingModal
                open
                mode="logcraft"
                onClose={() => undefined}
                onReady={() => undefined}
                onLaunch={() => undefined}
            />,
        )
        const next = await screen.findByRole('button', { name: /next/i })
        expect(next).toBeDisabled()
    })

    it('renders nothing when closed', () => {
        const { queryByRole } = render(
            <OnboardingModal
                open={false}
                mode="logcraft"
                onClose={() => undefined}
                onReady={() => undefined}
                onLaunch={() => undefined}
            />,
        )
        expect(queryByRole('dialog')).toBeNull()
    })
})
