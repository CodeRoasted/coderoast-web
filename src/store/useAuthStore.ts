import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthUser {
    id: string
    name: string
}

interface AuthState {
    /** Bearer token when logged in, null for unauthenticated (anonymous) visitors. */
    token: string | null
    /** Current principal. `null` means the app has not yet resolved the session. */
    user: AuthUser | null
    /** Permitted operation keys for the current subject. Empty for anonymous. */
    operations: string[]
    /** True while the initial session bootstrap is running. */
    loading: boolean
    /** User id the operator explicitly selected. Persisted so revisiting the page auto-restores the session. */
    selectedUserId: string | null

    setAuth: (token: string | null, user: AuthUser, operations?: string[]) => void
    setOperations: (operations: string[]) => void
    clearAuth: () => void
    setLoading: (loading: boolean) => void
    setSelectedUserId: (userId: string | null) => void
}

/**
 * Persisted authentication store.
 *
 * The selected user id is persisted across reloads so the operator's
 * choice (e.g. "visitor") survives page refreshes. The bearer token is
 * persisted too so the same visitor doesn't need to re-authenticate on
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
                }),
            setLoading: (loading) => set({ loading }),
            setSelectedUserId: (userId) => set({ selectedUserId: userId }),
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
