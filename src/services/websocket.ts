import type { EngineSnapshot } from '@/types/engine'

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

    connect(engineId: string, handlers: WsMessageHandler) {
        this.disconnect()
        this.engineId = engineId
        this.handlers = handlers
        this.shouldReconnect = true
        this.doConnect()
    }

    disconnect() {
        this.shouldReconnect = false
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

    private doConnect() {
        if (!this.engineId) return

        let url: string
        const apiBase = import.meta.env.VITE_API_BASE

        if (apiBase && (apiBase.startsWith('http://') || apiBase.startsWith('https://'))) {
            // Production: absolute URL to API server
            const protocol = apiBase.startsWith('https') ? 'wss:' : 'ws:'
            const domain = apiBase.replace(/^https?:\/\//, '')
            url = `${protocol}//${domain}/ws/engine?id=${encodeURIComponent(this.engineId)}`
        } else {
            // Development: relative path (proxied by Vite)
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
            url = `${protocol}//${window.location.host}/ws/engine?id=${encodeURIComponent(this.engineId)}`
        }

        this.ws = new WebSocket(url)

        this.ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data)
                switch (msg.type) {
                    case 'snapshot':
                        this.handlers.onSnapshot?.(msg.data as EngineSnapshot)
                        break
                    case 'result':
                        this.handlers.onResult?.(msg.success, msg.message)
                        break
                    case 'connected':
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
                this.reconnectTimer = setTimeout(() => this.doConnect(), 2000)
            }
        }

        this.ws.onerror = () => {
            this.handlers.onError?.('WebSocket connection error')
        }
    }
}

// Singleton instance
export const engineWs = new EngineWebSocket()
