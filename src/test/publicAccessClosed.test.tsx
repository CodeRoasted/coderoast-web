import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PublicAccessClosedError, createEngine, login } from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'
import { useStore } from '@/store/useStore'
import App from '@/App'

// The bootstrap and the root layout are under test, not the landing page they route to.
vi.mock('@/pages/Home', () => ({ default: () => null }))

/**
 * RUL-259 (DN-94.D12): with the server's `anonymous_access_enabled` flag off, the
 * password-less login answers 403 and a request with no session or on a visitor session is refused,
 * both with cause `anonymous_access_disabled`. The app shows one closed state, keeps the visitor's
 * session (refused, never destroyed), and sends nothing more until the visitor asks.
 */

const kTitleEn = 'Public access is temporarily disabled'
const kTitleFr = "L'accès public est temporairement désactivé"
const kVisitor = { id: 'visitor', name: 'Visitor' }

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    })
}

/** The server's denial with the access-mode flag off: the 403 body, its `cause` the audit token. */
function accessModeDenial(operation: string, identityKind: string): Response {
    return json(
        {
            error: 'Access denied',
            reason: `Operation '${operation}' is refused: anonymous access is disabled on this deployment; sign in`,
            cause: 'anonymous_access_disabled',
            operation,
            required_entitlement: null,
            quota: null,
            user: identityKind,
            role: identityKind,
            identity_kind: identityKind,
            deployment_context: 'public_demo',
        },
        403,
    )
}

const kVisitorLogin = { token: 'bearer-fresh', user: kVisitor, access: { operations: ['engine.create'] } }

describe('the closed state: public access disabled by the server (RUL-259)', () => {
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

    /** Answers each path from its queue in order; a request with no answer left fails the test loudly. */
    function serve(routes: Record<string, Array<() => Response>>) {
        fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
            const path = url.replace(/^\/api\/v1/, '')
            const answer = routes[path]?.shift()
            if (!answer) throw new Error(`unexpected request: ${init?.method ?? 'GET'} ${url}; sent: ${sent().join(' | ')}`)
            return answer()
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
            publicAccessClosed: false,
        })
        useStore.setState({ language: 'en' })
        localStorage.clear()
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('renders the closed state when the background visitor login answers 403, after one request', async () => {
        serve({ '/login': [() => accessModeDenial('auth.login', 'anonymous')] })

        render(<App />)

        expect(await screen.findByRole('heading', { name: kTitleEn })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Try again' })).toBeEnabled()
        expect(sent()).toEqual(['POST /login -'])
        expect(useAuthStore.getState()).toMatchObject({ token: null, loading: false, publicAccessClosed: true })
    })

    it('renders the closed state in French when the visitor reads French', async () => {
        useStore.setState({ language: 'fr' })
        serve({ '/login': [() => accessModeDenial('auth.login', 'anonymous')] })

        render(<App />)

        expect(await screen.findByRole('heading', { name: kTitleFr })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Réessayer' })).toBeEnabled()
    })

    it('switches to the closed state when a request is refused mid-session, keeping the session', async () => {
        useAuthStore.setState({ token: 'bearer-a', user: kVisitor, selectedUserId: 'visitor' })
        serve({
            '/whoami': [
                () =>
                    json({
                        authenticated: true,
                        token_presented: true,
                        token_valid: true,
                        user: kVisitor,
                        access: { operations: ['engine.create'] },
                    }),
            ],
            '/engines': [() => accessModeDenial('engine.create', 'visitor')],
        })
        render(<App />)
        await waitFor(() => expect(useAuthStore.getState().loading).toBe(false))
        expect(screen.queryByRole('heading', { name: kTitleEn })).not.toBeInTheDocument()

        // The refusal re-renders the layout, so the request runs inside act().
        await act(async () => {
            await expect(createEngine('name: refused')).rejects.toMatchObject({
                name: 'PolicyDenialError',
                cause: 'anonymous_access_disabled',
            })
        })

        expect(await screen.findByRole('heading', { name: kTitleEn })).toBeInTheDocument()
        expect(sent()).toEqual(['GET /whoami Bearer bearer-a', 'POST /engines Bearer bearer-a'])
        // Refused, never destroyed (DN-94.D12 item 3): switched back on, the same bearer is served.
        expect(useAuthStore.getState().token).toBe('bearer-a')
    })

    it('sends no sign-in while closed, whichever background path asks', async () => {
        serve({ '/login': [() => accessModeDenial('auth.login', 'anonymous')] })
        render(<App />)
        await screen.findByRole('heading', { name: kTitleEn })

        // The Lab's auto-login, the scenario picker's upgrade and the persisted selection's re-login
        // all go through `login()`; a refused bearer's re-login does too.
        const attempts = await Promise.allSettled([login('visitor'), login('visitor'), login(null)])
        useAuthStore.setState({ token: 'bearer-old' })
        useAuthStore.getState().forgetRefusedToken('bearer-old')
        await Promise.resolve()

        expect(attempts.map((attempt) => attempt.status === 'rejected' && attempt.reason instanceof PublicAccessClosedError)).toEqual([
            true,
            true,
            true,
        ])
        expect(sent()).toEqual(['POST /login -'])
    })

    it('asks again only on the visitor click, one request per click, and opens when served', async () => {
        let answerSecond: (response: Response) => void = () => {
            throw new Error('the second sign-in was never sent')
        }
        const queue = [
            () => Promise.resolve(accessModeDenial('auth.login', 'anonymous')),
            () => new Promise<Response>((resolve) => (answerSecond = resolve)),
            () => Promise.resolve(json(kVisitorLogin)),
        ]
        fetchMock.mockImplementation(async (url: string) => {
            const next = queue.shift()
            if (!url.endsWith('/login') || !next) throw new Error(`unexpected request: ${url}; sent: ${sent().join(' | ')}`)
            return next()
        })
        const user = userEvent.setup()
        render(<App />)
        await screen.findByRole('heading', { name: kTitleEn })

        await user.click(screen.getByRole('button', { name: 'Try again' }))
        const checking = await screen.findByRole('button', { name: 'Checking…' })
        expect(checking).toBeDisabled()
        await user.click(checking)
        expect(sent()).toEqual(['POST /login -', 'POST /login -'])

        answerSecond(accessModeDenial('auth.login', 'anonymous'))
        expect(await screen.findByText('Public access is still disabled. Try again later.')).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Try again' }))
        await waitFor(() => expect(screen.queryByRole('heading', { name: kTitleEn })).not.toBeInTheDocument())

        expect(sent()).toEqual(['POST /login -', 'POST /login -', 'POST /login -'])
        expect(useAuthStore.getState()).toMatchObject({
            token: 'bearer-fresh',
            user: kVisitor,
            selectedUserId: 'visitor',
            publicAccessClosed: false,
        })
    })
})

describe('the closed state on a page made of server calls (RUL-259)', () => {
    afterEach(() => {
        window.history.pushState({}, '', '/')
        vi.unstubAllGlobals()
        vi.resetModules()
    })

    // The router reads the URL when App's module loads, so this arm loads a fresh module graph at /diff.
    it('stands in place of the page and offers the way home', async () => {
        window.history.pushState({}, '', '/diff')
        // A first visit: the fresh store must not hydrate a sign-in state an earlier arm persisted.
        localStorage.clear()
        vi.resetModules()
        const fetchMock = vi.fn(async (url: string) => {
            if (!url.endsWith('/login')) throw new Error(`unexpected request: ${url}`)
            return accessModeDenial('auth.login', 'anonymous')
        })
        vi.stubGlobal('fetch', fetchMock)
        const { default: FreshApp } = await import('@/App')

        render(<FreshApp />)

        expect(await screen.findByRole('heading', { name: kTitleEn })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
        // The diff page never mounted, so it sent nothing of its own.
        expect(fetchMock.mock.calls.map(([url]) => url)).toEqual(['/api/v1/login'])
    })
})
