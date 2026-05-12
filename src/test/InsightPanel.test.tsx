import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import InsightPanel from '@/components/playground/InsightPanel'
import type { InsightReport, InsightStatus } from '@/types/engine'

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
