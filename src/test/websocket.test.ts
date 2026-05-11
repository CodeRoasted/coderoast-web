import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { EngineWebSocket } from '@/services/websocket'
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

describe('EngineWebSocket', () => {
    let originalWebSocket: typeof WebSocket

    beforeEach(() => {
        MockWebSocket.instances = []
        originalWebSocket = globalThis.WebSocket
        // Cast through unknown — MockWebSocket only implements the surface
        // EngineWebSocket actually touches.
        ; (globalThis as unknown as { WebSocket: unknown }).WebSocket =
            MockWebSocket as unknown
        useAuthStore.setState({
            token: null,
            user: null,
            tier: null,
            loading: false,
            selectedUserId: null,
        })
    })

    afterEach(() => {
        ; (globalThis as unknown as { WebSocket: typeof WebSocket }).WebSocket =
            originalWebSocket
        vi.useRealTimers()
    })

    function lastSocket(): MockWebSocket {
        const s = MockWebSocket.instances[MockWebSocket.instances.length - 1]
        if (!s) throw new Error('no socket created')
        return s
    }

    it('opens a socket scoped to the engineId', () => {
        const ws = new EngineWebSocket()
        ws.connect('eng-42', {})
        expect(MockWebSocket.instances).toHaveLength(1)
        expect(lastSocket().url).toContain('id=eng-42')
        ws.disconnect()
    })

    it('appends bearer token as a query parameter when present', () => {
        useAuthStore.setState({ token: 'sekrit' })
        const ws = new EngineWebSocket()
        ws.connect('eng-1', {})
        expect(lastSocket().url).toContain('token=sekrit')
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

    it('sendCommand serialises only when the socket is open', () => {
        const ws = new EngineWebSocket()
        ws.connect('eng-1', {})
        const sock = lastSocket()

        ws.sendCommand({ type: 'pause' })
        expect(sock.sent).toEqual(['{"type":"pause"}'])

        sock.readyState = MockWebSocket.CLOSED
        ws.sendCommand({ type: 'resume' })
        expect(sock.sent).toHaveLength(1) // unchanged

        ws.disconnect()
    })

    it('connected reports OPEN status', () => {
        const ws = new EngineWebSocket()
        expect(ws.connected).toBe(false)
        ws.connect('eng-1', {})
        expect(ws.connected).toBe(true)
        ws.disconnect()
        expect(ws.connected).toBe(false)
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
