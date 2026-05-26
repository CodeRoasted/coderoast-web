import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '@/components/Navbar'

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
    return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>)
}

describe('Navbar', () => {
    it('renders the umbrella nav: Products menu, Pricing, and the diff CTA', () => {
        renderWithRouter(<Navbar />)
        expect(screen.getByRole('button', { name: /products/i })).toBeTruthy()
        expect(screen.getAllByText('Pricing').length).toBeGreaterThan(0)
        // The wedge leads the umbrella nav as the primary CTA.
        expect(screen.getAllByText('Diff two logs').length).toBeGreaterThan(0)
    })

    it('no longer surfaces product-specific section anchors in the umbrella nav', () => {
        renderWithRouter(<Navbar />)
        // The old #how / #features anchors moved onto the product pages.
        expect(screen.queryByText('How')).toBeNull()
        expect(screen.queryByText('Features')).toBeNull()
    })

    it('reveals the registry-driven product slate when the Products menu opens', () => {
        renderWithRouter(<Navbar />)
        // Closed by default — no product entries in the DOM yet.
        expect(screen.queryByText('Sift')).toBeNull()
        fireEvent.click(screen.getByRole('button', { name: /products/i }))
        expect(screen.getAllByText('Sift').length).toBeGreaterThan(0)
        expect(screen.getAllByText('LogCraft').length).toBeGreaterThan(0)
        expect(screen.getAllByText('InSight').length).toBeGreaterThan(0)
    })

    describe('logo anchor resolution', () => {
        it('logo links to /#hero on sub-pages', () => {
            renderWithRouter(<Navbar />, { route: '/logcraft' })
            const codeTexts = screen.getAllByText('Code')
            const logoAnchor = codeTexts
                .map((el) => el.closest('a'))
                .find((a) => a?.getAttribute('href')?.includes('hero'))
            expect(logoAnchor).toBeTruthy()
            expect(logoAnchor!.getAttribute('href')).toBe('/#hero')
        })

        it('logo links to #hero on home page', () => {
            renderWithRouter(<Navbar />, { route: '/' })
            const codeTexts = screen.getAllByText('Code')
            const logoAnchor = codeTexts
                .map((el) => el.closest('a'))
                .find((a) => a?.getAttribute('href')?.includes('hero'))
            expect(logoAnchor).toBeTruthy()
            expect(logoAnchor!.getAttribute('href')).toBe('#hero')
        })
    })
})
