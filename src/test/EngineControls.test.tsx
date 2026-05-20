import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import EngineControls from '@/components/playground/EngineControls'
import { useAuthStore } from '@/store/useAuthStore'
import type { EngineSnapshot } from '@/types/engine'

const snapshot: EngineSnapshot = {
    scenario_name: 'demo',
    seed: 1,
    has_seed: true,
    engine_mode: 'deterministic',
    replay_mode: false,
    has_cascade: false,
    clock_mode: 'virtual',
    playback_state: 'paused',
    speed_multiplier: 1,
    duration_seconds: 60,
    elapsed_seconds: 12.5,
    wall_elapsed_seconds: 12.5,
    simulation_elapsed_seconds: 12.5,
    remaining_seconds: 47.5,
    simulation_now_unix_ns: 12_500_000_000,
    state: 'running',
    queue_backlog: 0,
    throughput_rps: 0,
    error_ratio: 0,
    total_entries: 0,
    agents: [],
    sinks: [],
    incidents: [],
    tail: [],
}

describe('EngineControls', () => {
    it('sends play-to-target in elapsed nanoseconds', () => {
        useAuthStore.setState({
            operations: ['engine.start', 'engine.stop', 'engine.playback.play', 'engine.playback.pause', 'engine.speed.set', 'engine.advance', 'engine.cascade.trigger'],
            loading: false,
        })
        const onPlayToTarget = vi.fn()

        render(
            <EngineControls
                snapshot={snapshot}
                hasEngine
                onStart={vi.fn()}
                onStop={vi.fn()}
                onPlayToTarget={onPlayToTarget}
            />,
        )

        const targetInput = screen.getByLabelText('Target seconds')
        expect(targetInput).toHaveValue('12.5')
        expect(targetInput).toHaveAttribute('type', 'text')

        fireEvent.change(targetInput, { target: { value: '7.25' } })
        fireEvent.click(screen.getByRole('button', { name: 'Play to target' }))

        expect(onPlayToTarget).toHaveBeenCalledWith(7_250_000_000)
    })

    it('hides play-to-target editing until playback is paused', () => {
        useAuthStore.setState({
            operations: ['engine.start', 'engine.stop', 'engine.playback.play', 'engine.playback.pause', 'engine.speed.set', 'engine.advance', 'engine.cascade.trigger'],
            loading: false,
        })

        render(
            <EngineControls
                snapshot={{ ...snapshot, playback_state: 'playing' }}
                hasEngine
                onStart={vi.fn()}
                onStop={vi.fn()}
                onPlayToTarget={vi.fn()}
            />,
        )

        expect(screen.queryByLabelText('Target seconds')).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Play to target' })).not.toBeInTheDocument()
    })

    it('shows play-to-target progress while the command is pending', () => {
        useAuthStore.setState({
            operations: ['engine.start', 'engine.stop', 'engine.playback.play', 'engine.playback.pause', 'engine.speed.set', 'engine.advance', 'engine.cascade.trigger'],
            loading: false,
        })

        render(
            <EngineControls
                snapshot={snapshot}
                hasEngine
                onStart={vi.fn()}
                onStop={vi.fn()}
                onPlayToTarget={vi.fn()}
                playToTargetPending
            />,
        )

        expect(screen.getByText('Replaying')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Play to target' })).toBeDisabled()
        expect(screen.getByLabelText('Target seconds')).toBeDisabled()
    })
})