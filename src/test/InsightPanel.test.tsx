import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import InsightPanel from '@/components/playground/InsightPanel'
import type { AcuteDiffSummary, InsightLatestWindow, InsightReport, InsightStatus } from '@/types/engine'

const status: InsightStatus = {
    engine_id: 'eng-1',
    running: true,
    lines_ingested: 4200,
}

const report: InsightReport = {
    headline: 'Checkout failures are cascading from postgres latency.',
    body: 'InSight matched postgres slow queries with checkout retries.',
    severity: 'High',
    confidence: 0.91,
    action_hint: 'Isolate the postgres write path.',
    affected_templates: ['T17', 'T42'],
    supporting_evidence: ['postgres slow query 412ms', 'checkout retry 1/3'],
    dedup_id: 'd:4317e93af798dcad59c9e90eaa84da08',
}

const llmReport: InsightReport = {
    ...report,
    explain_mode: 'llm_augmented',
    llm_enabled: true,
    llm_model: 'gpt-4o-mini',
}

describe('InsightPanel', () => {
    it('renders the explain-first report view', () => {
        render(<InsightPanel engineId={null} status={status} reports={[report]} loading={false} error={null} />)

        expect(screen.getByText('InSight Explain')).toBeInTheDocument()
        expect(screen.getByText('Checkout failures are cascading from postgres latency.')).toBeInTheDocument()
        expect(screen.getByText('91%')).toBeInTheDocument()
        expect(screen.getByText('Isolate the postgres write path.')).toBeInTheDocument()
    })

    it('switches to the template capability view', () => {
        render(<InsightPanel engineId={null} status={status} reports={[report]} loading={false} error={null} />)

        fireEvent.click(screen.getByRole('tab', { name: /Templates/i }))

        expect(screen.getByText('Template focus')).toBeInTheDocument()
        expect(screen.getByText('T17')).toBeInTheDocument()
        expect(screen.getByText('T42')).toBeInTheDocument()
    })

    it('renders the empty explanation state while waiting for reports', () => {
        render(<InsightPanel engineId={null} status={{ ...status, lines_ingested: 0 }} reports={[]} loading={false} error={null} />)

        expect(screen.getByText('Waiting for first explanation')).toBeInTheDocument()
    })

    it('shows LLM mode metadata when reports are AI augmented', () => {
        render(
            <InsightPanel
                engineId={null}
                status={{ ...status, explain_mode: 'llm_augmented', llm_enabled: true, llm_model: 'gpt-4o-mini' }}
                reports={[llmReport]}
                loading={false}
                error={null}
            />,
        )

        expect(screen.getAllByText('AI augmented').length).toBeGreaterThan(0)
        expect(screen.getByText('gpt-4o-mini')).toBeInTheDocument()
    })
})

// ADR-25.D13: a count the MetaLog diff states incomparable is omitted from the summary, and the
// panel must say so with the reason rather than read the absence as "no change".
describe('InsightPanel acute diff (ADR-25.D13)', () => {
    const windowWith = (acuteDiff: AcuteDiffSummary): InsightLatestWindow => ({
        metalog: {
            version: '1',
            window: { start: '2026-09-29T10:00:01Z', end: '2026-09-29T10:00:25Z', duration_seconds: 24, lines_observed: 480 },
            stats: { unique_templates: 7, tail_count: 0, tail_unique: 0, top_k: [] },
        },
        acuteDiff,
        detectionReports: [],
        contextPackets: [],
    })
    const counts = { version: '1', new_templates_count: 0, vanished_templates_count: 0, template_delta_count: 0 }

    const renderMetalog = (acuteDiff: AcuteDiffSummary) => {
        render(
            <InsightPanel
                engineId={null}
                status={status}
                reports={[report]}
                latestWindow={windowWith(acuteDiff)}
                loading={false}
                error={null}
            />,
        )
        fireEvent.click(screen.getByRole('tab', { name: /MetaLog/ }))
    }

    it('renders an incomparable branching property with its reason, never a branching count', () => {
        renderMetalog({ ...counts, field_histogram_delta_count: 0, incomparable_signals: { branching_delta: 'absent_in_one_input' } })

        expect(screen.getByText('Branching: not comparable (absent from one of the two windows)')).toBeInTheDocument()
        expect(screen.queryByText(/branching delta/i)).not.toBeInTheDocument()
    })

    it('control: a compared branching count renders the chip as before', () => {
        renderMetalog({ ...counts, branching_delta_count: 2, field_histogram_delta_count: 0 })

        expect(screen.getByText('2 branching deltas')).toBeInTheDocument()
        expect(screen.queryByText(/not comparable/)).not.toBeInTheDocument()
    })
})
