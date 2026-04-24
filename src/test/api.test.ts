import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
    TierRequiredError,
    DEFAULT_REQUEST_TIMEOUT_MS,
    login,
    logout,
    whoami,
    listUsers,
    createEngine,
    listScenarios,
    validateScenario,
} from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'

function jsonResponse(body: unknown, init: ResponseInit = { status: 200 }): Response {
    return new Response(JSON.stringify(body), {
        ...init,
        headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    })
}

describe('services/api', () => {
    let fetchMock: ReturnType<typeof vi.fn>

    beforeEach(() => {
        fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
        useAuthStore.setState({
            token: null,
            user: null,
            tier: null,
            loading: false,
            selectedUserId: null,
        })
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.useRealTimers()
    })

    describe('TierRequiredError', () => {
        it('extends Error with tier metadata', () => {
            const err = new TierRequiredError({
                permission: 'command.evaluate_cascade',
                userId: 'free_demo',
                userTier: { name: 'free', level: 1 },
                requiredTier: { name: 'enterprise', level: 3 },
                reason: 'tier too low',
            })
            expect(err).toBeInstanceOf(Error)
            expect(err.name).toBe('TierRequiredError')
            expect(err.message).toBe('tier too low')
            expect(err.permission).toBe('command.evaluate_cascade')
            expect(err.requiredTier).toEqual({ name: 'enterprise', level: 3 })
        })

        it('falls back to generic message when reason is empty', () => {
            const err = new TierRequiredError({
                permission: '',
                userId: '',
                userTier: null,
                requiredTier: null,
                reason: '',
            })
            expect(err.message).toBe('Access denied')
        })
    })

    describe('request envelope', () => {
        it('attaches Bearer token from auth store when present', async () => {
            useAuthStore.setState({ token: 'abc123' })
            fetchMock.mockResolvedValue(jsonResponse({ ok: true }))

            await whoami()

            const call = fetchMock.mock.calls[0]
            expect(call).toBeDefined()
            const init = call![1] as RequestInit
            const headers = init.headers as Record<string, string>
            expect(headers.Authorization).toBe('Bearer abc123')
        })

        it('omits Authorization header when no token is set', async () => {
            fetchMock.mockResolvedValue(jsonResponse({ ok: true }))

            await whoami()

            const call = fetchMock.mock.calls[0]
            const init = call![1] as RequestInit
            const headers = init.headers as Record<string, string>
            expect(headers.Authorization).toBeUndefined()
        })

        it('throws TierRequiredError on HTTP 403', async () => {
            fetchMock.mockResolvedValue(
                jsonResponse(
                    {
                        permission: 'command.generate_burst',
                        user: 'free_demo',
                        user_tier: { name: 'free', level: 1 },
                        required_tier: { name: 'pro', level: 2 },
                        reason: 'pro tier required',
                    },
                    { status: 403 },
                ),
            )

            await expect(createEngine('name: test')).rejects.toMatchObject({
                name: 'TierRequiredError',
                permission: 'command.generate_burst',
                requiredTier: { name: 'pro', level: 2 },
            })
        })

        it('throws plain Error with body.error on non-403 failures', async () => {
            fetchMock.mockResolvedValue(
                jsonResponse({ error: 'invalid yaml' }, { status: 400 }),
            )

            await expect(createEngine('garbage')).rejects.toThrow('invalid yaml')
        })

        it('throws an HTTP <status> error when body is empty / non-JSON', async () => {
            // Body that fails JSON parse falls through to "HTTP <status>"
            fetchMock.mockResolvedValue(
                new Response('<html>500</html>', { status: 500 }),
            )

            await expect(listScenarios()).rejects.toThrow(/HTTP 500/)
        })

        it('aborts the request after the default timeout', async () => {
            vi.useFakeTimers()
            fetchMock.mockImplementation(
                (_url: string, init: RequestInit) =>
                    new Promise((_resolve, reject) => {
                        init.signal?.addEventListener('abort', () => {
                            reject(
                                new DOMException(
                                    'The operation was aborted.',
                                    'AbortError',
                                ),
                            )
                        })
                    }),
            )

            const pending = listScenarios()
            // Advance past the timeout window, then unwind the queued
            // microtasks so the pending Promise resolves.
            vi.advanceTimersByTime(DEFAULT_REQUEST_TIMEOUT_MS + 1)
            await expect(pending).rejects.toThrow(/timed out/i)
        })
    })

    describe('endpoint shapes', () => {
        it('login posts user_id when supplied', async () => {
            fetchMock.mockResolvedValue(
                jsonResponse({ token: 't', user: { id: 'u', name: 'U' } }),
            )

            await login('admin')

            const call = fetchMock.mock.calls[0]!
            const url = call[0] as string
            const init = call[1] as RequestInit
            expect(url).toContain('/login')
            expect(init.method).toBe('POST')
            expect(JSON.parse(init.body as string)).toEqual({ user_id: 'admin' })
        })

        it('login posts no body for anonymous session', async () => {
            fetchMock.mockResolvedValue(
                jsonResponse({ token: 't', user: { id: 'anon', name: 'Anon' } }),
            )

            await login()

            const call = fetchMock.mock.calls[0]!
            const init = call[1] as RequestInit
            expect(init.body).toBeUndefined()
        })

        it('logout posts to /logout', async () => {
            fetchMock.mockResolvedValue(jsonResponse({}))

            await logout()

            const call = fetchMock.mock.calls[0]!
            expect(call[0]).toContain('/logout')
            expect((call[1] as RequestInit).method).toBe('POST')
        })

        it('listUsers GETs /users', async () => {
            fetchMock.mockResolvedValue(jsonResponse({ users: [] }))

            await listUsers()

            const call = fetchMock.mock.calls[0]!
            expect(call[0]).toContain('/users')
            expect((call[1] as RequestInit).method).toBeUndefined()
        })

        it('validateScenario POSTs the yaml payload', async () => {
            fetchMock.mockResolvedValue(
                jsonResponse({ valid: true, errors: [] }),
            )

            const result = await validateScenario('name: ok')

            const call = fetchMock.mock.calls[0]!
            const url = call[0] as string
            const init = call[1] as RequestInit
            expect(url).toContain('/scenarios/validate')
            expect(init.method).toBe('POST')
            expect(JSON.parse(init.body as string)).toEqual({ yaml: 'name: ok' })
            expect(result.valid).toBe(true)
        })
    })
})
