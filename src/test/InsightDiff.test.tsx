// InsightDiff.test.tsx — the /diff preset picker, where the provenance rule is
// actually enforced against a rendered DOM rather than against a data structure.
//
// diffPresets.test.ts proves the DATA is labelled and that the vendored bytes are
// the published ones. This file proves the visitor SEES the label at the point of
// choosing (web_copy.md makes that binding: not a tooltip, not a footnote), and
// that the asynchronous load the real pairs now require behaves — spinner while
// fetching, text in the inputs when it lands, a stated error when it does not.
//
// The real logs are served from the vendored files themselves, so this exercises
// the same decode path the browser takes, over the same bytes.

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import InsightDiff from '@/pages/InsightDiff'
import { diffPresets, type RealCiPreset } from '@/data/diffPresets'
import en from '@/i18n/en'

vi.mock('@/services/api', () => ({
    runInsightDiff: vi.fn(),
    PolicyDenialError: class PolicyDenialError extends Error {},
}))

const VENDORED = join(process.cwd(), 'src/assets/sift-showcase')

const realPresets = diffPresets.filter(
    (preset): preset is RealCiPreset => preset.provenance === 'real-ci'
)

function presetLabel(id: string): string {
    return (en.diff.presets as Record<string, { label: string }>)[id]?.label ?? id
}

/** Serve every vendored log at the URL its preset points at. */
function stubVendoredFetch() {
    const served = new Map<string, Buffer>()
    for (const preset of realPresets) {
        for (const sample of Object.values(preset.samples)) {
            served.set(sample.url, readFileSync(join(VENDORED, sample.file)))
        }
    }
    const fetcher = vi.fn(async (url: string) => {
        const bytes = served.get(url)
        if (!bytes) throw new Error(`test served no bytes for ${url}`)
        return {
            ok: true,
            status: 200,
            statusText: 'OK',
            arrayBuffer: async () =>
                bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
        }
    })
    vi.stubGlobal('fetch', fetcher)
    return fetcher
}

function renderPage() {
    return render(
        <MemoryRouter initialEntries={['/diff']}>
            <InsightDiff />
        </MemoryRouter>
    )
}

/** The picker button for a preset, found by its label. */
function pickerButton(id: string): HTMLElement {
    const label = presetLabel(id)
    const button = screen
        .getAllByRole('button')
        .find((candidate) => candidate.textContent?.includes(label))
    expect(button, `no picker button carries the label "${label}"`).toBeDefined()
    return button as HTMLElement
}

describe('/diff preset picker — provenance is visible at the point of choosing', () => {
    beforeEach(() => {
        stubVendoredFetch()
    })
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('labels EVERY preset, generated ones included', () => {
        renderPage()
        for (const preset of diffPresets) {
            const button = pickerButton(preset.id)
            const expected =
                preset.provenance === 'real-ci'
                    ? en.diff.provenance.realCi
                    : en.diff.provenance.generated
            expect(
                within(button).queryByText(expected),
                `preset "${preset.id}" (${preset.provenance}) renders no provenance label. ` +
                    `An unlabelled fixture beside a labelled real log reads as real too.\n` +
                    `button text: ${button.textContent}`
            ).not.toBeNull()
        }
    })

    it('shows both provenance values, on the expected counts', () => {
        renderPage()
        const real = diffPresets.filter((preset) => preset.provenance === 'real-ci').length
        const generated = diffPresets.length - real
        expect(screen.getAllByText(en.diff.provenance.realCi)).toHaveLength(real)
        expect(screen.getAllByText(en.diff.provenance.generated)).toHaveLength(generated)
    })

    it('puts the real CI pairs first in the rendered order', () => {
        renderPage()
        // getAllByRole returns DOM order, so the picker's rendered sequence is
        // read off the page rather than assumed from the data array.
        const rendered: string[] = []
        for (const button of screen.getAllByRole('button')) {
            const match = diffPresets.find((preset) =>
                button.textContent?.includes(presetLabel(preset.id))
            )
            if (match && !rendered.includes(match.id)) rendered.push(match.id)
        }
        expect(rendered, 'not every preset reached the DOM').toHaveLength(diffPresets.length)

        const provenanceOf = (id: string) =>
            diffPresets.find((preset) => preset.id === id)?.provenance
        const firstGenerated = rendered.findIndex((id) => provenanceOf(id) === 'generated')
        const lastReal = rendered.map(provenanceOf).lastIndexOf('real-ci')
        expect(
            lastReal,
            `rendered order was: ${rendered.map((id) => `${id}:${provenanceOf(id)}`).join(', ')}`
        ).toBeLessThan(firstGenerated)
    })
})

describe('/diff preset picker — loading a pair', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    // ORDER MATTERS: the failure case must run before any real sample has been
    // cached by a successful load, or there is nothing left to fetch.
    it('states an error when a real sample cannot be fetched, and keeps the inputs empty', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn(async () => ({ ok: false, status: 503, statusText: 'Service Unavailable' }))
        )
        const user = userEvent.setup()
        renderPage()

        await user.click(pickerButton('real-ci-noise'))

        await waitFor(() => {
            expect(screen.getByText(en.diff.error.presetFailed)).toBeTruthy()
        })
        const baseline = screen.getByLabelText(en.diff.baselineLog) as HTMLTextAreaElement
        expect(baseline.value, 'a failed load must not leave half a pair in the inputs').toBe('')
    })

    it('loads a generated fixture into both inputs and shows its brief', async () => {
        stubVendoredFetch()
        const user = userEvent.setup()
        renderPage()

        await user.click(pickerButton('hotfix'))

        const baseline = screen.getByLabelText(en.diff.baselineLog) as HTMLTextAreaElement
        const changed = screen.getByLabelText(en.diff.changedLog) as HTMLTextAreaElement
        await waitFor(() => expect(baseline.value.length).toBeGreaterThan(0))
        expect(changed.value.length).toBeGreaterThan(0)
        // The brief expands the provenance rather than leaving it as two words.
        expect(screen.getByText(en.diff.provenanceNote.generated)).toBeTruthy()
    })

    it('fetches a real pair, fills the inputs with the published bytes, and headlines its figures', async () => {
        const fetcher = stubVendoredFetch()
        const user = userEvent.setup()
        renderPage()

        await user.click(pickerButton('real-ci-noise'))

        const baseline = screen.getByLabelText(en.diff.baselineLog) as HTMLTextAreaElement
        const changed = screen.getByLabelText(en.diff.changedLog) as HTMLTextAreaElement
        await waitFor(() => expect(baseline.value.length).toBeGreaterThan(100_000), { timeout: 10_000 })
        expect(fetcher).toHaveBeenCalled()
        expect(changed.value.length).toBeGreaterThan(100_000)
        // The runner's BOM survived the fetch → decode → state round trip.
        expect(baseline.value.charCodeAt(0), 'the leading U+FEFF was stripped somewhere').toBe(0xfeff)

        const pair = realPresets[0] as RealCiPreset
        // Testing-library normalises whitespace, so the rendered non-breaking-space
        // grouping is matched by a plain-space query.
        const grouped = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
        expect(
            screen.getAllByText(grouped(pair.figures.plainTextDiffLines)).length,
            `the plain-diff figure ${pair.figures.plainTextDiffLines} is not on screen`
        ).toBeGreaterThan(0)
        expect(
            screen.getAllByText(String(pair.figures.significantChanges)).length,
            `the significant-change figure ${pair.figures.significantChanges} is not on screen`
        ).toBeGreaterThan(0)
        expect(screen.getByText(en.diff.provenanceNote.realCi)).toBeTruthy()
    })

    it('drops the brief as soon as the visitor edits an input — it no longer describes the text', async () => {
        stubVendoredFetch()
        const user = userEvent.setup()
        renderPage()

        await user.click(pickerButton('hotfix'))
        await waitFor(() => expect(screen.getByText(en.diff.provenanceNote.generated)).toBeTruthy())

        await user.type(screen.getByLabelText(en.diff.baselineLog), 'x')
        expect(screen.queryByText(en.diff.provenanceNote.generated)).toBeNull()
    })
})
