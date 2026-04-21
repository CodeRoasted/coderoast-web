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
    /** True while the initial session bootstrap is running. */
    loading: boolean
    /** User id the operator explicitly selected in the dropdown (persisted). */
    selectedUserId: string | null

    setAuth: (token: string | null, user: AuthUser) => void
    clearAuth: () => void
    setLoading: (loading: boolean) => void
    setSelectedUserId: (userId: string | null) => void
}

/**
 * Persisted authentication store.
 *
 * The selected demo user id is persisted across reloads so the operator's
 * choice (e.g. "pro_demo") survives page refreshes. The bearer token is
 * persisted too so the same demo user doesn't need to re-authenticate on
 * every navigation.
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            loading: true,
            selectedUserId: null,

            setAuth: (token, user) => set({ token, user, loading: false }),
            clearAuth: () =>
                set({ token: null, user: null, loading: false, selectedUserId: null }),
            setLoading: (loading) => set({ loading }),
            setSelectedUserId: (userId) => set({ selectedUserId: userId }),
        }),
        {
            name: 'coderoast.auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                selectedUserId: state.selectedUserId,
            }),
        }
    )
)
