import { create } from 'zustand'
import { persist, createJSONStorage, type PersistStorage } from 'zustand/middleware'

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
    /** Sign out: forget the whole sign-in state and end the bootstrap. */
    clearAuth: () => void
    /**
     * Forget the sign-in state if it still holds `token`, the bearer the server refused. A refusal
     * answering an older bearer leaves the session that replaced it, and a second refusal of the same
     * bearer finds nothing left to clear, so the clearing happens once. `loading` is left as it is:
     * a refusal met during the bootstrap does not end the bootstrap.
     */
    forgetRefusedToken: (token: string) => void
    setLoading: (loading: boolean) => void
    setSelectedUserId: (userId: string | null) => void
}

/** The part of the state written to the browser: the sign-in state. */
type PersistedAuth = Pick<AuthState, 'token' | 'user' | 'operations' | 'selectedUserId'>

/**
 * The sign-in state of a visitor who is signed out: nothing to keep. A fresh object per call,
 * so no two states share one `operations` array.
 */
function signedOut(): PersistedAuth {
    return { token: null, user: null, operations: [], selectedUserId: null }
}

function holdsSignInState(state: PersistedAuth): boolean {
    return (
        state.token !== null ||
        state.user !== null ||
        state.operations.length > 0 ||
        state.selectedUserId !== null
    )
}

/**
 * localStorage, with one rule added: the key exists only while there is sign-in state to keep.
 * zustand's persist middleware writes the persisted part on EVERY `set`, so a signed-out store
 * would otherwise leave a record of nulls behind, and any later write, `setLoading` included,
 * would put one back. The browser keeps the sign-in state until logout or a refused token
 * (ADR-40.D2, row J), and a record of nulls is still a record.
 */
function signInStateStorage(): PersistStorage<PersistedAuth> | undefined {
    const jsonStorage = createJSONStorage<PersistedAuth>(() => localStorage)
    if (jsonStorage === undefined) return undefined
    return {
        ...jsonStorage,
        setItem: (name, value) =>
            holdsSignInState(value.state)
                ? jsonStorage.setItem(name, value)
                : jsonStorage.removeItem(name),
    }
}

/**
 * Persisted authentication store.
 *
 * The selected user id is persisted across reloads so the operator's
 * choice (e.g. "visitor") survives page refreshes. The bearer token is
 * persisted too so the same visitor doesn't need to re-authenticate on
 * every navigation. Both leave the browser at logout and on a refused
 * token: see `signInStateStorage`.
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            ...signedOut(),
            loading: true,

            setAuth: (token, user, operations = []) =>
                set({ token, user, operations, loading: false }),
            setOperations: (operations) => set({ operations }),
            clearAuth: () => set({ ...signedOut(), loading: false }),
            forgetRefusedToken: (token) => {
                if (get().token === token) set(signedOut())
            },
            setLoading: (loading) => set({ loading }),
            setSelectedUserId: (userId) => set({ selectedUserId: userId }),
        }),
        {
            name: 'coderoast.auth',
            storage: signInStateStorage(),
            partialize: (state): PersistedAuth => ({
                token: state.token,
                user: state.user,
                operations: state.operations,
                selectedUserId: state.selectedUserId,
            }),
        }
    )
)
