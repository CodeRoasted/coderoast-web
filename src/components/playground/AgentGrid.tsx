import { useMemo } from 'react'
import type { AgentSnapshot } from '@/types/engine'
import AgentCard from './AgentCard'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    agents: AgentSnapshot[]
    onSetRate?: (name: string, rps: number) => void
    onSetErrorRate?: (name: string, rate: number) => void
    onBurst?: (name: string, count: number) => void
    isSeeded?: boolean
    seedBroken?: boolean
    onSeedBreachConfirm?: () => void
    runKey?: number
}

export default function AgentGrid({ agents, onSetRate, onSetErrorRate, onBurst, isSeeded, seedBroken, onSeedBreachConfirm, runKey }: Props) {
    const t = useTranslation()

    // Alphabetical by name — stable across the whole run because names never change.
    const sorted = useMemo(
        () => [...agents].sort((a, b) => a.name.localeCompare(b.name)),
        [agents],
    )

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
                    key={`${agent.name}-${runKey ?? 0}`}
                    agent={agent}
                    onSetRate={onSetRate}
                    onSetErrorRate={onSetErrorRate}
                    onBurst={onBurst}
                    isSeeded={isSeeded}
                    seedBroken={seedBroken}
                    onSeedBreachConfirm={onSeedBreachConfirm}
                />
            ))}
        </div>
    )
}
