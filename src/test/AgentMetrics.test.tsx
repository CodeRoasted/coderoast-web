import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AgentMetrics from '@/components/playground/agent/AgentMetrics'
import type { AgentSnapshot } from '@/types/engine'

const baseAgent: AgentSnapshot = {
    name: 'auth',
    type: 'http',
    health: 'Healthy',
    rate_rps: 12.4,
    error_ratio: 0.01,
    p50_latency: 8,
    p95_latency: 24,
    p99_latency: 48,
    incident_active: false,
    cascade_active: false,
    phase: '',
    dependencies: [],
}

/**
 * Pure presentational component — verify that the metric values surface
 * verbatim and that the conditional badges only render when the
 * corresponding flag is set.
 */
describe('AgentMetrics', () => {
    it('renders the rate, error, and p95 metrics', () => {
        render(<AgentMetrics agent={baseAgent} />)
        expect(screen.getByText('12.4')).toBeInTheDocument()
        expect(screen.getByText('1.0')).toBeInTheDocument()
        expect(screen.getByText('24.0')).toBeInTheDocument()
    })

    it('renders no status badges when no flag is set', () => {
        render(<AgentMetrics agent={baseAgent} />)
        expect(screen.queryByText('Incident')).not.toBeInTheDocument()
        expect(screen.queryByText('Cascade')).not.toBeInTheDocument()
    })

    it('shows the Incident badge when an incident is active', () => {
        render(<AgentMetrics agent={{ ...baseAgent, incident_active: true }} />)
        expect(screen.getByText('Incident')).toBeInTheDocument()
    })

    it('shows the Cascade badge when a cascade is active', () => {
        render(<AgentMetrics agent={{ ...baseAgent, cascade_active: true }} />)
        expect(screen.getByText('Cascade')).toBeInTheDocument()
    })

    it('shows the phase badge when set', () => {
        render(<AgentMetrics agent={{ ...baseAgent, phase: 'spike' }} />)
        expect(screen.getByText('spike')).toBeInTheDocument()
    })

    it('warns on the error metric when ratio exceeds 5%', () => {
        const { container } = render(
            <AgentMetrics agent={{ ...baseAgent, error_ratio: 0.12 }} />,
        )
        const warned = container.querySelector('.text-amber-400')
        expect(warned).not.toBeNull()
    })
})
