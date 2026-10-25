// Sift.test.tsx — the /sift page's claim boundary, enforced on the rendered DOM and the bundles.
//
// The page may state only what a committed record backs (the Sift study of 2026-10-22, § 4.2,
// left column), and every number on it names its record. Two arms make that structural rather
// than a review habit: no copy string outside the records section carries a digit, so a number
// can reach the page only through the figures table; and every figure links to a record entry
// that is on the page. A third pins the install snippet to the Action's published major.

import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SiftPage from '@/pages/Sift'
import en from '@/i18n/en'
import fr from '@/i18n/fr'

function renderPage() {
    return render(
        <MemoryRouter initialEntries={['/sift']}>
            <SiftPage />
        </MemoryRouter>
    )
}

/** Every [dotted path, value] leaf of a translation subtree. */
function leaves(node: unknown, prefix: string[] = [], out: [string, string][] = []): [string, string][] {
    if (node !== null && typeof node === 'object') {
        for (const [key, value] of Object.entries(node)) leaves(value, [...prefix, key], out)
    } else {
        out.push([prefix.join('.'), String(node)])
    }
    return out
}

describe('/sift — every number names its record', () => {
    it.each([
        ['en', en],
        ['fr', fr],
    ])('no %s copy string outside the records carries a digit', (_language, bundle) => {
        const offenders = leaves(bundle.sift, ['sift'])
            .filter(([path]) => !path.startsWith('sift.records.'))
            .filter(([, value]) => /\d/.test(value))
        expect(
            offenders,
            'a number in the copy bypasses the figures table and names no record:\n' +
                offenders.map(([path, value]) => `  ${path}: ${value}`).join('\n')
        ).toEqual([])
    })

    it('links every figure to a record entry rendered on the page', () => {
        const { container } = renderPage()
        const figures = container.querySelectorAll<HTMLElement>('[data-figure]')
        expect(figures.length, 'the page renders no figure at all').toBeGreaterThan(0)
        for (const figure of figures) {
            const links = figure.querySelectorAll<HTMLAnchorElement>('a[href^="#sift-record-"]')
            expect(links, `figure "${figure.dataset.figure}" carries ${links.length} record links`).toHaveLength(1)
            const target = (links[0] as HTMLAnchorElement).getAttribute('href')?.slice(1) ?? ''
            const record = container.querySelector(`[id="${target}"]`)
            expect(record, `figure "${figure.dataset.figure}" links to #${target}, absent from the page`).not.toBeNull()
            expect((record?.textContent ?? '').trim().length, `record #${target} is empty`).toBeGreaterThan(0)
        }
    })
})

describe('/sift — the install snippet', () => {
    it('installs the Action on its published major, v2', () => {
        renderPage()
        const blocks = screen.getAllByText((_, node) => node?.tagName === 'CODE')
        const uses = blocks.map((block) => block.textContent ?? '').filter((text) => text.includes('sift-action@'))
        expect(uses, `install blocks: ${JSON.stringify(blocks.map((block) => block.textContent))}`).toHaveLength(1)
        expect(uses[0]).toContain('uses: CodeRoasted/sift-action@v2')
        expect(document.body.textContent, 'a stale @v1 reference is still on the page').not.toContain('sift-action@v1')
    })
})
