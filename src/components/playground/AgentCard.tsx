import { Activity } from 'lucide-react'
import type { AgentSnapshot } from '@/types/engine'
import AgentMetrics from './agent/AgentMetrics'
import AgentControls from './agent/AgentControls'
import { healthStyle } from './agent/healthStyles'

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

/**
 * Agent card for the live dashboard. In real mode the parent wires live
 * mutation handlers; in deterministic mode those handlers are omitted and
 * the card becomes read-only.
 */
export default function AgentCard({
    agent,
    onSetRate,
    onSetErrorRate,
    onBurst,
}: Props) {
    const style = healthStyle(agent.health)
    const hasLiveControls = Boolean(onSetRate || onSetErrorRate || onBurst)

    return (
        <div className={`bg-gray-900 border rounded-xl p-4 transition-all ${style.border}`}>
            <div className="flex items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <Activity className={`w-4 h-4 shrink-0 ${style.text}`} />
                    <span className="font-medium text-gray-100 truncate">{agent.name}</span>
                    <span className="text-xs text-gray-500 truncate">{agent.type}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <span
                        className={`text-xs font-medium uppercase px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}
                    >
                        {agent.health}
                    </span>
                </div>
            </div>

            <AgentMetrics agent={agent} />

            {hasLiveControls && (
                <AgentControls
                    agent={agent}
                    onSetRate={onSetRate}
                    onSetErrorRate={onSetErrorRate}
                    onBurst={onBurst}
                />
            )}
        </div>
    )
}
