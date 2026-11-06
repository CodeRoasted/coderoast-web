import { afterEach, describe, expect, it } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Privacy from '@/pages/legal/Privacy'
import Notice from '@/pages/legal/Notice'
import { useStore } from '@/store/useStore'

function renderAt(ui: React.ReactElement, route: string) {
    return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>)
}

/**
 * The legal pages follow the site's language switch: the English copy on `en`, the French on `fr`,
 * and never the other language's heading beside it.
 */
describe('legal pages follow the language switch', () => {
    afterEach(() => act(() => useStore.getState().setLanguage('en')))

    it('the privacy page shows the English copy on en and the French on fr', () => {
        renderAt(<Privacy />, '/legal/privacy')
        expect(screen.getByRole('heading', { level: 1, name: 'Privacy policy' })).toBeTruthy()
        expect(screen.getByText('Last updated: 2026-11-06')).toBeTruthy()
        expect(screen.queryByText('Politique de confidentialité', { selector: 'h1' })).toBeNull()
        act(() => useStore.getState().setLanguage('fr'))
        expect(screen.getByRole('heading', { level: 1, name: 'Politique de confidentialité' })).toBeTruthy()
        expect(screen.getByText('Dernière mise à jour : 2026-11-06')).toBeTruthy()
        expect(screen.getByRole('link', { name: 'mentions légales' }).getAttribute('href')).toBe('/legal/notice')
        expect(screen.getByRole('link', { name: /Retour à CodeRoast/ })).toBeTruthy()
        expect(screen.getByText('Juridique et sécurité')).toBeTruthy()
    })

    it('the legal notice shows the English copy on en and the French on fr', () => {
        renderAt(<Notice />, '/legal/notice')
        expect(screen.getByRole('heading', { level: 1, name: 'Legal notice' })).toBeTruthy()
        expect(screen.getByRole('heading', { level: 2, name: 'Publication director' })).toBeTruthy()
        act(() => useStore.getState().setLanguage('fr'))
        expect(screen.getByRole('heading', { level: 1, name: 'Mentions légales' })).toBeTruthy()
        expect(screen.getByRole('heading', { level: 2, name: 'Directeur de la publication' })).toBeTruthy()
        expect(screen.queryByRole('heading', { level: 2, name: 'Publication director' })).toBeNull()
        expect(screen.getByRole('link', { name: /Retour à CodeRoast/ })).toBeTruthy()
        expect(screen.queryByText('Legal & Security')).toBeNull()
    })
})

/**
 * No legal page renders an unfilled `<…>` placeholder token, in either language: the privacy page once
 * shipped "Last updated: <DATE>".
 */
describe('legal pages render no placeholder token', () => {
    afterEach(() => act(() => useStore.getState().setLanguage('en')))

    const pages: Array<[string, React.ReactElement, string]> = [
        ['privacy', <Privacy />, '/legal/privacy'],
        ['notice', <Notice />, '/legal/notice'],
    ]
    for (const language of ['en', 'fr'] as const) {
        for (const [name, ui, route] of pages) {
            it(`the ${name} page on ${language} contains no <…> placeholder`, () => {
                act(() => useStore.getState().setLanguage(language))
                const { container } = renderAt(ui, route)
                const text = container.textContent ?? ''
                const placeholders = text.match(/<[^<>\s][^<>]*>/g) ?? []
                expect(placeholders, `the ${name} page on ${language} renders placeholder token(s) ${JSON.stringify(placeholders)}`).toEqual([])
            })
        }
    }
})
