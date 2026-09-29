import { afterEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import InsightPanel from '@/components/playground/InsightPanel'
import { useStore } from '@/store/useStore'
import type { InsightStatus } from '@/types/engine'

/**
 * The pyramid warm-up bar speaks the operator's language: its window count, its time to maturity
 * and its "finalising" state come from the translation bundles, so a French session reads no
 * English there. The "Pyramid maturity" row's counter carries no unit either: its label already
 * says what is counted, and a "w" for "windows" was English in every language. The wording is
 * asserted literally, since a test built from the bundles would pass on any string they hold,
 * English included.
 */

const kWarmingUp: InsightStatus = {
    engine_id: 'eng-1',
    running: true,
    lines_ingested: 4200,
    window_duration_seconds: 25,
    window_count: 3,
    pyramid_maturity: 'warming_up',
    windows_seen: 3,
    pyramid_warmup_windows: 13,
}

/** Every window seen, the pyramid not yet reported mature: the bar says it is finalising. */
const kFinalising: InsightStatus = { ...kWarmingUp, window_count: 13, windows_seen: 13 }

const kEnglishInTheBar = /windows|to maturity|finalising/i

/** The warm-up bar, found by its heading and read whole. */
function warmupBarText(heading: string, status: InsightStatus): string {
    render(
        <InsightPanel engineId={null} status={status} reports={[]} loading={false} error={null} />,
    )
    fireEvent.click(screen.getByRole('tab', { name: /Config/ }))
    const bar = screen.getByText(heading).parentElement?.parentElement
    expect(bar, `no warm-up bar under the heading "${heading}"`).toBeTruthy()
    return bar!.textContent ?? ''
}

/** The "Pyramid maturity" row, found by its label: the label, the counter and the badge. */
function maturityRow(label: string, status: InsightStatus): HTMLElement {
    render(
        <InsightPanel engineId={null} status={status} reports={[]} loading={false} error={null} />,
    )
    fireEvent.click(screen.getByRole('tab', { name: /Config/ }))
    const row = screen.getByText(label).parentElement
    expect(row, `no row under the label "${label}"`).toBeTruthy()
    return row!
}

describe('the pyramid maturity counter', () => {
    afterEach(() => {
        useStore.setState({ language: 'en' })
    })

    for (const [language, label] of [['fr', 'Maturité pyramide'], ['en', 'Pyramid maturity']] as const) {
        it(`reads seen/target with no unit suffix (${language})`, () => {
            useStore.setState({ language })
            const row = maturityRow(label, kWarmingUp)

            expect(within(row).queryByText('3/13'), `the row read "${row.textContent}"`).not.toBeNull()
            expect(row.textContent?.match(/\d+w/) ?? null, `a unit suffix in "${row.textContent}"`).toBeNull()
        })
    }

    it('reads the seen count alone when the status reports no target', () => {
        const row = maturityRow('Pyramid maturity', { ...kWarmingUp, pyramid_warmup_windows: undefined })

        expect(within(row).queryByText('3'), `the row read "${row.textContent}"`).not.toBeNull()
        expect(row.textContent?.match(/\d+w/) ?? null, `a unit suffix in "${row.textContent}"`).toBeNull()
    })
})

describe('the pyramid warm-up bar', () => {
    afterEach(() => {
        useStore.setState({ language: 'en' })
    })

    it('reads in French while the pyramid warms up, with no English left', () => {
        useStore.setState({ language: 'fr' })
        const text = warmupBarText('en chauffe', kWarmingUp)

        expect(text, `the bar read "${text}"`).toContain('3 / 13 fenêtres')
        expect(text, `the bar read "${text}"`).toContain('~4m 10s avant maturité')
        expect(text.match(kEnglishInTheBar), `English in the French bar: "${text}"`).toBeNull()
    })

    it('reads in French once every window is seen, with no English left', () => {
        useStore.setState({ language: 'fr' })
        const text = warmupBarText('en chauffe', kFinalising)

        expect(text, `the bar read "${text}"`).toContain('13 / 13 fenêtres')
        expect(text, `the bar read "${text}"`).toContain('finalisation…')
        expect(text.match(kEnglishInTheBar), `English in the French bar: "${text}"`).toBeNull()
    })

    it('keeps its English wording in an English session while the pyramid warms up', () => {
        const text = warmupBarText('warming up', kWarmingUp)

        expect(text, `the bar read "${text}"`).toContain('3 / 13 windows')
        expect(text, `the bar read "${text}"`).toContain('~4m 10s to maturity')
    })

    it('keeps its English wording in an English session once every window is seen', () => {
        const text = warmupBarText('warming up', kFinalising)

        expect(text, `the bar read "${text}"`).toContain('finalising…')
    })
})
