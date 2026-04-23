import { useState } from 'react'
import { Play, Square, Zap, Lock } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import Tooltip from '@/components/Tooltip'
import SeedConfirmModal from './SeedConfirmModal'
import { useAuthStore } from '@/store/useAuthStore'
import { hasPermission, requiredTierName } from '@/utils/permissions'

interface Props {
    isRunning: boolean
    hasEngine: boolean
    onStart: () => void
    onStop: () => void
    onCascade?: () => void
    isSeeded?: boolean
    seedBroken?: boolean
    onSeedBreachConfirm?: () => void
}

export default function EngineControls({
    isRunning,
    hasEngine,
    onStart,
    onStop,
    onCascade,
    isSeeded = false,
    seedBroken = false,
    onSeedBreachConfirm,
}: Props) {
    const t = useTranslation()
    const tier = useAuthStore((s) => s.tier)
    const canStart = hasPermission(tier, 'command.start_engine')
    const canStop = hasPermission(tier, 'command.stop_engine')
    const canCascade = hasPermission(tier, 'command.evaluate_cascade')
    const [seedPending, setSeedPending] = useState<(() => void) | null>(null)

    if (!hasEngine) return null

    const handleCascade = () => {
        if (!onCascade || !canCascade) return
        if (isSeeded && !seedBroken) {
            setSeedPending(() => onCascade)
            return
        }
        onCascade()
    }

    const tierLockMsg = (key: string) =>
        t.lab.lockedTierRequired.replace('{tier}', requiredTierName(key))

    return (
        <>
            <SeedConfirmModal
                open={seedPending !== null}
                actionLabel={t.lab.seedActionCascade}
                onConfirm={() => {
                    onSeedBreachConfirm?.()
                    seedPending?.()
                    setSeedPending(null)
                }}
                onCancel={() => setSeedPending(null)}
            />
            <div className="flex items-center gap-3 flex-wrap">
                {!isRunning ? (
                    <Tooltip content={canStart ? t.lab.start : tierLockMsg('command.start_engine')}>
                        <button
                            onClick={onStart}
                            disabled={!canStart}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-emerald-600"
                        >
                            {canStart ? <Play className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            {t.lab.start}
                        </button>
                    </Tooltip>
                ) : (
                    <Tooltip content={canStop ? t.lab.stop : tierLockMsg('command.stop_engine')}>
                        <button
                            onClick={onStop}
                            disabled={!canStop}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-600"
                        >
                            {canStop ? <Square className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            {t.lab.stop}
                        </button>
                    </Tooltip>
                )}
                {isRunning && onCascade && (
                    <Tooltip
                        content={canCascade ? t.lab.cascadeTip : tierLockMsg('command.evaluate_cascade')}
                    >
                        <button
                            onClick={handleCascade}
                            disabled={!canCascade}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-purple-700"
                        >
                            {canCascade ? <Zap className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            {t.lab.cascade}
                        </button>
                    </Tooltip>
                )}
            </div>
        </>
    )
}
