import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TierLockModal from '@/components/playground/TierLockModal'
import { PolicyDenialError } from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'

vi.mock('@/services/api', async () => {
    const actual = await vi.importActual<typeof import('@/services/api')>(
        '@/services/api',
    )
    return {
        ...actual,
        listUsers: vi.fn(),
        login: vi.fn(),
    }
})

import { listUsers, login } from '@/services/api'

const mockedListUsers = vi.mocked(listUsers)
const mockedLogin = vi.mocked(login)

const accessError = new PolicyDenialError({
    operation: 'engine.cascade.trigger',
    requiredEntitlement: 'logcraft.advanced_dsl',
    quotaKey: '',
    quotaLimit: null,
    userId: 'logcraft_demo',
    subject: 'session-abc',
    role: 'demo_logcraft',
    identityKind: 'demo',
    deploymentContext: 'public_demo',
    reason: 'entitlement logcraft.advanced_dsl required',
})

const quotaError = new PolicyDenialError({
    operation: 'engine.create',
    requiredEntitlement: '',
    quotaKey: 'engines.concurrent',
    quotaLimit: 1,
    userId: 'logcraft_demo',
    subject: 'session-abc',
    role: 'demo_logcraft',
    identityKind: 'demo',
    deploymentContext: 'public_demo',
    reason: 'quota exceeded: engines.concurrent',
})

function renderModal(error: PolicyDenialError | null, onClose = vi.fn()) {
    return {
        onClose,
        ...render(
            <MemoryRouter>
                <TierLockModal error={error} onClose={onClose} />
            </MemoryRouter>,
        ),
    }
}

describe('TierLockModal', () => {
    beforeEach(() => {
        useAuthStore.setState({
            token: null,
            user: null,
            operations: [],
            loading: false,
            selectedUserId: null,
        })
        mockedListUsers.mockReset()
        mockedLogin.mockReset()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('renders nothing when no error is provided', () => {
        renderModal(null)
        expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })

    it('renders entitlement-locked content with operation and entitlement', () => {
        renderModal(accessError)
        expect(screen.getAllByText(/engine[.]cascade[.]trigger/).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/logcraft[.]advanced_dsl/).length).toBeGreaterThan(0)
        expect(
            screen.getByRole('button', { name: /switch/i }),
        ).toBeInTheDocument()
    })

    it('renders quota-error content without Switch button', () => {
        renderModal(quotaError)
        expect(
            screen.queryByRole('button', { name: /switch/i }),
        ).not.toBeInTheDocument()
    })

    it('switches to insight_demo on click and updates the auth store', async () => {
        mockedListUsers.mockResolvedValue({
            users: [
                {
                    id: 'insight_demo',
                    name: 'InSight Demo',
                    role: 'demo_insight',
                    is_demo: true,
                },
            ],
        })
        mockedLogin.mockResolvedValue({
            token: 'insight-token',
            user: { id: 'insight_demo', name: 'InSight Demo' },
            access: {
                tenant_id: 'default',
                user_id: 'insight_demo',
                subject_id: 'session-xyz',
                name: 'InSight Demo',
                role: 'demo_insight',
                identity_kind: 'demo',
                deployment_context: 'public_demo',
                entitlements: ['logcraft.advanced_dsl'],
                operations: ['engine.cascade.trigger'],
                quotas: [],
            },
        })

        const { onClose } = renderModal(accessError)
        fireEvent.click(screen.getByRole('button', { name: /switch/i }))

        await waitFor(() => {
            expect(useAuthStore.getState().token).toBe('insight-token')
        })
        expect(useAuthStore.getState().selectedUserId).toBe('insight_demo')
        expect(onClose).toHaveBeenCalled()
    })

    it('shows a friendly error and stays open when the switch fails', async () => {
        mockedListUsers.mockRejectedValue(new Error('users endpoint down'))
        mockedLogin.mockRejectedValue(new Error('login endpoint down'))

        const { onClose } = renderModal(accessError)
        fireEvent.click(screen.getByRole('button', { name: /switch/i }))

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument()
        })
        expect(onClose).not.toHaveBeenCalled()
    })

    it('invokes onClose when the close button is clicked', () => {
        const { onClose } = renderModal(accessError)
        const closeButtons = screen.getAllByRole('button')
        const lastButton = closeButtons[closeButtons.length - 1]
        expect(lastButton).toBeDefined()
        fireEvent.click(lastButton!)
        expect(onClose).toHaveBeenCalled()
    })
})
