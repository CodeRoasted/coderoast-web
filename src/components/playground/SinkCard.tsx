import { Cloud, HardDrive, Monitor, AlertCircle } from 'lucide-react'
import type { SinkSnapshot } from '@/types/engine'

interface Props {
    sink: SinkSnapshot
}

export default function SinkCard({ sink }: Props) {
    const hasErrors = sink.error_count > 0
    const isHttp = sink.type === 'http'

    return (
        <div
            className={`bg-gray-900 border rounded-xl p-4 transition-all ${hasErrors ? 'border-red-500/30' : 'border-gray-700/50'}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <SinkIcon type={sink.type} hasErrors={hasErrors} />
                    <span className="font-medium text-gray-100 text-sm">{sink.name}</span>
                    <span className="text-xs text-gray-500">{sink.type}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono bg-gray-800 px-2 py-0.5 rounded">
                    {sink.format}
                </span>
            </div>

            {/* Target URL */}
            {sink.target && (
                <div
                    className="text-[10px] text-gray-600 font-mono truncate mb-3"
                    title={sink.target}
                >
                    {sink.target}
                </div>
            )}

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
                <MetricCell label="Rate" value={sink.write_rps.toFixed(1)} unit="rps" />
                <MetricCell label="Written" value={formatCount(sink.total_written)} unit="" />
                <MetricCell
                    label="Backlog"
                    value={String(sink.backlog)}
                    unit=""
                    warn={sink.backlog > 50}
                />
            </div>

            {/* Error / HTTP status badges */}
            {(hasErrors || (isHttp && sink.last_http_status > 0)) && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                    {hasErrors && (
                        <span className="flex items-center gap-1 text-[10px] text-red-400 bg-red-900/30 px-2 py-0.5 rounded-full">
                            <AlertCircle className="w-3 h-3" />
                            {sink.error_count} err
                        </span>
                    )}
                    {isHttp && sink.last_http_status > 0 && (
                        <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${sink.last_http_status < 400
                                    ? 'bg-emerald-900/30 text-emerald-400'
                                    : 'bg-red-900/30 text-red-400'
                                }`}
                        >
                            HTTP {sink.last_http_status}
                        </span>
                    )}
                </div>
            )}

            {/* Last error message */}
            {sink.last_error && (
                <div
                    className="mt-1 text-[10px] text-red-400/70 truncate"
                    title={sink.last_error}
                >
                    {sink.last_error}
                </div>
            )}
        </div>
    )
}

function SinkIcon({ type, hasErrors }: { type: string; hasErrors: boolean }) {
    const color = hasErrors ? 'text-red-400' : 'text-brand-400'
    if (type === 'file') return <HardDrive className={`w-4 h-4 ${color}`} />
    if (type === 'console') return <Monitor className={`w-4 h-4 ${color}`} />
    return <Cloud className={`w-4 h-4 ${color}`} />
}

function MetricCell({
    label,
    value,
    unit,
    warn,
}: {
    label: string
    value: string
    unit: string
    warn?: boolean
}) {
    return (
        <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</div>
            <div className={`text-sm font-mono ${warn ? 'text-amber-400' : 'text-gray-200'}`}>
                {value}
                {unit && <span className="text-gray-500 text-[10px] ml-0.5">{unit}</span>}
            </div>
        </div>
    )
}

function formatCount(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return String(n)
}
