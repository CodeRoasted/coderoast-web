import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
    PolicyDenialError,
    DEFAULT_REQUEST_TIMEOUT_MS,
    GET_FIRST_ATTEMPT_TIMEOUT_MS,
    login,
    logout,
    whoami,
    createEngine,
    getInsightReports,
    getInsightStatus,
    getScenario,
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
            operations: [],
            loading: false,
            selectedUserId: null,
        })
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.useRealTimers()
    })

    describe('PolicyDenialError', () => {
        it('extends Error with policy metadata', () => {
            const err = new PolicyDenialError({
                operation: 'engine.cascade.trigger',
                requiredEntitlement: 'logcraft.advanced_dsl',
                quotaKey: '',
                quotaLimit: null,
                userId: 'visitor',
                subject: 'session-abc',
                role: 'visitor',
                identityKind: 'visitor',
                deploymentContext: 'public_demo',
                reason: 'entitlement required',
            })
            expect(err).toBeInstanceOf(Error)
            expect(err.name).toBe('PolicyDenialError')
            expect(err.message).toBe('entitlement required')
            expect(err.operation).toBe('engine.cascade.trigger')
            expect(err.requiredEntitlement).toBe('logcraft.advanced_dsl')
        })

        it('falls back to generic message when reason is empty', () => {
            const err = new PolicyDenialError({
                operation: '',
                requiredEntitlement: '',
                quotaKey: '',
                quotaLimit: null,
                userId: '',
                subject: '',
                role: '',
                identityKind: '',
                deploymentContext: '',
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

        it('throws PolicyDenialError on HTTP 403', async () => {
            fetchMock.mockResolvedValue(
                jsonResponse(
                    {
                        operation: 'engine.agent.rate.set',
                        required_entitlement: 'logcraft.advanced_dsl',
                        user: 'visitor',
                        role: 'visitor',
                        identity_kind: 'visitor',
                        deployment_context: 'public_demo',
                        reason: 'entitlement required',
                    },
                    { status: 403 },
                ),
            )

            await expect(createEngine('name: test')).rejects.toMatchObject({
                name: 'PolicyDenialError',
                operation: 'engine.agent.rate.set',
                requiredEntitlement: 'logcraft.advanced_dsl',
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
            // Attach the rejection handler BEFORE advancing timers so the
            // rejection that occurs mid-advance is never "unhandled".
            // GET requests are retried once (400 ms delay), so we advance
            // through: first timeout → retry delay → second timeout.
            const assertion = expect(pending).rejects.toThrow(/timed out/i)
            // First GET attempt uses GET_FIRST_ATTEMPT_TIMEOUT_MS (shorter),
            // retry uses DEFAULT_REQUEST_TIMEOUT_MS (full). Advance through
            // both plus the 400 ms retry delay.
            await vi.advanceTimersByTimeAsync(
                GET_FIRST_ATTEMPT_TIMEOUT_MS + 400 + DEFAULT_REQUEST_TIMEOUT_MS + 500,
            )
            await assertion
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

        it('listScenarios selects the requested playground catalog', async () => {
            fetchMock.mockResolvedValue(jsonResponse({ scenarios: [] }))

            await listScenarios('insight')

            const call = fetchMock.mock.calls[0]!
            expect(call[0]).toContain('/scenarios?playground=insight')
        })

        it('getScenario sends id and playground query params', async () => {
            fetchMock.mockResolvedValue(jsonResponse({ id: 'cases/latency', yaml: 'scenario: {}' }))

            await getScenario('cases/latency', 'insight')

            const call = fetchMock.mock.calls[0]!
            expect(call[0]).toContain('/scenarios?id=cases%2Flatency&playground=insight')
        })

        it('getInsightStatus GETs the encoded status route', async () => {
            fetchMock.mockResolvedValue(
                jsonResponse({ engine_id: 'eng/1', running: true, lines_ingested: 42 }),
            )

            const result = await getInsightStatus('eng/1')

            const call = fetchMock.mock.calls[0]!
            expect(call[0]).toContain('/engines/eng%2F1/insight/status')
            expect((call[1] as RequestInit).method).toBeUndefined()
            expect(result.running).toBe(true)
        })

        it('getInsightReports GETs the encoded reports route', async () => {
            fetchMock.mockResolvedValue(
                jsonResponse({
                    engine_id: 'eng-1',
                    lines_ingested: 4200,
                    insights: [
                        {
                            headline: 'Checkout cascade detected',
                            body: 'postgres latency led checkout retries',
                            severity: 'High',
                            confidence: 0.91,
                            action_hint: 'Throttle retries',
                            affected_templates: ['T42'],
                            supporting_evidence: ['checkout retry'],
                        },
                    ],
                }),
            )

            const result = await getInsightReports('eng-1')

            const call = fetchMock.mock.calls[0]!
            expect(call[0]).toContain('/engines/eng-1/insight/reports')
            expect((call[1] as RequestInit).method).toBeUndefined()
            expect(result.insights[0]?.headline).toBe('Checkout cascade detected')
        })
    })
})
