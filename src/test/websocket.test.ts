import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { EngineWebSocket } from '@/services/websocket'
import type { EngineCommand } from '@/types/engine'
import { useAuthStore } from '@/store/useAuthStore'

/**
 * Minimal WebSocket stub. Captures calls and exposes hooks to simulate
 * server messages, opens, and closes from inside tests.
 */
class MockWebSocket {
    static OPEN = 1
    static CLOSED = 3
    static instances: MockWebSocket[] = []

    readonly url: string
    readyState: number = MockWebSocket.OPEN
    onopen: (() => void) | null = null
    onmessage: ((event: MessageEvent) => void) | null = null
    onclose: (() => void) | null = null
    onerror: (() => void) | null = null
    sent: string[] = []
    closeCalled = false

    constructor(url: string) {
        this.url = url
        MockWebSocket.instances.push(this)
    }

    send(data: string) {
        this.sent.push(data)
    }

    close() {
        this.closeCalled = true
        this.readyState = MockWebSocket.CLOSED
        this.onclose?.()
    }

    // Test helpers
    receive(payload: unknown) {
        this.onmessage?.({ data: JSON.stringify(payload) } as MessageEvent)
    }

    receiveRaw(raw: string) {
        this.onmessage?.({ data: raw } as MessageEvent)
    }

    triggerClose() {
        this.readyState = MockWebSocket.CLOSED
        this.onclose?.()
    }
}

function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    })
}

/** The bearer every session-holding arm signs in with. It must never appear in a socket URL. */
const kBearer = 'sekrit-bearer-0c7e'

describe('EngineWebSocket', () => {
    let originalWebSocket: typeof WebSocket
    let fetchMock: ReturnType<typeof vi.fn>

    beforeEach(() => {
        MockWebSocket.instances = []
        originalWebSocket = globalThis.WebSocket
        // Cast through unknown — MockWebSocket only implements the surface
        // EngineWebSocket actually touches.
        ; (globalThis as unknown as { WebSocket: unknown }).WebSocket =
            MockWebSocket as unknown
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
        ; (globalThis as unknown as { WebSocket: typeof WebSocket }).WebSocket =
            originalWebSocket
        vi.unstubAllGlobals()
        vi.useRealTimers()
    })

    function lastSocket(): MockWebSocket {
        const s = MockWebSocket.instances[MockWebSocket.instances.length - 1]
        if (!s) throw new Error('no socket created')
        return s
    }

    /** Every socket URL opened so far, for a failure message. */
    function urls(): string {
        return MockWebSocket.instances.map((s) => s.url).join(' | ') || '<no socket>'
    }

    /** Every ticket request made so far, as `METHOD url body`, for a failure message. */
    function ticketCalls(): string {
        return (
            fetchMock.mock.calls
                .map(([url, init]) => `${(init as RequestInit | undefined)?.method ?? 'GET'} ${String(url)} ${String((init as RequestInit | undefined)?.body ?? '')}`)
                .join(' | ') || '<no request>'
        )
    }

    it('opens a socket scoped to the engineId', () => {
        const ws = new EngineWebSocket()
        ws.connect('eng-42', {})
        expect(MockWebSocket.instances).toHaveLength(1)
        expect(lastSocket().url).toContain('id=eng-42')
        ws.disconnect()
    })

    // A browser cannot set headers on an upgrade, so the bearer used to ride the URL as
    // `?token=`, where every proxy and error log that records a request line keeps it. The
    // client now spends the bearer on an authenticated POST and puts only a single-use ticket
    // in the URL; the parent put the bearer itself there and made no request at all.
    it('mints a ticket with the bearer and opens the socket with the ticket, never the bearer', async () => {
        vi.useFakeTimers()
        useAuthStore.setState({ token: kBearer })
        fetchMock.mockResolvedValueOnce(jsonResponse({ ticket: 'ticket-one' }))

        const ws = new EngineWebSocket()
        ws.connect('eng-1', {})
        await vi.advanceTimersByTimeAsync(0)

        expect(fetchMock, `expected one ticket request, got: ${ticketCalls()}`).toHaveBeenCalledTimes(1)
        const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
        expect(url).toBe('/api/v1/ws/ticket')
        expect(init.method).toBe('POST')
        expect((init.headers as Record<string, string>)['Authorization']).toBe(`Bearer ${kBearer}`)
        expect(JSON.parse(String(init.body))).toEqual({ engine_id: 'eng-1' })

        expect(MockWebSocket.instances, `sockets: ${urls()}`).toHaveLength(1)
        const opened = new URL(lastSocket().url)
        expect(opened.pathname).toBe('/api/v1/ws/engine')
        expect(opened.searchParams.get('id')).toBe('eng-1')
        expect(opened.searchParams.get('ticket')).toBe('ticket-one')
        expect(opened.searchParams.has('token'), `socket URL: ${lastSocket().url}`).toBe(false)
        expect(lastSocket().url, 'the bearer reached a socket URL').not.toContain(kBearer)

        ws.disconnect()
    })

    // A ticket is single-use, so a reconnect that reused the first one would be refused; every
    // open therefore spends a fresh request, and no URL across the whole run carries the bearer.
    it('mints a fresh ticket for every reconnect', async () => {
        vi.useFakeTimers()
        useAuthStore.setState({ token: kBearer })
        fetchMock
            .mockResolvedValueOnce(jsonResponse({ ticket: 'ticket-one' }))
            .mockResolvedValueOnce(jsonResponse({ ticket: 'ticket-two' }))

        const ws = new EngineWebSocket()
        ws.connect('eng-1', {})
        await vi.advanceTimersByTimeAsync(0)
        expect(MockWebSocket.instances, `sockets: ${urls()}`).toHaveLength(1)

        lastSocket().triggerClose()
        await vi.advanceTimersByTimeAsync(1000)

        expect(fetchMock, `ticket requests: ${ticketCalls()}`).toHaveBeenCalledTimes(2)
        expect(MockWebSocket.instances, `sockets: ${urls()}`).toHaveLength(2)
        const tickets = MockWebSocket.instances.map((s) => new URL(s.url).searchParams.get('ticket'))
        expect(tickets).toEqual(['ticket-one', 'ticket-two'])
        for (const socket of MockWebSocket.instances) {
            expect(socket.url, 'the bearer reached a socket URL').not.toContain(kBearer)
        }

        ws.disconnect()
    })

    // The server refusing the ticket (the engine is gone, or the session may not watch it) is an
    // answer, not a fault: retrying would earn the same refusal, so the loop stops and says why.
    it('stops reconnecting and reports a fatal error when the ticket is refused', async () => {
        vi.useFakeTimers()
        useAuthStore.setState({ token: kBearer })
        fetchMock.mockResolvedValue(jsonResponse({ error: "Engine 'eng-9' not found" }, 404))
        const onFatalError = vi.fn()

        const ws = new EngineWebSocket()
        ws.connect('eng-9', { onFatalError })
        await vi.advanceTimersByTimeAsync(0)

        expect(onFatalError).toHaveBeenCalledWith("Engine 'eng-9' not found")
        expect(MockWebSocket.instances, `sockets: ${urls()}`).toHaveLength(0)

        await vi.advanceTimersByTimeAsync(60_000)
        expect(fetchMock, `ticket requests: ${ticketCalls()}`).toHaveBeenCalledTimes(1)
        expect(MockWebSocket.instances, `sockets: ${urls()}`).toHaveLength(0)
    })

    // A request that never got an answer is a fault of the path, exactly like a dropped socket,
    // so it takes the same backoff and tries again with a fresh ticket.
    it('retries on the backoff schedule when the ticket request fails in transit', async () => {
        vi.useFakeTimers()
        useAuthStore.setState({ token: kBearer })
        fetchMock
            .mockRejectedValueOnce(new TypeError('Failed to fetch'))
            .mockResolvedValueOnce(jsonResponse({ ticket: 'ticket-after-retry' }))
        const onError = vi.fn()

        const ws = new EngineWebSocket()
        ws.connect('eng-1', { onError })
        await vi.advanceTimersByTimeAsync(0)
        expect(onError).toHaveBeenCalledTimes(1)
        expect(MockWebSocket.instances, `sockets: ${urls()}`).toHaveLength(0)

        await vi.advanceTimersByTimeAsync(999)
        expect(fetchMock, `ticket requests: ${ticketCalls()}`).toHaveBeenCalledTimes(1)
        await vi.advanceTimersByTimeAsync(1)

        expect(fetchMock, `ticket requests: ${ticketCalls()}`).toHaveBeenCalledTimes(2)
        expect(MockWebSocket.instances, `sockets: ${urls()}`).toHaveLength(1)
        expect(new URL(lastSocket().url).searchParams.get('ticket')).toBe('ticket-after-retry')

        ws.disconnect()
    })

    // The answer to a ticket request can land after the caller has moved on; a socket opened
    // then would attach a lease to an engine nobody is watching.
    it('opens no socket when disconnected while the ticket is in flight', async () => {
        vi.useFakeTimers()
        useAuthStore.setState({ token: kBearer })
        let answer: (response: Response) => void = () => { }
        fetchMock.mockReturnValueOnce(new Promise<Response>((resolve) => { answer = resolve }))

        const ws = new EngineWebSocket()
        ws.connect('eng-1', {})
        await vi.advanceTimersByTimeAsync(0)
        expect(fetchMock).toHaveBeenCalledTimes(1)

        ws.disconnect()
        answer(jsonResponse({ ticket: 'ticket-too-late' }))
        await vi.advanceTimersByTimeAsync(60_000)

        expect(MockWebSocket.instances, `sockets: ${urls()}`).toHaveLength(0)
    })

    // With no session there is nothing to spend on a ticket: the socket opens session-less,
    // exactly as a connection without a credential always has.
    it('connects without a ticket and makes no request when no session is held', () => {
        const ws = new EngineWebSocket()
        ws.connect('eng-1', {})
        expect(fetchMock, `ticket requests: ${ticketCalls()}`).not.toHaveBeenCalled()
        expect(MockWebSocket.instances).toHaveLength(1)
        const opened = new URL(lastSocket().url)
        expect(opened.searchParams.has('ticket')).toBe(false)
        expect(opened.searchParams.has('token')).toBe(false)
        ws.disconnect()
    })

    it('routes snapshot / result / connected / fatal error frames to handlers', () => {
        const onSnapshot = vi.fn()
        const onResult = vi.fn()
        const onConnected = vi.fn()
        const onError = vi.fn()
        const onFatalError = vi.fn()

        const ws = new EngineWebSocket()
        ws.connect('eng-1', { onSnapshot, onResult, onConnected, onError, onFatalError })
        const sock = lastSocket()

        sock.receive({ type: 'connected', engine_id: 'eng-1' })
        sock.receive({ type: 'snapshot', data: { engine_id: 'eng-1' } })
        sock.receive({ type: 'result', success: true, message: 'ok' })
        sock.receive({ type: 'error', message: 'bad input' })

        expect(onConnected).toHaveBeenCalledWith('eng-1')
        expect(onSnapshot).toHaveBeenCalledWith({ engine_id: 'eng-1' })
        expect(onResult).toHaveBeenCalledWith(true, 'ok')
        expect(onFatalError).toHaveBeenCalledWith('bad input')
        expect(onError).not.toHaveBeenCalled()

        ws.disconnect()
    })

    it('silently drops malformed frames', () => {
        const onSnapshot = vi.fn()
        const ws = new EngineWebSocket()
        ws.connect('eng-1', { onSnapshot })

        // Should not throw, should not invoke any handler
        expect(() => lastSocket().receiveRaw('not-json')).not.toThrow()
        expect(onSnapshot).not.toHaveBeenCalled()

        ws.disconnect()
    })

    // A command on a closed socket used to return quietly: the operator clicked, nothing
    // travelled, and nothing said so. Of done / failed / vanished, only the third leaves
    // them with no next move — so the refusal is now REPORTED, and this pins that.
    // Both arms matter: dropping the send is correct, staying silent about it is the bug.
    it('sendCommand reports a refusal instead of dropping the command', () => {
        const refused: EngineCommand[] = []
        const ws = new EngineWebSocket()
        ws.connect('eng-1', { onCommandRefused: (command) => refused.push(command) })
        const sock = lastSocket()

        // Open: on the wire, answered true, and NOT reported as refused.
        expect(ws.sendCommand({ type: 'pause' })).toBe(true)
        expect(sock.sent).toEqual(['{"type":"pause"}'])
        expect(refused).toEqual([])

        // Closed: not on the wire, answered false, and reported with the command itself,
        // so a caller can say WHICH press was lost rather than that one was. The refused
        // command carries a PAYLOAD here on purpose: the object is handed back whole, not
        // reduced to its discriminant, which is what lets the view layer say more than
        // "a command" if it ever needs to.
        sock.readyState = MockWebSocket.CLOSED
        expect(ws.sendCommand({ type: 'set_speed', multiplier: 4 })).toBe(false)
        expect(sock.sent, `nothing may be sent on a closed socket, got ${sock.sent.join(' | ')}`)
            .toHaveLength(1)
        expect(refused).toEqual([{ type: 'set_speed', multiplier: 4 }])

        ws.disconnect()
    })

    // The refusal rides the handler set given at connect(), so a socket that closes and
    // reconnects keeps reporting — the failure mode being ruled out is a callback captured
    // once and lost on the next doConnect().
    it('keeps reporting refusals after a reconnect', () => {
        vi.useFakeTimers()
        try {
            const refused: EngineCommand[] = []
            const ws = new EngineWebSocket()
            ws.connect('eng-1', { onCommandRefused: (command) => refused.push(command) })

            lastSocket().triggerClose()
            vi.advanceTimersByTime(1000) // first backoff step -> doConnect()
            const reconnected = lastSocket()
            reconnected.readyState = MockWebSocket.CLOSED

            expect(ws.sendCommand({ type: 'stop' })).toBe(false)
            expect(refused, 'a reconnect must not silence the refusal channel').toEqual([
                { type: 'stop' },
            ])

            ws.disconnect()
        } finally {
            vi.useRealTimers()
        }
    })

    it('disconnect closes the socket and prevents reconnection', () => {
        vi.useFakeTimers()
        const ws = new EngineWebSocket()
        ws.connect('eng-1', {})
        const sock = lastSocket()

        ws.disconnect()
        expect(sock.closeCalled).toBe(true)

        // Even if the timer somehow fires, no new socket should be created.
        vi.advanceTimersByTime(60_000)
        expect(MockWebSocket.instances).toHaveLength(1)
    })

    it('reconnects with exponential backoff on unexpected close', () => {
        vi.useFakeTimers()
        const ws = new EngineWebSocket()
        ws.connect('eng-1', {})
        expect(MockWebSocket.instances).toHaveLength(1)

        // First drop → 1s backoff
        lastSocket().triggerClose()
        vi.advanceTimersByTime(1000)
        expect(MockWebSocket.instances).toHaveLength(2)

        // Second drop → 2s backoff
        lastSocket().triggerClose()
        vi.advanceTimersByTime(1999)
        expect(MockWebSocket.instances).toHaveLength(2)
        vi.advanceTimersByTime(1)
        expect(MockWebSocket.instances).toHaveLength(3)

        // Third drop → 4s backoff
        lastSocket().triggerClose()
        vi.advanceTimersByTime(4000)
        expect(MockWebSocket.instances).toHaveLength(4)

        ws.disconnect()
    })

    it('resets backoff after a successful snapshot', () => {
        vi.useFakeTimers()
        const ws = new EngineWebSocket()
        ws.connect('eng-1', {})

        // Climb a couple of backoff steps
        lastSocket().triggerClose()
        vi.advanceTimersByTime(1000)
        lastSocket().triggerClose()
        vi.advanceTimersByTime(2000)
        // We're now at attempt 2 with a fresh socket
        expect(MockWebSocket.instances).toHaveLength(3)

        // A snapshot resets the counter
        lastSocket().receive({ type: 'snapshot', data: {} })

        // Next disconnect should fall back to the 1s slot, not 4s.
        lastSocket().triggerClose()
        vi.advanceTimersByTime(1000)
        expect(MockWebSocket.instances).toHaveLength(4)

        ws.disconnect()
    })

    it('reconnect creates a new socket scoped to the same engineId', () => {
        vi.useFakeTimers()
        const ws = new EngineWebSocket()
        ws.connect('eng-7', {})
        expect(lastSocket().url).toContain('id=eng-7')

        lastSocket().triggerClose()
        vi.advanceTimersByTime(1000)
        expect(lastSocket().url).toContain('id=eng-7')

        ws.disconnect()
    })
})
