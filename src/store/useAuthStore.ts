import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SelectableUser } from '@/services/api'

interface AuthUser {
    id: string
    name: string
}

export type { SelectableUser }

interface AuthState {
    /** Bearer token when logged in, null for unauthenticated (anonymous) visitors. */
    token: string | null
    /** Current principal. `null` means the app has not yet resolved the session. */
    user: AuthUser | null
    /** Permitted operation keys for the current subject. Empty for anonymous. */
    operations: string[]
    /** True while the initial session bootstrap is running. */
    loading: boolean
    /** User id the operator explicitly selected in the dropdown (persisted). */
    selectedUserId: string | null
    /**
     * Cached demo-user list. Populated once after bootstrap by UserSelector
     * and kept in memory for the lifetime of the page so navigating away and
     * back never triggers a second GET /users round-trip.
     * Not persisted — resets on hard reload (intentional; list is fast to
     * re-fetch and demo accounts rarely change).
     */
    demoUsers: SelectableUser[] | null

    setAuth: (token: string | null, user: AuthUser, operations?: string[]) => void
    setOperations: (operations: string[]) => void
    clearAuth: () => void
    setLoading: (loading: boolean) => void
    setSelectedUserId: (userId: string | null) => void
    setDemoUsers: (users: SelectableUser[]) => void
}

/**
 * Persisted authentication store.
 *
 * The selected demo user id is persisted across reloads so the operator's
 * choice (e.g. "logcraft_demo") survives page refreshes. The bearer token is
 * persisted too so the same demo user doesn't need to re-authenticate on
 * every navigation.
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            operations: [],
            loading: true,
            selectedUserId: null,
            demoUsers: null,

            setAuth: (token, user, operations = []) =>
                set({ token, user, operations, loading: false }),
            setOperations: (operations) => set({ operations }),
            clearAuth: () =>
                set({
                    token: null,
                    user: null,
                    operations: [],
                    loading: false,
                    selectedUserId: null,
                    demoUsers: null,
                }),
            setLoading: (loading) => set({ loading }),
            setSelectedUserId: (userId) => set({ selectedUserId: userId }),
            setDemoUsers: (users) => set({ demoUsers: users }),
        }),
        {
            name: 'coderoast.auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                operations: state.operations,
                selectedUserId: state.selectedUserId,
            }),
        }
    )
)
