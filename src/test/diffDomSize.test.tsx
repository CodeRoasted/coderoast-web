// /diff DOM size — a MEASUREMENT that is also a structural gate.
//
// The "~20 k DOM nodes" figure for this page had been read off the code (three
// elements per line × two unvirtualized panes) and never counted. Counted here,
// on the largest pair the picker can actually be asked to render — the real-CI
// noise pair, 3 610 + 3 725 lines:
//
//     elements, page idle    :     198
//     elements, report shown :  22 176
//     line rows              :   7 335   (2.99 elements each)
//     text nodes             :  14 747
//
// So the estimate was right, slightly under. Both panes are `h-80 overflow-auto`,
// ~25 rows tall, so upward of 99 % of that tree is off-screen at any moment.
//
// WHAT THIS FILE ASSERTS, and what it deliberately does not.
//
// It asserts the SHAPE of the cost: one row per input line, a small constant of
// elements per row, nothing superlinear. A change that made rows cost 10 elements
// each, or that made the count grow faster than the input, is a defect at any
// budget — so this can be a gate without anyone having to invent a budget first.
//
// It does NOT assert an absolute ceiling. Whether 22 k is acceptable is a product
// call about the page, not a fact about the code, and nothing here is evidence
// for it either way: jsdom builds the same tree a browser builds, so the COUNT
// transfers exactly, but layout, paint, scroll and memory are not measured at all
// and no frame-rate claim may be read off a jsdom timing.

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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

/** LogPane renders div + line-number span + text span for each line. */
const ELEMENTS_PER_ROW = 3
/** Generous band around ELEMENTS_PER_ROW: catches a structural change, not noise. */
const ELEMENTS_PER_ROW_TOLERANCE = 1

const realPresets = diffPresets.filter(
    (preset): preset is RealCiPreset => preset.provenance === 'real-ci'
)

function stubVendoredFetch() {
    const served = new Map<string, Buffer>()
    for (const preset of realPresets) {
        for (const sample of Object.values(preset.samples)) {
            served.set(sample.url, readFileSync(join(VENDORED, sample.file)))
        }
    }
    vi.stubGlobal(
        'fetch',
        vi.fn(async (url: string) => {
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
    )
}

/** Shaped like the live report for this pair: 744 observed, 1 significant. */
function noisePairReport() {
    return {
        summary: { total_changes: 744, significant_changes: 1, stability_score: 0.62 },
        inputs: {
            baseline: { lines_observed: 3609 },
            changed: { lines_observed: 3724 },
        },
        ranked_changes: [
            {
                kind: 'frequency_shift',
                severity: 'high',
                summary: 'Frequency shift: "Downloading <*> (<*> MB)" 4% → 38%',
                evidence: ['baseline 4%', 'changed 38%'],
                baseline_line_refs: [12, 480, 1902],
                changed_line_refs: [14, 512, 2044],
            },
        ],
        markdown: '# report',
    }
}

function pickerButton(id: string): HTMLElement {
    const label = (en.diff.presets as Record<string, { label: string }>)[id]?.label ?? id
    const button = screen
        .getAllByRole('button')
        .find((candidate) => candidate.textContent?.includes(label))
    if (!button) throw new Error(`no picker button carries the label "${label}"`)
    return button
}

describe('/diff DOM size', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        stubVendoredFetch()
    })
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('costs a small constant of elements per input line, and nothing superlinear', async () => {
        vi.mocked(api.runInsightDiff).mockResolvedValue(noisePairReport() as never)
        const user = userEvent.setup()
        const { container } = render(
            <MemoryRouter initialEntries={['/diff']}>
                <InsightDiff />
            </MemoryRouter>
        )

        const idle = container.querySelectorAll('*').length

        const noisePreset = realPresets.find((preset) => preset.id === 'real-ci-noise')
        if (!noisePreset) throw new Error('the real-ci-noise preset is gone from the picker')
        await user.click(pickerButton(noisePreset.id))

        const panes = () => {
            const areas = [...container.querySelectorAll('textarea')]
            const [baseline, changed] = areas
            if (!baseline || !changed) throw new Error(`expected 2 textareas, got ${areas.length}`)
            return { baseline, changed }
        }

        await waitFor(
            () => {
                const { baseline, changed } = panes()
                if (!baseline.value || !changed.value) throw new Error('preset not loaded yet')
            },
            { timeout: 20_000 }
        )

        const { baseline, changed } = panes()
        const inputLines = baseline.value.split('\n').length + changed.value.split('\n').length
        const loaded = container.querySelectorAll('*').length

        const compare = screen
            .getAllByRole('button')
            .find((candidate) => candidate.textContent?.includes(en.diff.compare))
        if (!compare) throw new Error('no compare button')

        await user.click(compare)
        await waitFor(
            () => {
                if (container.querySelectorAll('[data-line]').length === 0) {
                    throw new Error('panes not rendered yet')
                }
            },
            { timeout: 30_000 }
        )

        const rendered = container.querySelectorAll('*').length
        const rows = container.querySelectorAll('[data-line]').length
        const perRow = (rendered - loaded) / rows
        const report = [
            `  input lines            : ${inputLines}`,
            `  elements, page idle    : ${idle}`,
            `  elements, pair loaded  : ${loaded}`,
            `  elements, report shown : ${rendered}`,
            `  line rows ([data-line]): ${rows}`,
            `  elements per line row  : ${perRow.toFixed(2)}`,
        ].join('\n')

        // One row per input line: the panes are unvirtualized, and if that ever
        // changes this is the assertion that says so out loud rather than letting
        // the count quietly halve for a reason nobody recorded.
        expect(rows, `line rows must equal input lines (panes are unvirtualized).\n${report}`)
            .toBe(inputLines)

        expect(
            Math.abs(perRow - ELEMENTS_PER_ROW),
            `each rendered line costs ${perRow.toFixed(2)} elements, expected about ` +
                `${ELEMENTS_PER_ROW}. A jump here multiplies across every line of both panes — ` +
                `at this pair's size that is thousands of nodes per element added.\n${report}`
        ).toBeLessThanOrEqual(ELEMENTS_PER_ROW_TOLERANCE)
    }, 120_000)
})
