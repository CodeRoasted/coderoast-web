import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import EngineTimeline from '@/components/playground/EngineTimeline'
import type { EngineSnapshot } from '@/types/engine'

const snapshot: EngineSnapshot = {
    scenario_name: 'deterministic-demo',
    seed: 42,
    has_seed: true,
    engine_mode: 'deterministic',
    replay_mode: false,
    has_cascade: false,
    clock_mode: 'virtual',
    playback_state: 'paused',
    speed_multiplier: 1,
    elapsed_seconds: 25,
    wall_elapsed_seconds: 10,
    simulation_elapsed_seconds: 25,
    remaining_seconds: 35,
    simulation_now_unix_ns: 25_000_000_000,
    state: 'running',
    queue_backlog: 0,
    throughput_rps: 0,
    error_ratio: 0,
    total_entries: 0,
    agents: [],
    sinks: [],
    incidents: [
        { offset_seconds: 30, name: 'db-latency', event: 'start', details: 'latency spike' },
    ],
    tail: [],
}

describe('EngineTimeline', () => {
    it('renders elapsed, duration, remaining time, and incident markers', () => {
        const { container } = render(<EngineTimeline snapshot={snapshot} />)

        expect(screen.getByText('Sim elapsed')).toBeInTheDocument()
        expect(screen.getByText('0:25')).toBeInTheDocument()
        expect(screen.getByText('Duration')).toBeInTheDocument()
        expect(screen.getByText('1:00')).toBeInTheDocument()
        expect(screen.getByText('Remaining')).toBeInTheDocument()
        expect(screen.getByText('0:35')).toBeInTheDocument()
        expect(container.querySelector('[title="db-latency @ 0:30"]')).not.toBeNull()
    })
})
