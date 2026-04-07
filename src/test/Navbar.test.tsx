import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '@/components/Navbar'

// Minimal wrapper around MemoryRouter to render with routing context
function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
    return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>)
}

describe('Navbar', () => {
    it('renders nav links', () => {
        renderWithRouter(<Navbar />)
        expect(screen.getByText('Home')).toBeInTheDocument()
        expect(screen.getByText('Portfolio')).toBeInTheDocument()
    })

    it('renders LogCraft and Lab links', () => {
        renderWithRouter(<Navbar />)
        expect(screen.getByText('LogCraft')).toBeInTheDocument()
        expect(screen.getByText('Lab')).toBeInTheDocument()
    })

    describe('anchor link resolution', () => {
        it('uses hash-only anchors on the home page', () => {
            renderWithRouter(<Navbar />, { route: '/' })
            // Desktop nav links (there's also mobile, so filter for anchors)
            const homeLinks = screen.getAllByText('Home')
            // At least one link should have href="#hero"
            const anchors = homeLinks
                .map((el) => el.closest('a'))
                .filter(Boolean) as HTMLAnchorElement[]
            expect(anchors.some((a) => a.getAttribute('href') === '#hero')).toBe(true)
        })

        it('prepends / to anchors on sub-pages', () => {
            renderWithRouter(<Navbar />, { route: '/logcraft' })
            const homeLinks = screen.getAllByText('Home')
            const anchors = homeLinks
                .map((el) => el.closest('a'))
                .filter(Boolean) as HTMLAnchorElement[]
            expect(anchors.some((a) => a.getAttribute('href') === '/#hero')).toBe(true)
        })

        it('prepends / to portfolio anchor on /lab', () => {
            renderWithRouter(<Navbar />, { route: '/lab' })
            const portfolioLinks = screen.getAllByText('Portfolio')
            const anchors = portfolioLinks
                .map((el) => el.closest('a'))
                .filter(Boolean) as HTMLAnchorElement[]
            expect(anchors.some((a) => a.getAttribute('href') === '/#portfolio')).toBe(true)
        })

        it('logo links to /#hero on sub-pages', () => {
            renderWithRouter(<Navbar />, { route: '/logcraft' })
            // Logo has "Code" text inside
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
