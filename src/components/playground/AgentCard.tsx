import { useState } from 'react'
import { Activity, AlertTriangle, Zap } from 'lucide-react'
import type { AgentSnapshot, HealthState } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'
import Tooltip from '@/components/Tooltip'

interface Props {
    agent: AgentSnapshot
    /**
     * When the engine is running and the parent wires in a command
     * sender, each card exposes a live-tuning panel. Omit the callbacks
     * to render the card in read-only mode (e.g. before Start).
     */
    onSetRate?: (name: string, rps: number) => void
    onSetErrorRate?: (name: string, rate: number) => void
    onBurst?: (name: string, count: number) => void
}

const healthStyles: Record<HealthState, { bg: string; text: string; border: string }> = {
    Healthy: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    Degraded: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    Failing: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
    Recovering: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
}

export default function AgentCard({ agent, onSetRate, onSetErrorRate, onBurst }: Props) {
    const t = useTranslation()
    const style = healthStyles[agent.health] ?? healthStyles.Healthy
    const hasLiveControls = Boolean(onSetRate || onSetErrorRate || onBurst)

    // Live-control inputs are uncontrolled against the snapshot so the
    // slider doesn't jerk back every 200ms when a new snapshot arrives;
    // we seed them from the snapshot on first mount and leave editing
    // to the user thereafter.
    const [rateInput, setRateInput] = useState(agent.rate_rps)
    const [errorInput, setErrorInput] = useState(Math.round(agent.error_ratio * 100))
    const [burstInput, setBurstInput] = useState(100)

    return (
        <div
            className={`bg-gray-900 border rounded-xl p-4 transition-all ${style.border}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Activity className={`w-4 h-4 ${style.text}`} />
                    <span className="font-medium text-gray-100">{agent.name}</span>
                    <span className="text-xs text-gray-500">{agent.type}</span>
                </div>
                <span
                    className={`text-xs font-medium uppercase px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}
                >
                    {agent.health}
                </span>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
                <MetricCell label="Rate" value={`${agent.rate_rps.toFixed(1)}`} unit="rps" />
                <MetricCell
                    label="Errors"
                    value={`${(agent.error_ratio * 100).toFixed(1)}`}
                    unit="%"
                    warn={agent.error_ratio > 0.05}
                />
                <MetricCell label="p95" value={`${agent.p95_latency.toFixed(1)}`} unit="ms" />
            </div>

            {/* Latency bar */}
            <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500">
                <span>p50: {agent.p50_latency.toFixed(1)}ms</span>
                <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full ${style.bg.replace('/10', '/40')}`}
                        style={{ width: `${Math.min((agent.p95_latency / (agent.p99_latency || 1)) * 100, 100)}%` }}
                    />
                </div>
                <span>p99: {agent.p99_latency.toFixed(1)}ms</span>
            </div>

            {/* Status badges */}
            {(agent.incident_active || agent.cascade_active || agent.phase) && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                    {agent.phase && (
                        <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                            {agent.phase}
                        </span>
                    )}
                    {agent.incident_active && (
                        <span className="text-[10px] bg-red-900/50 text-red-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Incident
                        </span>
                    )}
                    {agent.cascade_active && (
                        <span className="text-[10px] bg-amber-900/50 text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Cascade
                        </span>
                    )}
                </div>
            )}

            {hasLiveControls && (
                <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
                    {onSetRate && (
                        <Tooltip content={t.lab.rateTip} placement="top">
                            <div className="flex items-center gap-2 w-full">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider w-10">
                                    {t.lab.rate}
                                </span>
                                <input
                                    type="range"
                                    min={0}
                                    max={500}
                                    step={1}
                                    value={rateInput}
                                    onChange={(e) => setRateInput(Number(e.target.value))}
                                    onMouseUp={() => onSetRate(agent.name, rateInput)}
                                    onTouchEnd={() => onSetRate(agent.name, rateInput)}
                                    className="flex-1 accent-brand-500"
                                />
                                <span className="text-[10px] font-mono text-gray-300 w-14 text-right">
                                    {rateInput.toFixed(0)} rps
                                </span>
                            </div>
                        </Tooltip>
                    )}
                    {onSetErrorRate && (
                        <Tooltip content={t.lab.errorsTip} placement="top">
                            <div className="flex items-center gap-2 w-full">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider w-10">
                                    Err
                                </span>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={errorInput}
                                    onChange={(e) => setErrorInput(Number(e.target.value))}
                                    onMouseUp={() => onSetErrorRate(agent.name, errorInput / 100)}
                                    onTouchEnd={() => onSetErrorRate(agent.name, errorInput / 100)}
                                    className="flex-1 accent-amber-500"
                                />
                                <span className="text-[10px] font-mono text-gray-300 w-14 text-right">
                                    {errorInput}%
                                </span>
                            </div>
                        </Tooltip>
                    )}
                    {onBurst && (
                        <Tooltip content={t.lab.burstTip} placement="top">
                            <div className="flex items-center gap-2 w-full">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider w-10">
                                    {t.lab.burst}
                                </span>
                                <input
                                    type="number"
                                    min={1}
                                    max={100000}
                                    value={burstInput}
                                    onChange={(e) => setBurstInput(Number(e.target.value))}
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 outline-none"
                                />
                                <button
                                    onClick={() => onBurst(agent.name, burstInput)}
                                    className="px-2 py-1 bg-purple-700 hover:bg-purple-600 text-white text-xs font-medium rounded transition-colors"
                                >
                                    {t.lab.send}
                                </button>
                            </div>
                        </Tooltip>
                    )}
                </div>
            )}
        </div>
    )
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
                <span className="text-gray-500 text-[10px] ml-0.5">{unit}</span>
            </div>
        </div>
    )
}
