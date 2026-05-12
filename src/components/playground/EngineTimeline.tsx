import { useRef, useState } from 'react'
import { Clock, Flag, MousePointerClick, TimerReset } from 'lucide-react'
import type { EngineSnapshot, IncidentSnapshot } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    snapshot: EngineSnapshot | null
    onSeek?: (targetElapsedNs: number) => void
}

export default function EngineTimeline({ snapshot, onSeek }: Props) {
    const t = useTranslation()
    const barRef = useRef<HTMLDivElement>(null)
    const [hoverFraction, setHoverFraction] = useState<number | null>(null)
    const isDeterministic = snapshot?.engine_mode === 'deterministic'
    const isPaused = snapshot?.playback_state === 'paused'
    const elapsedSeconds = isDeterministic
        ? snapshot?.simulation_elapsed_seconds ?? snapshot?.elapsed_seconds ?? 0
        : snapshot?.wall_elapsed_seconds ?? snapshot?.elapsed_seconds ?? 0
    const durationSeconds = Math.max(snapshot?.duration_seconds ?? 0, 0)
    const remainingSeconds = Math.max(snapshot?.remaining_seconds ?? 0, 0)
    const progress = durationSeconds > 0 ? clamp(elapsedSeconds / durationSeconds, 0, 1) : 0
    const incidents = snapshot?.incidents ?? []

    // Seekable in deterministic mode whenever a seek callback and duration are available.
    // The server handles seeking while playing (it jumps virtual time; client shows catch-up badge).
    const canSeek = !!onSeek && isDeterministic && durationSeconds > 0

    function handleBarClick(e: React.MouseEvent<HTMLDivElement>) {
        if (!canSeek || !barRef.current) return
        const rect = barRef.current.getBoundingClientRect()
        const fraction = clamp((e.clientX - rect.left) / rect.width, 0, 1)
        const targetSeconds = fraction * durationSeconds
        const targetNs = Math.round(targetSeconds * 1_000_000_000)
        onSeek!(targetNs)
    }

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!canSeek || !barRef.current) return
        const rect = barRef.current.getBoundingClientRect()
        setHoverFraction(clamp((e.clientX - rect.left) / rect.width, 0, 1))
    }

    function handleMouseLeave() {
        setHoverFraction(null)
    }

    const hoverSeconds = hoverFraction != null ? hoverFraction * durationSeconds : null

    return (
        <div className="mt-3 rounded-lg border border-gray-800 bg-gray-900/55 px-3 py-2.5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                    <TimelineMetric
                        icon={<Clock className="w-3.5 h-3.5 text-blue-400" />}
                        label={isDeterministic ? t.lab.simulationElapsed : t.lab.wallElapsed}
                        value={formatDuration(elapsedSeconds)}
                    />
                    <TimelineMetric
                        icon={<TimerReset className="w-3.5 h-3.5 text-brand-400" />}
                        label={t.lab.duration}
                        value={
                            durationSeconds > 0 ? formatDuration(durationSeconds) : t.lab.openEnded
                        }
                    />
                    {durationSeconds > 0 && (
                        <TimelineMetric
                            icon={<Flag className="w-3.5 h-3.5 text-amber-400" />}
                            label={t.lab.remaining}
                            value={formatDuration(remainingSeconds)}
                        />
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {isDeterministic && durationSeconds > 0 && (
                        <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider transition-colors ${isPaused ? 'text-brand-400' : 'text-gray-500 hover:text-brand-400/70'}`}>
                            <MousePointerClick className="w-3 h-3" />
                            {t.lab.clickToSeek}
                        </span>
                    )}
                    <div className="text-[10px] uppercase tracking-wider text-gray-600">
                        {t.lab.timeline}
                    </div>
                </div>
            </div>

            <div
                ref={barRef}
                role={canSeek ? 'slider' : undefined}
                aria-label={canSeek ? t.lab.seekTimeline : undefined}
                aria-valuemin={canSeek ? 0 : undefined}
                aria-valuemax={canSeek ? durationSeconds : undefined}
                aria-valuenow={canSeek ? Math.round(elapsedSeconds) : undefined}
                tabIndex={canSeek ? 0 : undefined}
                onClick={handleBarClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onKeyDown={canSeek ? (e) => {
                    if (!barRef.current) return
                    const step = durationSeconds * 0.05
                    if (e.key === 'ArrowRight') {
                        e.preventDefault()
                        onSeek!(Math.round(Math.min(elapsedSeconds + step, durationSeconds) * 1_000_000_000))
                    } else if (e.key === 'ArrowLeft') {
                        e.preventDefault()
                        onSeek!(Math.round(Math.max(elapsedSeconds - step, 0) * 1_000_000_000))
                    }
                } : undefined}
                className={[
                    'relative mt-2 h-2.5 rounded-full bg-gray-950 overflow-hidden border border-gray-800',
                    canSeek ? 'cursor-crosshair hover:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-400' : '',
                ].join(' ')}
            >
                {durationSeconds > 0 ? (
                    <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-500 to-orange-400"
                        style={{ width: `${progress * 100}%` }}
                    />
                ) : (
                    <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gray-700/80" />
                )}
                {durationSeconds > 0 &&
                    incidents.map((incident, index) => (
                        <IncidentMarker
                            key={`${incident.offset_seconds}-${incident.name}-${index}`}
                            incident={incident}
                            totalSeconds={durationSeconds}
                        />
                    ))}
                {/* Hover position indicator */}
                {hoverFraction != null && (
                    <>
                        <div
                            className="absolute inset-y-0 w-0.5 bg-white/50 pointer-events-none"
                            style={{ left: `calc(${hoverFraction * 100}% - 1px)` }}
                        />
                        {hoverSeconds != null && (
                            <div
                                className="absolute -top-6 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 border border-gray-700 px-1.5 py-0.5 text-[10px] font-mono text-gray-200 pointer-events-none"
                                style={{ left: `${hoverFraction * 100}%` }}
                            >
                                {formatDuration(hoverSeconds)}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

function TimelineMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="inline-flex items-center gap-1.5 text-gray-300">
            {icon}
            <span className="text-gray-500">{label}</span>
            <span className="font-mono text-gray-100">{value}</span>
        </div>
    )
}

function IncidentMarker({ incident, totalSeconds }: { incident: IncidentSnapshot; totalSeconds: number }) {
    const left = clamp(incident.offset_seconds / totalSeconds, 0, 1) * 100
    const title = `${incident.name || incident.event} @ ${formatDuration(incident.offset_seconds)}`
    return (
        <span
            className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.7)]"
            style={{ left: `${left}%` }}
            title={title}
        />
    )
}

function formatDuration(seconds: number): string {
    const safeSeconds = Math.max(Math.round(seconds), 0)
    const hours = Math.floor(safeSeconds / 3600)
    const minutes = Math.floor((safeSeconds % 3600) / 60)
    const secs = safeSeconds % 60
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}