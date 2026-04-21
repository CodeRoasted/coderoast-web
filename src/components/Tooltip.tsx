import { useState, useRef, useEffect, type ReactNode } from 'react'

interface Props {
    content: ReactNode
    children: ReactNode
    /** Where to anchor the tooltip relative to the trigger. Default top. */
    placement?: 'top' | 'bottom' | 'left' | 'right'
    /**
     * Optional className to style the wrapper. The trigger area covers
     * exactly the children's bounding box, so don't pass sizing classes.
     */
    className?: string
}

/**
 * Minimal, dependency-free hover tooltip.
 *
 * We deliberately avoid a third-party lib because every control in the
 * playground needs one, and the interaction is extremely simple: show
 * on hover/focus, hide on leave/blur. Keyboard focus is supported so
 * the docs are reachable without a mouse.
 */
export default function Tooltip({ content, children, placement = 'top', className }: Props) {
    const [visible, setVisible] = useState(false)
    const timer = useRef<number | null>(null)

    useEffect(() => {
        return () => {
            if (timer.current !== null) {
                window.clearTimeout(timer.current)
            }
        }
    }, [])

    const show = () => {
        if (timer.current !== null) window.clearTimeout(timer.current)
        // Small delay so quick mouse-overs don't flicker.
        timer.current = window.setTimeout(() => setVisible(true), 120)
    }
    const hide = () => {
        if (timer.current !== null) window.clearTimeout(timer.current)
        setVisible(false)
    }

    const positionClasses: Record<NonNullable<Props['placement']>, string> = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    }

    return (
        <span
            className={`relative inline-flex ${className ?? ''}`}
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
        >
            {children}
            {visible && (
                <span
                    role="tooltip"
                    className={`pointer-events-none absolute z-50 w-64 whitespace-normal text-left rounded-lg border border-gray-700 bg-gray-950/95 px-3 py-2 text-xs text-gray-200 shadow-lg ${positionClasses[placement]}`}
                >
                    {content}
                </span>
            )}
        </span>
    )
}
