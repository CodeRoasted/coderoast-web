import { useState } from 'react'
import { Activity, Lock, Unlock } from 'lucide-react'
import type { AgentSnapshot } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'
import Tooltip from '@/components/Tooltip'
import SeedConfirmModal from './SeedConfirmModal'
import { useAuthStore } from '@/store/useAuthStore'
import { hasPermission, requiredTierName } from '@/utils/permissions'
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
    /** True when the parent scenario has a `seed`. Triggers the determinism
     *  warning before the user can take ownership of an agent. */
    isSeeded?: boolean
    /** True once any seed-breaking action has been confirmed. Suppresses re-confirmation. */
    seedBroken?: boolean
    /** Lift the seed-breach event to the parent so all cards/controls stop re-confirming. */
    onSeedBreachConfirm?: () => void
}

/**
 * Locked-by-default ownership model.
 *
 * The backend has no "restore to scenario" command — once you push a
 * rate/error override, the agent stops following its phases until the
 * engine is reloaded. So instead of an always-editable slider with a fake
 * reset button, we ask the operator to explicitly take ownership of the
 * agent before tweaking anything. Burst stays available because it
 * doesn't break scenario tracking (it just emits N records on top).
 */
export default function AgentCard({
    agent,
    onSetRate,
    onSetErrorRate,
    onBurst,
    isSeeded = false,
    seedBroken = false,
    onSeedBreachConfirm,
}: Props) {
    const t = useTranslation()
    const style = healthStyle(agent.health)
    const hasLiveControls = Boolean(onSetRate || onSetErrorRate || onBurst)

    const tier = useAuthStore((s) => s.tier)
    const canSetRate = hasPermission(tier, 'command.set_agent_rate')
    const canSetErrorRate = hasPermission(tier, 'command.set_agent_error_rate')
    const canOverride = canSetRate || canSetErrorRate

    const [unlocked, setUnlocked] = useState(false)
    const [seedPending, setSeedPending] = useState<{ label: string; fn: () => void } | null>(null)

    const requireSeedConfirm = (label: string, fn: () => void) => {
        if (!isSeeded || seedBroken) {
            fn()
            return
        }
        setSeedPending({ label, fn })
    }

    const handleUnlock = () => {
        if (unlocked) {
            setUnlocked(false)
            return
        }
        if (!canOverride) return
        requireSeedConfirm(t.lab.seedActionUnlock, () => setUnlocked(true))
    }

    const lockTooltip = !canOverride
        ? t.lab.lockedTierRequired.replace('{tier}', requiredTierName('command.set_agent_rate'))
        : unlocked
            ? t.lab.unlockedTip
            : t.lab.lockedTip

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
                    {hasLiveControls && (
                        <Tooltip content={lockTooltip} placement="top">
                            <button
                                onClick={handleUnlock}
                                disabled={!canOverride}
                                className={`p-1 rounded transition-colors ${!canOverride
                                    ? 'text-gray-600 cursor-not-allowed'
                                    : unlocked
                                        ? 'text-amber-400 hover:bg-amber-500/10'
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                                    }`}
                                aria-label={unlocked ? t.lab.lock : t.lab.unlock}
                            >
                                {unlocked ? (
                                    <Unlock className="w-3.5 h-3.5" />
                                ) : (
                                    <Lock className="w-3.5 h-3.5" />
                                )}
                            </button>
                        </Tooltip>
                    )}
                </div>
            </div>

            <AgentMetrics agent={agent} />

            {hasLiveControls && (
                <AgentControls
                    agent={agent}
                    unlocked={unlocked}
                    onSetRate={onSetRate}
                    onSetErrorRate={onSetErrorRate}
                    onBurst={onBurst}
                    requireSeedConfirm={requireSeedConfirm}
                    isSeeded={isSeeded}
                />
            )}

            <SeedConfirmModal
                open={seedPending !== null}
                actionLabel={seedPending?.label ?? ''}
                onConfirm={() => {
                    onSeedBreachConfirm?.()
                    seedPending?.fn()
                    setSeedPending(null)
                }}
                onCancel={() => setSeedPending(null)}
            />
        </div>
    )
}
