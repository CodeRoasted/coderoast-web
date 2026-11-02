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
        expect(screen.queryByText('Politique de confidentialité', { selector: 'h1' })).toBeNull()
        act(() => useStore.getState().setLanguage('fr'))
        expect(screen.getByRole('heading', { level: 1, name: 'Politique de confidentialité' })).toBeTruthy()
        expect(screen.getByText('Dernière mise à jour : <DATE>')).toBeTruthy()
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
