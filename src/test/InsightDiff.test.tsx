// InsightDiff.test.tsx — the /diff preset picker, where the provenance rule is
// actually enforced against a rendered DOM rather than against a data structure.
//
// diffPresets.test.ts proves the DATA is labelled and that the vendored bytes are
// the published ones. This file proves the visitor SEES the label at the point of
// choosing (PRD-6 makes that binding: not a tooltip, not a footnote), and
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
import * as api from '@/services/api'

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

// ── The suppression footer, at the numbers a real report now carries ─────────
//
// The footer subtracts `significant_changes` from `total_changes` (InsightDiff.tsx),
// and until ADR-20.D15 that subtraction was widely believed to be a structural zero.
// It is not: `total_changes` is the pre-cut census on the ALIGNED spine, which /diff's
// hosted demo runs exactly as the CLI does (ADR-14.D7), so the branch is live, and the
// live-shaped fixture next door (diffDomSize, 941 observed / 1 significant) RENDERS it
// on every run while asserting DOM element counts. Nothing there reads the sentence.
//
// These arms read the sentence. The COPY comes from the bundle — this file does not
// own the wording and must not red on a reword — and the NUMBERS are literals, so the
// arithmetic is pinned by something that does not recompute it.
/** A drift-shaped report at a chosen (total, significant): one ranked row, so the list renders. */
const reportAt = (total: number, significant: number) => ({
    summary: { total_changes: total, significant_changes: significant, stability_score: 0.62 },
    inputs: { baseline: { lines_observed: 3609 }, changed: { lines_observed: 3724 } },
    ranked_changes: [
        {
            kind: 'frequency_shift',
            severity: 'high',
            summary: 'Frequency shift: "Downloading <*> (<*> MB)" 4% → 38%',
            evidence: ['baseline 4%', 'changed 38%'],
            baseline_line_refs: [1],
            changed_line_refs: [1],
        },
    ],
    markdown: '# report',
})

/** Render /diff, submit a pair, and wait until the report — heading and rows — is on screen. */
async function compare(total: number, significant: number) {
    await submitReport(reportAt(total, significant), 'alpha', 'beta')
}

/** Render /diff, type the two inputs, compare, and wait until `report` is on screen with its rows. */
async function submitReport(report: unknown, baselineText: string, changedText: string) {
    vi.mocked(api.runInsightDiff).mockResolvedValue(report as never)
    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText(en.diff.baselineLog), baselineText)
    await user.type(screen.getByLabelText(en.diff.changedLog), changedText)
    const button = screen
        .getAllByRole('button')
        .find((candidate) => candidate.textContent?.includes(en.diff.compare))
    expect(button, 'no compare button on the page').toBeDefined()
    await user.click(button as HTMLElement)
    await waitFor(() => expect(api.runInsightDiff).toHaveBeenCalled())
    // The ranked-list heading renders only once the report is on screen with rows —
    // waiting on it means an absence asserted below is a MEASURED absence, not a race.
    await waitFor(() => expect(screen.getByText(en.diff.significantChanges)).toBeTruthy())
}

describe('/diff — the suppression footer reads the census gap', () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    /** The footer sentence for a given pair of already-rendered numbers, wording owned by the bundle. */
    const footer = (count: string, total: string) =>
        en.diff.suppressed.replace('{count}', count).replace('{total}', total)

    /** The bundle-owned clause that follows the numbers — present iff the footer rendered at all. */
    const footerTail = en.diff.suppressed.split('{total}')[1] as string

    const footerNodes = () =>
        screen.queryAllByText((_, node) => (node?.textContent ?? '').includes(footerTail))

    it('renders 951 of the 973 for the measured post-restore pair', async () => {
        await compare(973, 22)
        expect(screen.getByText(footer('951', '973'))).toBeTruthy()
    })

    it('omits the footer entirely when nothing was suppressed', async () => {
        await compare(22, 22)
        expect(
            footerNodes(),
            'a zero gap must print no footer at all — "0 of 22 observed changes not listed" is ' +
                'a sentence about nothing, and it is what this page showed before the census landed ' +
                'on the spine the CI product uses'
        ).toHaveLength(0)
    })

    // The `suppressed > 0` gate is not a defensive clamp — it is a display condition that
    // happens to make this surface incapable of the failure the two UNSIGNED C++ render
    // sites are exposed to. A JS number is a double, so a breached `significant <= total`
    // yields −951 here, never the ~1.8e19 an unsigned wrap produces; and the gate then
    // drops the paragraph rather than printing the negative. Characterized, not defended:
    // the invariant stays the engine's (ADR-20.D15), asserted where each spine finalizes.
    it('prints nothing rather than a negative if the engine invariant is ever breached', async () => {
        await compare(22, 973)
        expect(footerNodes(), 'a breached invariant reached the page as text').toHaveLength(0)
        expect(document.body.textContent).not.toMatch(/-9\d\d/)
    })
})

// ── Rendered figures are a function of the REPORT, never of the visitor's browser ──────────
//
// `/diff` grouped its census numbers with `toLocaleString()` and no locale argument, which
// reads the BROWSER — not the i18n bundle that produced the prose around them. An FR-bundle
// visitor on an en-US browser therefore read French sentences carrying US separators, and one
// report rendered two ways depending on where it was opened. `sift-action` had already ruled
// the other way for the PR comment (frame.ts `groupThousands`, "no toLocaleString"), so the
// two shipped surfaces disagreed on the policy while the product's whole claim is that output
// is a function of input.
//
// The three arms in the footer block above are BLIND to this: every number they render is
// three digits, where grouped and ungrouped are the same string. These use four-digit values,
// which is the smallest input where the separator exists at all — and they close the door from
// both sides: two read the rendered glyph, the third asserts the POLICY, so a revert that
// happened to pick a locale whose separator is a space still reds.
describe('/diff — figures are grouped locale-independently', () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    // Spelled as an ESCAPE, never a pasted literal: a U+00A0 in a source file is invisible
    // in review, and one editor's whitespace pass would silently turn these arms into a
    // tautology by collapsing it to an ordinary space.
    const NBSP = '\u00a0'

    it('groups the census and the line counts with a non-breaking space, not a browser separator', async () => {
        await compare(9734, 22)
        const rendered = document.body.textContent ?? ''
        // The header census, the suppression footer's two numbers, and the input line counts —
        // every four-digit figure the page puts on screen for this report.
        for (const value of [`9${NBSP}734`, `9${NBSP}712`, `3${NBSP}609`, `3${NBSP}724`]) {
            expect(
                rendered.includes(value),
                `"${value}" is not on the page — the grouping is not the authored copy's ` +
                    `non-breaking space. Rendered: ${rendered.slice(0, 400)}`
            ).toBe(true)
        }
        expect(
            rendered,
            'a comma-grouped figure reached the page: the separator came from the runtime ' +
                'environment, not from this surface'
        ).not.toMatch(/\d,\d{3}/)
    })

    it('renders the whole report without ever consulting the environment locale', async () => {
        const localeFormat = vi.spyOn(Number.prototype, 'toLocaleString')
        try {
            await compare(9734, 22)
            expect(
                localeFormat.mock.calls.length,
                'a render path called Number#toLocaleString, so at least one figure on this ' +
                    'surface is formatted by the visitor\'s browser rather than by the page. ' +
                    'That is the one option ruled off the table: group locale-independently ' +
                    '(groupThousands, as sift-action does) or drive the locale from the SAME ' +
                    'i18n bundle that produced the prose.'
            ).toBe(0)
        } finally {
            localeFormat.mockRestore()
        }
    })
})

// ── An inferred cause line reads as inferred (ROADMAP N398, RUL-164) ─────────────────────
//
// Since report 0.14.0 a FAILING row carries `cause_lines`: each cited line's 0-based ref in the
// changed run and how it was established — `declared` (the CI said so) or `inferred` (canon read
// the line as error-level). Its refs also lead `changed_line_refs`, which the pane highlights
// alike, so before this view read `cause_lines` an inferred line looked exactly as declared as a
// `##[error]` line beside it. The engine's reader treats every token other than `declared` as
// inferred, so a re-read never shows a line as declared that its writer did not; the page keeps
// the same rule. The wording is the bundle's, which mirrors the report's own evidence line.
describe('/diff — an inferred cause line reads as inferred', () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    /** A red pair's report: one FAILING row citing line 1 inferred, line 2 declared, line 3 plain. */
    const failingReport = (causeLines: { ref: number; established: string }[]) => ({
        report_version: '0.14.0',
        summary: { total_changes: 4, significant_changes: 1 },
        inputs: { baseline: { lines_observed: 2 }, changed: { lines_observed: 4 } },
        ranked_changes: [
            {
                kind: 'unit_outcome_changed',
                severity: 'critical',
                polarity: 'regression',
                significance: 1,
                summary: 'Failing: "build" — this unit of work changed outcome',
                evidence: [
                    'cited first: 1 line of step "Run tests" read as error-level by inference, not declared, then its first declared error line',
                ],
                changed_line_refs: [1, 2, 3],
                cause_lines: causeLines,
            },
        ],
        markdown: '# report',
    })

    const BASELINE = 'start{Enter}done'
    const CHANGED = 'start{Enter}FAILED: test_cache{Enter}##[error]Process completed with exit code 1.{Enter}done'

    /** The changed run's pane, asserted unique: role + name alone is not a unique selector. */
    function changedPane(): HTMLElement {
        const panes = screen.getAllByRole('region', { name: en.diff.paneChanged })
        expect(panes, 'expected exactly one log pane named for the changed run').toHaveLength(1)
        return panes[0] as HTMLElement
    }

    /** The inferred markers inside one rendered line of a pane. */
    const inferredMarks = (pane: HTMLElement, line: number) => {
        const row = pane.querySelector<HTMLElement>(`[data-line="${line}"]`)
        expect(row, `the pane rendered no line ${line}`).not.toBeNull()
        return within(row as HTMLElement).queryAllByText(en.diff.inferredLine)
    }

    it('marks the inferred line, and neither the declared line nor a plain changed ref', async () => {
        await submitReport(
            failingReport([
                { ref: 1, established: 'inferred' },
                { ref: 2, established: 'declared' },
            ]),
            BASELINE,
            CHANGED
        )
        const pane = changedPane()
        const marks = inferredMarks(pane, 1)
        expect(
            marks,
            `line 1 is cited "inferred" and renders ${marks.length} inferred markers; ` +
                `line text: ${pane.querySelector('[data-line="1"]')?.textContent}`
        ).toHaveLength(1)
        expect(marks[0]?.getAttribute('title')).toBe(en.diff.inferredLineTitle)
        expect(inferredMarks(pane, 2), 'line 2 is cited "declared" and must not read inferred').toHaveLength(0)
        expect(inferredMarks(pane, 3), 'line 3 is a plain changed ref, not a cause line').toHaveLength(0)
        const baselinePanes = screen.getAllByRole('region', { name: en.diff.paneBaseline })
        expect(baselinePanes).toHaveLength(1)
        expect(
            within(baselinePanes[0] as HTMLElement).queryAllByText(en.diff.inferredLine),
            'cause lines index the changed run; the baseline pane carries none'
        ).toHaveLength(0)
    })

    it('reads a token other than "declared" as inferred, as the report reader does', async () => {
        await submitReport(failingReport([{ ref: 2, established: 'asserted' }]), BASELINE, CHANGED)
        expect(
            inferredMarks(changedPane(), 2),
            'an unknown establishment token must never render as declared'
        ).toHaveLength(1)
    })

    it('drops the marker when the row is unpinned, with the rest of its highlight', async () => {
        await submitReport(failingReport([{ ref: 1, established: 'inferred' }]), BASELINE, CHANGED)
        expect(inferredMarks(changedPane(), 1)).toHaveLength(1)
        const user = userEvent.setup()
        const clear = screen
            .getAllByRole('button')
            .filter((candidate) => candidate.textContent === en.diff.clearPinned.replace('{count}', '1'))
        expect(clear, 'expected exactly one "clear pinned" control').toHaveLength(1)
        await user.click(clear[0] as HTMLElement)
        await user.unhover(changedPane())
        expect(
            inferredMarks(changedPane(), 1),
            'an inactive row lights no line, so it marks none inferred either'
        ).toHaveLength(0)
    })
})
