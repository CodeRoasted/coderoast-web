import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '@/components/ErrorBoundary'

function Boom({ message = 'kaboom' }: { message?: string }): JSX.Element {
    throw new Error(message)
}

describe('ErrorBoundary', () => {
    // Silence the React error log noise; the boundary is doing its job.
    const originalError = console.error
    afterEach(() => {
        console.error = originalError
    })

    it('renders children when no error is thrown', () => {
        render(
            <ErrorBoundary>
                <p>safe content</p>
            </ErrorBoundary>,
        )
        expect(screen.getByText('safe content')).toBeInTheDocument()
    })

    it('catches a render-time error and shows the default fallback', () => {
        console.error = vi.fn()
        render(
            <ErrorBoundary>
                <Boom />
            </ErrorBoundary>,
        )
        expect(screen.getByRole('alert')).toBeInTheDocument()
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })

    it('invokes the optional onError callback with the captured error', () => {
        console.error = vi.fn()
        const onError = vi.fn()
        render(
            <ErrorBoundary onError={onError}>
                <Boom message="custom" />
            </ErrorBoundary>,
        )
        expect(onError).toHaveBeenCalled()
        expect(onError.mock.calls[0][0]).toBeInstanceOf(Error)
        expect((onError.mock.calls[0][0] as Error).message).toBe('custom')
    })

    it('uses a custom fallback render prop when provided, with reset callback', () => {
        console.error = vi.fn()
        const reset = vi.fn()

        // We can't actually re-render without remounting; just verify the
        // fallback receives the captured error and a callable reset.
        render(
            <ErrorBoundary
                fallback={(err, doReset) => {
                    reset.mockImplementation(doReset)
                    return <span>caught: {err.message}</span>
                }}
            >
                <Boom message="hi" />
            </ErrorBoundary>,
        )
        expect(screen.getByText('caught: hi')).toBeInTheDocument()
    })

    it('survives an onError callback that itself throws', () => {
        console.error = vi.fn()
        const onError = vi.fn(() => {
            throw new Error('telemetry failed')
        })
        render(
            <ErrorBoundary onError={onError}>
                <Boom />
            </ErrorBoundary>,
        )
        expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('reload button calls window.location.reload', () => {
        console.error = vi.fn()
        // jsdom forbids assigning to location.reload directly; redefine the
        // whole `location` object so we can spy on reload().
        const reload = vi.fn()
        const originalLocation = window.location
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { ...originalLocation, reload },
        })

        try {
            render(
                <ErrorBoundary>
                    <Boom />
                </ErrorBoundary>,
            )
            fireEvent.click(screen.getByRole('button', { name: /reload/i }))
            expect(reload).toHaveBeenCalled()
        } finally {
            Object.defineProperty(window, 'location', {
                configurable: true,
                value: originalLocation,
            })
        }
    })
})
