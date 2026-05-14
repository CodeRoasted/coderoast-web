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

    it('auto-logs in as logcraft_demo on first visit', async () => {
        mockedListUsers.mockResolvedValue({
            users: [userInsight, userLogcraft, userAdmin],
        })
        mockedLogin.mockResolvedValue({
            token: 'logcraft-token',
            user: { id: 'logcraft_demo', name: 'LogCraft Demo' },
            access: null,
        })

        render(<UserSelector />)

        await waitFor(() => {
            expect(mockedLogin).toHaveBeenCalledWith('logcraft_demo')
        })
        await waitFor(() => {
            expect(useAuthStore.getState().token).toBe('logcraft-token')
        })
    })

    it('does not auto-login when a user is already selected', async () => {
        useAuthStore.setState({
            token: 'existing',
            user: { id: 'logcraft_demo', name: 'LogCraft Demo' },
            selectedUserId: 'logcraft_demo',
        })
        mockedListUsers.mockResolvedValue({ users: [userLogcraft, userInsight] })

        render(<UserSelector />)

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument()
        })
        expect(mockedLogin).not.toHaveBeenCalled()
    })
})
