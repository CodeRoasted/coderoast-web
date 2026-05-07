import { useState } from 'react'
import { Activity, Clock, Gauge, AlertTriangle, Copy, Check } from 'lucide-react'
import type { EngineSnapshot } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    snapshot: EngineSnapshot | null
    engineId: string
}

function shortId(id: string): string {
    // Show only the leading segment of a UUID — enough to identify the
    // engine in logs without flashing a 36-char string in the header.
    if (id.length <= 8) return id
    return `${id.slice(0, 8)}…`
}

export default function EngineHeader({ snapshot, engineId }: Props) {
    const t = useTranslation()
    const state = snapshot?.state ?? 'idle'
    const engineMode = snapshot?.engine_mode ?? 'real'
    const clockMode = snapshot?.clock_mode ?? 'real'
    const playbackState = snapshot?.playback_state ?? 'stopped'
    const isDeterministic = engineMode === 'deterministic'
    const elapsedSeconds = isDeterministic
        ? snapshot?.simulation_elapsed_seconds ?? snapshot?.elapsed_seconds ?? 0
        : snapshot?.wall_elapsed_seconds ?? snapshot?.elapsed_seconds ?? 0
    const stateColor =
        state === 'running'
            ? 'text-emerald-400'
            : state === 'stopped'
                ? 'text-red-400'
                : 'text-gray-400'

    const [copied, setCopied] = useState(false)
    const handleCopyId = () => {
        navigator.clipboard.writeText(engineId).catch(() => undefined)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    const friendlyName = snapshot?.scenario_name || t.lab.engineLabel

    return (
        <div className="flex flex-wrap items-center gap-6">
            <div>
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-bold text-gray-100">
                        {friendlyName}
                    </h2>
                    <span
                        className={`text-xs font-medium uppercase px-2 py-0.5 rounded-full border ${stateColor} border-current/30`}
                    >
                        {state}
                    </span>
                    <MetaBadge label={t.lab.mode} value={humanize(engineMode)} />
                    <MetaBadge label={t.lab.clock} value={humanize(clockMode)} />
                    {isDeterministic && (
                        <>
                            <MetaBadge label={t.lab.playback} value={humanize(playbackState)} />
                            <MetaBadge
                                label={t.lab.speed}
                                value={`${(snapshot?.speed_multiplier ?? 1).toFixed(1)}x`}
                            />
                        </>
                    )}
                </div>
                <button
                    onClick={handleCopyId}
                    className="mt-0.5 flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-300 transition-colors font-mono"
                    title={engineId}
                >
                    <span>{t.lab.engineLabel} · {shortId(engineId)}</span>
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
            </div>
            <div className="flex items-center gap-5 text-sm">
                <Stat
                    icon={<Gauge className="w-4 h-4 text-brand-400" />}
                    label={t.lab.throughput}
                    value={`${(snapshot?.throughput_rps ?? 0).toFixed(1)} rps`}
                />
                <Stat
                    icon={<AlertTriangle className="w-4 h-4 text-amber-400" />}
                    label={t.lab.errorRate}
                    value={`${((snapshot?.error_ratio ?? 0) * 100).toFixed(2)}%`}
                />
                <Stat
                    icon={<Clock className="w-4 h-4 text-blue-400" />}
                    label={isDeterministic ? t.lab.simulationElapsed : t.lab.wallElapsed}
                    value={formatDuration(elapsedSeconds)}
                />
                <Stat
                    icon={<Activity className="w-4 h-4 text-purple-400" />}
                    label={t.lab.agents}
                    value={String(snapshot?.agents?.length ?? 0)}
                />
            </div>
        </div>
    )
}

function MetaBadge({ label, value }: { label: string; value: string }) {
    return (
        <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border border-gray-700 bg-gray-900 text-gray-300">
            {label}: {value}
        </span>
    )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-1.5">
            {icon}
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</span>
                <span className="text-sm font-mono text-gray-200">{value}</span>
            </div>
        </div>
    )
}

function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
}

function humanize(value: string): string {
    if (!value) return 'Unknown'
    return value.replace(/_/g, ' ')
}
