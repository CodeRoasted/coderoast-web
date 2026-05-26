import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LabStatusToast from '@/components/playground/lab/LabStatusToast'

/**
 * Visual contract is the leading-marker convention:
 *   ✓-prefix → success colour, ✗-prefix → error colour, anything else → neutral.
 * A null message renders nothing so the page doesn't reserve space for a
 * collapsed toast.
 */
describe('LabStatusToast', () => {
    it('renders nothing when message is null', () => {
        const { container } = render(<LabStatusToast message={null} />)
        expect(container.firstChild).toBeNull()
    })

    it('applies the success palette for a ✓-prefixed message', () => {
        render(<LabStatusToast message="✓ Engine started" />)
        // Palette lives on the toast container; the message is a child span.
        const toast = screen.getByText('✓ Engine started').closest('div')
        expect(toast?.className).toContain('emerald')
    })

    it('applies the error palette for a ✗-prefixed message', () => {
        render(<LabStatusToast message="✗ Validation failed" />)
        const toast = screen.getByText('✗ Validation failed').closest('div')
        expect(toast?.className).toContain('red')
    })

    it('applies the neutral palette for an unprefixed message', () => {
        render(<LabStatusToast message="Connecting..." />)
        const toast = screen.getByText('Connecting...').closest('div')
        expect(toast?.className).toContain('gray')
    })
})
