import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
    children: ReactNode
    /**
     * Optional fallback. When provided, takes over the default error UI.
     * The render function receives the captured error and a `reset`
     * callback that clears the boundary state so the children can
     * re-mount (useful when wrapping a sub-tree that the user can retry).
     */
    fallback?: (error: Error, reset: () => void) => ReactNode
    /** Optional hook for telemetry (e.g. Sentry). Never throws. */
    onError?: (error: Error, info: ErrorInfo) => void
}

interface State {
    error: Error | null
}

/**
 * Top-level safety net. Catches render-time errors anywhere below it and
 * shows a friendly fallback instead of an unmounted blank page.
 *
 * Note: React error boundaries do NOT catch errors inside event handlers,
 * async callbacks, server requests, or `setState` outside of render. Those
 * are still surfaced via the existing toast/`statusMessage` paths.
 */
export default class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null }

    static getDerivedStateFromError(error: Error): State {
        return { error }
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        // Surface in dev so the stack is not hidden behind the fallback UI.
        if (import.meta.env.DEV) {
            console.error('[ErrorBoundary]', error, info)
        }
        try {
            this.props.onError?.(error, info)
        } catch {
            /* telemetry must never crash the boundary */
        }
    }

    private reset = () => {
        this.setState({ error: null })
    }

    private reload = () => {
        window.location.reload()
    }

    render(): ReactNode {
        const { error } = this.state
        if (!error) return this.props.children
        if (this.props.fallback) return this.props.fallback(error, this.reset)

        return (
            <div
                role="alert"
                className="min-h-screen flex items-center justify-center p-6 bg-gray-950 text-gray-100"
            >
                <div className="max-w-md w-full rounded-2xl bg-gray-900 border border-red-700/40 shadow-2xl shadow-red-900/10 p-6">
                    <div className="inline-flex p-2.5 rounded-xl bg-red-600/80 text-white mb-4">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h2 className="font-display text-xl font-bold mb-2">
                        Something went wrong
                    </h2>
                    <p className="text-sm text-gray-400 leading-relaxed mb-5">
                        The page hit an unexpected error and could not finish
                        rendering. Reloading usually fixes it.
                    </p>
                    {import.meta.env.DEV && (
                        <pre className="text-[11px] text-red-300/80 bg-black/30 rounded-md p-2 mb-4 overflow-auto max-h-40">
                            {error.message}
                        </pre>
                    )}
                    <button
                        onClick={this.reload}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reload page
                    </button>
                </div>
            </div>
        )
    }
}
