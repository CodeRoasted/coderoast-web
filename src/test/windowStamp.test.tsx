import { afterEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import InsightPanel from '@/components/playground/InsightPanel'
import { useStore } from '@/store/useStore'
import type { InsightLatestWindow, InsightReport, InsightStatus } from '@/types/engine'

/**
 * The stamp at the top right of four InSight tabs prints a MetaLog's `window.start → window.end`,
 * the window's first and last event times (ADR-34.D13), never its boundaries. So the range carries
 * a visible word, "observed" ("observé"), because the misreading happens at a glance, and the
 * observed-span hint as its title (ADR-34.D13). The wording is asserted literally, as the ruling
 * gives it.
 */

const status: InsightStatus = {
    engine_id: 'eng-1',
    running: true,
    lines_ingested: 4200,
    window_count: 3,
}

const report: InsightReport = {
    headline: 'Checkout failures are cascading from postgres latency.',
    body: 'InSight matched postgres slow queries with checkout retries.',
    severity: 'High',
    confidence: 0.91,
    action_hint: 'Isolate the postgres write path.',
    affected_templates: ['T17'],
    supporting_evidence: ['postgres slow query 412ms'],
    dedup_id: 'd:4317e93af798dcad59c9e90eaa84da08',
}

const latestWindow: InsightLatestWindow = {
    metalog: {
        version: '1',
        window: {
            start: '2026-09-29T10:00:01Z',
            end: '2026-09-29T10:00:25Z',
            duration_seconds: 24,
            lines_observed: 480,
        },
        stats: { unique_templates: 7, tail_count: 0, tail_unique: 0, top_k: [] },
    },
    acuteDiff: null,
    detectionReports: [
        {
            type: 'frequency_spike',
            template_id: 'T17',
            template: 'postgres slow query <*>ms',
            observed_count: 42,
            score: 4.2,
            confidence: 0.9,
            scale: 1,
            evidence: ['postgres slow query 412ms'],
        },
    ],
    contextPackets: [],
}

const wording = {
    en: {
        range: 'observed 10:00:01 → 10:00:25',
        hint: "from the window's first event to its last",
    },
    fr: {
        range: 'observé 10:00:01 → 10:00:25',
        hint: 'du premier événement de la fenêtre au dernier',
    },
} as const

const tabs = [/Explain/, /Detect/, /MetaLog/, /Evidence/]

describe('the window stamp names its range the observed span (ADR-34.D13)', () => {
    afterEach(() => {
        useStore.setState({ language: 'en' })
    })

    for (const language of ['en', 'fr'] as const) {
        for (const tab of tabs) {
            it(`reads "${wording[language].range}" with the hint as its title (${language}, ${tab.source} tab)`, () => {
                useStore.setState({ language })
                render(
                    <InsightPanel
                        engineId={null}
                        status={status}
                        reports={[report]}
                        latestWindow={latestWindow}
                        loading={false}
                        error={null}
                    />,
                )
                fireEvent.click(screen.getByRole('tab', { name: tab }))

                const ranges = screen.getAllByText(/10:00:01 → 10:00:25/)
                expect(ranges, 'exactly one range on the tab').toHaveLength(1)
                const range = ranges[0]!
                expect({ text: range.textContent, title: range.getAttribute('title') }).toEqual({
                    text: wording[language].range,
                    title: wording[language].hint,
                })
            })
        }
    }
})
