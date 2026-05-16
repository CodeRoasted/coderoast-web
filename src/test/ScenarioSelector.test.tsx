import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useEngineStore } from '@/store/useEngineStore'

vi.mock('@/services/api', () => ({
    listScenarios: vi.fn(),
    getScenario: vi.fn(),
    login: vi.fn(),
    PolicyDenialError: class PolicyDenialError extends Error {
        operation: string
        requiredEntitlement: string
        quotaKey: string
        quotaLimit: number | null
        userId: string
        subject: string
        role: string
        identityKind: string
        deploymentContext: string
        constructor(p: { operation: string; requiredEntitlement: string; quotaKey: string; quotaLimit: number | null; userId: string; subject: string; role: string; identityKind: string; deploymentContext: string; reason: string }) {
            super(p.reason || 'Access denied')
            this.name = 'PolicyDenialError'
            this.operation = p.operation
            this.requiredEntitlement = p.requiredEntitlement
            this.quotaKey = p.quotaKey
            this.quotaLimit = p.quotaLimit
            this.userId = p.userId
            this.subject = p.subject
            this.role = p.role
            this.identityKind = p.identityKind
            this.deploymentContext = p.deploymentContext
        }
    },
}))

import ScenarioSelector from '@/components/playground/ScenarioSelector'
import { listScenarios, getScenario, login } from '@/services/api'

const mockedList = vi.mocked(listScenarios)
const mockedGet = vi.mocked(getScenario)
const mockedLogin = vi.mocked(login)

describe('ScenarioSelector', () => {
    beforeEach(() => {
        useEngineStore.setState({
            selectedScenarioId: null,
            scenarioYaml: '',
        })
        mockedList.mockReset()
        mockedGet.mockReset()
        mockedLogin.mockReset()
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
                <ScenarioSelector mode="logcraft" />
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
                <ScenarioSelector mode="logcraft" />
            </MemoryRouter>,
        )

        const card = await screen.findByText('Hello')
        fireEvent.click(card)

        await waitFor(() => {
            expect(mockedGet).toHaveBeenCalledWith('hello', 'logcraft', expect.any(AbortSignal))
            expect(useEngineStore.getState().scenarioYaml).toContain('agents:')
            expect(useEngineStore.getState().selectedScenarioId).toBe('hello')
        })
    })

    it('auto-logs in as visitor and retries when scenario fetch is policy-gated', async () => {
        const { PolicyDenialError } = await import('@/services/api')
        mockedList.mockResolvedValue({
            scenarios: [
                {
                    id: 'insight_only',
                    name: 'InSight Only',
                    description: 'd',
                    category: 'Showcase',
                    duration: '1m',
                },
            ],
        })
        mockedGet
            .mockRejectedValueOnce(
                new PolicyDenialError({
                    operation: 'scenario.showcase.load',
                    requiredEntitlement: 'insight.showcase',
                    quotaKey: '',
                    quotaLimit: null,
                    userId: 'visitor',
                    subject: 'session-abc',
                    role: 'visitor',
                    identityKind: 'visitor',
                    deploymentContext: 'public_demo',
                    reason: 'entitlement insight.showcase required',
                }),
            )
            .mockResolvedValueOnce({ id: 'insight_only', yaml: 'agents:\n  - name: x' })
        mockedLogin.mockResolvedValue({
            token: 'visitor-token',
            user: { id: 'visitor', name: 'InSight Visitor' },
            access: null,
        })

        render(
            <MemoryRouter>
                <ScenarioSelector mode="insight" />
            </MemoryRouter>,
        )
        const card = await screen.findByText('InSight Only')
        fireEvent.click(card)

        await waitFor(() => {
            expect(mockedLogin).toHaveBeenCalledWith('visitor')
            expect(useEngineStore.getState().scenarioYaml).toContain('agents:')
            expect(useEngineStore.getState().selectedScenarioId).toBe('insight_only')
        })
    })
})
