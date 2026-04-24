import type { EngineSnapshot } from '@/types/engine'
import { useAuthStore } from '@/store/useAuthStore'

export type WsMessageHandler = {
    onSnapshot?: (snapshot: EngineSnapshot) => void
    onResult?: (success: boolean, message: string) => void
    onConnected?: (engineId: string) => void
    onError?: (error: string) => void
    onClose?: () => void
}

export class EngineWebSocket {
    private ws: WebSocket | null = null
    private handlers: WsMessageHandler = {}
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null
    private engineId: string | null = null
    private shouldReconnect = false
    private reconnectAttempt = 0

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

    sendCommand(command: Record<string, unknown>) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(command))
        }
    }

    get connected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN
    }

    private nextBackoffMs(): number {
        const schedule = EngineWebSocket.kBackoffSchedule
        const idx = Math.min(this.reconnectAttempt, schedule.length - 1)
        // schedule is non-empty and idx is clamped, so this is always defined.
        return schedule[idx] ?? schedule[schedule.length - 1] ?? 1000
    }

    private doConnect() {
        if (!this.engineId) return

        // Browsers can't add headers to a WebSocket upgrade, so the bearer
        // token (when present) rides along as a query parameter. The
        // backend's resolve_ws_principal() honours both Authorization
        // header and ?token=…
        const token = useAuthStore.getState().token
        const params = new URLSearchParams({ id: this.engineId })
        if (token) {
            params.set('token', token)
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
                        this.handlers.onError?.(msg.message)
                        break
                }
            } catch {
                // Ignore malformed messages
            }
        }

        this.ws.onclose = () => {
            this.handlers.onClose?.()
            if (this.shouldReconnect) {
                const delay = this.nextBackoffMs()
                this.reconnectAttempt += 1
                this.reconnectTimer = setTimeout(() => this.doConnect(), delay)
            }
        }

        this.ws.onerror = () => {
            this.handlers.onError?.('WebSocket connection error')
        }
    }
}

// Singleton instance
export const engineWs = new EngineWebSocket()
