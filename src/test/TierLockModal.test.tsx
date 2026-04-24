import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TierLockModal from '@/components/playground/TierLockModal'
import { TierRequiredError } from '@/services/api'
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

const tierError = new TierRequiredError({
    permission: 'command.evaluate_cascade',
    userId: 'free_demo',
    userTier: { name: 'free', level: 1 },
    requiredTier: { name: 'enterprise', level: 3 },
    reason: 'enterprise tier required',
})

const disabledError = new TierRequiredError({
    permission: 'command.shutdown_world',
    userId: 'free_demo',
    userTier: { name: 'free', level: 1 },
    requiredTier: { name: 'disabled', level: 99 },
    reason: 'feature disabled in this deployment',
})

function renderModal(error: TierRequiredError | null, onClose = vi.fn()) {
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
            tier: null,
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
        // Modal contents are wrapped in a heading; absence proves it didn't mount.
        expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })

    it('renders tier-locked content with required + current tier', () => {
        renderModal(tierError)
        // Required tier name appears in the body
        expect(screen.getByText(/enterprise/i)).toBeInTheDocument()
        // Current tier (free) appears too
        expect(screen.getByText(/free/i)).toBeInTheDocument()
        // Switch button is present in tier-locked mode
        expect(
            screen.getByRole('button', { name: /switch/i }),
        ).toBeInTheDocument()
    })

    it('renders disabled-mode content (no Switch button)', () => {
        renderModal(disabledError)
        expect(
            screen.queryByRole('button', { name: /switch/i }),
        ).not.toBeInTheDocument()
    })

    it('switches to admin on click and updates the auth store', async () => {
        mockedListUsers.mockResolvedValue({
            users: [
                {
                    id: 'admin',
                    name: 'Admin',
                    role: 'admin',
                    tier: { name: 'enterprise', level: 3 },
                },
            ],
        })
        mockedLogin.mockResolvedValue({
            token: 'admin-token',
            user: { id: 'admin', name: 'Admin' },
        })

        const { onClose } = renderModal(tierError)
        fireEvent.click(screen.getByRole('button', { name: /switch/i }))

        await waitFor(() => {
            expect(useAuthStore.getState().token).toBe('admin-token')
        })
        expect(useAuthStore.getState().selectedUserId).toBe('admin')
        expect(onClose).toHaveBeenCalled()
    })

    it('shows a friendly error and stays open when the switch fails', async () => {
        mockedListUsers.mockRejectedValue(new Error('users endpoint down'))
        mockedLogin.mockRejectedValue(new Error('login endpoint down'))

        const { onClose } = renderModal(tierError)
        fireEvent.click(screen.getByRole('button', { name: /switch/i }))

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument()
        })
        // Modal must NOT auto-close on failure
        expect(onClose).not.toHaveBeenCalled()
    })

    it('invokes onClose when the close button is clicked', () => {
        const { onClose } = renderModal(tierError)
        // The close button has aria-label set from i18n; pick by aria-label "Close"
        // — the FR label is "Fermer" so match either via the X icon button.
        const closeButtons = screen.getAllByRole('button')
        const lastButton = closeButtons[closeButtons.length - 1]
        expect(lastButton).toBeDefined()
        fireEvent.click(lastButton!)
        expect(onClose).toHaveBeenCalled()
    })
})
