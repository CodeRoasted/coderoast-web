import { useState, useRef, useEffect, type ReactNode, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'

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
 * Hover tooltip rendered via a React portal so it always sits above
 * stacking-context boundaries (sticky headers, transformed ancestors, etc.).
 * Position is computed from getBoundingClientRect and applied as fixed coords.
 */
export default function Tooltip({ content, children, placement = 'top', className }: Props) {
    const [visible, setVisible] = useState(false)
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
    const triggerRef = useRef<HTMLSpanElement>(null)
    const timer = useRef<number | null>(null)

    useEffect(() => {
        return () => {
            if (timer.current !== null) window.clearTimeout(timer.current)
        }
    }, [])

    const show = () => {
        if (timer.current !== null) window.clearTimeout(timer.current)
        // Small delay so quick mouse-overs don't flicker.
        timer.current = window.setTimeout(() => {
            if (!triggerRef.current) return
            const r = triggerRef.current.getBoundingClientRect()
            const GAP = 8
            let top: number, left: number
            if (placement === 'top') {
                top = r.top - GAP
                left = r.left + r.width / 2
            } else if (placement === 'bottom') {
                top = r.bottom + GAP
                left = r.left + r.width / 2
            } else if (placement === 'left') {
                top = r.top + r.height / 2
                left = r.left - GAP
            } else {
                top = r.top + r.height / 2
                left = r.right + GAP
            }
            setPos({ top, left })
            setVisible(true)
        }, 120)
    }

    const hide = () => {
        if (timer.current !== null) window.clearTimeout(timer.current)
        setVisible(false)
    }

    // Tailwind transform classes to shift the box so the anchor point is the
    // tip of the tooltip rather than its top-left corner.
    const transformClass: Record<NonNullable<Props['placement']>, string> = {
        top: '-translate-x-1/2 -translate-y-full',
        bottom: '-translate-x-1/2',
        left: '-translate-x-full -translate-y-1/2',
        right: '-translate-y-1/2',
    }

    const tooltipStyle: CSSProperties = pos
        ? { position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999, width: '16rem' }
        : {}

    return (
        <span
            ref={triggerRef}
            className={`relative inline-flex ${className ?? ''}`}
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
        >
            {children}
            {visible && pos &&
                createPortal(
                    <span
                        role="tooltip"
                        style={tooltipStyle}
                        className={`pointer-events-none ${transformClass[placement]} whitespace-normal text-left rounded-lg border border-gray-700 bg-gray-950/95 px-3 py-2 text-xs text-gray-200 shadow-lg`}
                    >
                        {content}
                    </span>,
                    document.body,
                )}
        </span>
    )
}
