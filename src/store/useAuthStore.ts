import { create } from 'zustand'
import { persist, createJSONStorage, type PersistStorage } from 'zustand/middleware'
import { login } from '@/services/api'

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
    /**
     * True once the server refused a password-less sign-in with 403: the deployment's
     * `anonymous_access_enabled` flag is off, and every door a visitor could use is closed (RUL-259,
     * ADR-35.D10). While it holds, `login()` sends nothing; only `reopenPublicAccess()` asks again.
     * Never persisted: a reload asks the server once more, which is one request, not a loop.
     */
    publicAccessClosed: boolean

    setAuth: (token: string | null, user: AuthUser, operations?: string[]) => void
    setOperations: (operations: string[]) => void
    /** Sign out: forget the whole sign-in state and end the bootstrap. */
    clearAuth: () => void
    /**
     * Forget the sign-in state if it still holds `token`, the bearer the server refused. A refusal
     * answering an older bearer leaves the session that replaced it, and a second refusal of the same
     * bearer finds nothing left to clear, so the clearing happens once. `loading` is left as it is:
     * a refusal met during the bootstrap does not end the bootstrap.
     *
     * Outside the bootstrap, the open tab then signs back in as visitor, once, so a session that
     * ended under it does not leave every control locked until a reload. The bootstrap signs in on
     * its own (with the persisted selection), so a refusal met during it starts no second sign-in.
     */
    forgetRefusedToken: (token: string) => void
    setLoading: (loading: boolean) => void
    setSelectedUserId: (userId: string | null) => void
    /** The server refused a visitor: show the closed state and stop signing in in the background. */
    closePublicAccess: () => void
    /** A sign-in the server served: the closed state ends. */
    openPublicAccess: () => void
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
            publicAccessClosed: false,

            setAuth: (token, user, operations = []) =>
                set({ token, user, operations, loading: false }),
            setOperations: (operations) => set({ operations }),
            clearAuth: () => set({ ...signedOut(), loading: false }),
            forgetRefusedToken: (token) => {
                if (get().token !== token) return
                set(signedOut())
                if (get().loading) return
                login('visitor')
                    .then(({ token: fresh, user, access }) => {
                        // A sign-in made while this one was in flight is the visitor's newer choice.
                        if (get().token !== null) return
                        set({ token: fresh, user, operations: access?.operations ?? [], selectedUserId: 'visitor' })
                    })
                    .catch(() => {
                        // Refused, closed or unreachable: the tab stays signed out and retries nothing.
                    })
            },
            setLoading: (loading) => set({ loading }),
            setSelectedUserId: (userId) => set({ selectedUserId: userId }),
            closePublicAccess: () => set({ publicAccessClosed: true, loading: false }),
            openPublicAccess: () => set({ publicAccessClosed: false }),
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
