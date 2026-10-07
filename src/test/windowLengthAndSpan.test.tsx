import { afterEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import InsightPanel from '@/components/playground/InsightPanel'
import { useStore } from '@/store/useStore'
import en from '@/i18n/en'
import fr from '@/i18n/fr'
import type { InsightLatestWindow, InsightStatus } from '@/types/engine'

/**
 * A window has a LENGTH and an OBSERVED SPAN, and neither is labelled with the other's name
 * (ADR-34.D13). The length is the producer's seal interval, reported by the status field
 * `window_duration_seconds`; the span is a published MetaLog's `window.duration_seconds`, from the
 * window's first event to its last. A window cut every 25 s whose last line came 1 s before its
 * seal reads a span of 24 and a length of 25, and one label for both reads as a 24 s window.
 *
 * The wording is asserted literally, because the ruling gives it: asserting the translation keys
 * would compare the source of a label with itself.
 */

const kLengthSeconds = 25
const kSpanSeconds = 24

const status: InsightStatus = {
    engine_id: 'eng-1',
    running: true,
    lines_ingested: 4200,
    window_duration_seconds: kLengthSeconds,
    window_count: 3,
    pyramid_maturity: 'warming_up',
    windows_seen: 3,
    pyramid_warmup_windows: 13,
}

const latestWindow: InsightLatestWindow = {
    metalog: {
        version: '1',
        window: {
            start: '2026-09-29T10:00:00Z',
            end: '2026-09-29T10:00:24Z',
            duration_seconds: kSpanSeconds,
            lines_observed: 480,
        },
        stats: { unique_templates: 7, tail_count: 0, tail_unique: 0, top_k: [] },
    },
    acuteDiff: null,
    detectionReports: [],
    contextPackets: [],
}

const wording = {
    en: {
        span: 'Observed span',
        spanHint: "from the window's first event to its last",
        length: 'Window length',
        lengthHint: "the producer's seal interval",
        ambiguous: /window duration/i,
    },
    fr: {
        span: 'Étendue observée',
        spanHint: 'du premier événement de la fenêtre au dernier',
        length: 'Longueur de fenêtre',
        lengthHint: "l'intervalle de scellement du producteur",
        ambiguous: /durée de (la )?fenêtre/i,
    },
} as const

function openTab(tab: RegExp, panelStatus: InsightStatus = status) {
    render(
        <InsightPanel
            engineId={null}
            status={panelStatus}
            reports={[]}
            latestWindow={latestWindow}
            loading={false}
            error={null}
        />,
    )
    fireEvent.click(screen.getByRole('tab', { name: tab }))
}

/** The whole text of the metric tile showing `value`: its value, its label and its hint. */
function tileText(value: string): string {
    const shown = screen.getAllByText(value)
    expect(shown, `exactly one tile must show "${value}"`).toHaveLength(1)
    return shown[0]!.parentElement?.textContent ?? ''
}

function panelText(): string {
    return document.body.textContent ?? ''
}

/** Every leaf string of a translation tree, with its dotted path. */
function leaves(node: unknown, path: string[] = [], out: [string, string][] = []): [string, string][] {
    if (typeof node === 'string') {
        out.push([path.join('.'), node])
    } else if (node !== null && typeof node === 'object') {
        for (const [key, value] of Object.entries(node)) leaves(value, [...path, key], out)
    }
    return out
}

describe('a window LENGTH and an OBSERVED SPAN (ADR-34.D13)', () => {
    afterEach(() => {
        useStore.setState({ language: 'en' })
    })

    for (const language of ['en', 'fr'] as const) {
        const words = wording[language]

        describe(language, () => {
            it('names the MetaLog panel figure the observed span, with its hint', () => {
                useStore.setState({ language })
                openTab(/MetaLog/)

                const tile = tileText(`${kSpanSeconds.toFixed(1)}s`)
                expect(tile).toContain(words.span)
                expect(tile).toContain(words.spanHint)
                expect(tile).not.toContain(words.length)
                expect(panelText()).not.toMatch(words.ambiguous)
            })

            it('names the config panel figure the window length, with its hint', () => {
                useStore.setState({ language })
                openTab(/Config/)

                const tile = tileText(`${kLengthSeconds}s`)
                expect(tile).toContain(words.length)
                expect(tile).toContain(words.lengthHint)
                expect(tile).not.toContain(words.span)
                expect(panelText()).not.toMatch(words.ambiguous)
            })
        })
    }

    it('leaves no translation naming a window quantity "window duration", in either language', () => {
        const ambiguous = [
            ...leaves(en).filter(([, text]) => wording.en.ambiguous.test(text)).map(([path]) => `en.${path}`),
            ...leaves(fr).filter(([, text]) => wording.fr.ambiguous.test(text)).map(([path]) => `fr.${path}`),
        ]
        expect(ambiguous).toEqual([])
    })

    // No surface derives one quantity from the other (ADR-34.D13): the time to maturity is counted in
    // window LENGTHS, and a status that reports none has no length to count in, whatever span the
    // latest MetaLog saw.
    it('counts the time to maturity in window lengths, never in the observed span', () => {
        openTab(/Config/)
        expect(screen.getByText('~4m 10s to maturity')).toBeInTheDocument()
    })

    it('shows no time to maturity when the status reports no window length', () => {
        openTab(/Config/, { ...status, window_duration_seconds: undefined })

        expect(
            screen.queryByText(/to maturity/),
            `no length is reported, yet an ETA was shown: "${screen.queryByText(/to maturity/)?.textContent}"`,
        ).toBeNull()
    })
})
