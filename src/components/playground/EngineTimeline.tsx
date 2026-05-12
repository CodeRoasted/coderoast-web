import { Clock, Flag, TimerReset } from 'lucide-react'
import type { EngineSnapshot, IncidentSnapshot } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    snapshot: EngineSnapshot | null
}

export default function EngineTimeline({ snapshot }: Props) {
    const t = useTranslation()
    const isDeterministic = snapshot?.engine_mode === 'deterministic'
    const elapsedSeconds = isDeterministic
        ? snapshot?.simulation_elapsed_seconds ?? snapshot?.elapsed_seconds ?? 0
        : snapshot?.wall_elapsed_seconds ?? snapshot?.elapsed_seconds ?? 0
    const remainingSeconds = Math.max(snapshot?.remaining_seconds ?? 0, 0)
    const totalSeconds = remainingSeconds > 0 ? elapsedSeconds + remainingSeconds : 0
    const progress = totalSeconds > 0 ? clamp(elapsedSeconds / totalSeconds, 0, 1) : 0
    const incidents = snapshot?.incidents ?? []

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
                        value={totalSeconds > 0 ? formatDuration(totalSeconds) : t.lab.openEnded}
                    />
                    {totalSeconds > 0 && (
                        <TimelineMetric
                            icon={<Flag className="w-3.5 h-3.5 text-amber-400" />}
                            label={t.lab.remaining}
                            value={formatDuration(remainingSeconds)}
                        />
                    )}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-gray-500">
                    {t.lab.timeline}
                </div>
            </div>

            <div className="relative mt-2 h-2 rounded-full bg-gray-950 overflow-hidden border border-gray-800">
                {totalSeconds > 0 ? (
                    <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-500 to-orange-400"
                        style={{ width: `${progress * 100}%` }}
                    />
                ) : (
                    <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gray-700/80" />
                )}
                {totalSeconds > 0 && incidents.map((incident, index) => (
                    <IncidentMarker
                        key={`${incident.offset_seconds}-${incident.name}-${index}`}
                        incident={incident}
                        totalSeconds={totalSeconds}
                    />
                ))}
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
    const safeSeconds = Math.max(seconds, 0)
    const hours = Math.floor(safeSeconds / 3600)
    const minutes = Math.floor((safeSeconds % 3600) / 60)
    const secs = Math.floor(safeSeconds % 60)
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}