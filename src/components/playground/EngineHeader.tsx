import { Activity, Clock, Gauge, AlertTriangle } from 'lucide-react'
import type { EngineSnapshot } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    snapshot: EngineSnapshot | null
    engineId: string
}

export default function EngineHeader({ snapshot, engineId }: Props) {
    const t = useTranslation()
    const state = snapshot?.state ?? 'idle'
    const stateColor =
        state === 'running'
            ? 'text-emerald-400'
            : state === 'stopped'
                ? 'text-red-400'
                : 'text-gray-400'

    return (
        <div className="flex flex-wrap items-center gap-6">
            <div>
                <div className="flex items-center gap-2">
                    <h2 className="font-display text-xl font-bold text-gray-100">
                        {snapshot?.scenario_name || engineId}
                    </h2>
                    <span
                        className={`text-xs font-medium uppercase px-2 py-0.5 rounded-full border ${stateColor} border-current/30`}
                    >
                        {state}
                    </span>
                </div>
                <span className="text-xs text-gray-500">ID: {engineId}</span>
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
                    label={t.lab.elapsed}
                    value={formatDuration(snapshot?.elapsed_seconds ?? 0)}
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
