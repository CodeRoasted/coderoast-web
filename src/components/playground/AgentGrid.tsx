import { useMemo } from 'react'
import type { AgentSnapshot, HealthState } from '@/types/engine'
import AgentCard from './AgentCard'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    agents: AgentSnapshot[]
    onSetRate?: (name: string, rps: number) => void
    onSetErrorRate?: (name: string, rate: number) => void
    onBurst?: (name: string, count: number) => void
}

// Worst-first ordering so the eye lands on the failing service before
// the healthy ones — mirrors how an on-call would scan a dashboard.
const HEALTH_PRIORITY: Record<HealthState, number> = {
    Failing: 0,
    Degraded: 1,
    Recovering: 2,
    Healthy: 3,
}

export default function AgentGrid({ agents, onSetRate, onSetErrorRate, onBurst }: Props) {
    const t = useTranslation()

    const sorted = useMemo(() => {
        return [...agents].sort((a, b) => {
            const pa = HEALTH_PRIORITY[a.health] ?? 99
            const pb = HEALTH_PRIORITY[b.health] ?? 99
            if (pa !== pb) return pa - pb
            // Tie-break on error ratio (descending) then name for stability.
            if (a.error_ratio !== b.error_ratio) return b.error_ratio - a.error_ratio
            return a.name.localeCompare(b.name)
        })
    }, [agents])

    if (sorted.length === 0) {
        return (
            <div className="bg-gray-900 border border-gray-700/50 rounded-xl p-8 text-center text-gray-500">
                {t.lab.noAgents}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sorted.map((agent) => (
                <AgentCard
                    key={agent.name}
                    agent={agent}
                    onSetRate={onSetRate}
                    onSetErrorRate={onSetErrorRate}
                    onBurst={onBurst}
                />
            ))}
        </div>
    )
}
