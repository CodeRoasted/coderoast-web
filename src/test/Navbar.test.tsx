import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '@/components/Navbar'

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
    return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>)
}

describe('Navbar', () => {
    it('renders the product anchor links', () => {
        renderWithRouter(<Navbar />)
        // Three same-page anchors are rendered: product / how / features.
        expect(screen.getAllByText('Product').length).toBeGreaterThan(0)
        expect(screen.getAllByText('How').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Features').length).toBeGreaterThan(0)
    })

    it('renders LogCraft and InSight Playground links', () => {
        renderWithRouter(<Navbar />)
        expect(screen.getAllByText('LogCraft').length).toBeGreaterThan(0)
        expect(screen.getAllByText('InSight Playground').length).toBeGreaterThan(0)
    })

    describe('anchor link resolution', () => {
        it('uses hash-only anchors on the home page', () => {
            renderWithRouter(<Navbar />, { route: '/' })
            const productLinks = screen.getAllByText('Product')
            const anchors = productLinks
                .map((el) => el.closest('a'))
                .filter(Boolean) as HTMLAnchorElement[]
            expect(anchors.some((a) => a.getAttribute('href') === '#product')).toBe(true)
        })

        it('prepends / to anchors on sub-pages', () => {
            renderWithRouter(<Navbar />, { route: '/logcraft' })
            const productLinks = screen.getAllByText('Product')
            const anchors = productLinks
                .map((el) => el.closest('a'))
                .filter(Boolean) as HTMLAnchorElement[]
            expect(anchors.some((a) => a.getAttribute('href') === '/#product')).toBe(true)
        })

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
