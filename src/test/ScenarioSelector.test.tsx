import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useEngineStore } from '@/store/useEngineStore'

vi.mock('@/services/api', () => ({
    listScenarios: vi.fn(),
    getScenario: vi.fn(),
    TierRequiredError: class TierRequiredError extends Error {
        permission: string
        userId: string
        userTier: unknown
        requiredTier: unknown
        reason: string
        constructor(p: { permission: string; userId: string; reason: string }) {
            super(p.reason)
            this.permission = p.permission
            this.userId = p.userId
            this.userTier = null
            this.requiredTier = null
            this.reason = p.reason
        }
    },
}))

import ScenarioSelector from '@/components/playground/ScenarioSelector'
import { listScenarios, getScenario } from '@/services/api'

const mockedList = vi.mocked(listScenarios)
const mockedGet = vi.mocked(getScenario)

describe('ScenarioSelector', () => {
    beforeEach(() => {
        useEngineStore.setState({
            selectedScenarioId: null,
            scenarioYaml: '',
        })
        mockedList.mockReset()
        mockedGet.mockReset()
    })

    it('renders categories in Simple → Demo → Showcase order', async () => {
        mockedList.mockResolvedValue({
            scenarios: [
                { id: 's1', name: 'S1', description: '', category: 'Showcase', duration: '1m' },
                { id: 's2', name: 'S2', description: '', category: 'Simple', duration: '1m' },
                { id: 's3', name: 'S3', description: '', category: 'Demo', duration: '1m' },
            ],
        })
        render(
            <MemoryRouter>
                <ScenarioSelector />
            </MemoryRouter>,
        )

        const headers = await screen.findAllByText(/Simple|Demo|Showcase/)
        const order = headers.map((h) => h.textContent)
        expect(order.indexOf('Simple')).toBeLessThan(order.indexOf('Demo'))
        expect(order.indexOf('Demo')).toBeLessThan(order.indexOf('Showcase'))
    })

    it('loads YAML into the engine store when a card is clicked', async () => {
        mockedList.mockResolvedValue({
            scenarios: [
                { id: 'hello', name: 'Hello', description: 'd', category: 'Simple', duration: '1m' },
            ],
        })
        mockedGet.mockResolvedValue({ id: 'hello', yaml: 'agents:\n  - name: x' })
        render(
            <MemoryRouter>
                <ScenarioSelector />
            </MemoryRouter>,
        )

        const card = await screen.findByText('Hello')
        fireEvent.click(card)

        await waitFor(() => {
            expect(useEngineStore.getState().scenarioYaml).toContain('agents:')
            expect(useEngineStore.getState().selectedScenarioId).toBe('hello')
        })
    })

    it('shows the tier-lock modal when scenario fetch is tier-gated', async () => {
        const { TierRequiredError } = await import('@/services/api')
        mockedList.mockResolvedValue({
            scenarios: [
                {
                    id: 'pro_only',
                    name: 'Pro Only',
                    description: 'd',
                    category: 'Showcase',
                    duration: '1m',
                },
            ],
        })
        mockedGet.mockRejectedValue(
            new TierRequiredError({
                permission: 'scenario.showcase',
                userId: 'free',
                userTier: null,
                requiredTier: null,
                reason: 'Showcase scenarios require Pro.',
            }),
        )

        render(
            <MemoryRouter>
                <ScenarioSelector />
            </MemoryRouter>,
        )
        const card = await screen.findByText('Pro Only')
        fireEvent.click(card)

        await waitFor(() => {
            // Modal title is sourced from translations; surfacing it is
            // enough to prove the lock flow fired without coupling the
            // assertion to the exact body template.
            expect(
                screen.getByText(/higher tier|Palier sup/i),
            ).toBeInTheDocument()
        })
        // Selection is rolled back so the user isn't stuck with a fake-checked card.
        expect(useEngineStore.getState().selectedScenarioId).toBeNull()
        expect(useEngineStore.getState().scenarioYaml).toBe('')
    })
})
