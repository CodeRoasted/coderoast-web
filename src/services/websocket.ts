import type { EngineCommand, EngineSnapshot } from '@/types/engine'
import { HttpError, PolicyDenialError, mintWsTicket } from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'

export type WsMessageHandler = {
    onSnapshot?: (snapshot: EngineSnapshot) => void
    onResult?: (success: boolean, message: string) => void
    onConnected?: (engineId: string) => void
    onError?: (error: string) => void
    /**
     * Called when the server refuses the connection outright — a fatal error
     * frame sent before closing the socket (e.g. "engine not found"), or a
     * refused ticket request. Unlike `onError` (network faults), this will NOT
     * trigger a reconnect attempt: the server has explicitly rejected the
     * connection, and asking again would earn the same answer.
     */
    onFatalError?: (error: string) => void
    /**
     * A command was NOT put on the wire, because the socket was not open. The
     * transport reports the refusal rather than returning quietly: of the three
     * outcomes a click can have — done, failed, vanished — only the third leaves
     * the operator with nothing to act on, and it is the one this callback exists
     * to make impossible. Wiring it is therefore not optional in a UI that sends
     * commands. The reason is not passed as text: the transport knows the fact,
     * the view layer owns the words (`src/i18n/`).
     *
     * The refused command is passed WHOLE, and it is typed rather than a bag, so the view
     * layer can name the control the operator actually pressed instead of reporting that
     * "a command" was lost. A refusal nobody can attribute is only marginally better than
     * silence.
     */
    onCommandRefused?: (command: EngineCommand) => void
    onClose?: () => void
}

/**
 * A ticket request the server ANSWERED with a refusal (the engine is gone, the
 * session may not watch it, or there is no session). A 5xx, a timeout or a
 * network failure is a fault of the path instead, and is retried.
 */
function isRefusal(error: unknown): error is Error {
    return error instanceof PolicyDenialError || (error instanceof HttpError && error.status < 500)
}

export class EngineWebSocket {
    private ws: WebSocket | null = null
    private handlers: WsMessageHandler = {}
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null
    private engineId: string | null = null
    private shouldReconnect = false
    private reconnectAttempt = 0
    /**
     * Bumped by every open attempt and every disconnect, so the answer to a
     * ticket request that lands after the caller moved on opens nothing.
     */
    private openGeneration = 0

    /**
     * Backoff schedule for reconnect (ms). After the last entry we keep
     * retrying at the cap so a backend that comes back hours later still
     * recovers without manual reload.
     */
    private static readonly kBackoffSchedule = [1000, 2000, 4000, 8000, 15000]

    connect(engineId: string, handlers: WsMessageHandler) {
        this.disconnect()
        this.engineId = engineId
        this.handlers = handlers
        this.shouldReconnect = true
        this.reconnectAttempt = 0
        this.doConnect()
    }

    disconnect() {
        this.shouldReconnect = false
        this.reconnectAttempt = 0
        this.openGeneration += 1
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer)
            this.reconnectTimer = null
        }
        if (this.ws) {
            this.ws.close()
            this.ws = null
        }
        this.engineId = null
    }

    /** @returns whether the command reached the wire. A refusal is also reported on
     *  `onCommandRefused`, so a caller that ignores this value still cannot drop it. */
    sendCommand(command: EngineCommand): boolean {
        if (this.ws?.readyState !== WebSocket.OPEN) {
            this.handlers.onCommandRefused?.(command)
            return false
        }
        this.ws.send(JSON.stringify(command))
        return true
    }

    private nextBackoffMs(): number {
        const schedule = EngineWebSocket.kBackoffSchedule
        const idx = Math.min(this.reconnectAttempt, schedule.length - 1)
        // schedule is non-empty and idx is clamped, so this is always defined.
        return schedule[idx] ?? schedule[schedule.length - 1] ?? 1000
    }

    private scheduleReconnect() {
        if (!this.shouldReconnect) return
        const delay = this.nextBackoffMs()
        this.reconnectAttempt += 1
        this.reconnectTimer = setTimeout(() => this.doConnect(), delay)
    }

    /**
     * A browser cannot set headers on a WebSocket upgrade, so the bearer never
     * travels to the socket: it is spent on an authenticated `POST /ws/ticket`,
     * and the URL carries only the single-use ticket that answers it. A ticket
     * is dead after one open, so every connect and every reconnect mints its
     * own. With no session there is nothing to spend, and the socket opens
     * session-less.
     */
    private doConnect() {
        const engineId = this.engineId
        if (!engineId) return
        const generation = ++this.openGeneration

        if (!useAuthStore.getState().token) {
            this.open(engineId, null)
            return
        }

        mintWsTicket(engineId).then(
            (ticket) => {
                if (generation !== this.openGeneration || !this.shouldReconnect) return
                this.open(engineId, ticket)
            },
            (error: unknown) => {
                if (generation !== this.openGeneration || !this.shouldReconnect) return
                if (isRefusal(error)) {
                    this.shouldReconnect = false
                    this.handlers.onFatalError?.(error.message)
                    return
                }
                this.handlers.onError?.('WebSocket ticket request failed')
                this.scheduleReconnect()
            },
        )
    }

    private open(engineId: string, ticket: string | null) {
        const params = new URLSearchParams({ id: engineId })
        if (ticket) {
            params.set('ticket', ticket)
        }
        const query = params.toString()

        let url: string
        const apiBase = import.meta.env.VITE_API_BASE

        if (apiBase && (apiBase.startsWith('http://') || apiBase.startsWith('https://'))) {
            // Production: absolute URL to API server. apiBase already
            // includes the /api/v1 prefix (set in .env.production /
            // netlify.toml), so we just swap the scheme to ws/wss and
            // append /ws/engine.
            const wsBase = apiBase.replace(/^http(s?):\/\//, (_m: string, s: string) => `ws${s}://`)
            url = `${wsBase}/ws/engine?${query}`
        } else {
            // Development: relative path (proxied by Vite). Backend
            // expects /api/v1/ws/engine.
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
            url = `${protocol}//${window.location.host}/api/v1/ws/engine?${query}`
        }

        this.ws = new WebSocket(url)

        this.ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data)
                switch (msg.type) {
                    case 'snapshot':
                        // First snapshot after reconnect = healthy session,
                        // reset backoff so the next disconnect doesn't keep
                        // climbing forever.
                        this.reconnectAttempt = 0
                        this.handlers.onSnapshot?.(msg.data as EngineSnapshot)
                        break
                    case 'result':
                        this.handlers.onResult?.(msg.success, msg.message)
                        break
                    case 'connected':
                        this.reconnectAttempt = 0
                        this.handlers.onConnected?.(msg.engine_id)
                        break
                    case 'error':
                        // The server always calls ws_conn->shutdown() after
                        // sending this, so reconnecting would just get the same
                        // rejection. Stop the loop and let the caller decide
                        // what to show / navigate to.
                        this.shouldReconnect = false
                        this.handlers.onFatalError?.(msg.message as string)
                        break
                }
            } catch {
                // Ignore malformed messages
            }
        }

        this.ws.onclose = () => {
            this.handlers.onClose?.()
            this.scheduleReconnect()
        }

        this.ws.onerror = () => {
            this.handlers.onError?.('WebSocket connection error')
        }
    }
}

// Singleton instance
export const engineWs = new EngineWebSocket()
