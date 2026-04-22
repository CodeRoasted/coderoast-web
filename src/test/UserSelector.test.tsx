import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import UserSelector from '@/components/UserSelector'
import { useAuthStore } from '@/store/useAuthStore'

vi.mock('@/services/api', () => ({
    listUsers: vi.fn(),
    login: vi.fn(),
}))

import { listUsers, login } from '@/services/api'

const mockedListUsers = vi.mocked(listUsers)
const mockedLogin = vi.mocked(login)

const userPro = {
    id: 'pro_demo',
    name: 'Pro Demo',
    role: 'pro',
    tier: { name: 'pro', level: 2, description: '' },
}
const userFree = {
    id: 'free_demo',
    name: 'Free Demo',
    role: 'free',
    tier: { name: 'free', level: 1, description: '' },
}
const userEnt = {
    id: 'ent_demo',
    name: 'Enterprise Demo',
    role: 'enterprise',
    tier: { name: 'enterprise', level: 3, description: '' },
}

describe('UserSelector', () => {
    beforeEach(() => {
        // Reset Zustand auth store to a fresh anonymous state.
        useAuthStore.setState({
            token: null,
            user: null,
            loading: false,
            selectedUserId: null,
        })
        mockedListUsers.mockReset()
        mockedLogin.mockReset()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('orders users by tier level ascending (free → pro → enterprise)', async () => {
        mockedListUsers.mockResolvedValue({
            // Backend returns in arbitrary order; UI must normalise.
            users: [userPro, userEnt, userFree],
        })
        // Force an in-flight token so the auto-login does NOT fire and
        // change the dropdown's `value` away from anonymous.
        useAuthStore.setState({ token: 'preset', user: { id: 'x', name: 'x' } })

        render(<UserSelector />)

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument()
        })
        const options = Array.from(
            screen.getByRole('combobox').querySelectorAll('option'),
        ) as HTMLOptionElement[]
        // First option is the anonymous sentinel; demo users start at index 1.
        const demoOrder = options.slice(1).map((o) => o.value)
        expect(demoOrder).toEqual(['free_demo', 'pro_demo', 'ent_demo'])
    })

    it('auto-logs in the lowest-tier demo user on first visit', async () => {
        mockedListUsers.mockResolvedValue({ users: [userPro, userFree] })
        mockedLogin.mockResolvedValue({
            token: 'free-token',
            user: { id: 'free_demo', name: 'Free Demo' },
        })

        render(<UserSelector />)

        await waitFor(() => {
            expect(mockedLogin).toHaveBeenCalledWith('free_demo')
        })
        await waitFor(() => {
            expect(useAuthStore.getState().token).toBe('free-token')
            expect(useAuthStore.getState().selectedUserId).toBe('free_demo')
        })
    })

    it('does not auto-login when a user is already selected', async () => {
        useAuthStore.setState({
            token: 'existing',
            user: { id: 'pro_demo', name: 'Pro Demo' },
            selectedUserId: 'pro_demo',
        })
        mockedListUsers.mockResolvedValue({ users: [userPro, userFree] })

        render(<UserSelector />)

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument()
        })
        expect(mockedLogin).not.toHaveBeenCalled()
    })
})
