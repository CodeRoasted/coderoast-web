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

const userLogcraft = {
    id: 'logcraft_demo',
    name: 'LogCraft Demo',
    role: 'demo_logcraft',
    is_demo: true,
}
const userInsight = {
    id: 'insight_demo',
    name: 'InSight Demo',
    role: 'demo_insight',
    is_demo: true,
}
const userAdmin = {
    id: 'admin',
    name: 'Admin',
    role: 'admin',
    is_demo: false,
}

describe('UserSelector', () => {
    beforeEach(() => {
        useAuthStore.setState({
            token: null,
            user: null,
            operations: [],
            loading: false,
            selectedUserId: null,
            demoUsers: null,
        })
        mockedListUsers.mockReset()
        mockedLogin.mockReset()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('orders demo users first then alphabetically', async () => {
        mockedListUsers.mockResolvedValue({
            users: [userAdmin, userInsight, userLogcraft],
        })
        useAuthStore.setState({ token: 'preset', user: { id: 'x', name: 'x' } })

        render(<UserSelector />)

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument()
        })
        const options = Array.from(
            screen.getByRole('combobox').querySelectorAll('option'),
        ) as HTMLOptionElement[]
        const order = options.map((o) => o.value)
        // Demo users come before non-demo users
        expect(order.indexOf('logcraft_demo')).toBeLessThan(order.indexOf('admin'))
        expect(order.indexOf('insight_demo')).toBeLessThan(order.indexOf('admin'))
    })

    it('calls listUsers once token is available and not loading', async () => {
        mockedListUsers.mockResolvedValue({
            users: [userInsight, userLogcraft, userAdmin],
        })
        useAuthStore.setState({
            token: 'logcraft-token',
            user: { id: 'logcraft_demo', name: 'LogCraft Demo' },
            loading: false,
        })

        render(<UserSelector />)

        await waitFor(() => {
            expect(mockedListUsers).toHaveBeenCalled()
        })
        expect(mockedLogin).not.toHaveBeenCalled()
    })

    it('does not refetch user list when token changes after switching identity', async () => {
        mockedListUsers.mockResolvedValue({
            users: [userLogcraft, userInsight],
        })
        useAuthStore.setState({
            token: 'logcraft-token',
            user: { id: 'logcraft_demo', name: 'LogCraft Demo' },
            loading: false,
            demoUsers: null,
        })

        render(<UserSelector />)

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument()
        })
        expect(mockedListUsers).toHaveBeenCalledTimes(1)

        // Simulate switching to insight user — token changes but demoUsers
        // is already populated in the store, so no second fetch.
        useAuthStore.setState({
            token: 'insight-token',
            user: { id: 'insight_demo', name: 'InSight Demo' },
            loading: false,
        })

        await new Promise((r) => setTimeout(r, 50))
        // Should NOT have called listUsers again
        expect(mockedListUsers).toHaveBeenCalledTimes(1)
    })

    it('skips listUsers while auth is loading', async () => {
        useAuthStore.setState({ token: 'some-token', loading: true })
        render(<UserSelector />)

        await new Promise((r) => setTimeout(r, 50))
        expect(mockedListUsers).not.toHaveBeenCalled()
    })
})
