import { AlertTriangle, Zap } from 'lucide-react'
import type { AgentSnapshot } from '@/types/engine'
import MetricCell from './MetricCell'
import { healthStyle } from './healthStyles'

interface Props {
    agent: AgentSnapshot
}

/**
 * Read-only metrics block: rate / errors / p95, the p50→p99 latency bar,
 * and the live status badges (phase / incident / cascade). Pure render.
 */
export default function AgentMetrics({ agent }: Props) {
    const style = healthStyle(agent.health)
    return (
        <>
            <div className="grid grid-cols-3 gap-3 text-center">
                <MetricCell label="Rate" value={agent.rate_rps.toFixed(1)} unit="rps" />
                <MetricCell
                    label="Errors"
                    value={(agent.error_ratio * 100).toFixed(1)}
                    unit="%"
                    warn={agent.error_ratio > 0.05}
                />
                <MetricCell label="p95" value={agent.p95_latency.toFixed(1)} unit="ms" />
            </div>

            <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500">
                <span>p50: {agent.p50_latency.toFixed(1)}ms</span>
                <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full ${style.bg.replace('/10', '/40')}`}
                        style={{
                            width: `${Math.min(
                                (agent.p95_latency / (agent.p99_latency || 1)) * 100,
                                100,
                            )}%`,
                        }}
                    />
                </div>
                <span>p99: {agent.p99_latency.toFixed(1)}ms</span>
            </div>

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
        </>
    )
}
