import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { PolicyDenialError, createEngine, login, logout, mintWsTicket } from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'
import App from '@/App'

// The boot tests need App's session bootstrap, not the landing page it routes to.
vi.mock('@/pages/Home', () => ({ default: () => null }))

/**
 * The sign-in state lives in the browser until logout or a refused token (ADR-40.D2, row J), and
 * "lives" is read in localStorage itself: a key holding nulls is still a record the site wrote.
 * The key is spelled out rather than imported, because it is the site's storage footprint, the
 * name a privacy statement lists, and an import would follow a rename silently.
 */
const kStorageKey = 'coderoast.auth'
const kVisitor = { id: 'visitor', name: 'Visitor' }

function stored(): string | null {
    return localStorage.getItem(kStorageKey)
}

/** Compares a record, not a string, so a failure prints the whole stored value rather than a truncated one. */
function expectNoStoredState() {
    expect({ [kStorageKey]: stored() }).toEqual({ [kStorageKey]: null })
}

function signIn(token: string, loading = false) {
    useAuthStore.setState({
        token,
        user: kVisitor,
        operations: ['engine.create'],
        loading,
        selectedUserId: 'visitor',
    })
}

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    })
}

const kRefusedByWhoami = {
    authenticated: false,
    token_presented: true,
    token_valid: false,
    user: { id: 'anonymous', name: 'Anonymous' },
    access: null,
}

describe('the persisted sign-in state (ADR-40.D2, row J)', () => {
    let fetchMock: ReturnType<typeof vi.fn>

    /** Every request sent, as `METHOD path bearer`, so a failure prints the whole exchange. */
    function sent(): string[] {
        return fetchMock.mock.calls.map(([url, init]) => {
            const request = (init ?? {}) as RequestInit
            const headers = (request.headers ?? {}) as Record<string, string>
            const path = String(url).replace(/^\/api\/v1/, '')
            return `${request.method ?? 'GET'} ${path} ${headers.Authorization ?? '-'}`
        })
    }

    function serve(routes: Record<string, () => Response>) {
        fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
            const path = url.replace(/^\/api\/v1/, '')
            const route = routes[path]
            if (!route) throw new Error(`unexpected request: ${init?.method ?? 'GET'} ${url}`)
            return route()
        })
    }

    beforeEach(() => {
        fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
        useAuthStore.setState({
            token: null,
            user: null,
            operations: [],
            loading: true,
            selectedUserId: null,
        })
        localStorage.clear()
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    describe('logout', () => {
        it('ends the session with its bearer, then removes the key from localStorage', async () => {
            signIn('bearer-a')
            expect(stored()).toContain('bearer-a')
            serve({ '/logout': () => json({ status: 'logged_out' }) })

            await logout()

            expect(sent()).toEqual(['POST /logout Bearer bearer-a'])
            expectNoStoredState()
            expect(useAuthStore.getState().token).toBeNull()
        })

        it('forgets the sign-in state even when the server cannot be reached', async () => {
            signIn('bearer-a')
            expect(stored()).toContain('bearer-a')
            fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

            await expect(logout()).rejects.toThrow('Failed to fetch')

            expectNoStoredState()
        })

        it('leaves no record of nulls behind, and a later write does not bring the key back', () => {
            signIn('bearer-a')
            expect(stored()).toContain('bearer-a')

            useAuthStore.getState().clearAuth()
            expectNoStoredState()

            useAuthStore.getState().setLoading(true)
            expectNoStoredState()
        })
    })

    describe('a 401 answering the bearer', () => {
        it('removes the key, once, and sends nothing more', async () => {
            signIn('bearer-a')
            expect(stored()).toContain('bearer-a')
            serve({ '/ws/ticket': () => json({ error: 'A ticket requires a live session' }, 401) })

            await expect(mintWsTicket('eng-1')).rejects.toMatchObject({ name: 'HttpError', status: 401 })

            expectNoStoredState()
            expect(useAuthStore.getState().token).toBeNull()
            expect(sent()).toEqual(['POST /ws/ticket Bearer bearer-a'])
        })

        it('leaves the session that replaced the refused bearer while the answer was in flight', async () => {
            signIn('bearer-old')
            let answer: (response: Response) => void = () => {
                throw new Error('the ticket request was never sent')
            }
            fetchMock.mockImplementation(
                () => new Promise<Response>((resolve) => {
                    answer = resolve
                }),
            )
            const pending = mintWsTicket('eng-1')
            signIn('bearer-new')

            answer(json({ error: 'A ticket requires a live session' }, 401))
            await expect(pending).rejects.toMatchObject({ status: 401 })

            expect(sent()).toEqual(['POST /ws/ticket Bearer bearer-old'])
            expect(stored()).toContain('bearer-new')
            expect(useAuthStore.getState().token).toBe('bearer-new')
        })

        it('is not a login refusal: a 401 from /login refuses the credential in its body, never the bearer', async () => {
            signIn('bearer-a')
            serve({ '/login': () => json({ error: 'Invalid credentials' }, 401) })

            await expect(login('nobody')).rejects.toMatchObject({ status: 401 })

            expect(stored()).toContain('bearer-a')
            expect(useAuthStore.getState().token).toBe('bearer-a')
        })

        it('is not a 403: a policy denial refuses an operation and keeps the session', async () => {
            signIn('bearer-a')
            serve({
                '/engines': () => json({ reason: 'entitlement required', user: 'visitor', role: 'visitor' }, 403),
            })

            await expect(createEngine('name: denied')).rejects.toBeInstanceOf(PolicyDenialError)

            expect(stored()).toContain('bearer-a')
            expect(useAuthStore.getState().token).toBe('bearer-a')
        })
    })

    describe('the boot-time refusal: /whoami answers token_valid false', () => {
        it('removes the refused token before the re-login is sent, and the re-login carries no bearer', async () => {
            signIn('bearer-stale', true)
            expect(stored()).toContain('bearer-stale')
            let storedWhenReloginSent: string | null | undefined
            serve({
                '/whoami': () => json(kRefusedByWhoami),
                '/login': () => {
                    storedWhenReloginSent = stored()
                    return json({ token: 'bearer-fresh', user: kVisitor, access: null })
                },
            })

            render(<App />)
            await waitFor(() => expect(useAuthStore.getState().token).toBe('bearer-fresh'))

            expect(sent()).toEqual(['GET /whoami Bearer bearer-stale', 'POST /login -'])
            expect({ storedWhenReloginSent }).toEqual({ storedWhenReloginSent: null })
            expect(stored()).toContain('bearer-fresh')
            expect(stored()).not.toContain('bearer-stale')
            expect(useAuthStore.getState().selectedUserId).toBe('visitor')
        })

        it('removes the key when the re-login is refused too, and retries nothing', async () => {
            signIn('bearer-stale', true)
            expect(stored()).toContain('bearer-stale')
            serve({
                '/whoami': () => json(kRefusedByWhoami),
                '/login': () => json({ error: 'Invalid credentials' }, 401),
            })

            render(<App />)
            await waitFor(() => expect(useAuthStore.getState().loading).toBe(false))

            expectNoStoredState()
            expect(sent()).toHaveLength(2)
            expect(sent()[0]).toBe('GET /whoami Bearer bearer-stale')
            expect(sent()[1]).toMatch(/^POST \/login /)
        })
    })
})
