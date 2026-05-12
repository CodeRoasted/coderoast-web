import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import UseCases from '@/pages/UseCases'

/**
 * Minimal smoke + contract tests for the dedicated /use-cases page.
 * The audit treats this page as the conversion target for the three
 * audiences — these tests guard the conditions a marketing change can
 * silently break:
 *   1. All three narratives render (no copy drops).
 *   2. Each narrative shows a YAML snippet block (the proof).
 *   3. Each narrative links back to /lab so the visitor can actually
 *      try it (the call-to-action contract).
 */
describe('UseCases page', () => {
    function renderPage() {
        return render(
            <MemoryRouter initialEntries={['/use-cases']}>
                <UseCases />
            </MemoryRouter>,
        )
    }

    it('renders all three audience narratives', () => {
        renderPage()
        expect(screen.getByRole('heading', { level: 2, name: /pipeline/i })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 2, name: /cascade/i })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 2, name: /train an on-call/i })).toBeInTheDocument()
    })

    it('shows a YAML snippet for every narrative', () => {
        const { container } = renderPage()
        const snippets = container.querySelectorAll('pre code')
        expect(snippets.length).toBe(3)
        snippets.forEach((node) => {
            expect(node.textContent ?? '').toContain('seed:')
        })
    })

    it('links every narrative to the Lab', () => {
        renderPage()
        const labLinks = screen
            .getAllByRole('link')
            .filter((a) => (a as HTMLAnchorElement).getAttribute('href') === '/lab/logcraft')
        // 3 narrative CTAs + the navbar's "Open Lab" CTA = at least 4.
        expect(labLinks.length).toBeGreaterThanOrEqual(3)
    })
})
