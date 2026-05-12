import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ObservationPanel from '@/components/playground/ObservationPanel'

const baseProps = {
    engineId: 'engine-1',
    snapshot: null,
    liveTail: [],
    clearLiveTail: vi.fn(),
    agentNames: [],
    insightStatus: null,
    insightReports: [],
    insightLoading: false,
    insightError: null,
}

describe('ObservationPanel', () => {
    it('hides InSight views in LogCraft Playground mode', () => {
        render(<ObservationPanel {...baseProps} showInsight={false} />)

        expect(screen.queryByRole('tab', { name: /Insights/i })).not.toBeInTheDocument()
        expect(screen.getByRole('tab', { name: /Log Tail/i })).toHaveAttribute('aria-selected', 'true')
    })
})
