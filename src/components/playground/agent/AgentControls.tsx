import { useEffect, useRef, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { AgentSnapshot } from '@/types/engine'
import Tooltip from '@/components/Tooltip'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStore } from '@/store/useAuthStore'
import { hasPermission, requiredTierName } from '@/utils/permissions'

interface Props {
    agent: AgentSnapshot
    /** True after the user explicitly took ownership of the agent. */
    unlocked: boolean
    /** Optional command senders. Omitting a sender hides its row. */
    onSetRate?: (name: string, rps: number) => void
    onSetErrorRate?: (name: string, rate: number) => void
    onBurst?: (name: string, count: number) => void
    /** Wraps any seed-breaking action in a confirmation gate. */
    requireSeedConfirm: (label: string, fn: () => void) => void
    /** True when a seed warning should show above the controls. */
    isSeeded: boolean
}

/**
 * Live-tuning panel: rate / error / burst sliders + send button.
 * Encapsulates per-control tier gating, seed-confirmation wiring, and the
 * "freeze slider when unlocked" behavior so the parent only needs to track
 * the unlock toggle.
 */
export default function AgentControls({
    agent,
    unlocked,
    onSetRate,
    onSetErrorRate,
    onBurst,
    requireSeedConfirm,
    isSeeded,
}: Props) {
    const t = useTranslation()
    const tier = useAuthStore((s) => s.tier)
    const canSetRate = hasPermission(tier, 'command.set_agent_rate')
    const canSetErrorRate = hasPermission(tier, 'command.set_agent_error_rate')
    const canBurst = hasPermission(tier, 'command.generate_burst')

    const [rateInput, setRateInput] = useState(agent.rate_rps)
    const [errorInput, setErrorInput] = useState(Math.round(agent.error_ratio * 100))
    const [burstInput, setBurstInput] = useState(100)

    // Capture the scenario value at unlock time so the user can read
    // "where the scenario was" even after they start tweaking.
    const baseRateRef = useRef(agent.rate_rps)
    const baseErrorRef = useRef(agent.error_ratio)

    // While locked, slider tracks the snapshot (so phases / incidents are
    // visible). Once unlocked, the slider is frozen until the user moves
    // it — we don't want a phase change to silently revert their choice.
    useEffect(() => {
        if (!unlocked) {
            setRateInput(agent.rate_rps)
            setErrorInput(Math.round(agent.error_ratio * 100))
            baseRateRef.current = agent.rate_rps
            baseErrorRef.current = agent.error_ratio
        }
    }, [agent.rate_rps, agent.error_ratio, unlocked])

    const tierLockMsg = (key: string) =>
        t.lab.lockedTierRequired.replace('{tier}', requiredTierName(key))

    const handleBurstClick = () => {
        if (!onBurst || !canBurst) return
        const burst = onBurst
        requireSeedConfirm(t.lab.seedActionBurst, () => burst(agent.name, burstInput))
    }

    return (
        <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
            {unlocked && isSeeded && (
                <div className="flex items-center gap-1.5 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded px-2 py-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>{t.lab.seededAgentOwned}</span>
                </div>
            )}
            {onSetRate && (
                <Tooltip
                    content={
                        !canSetRate
                            ? tierLockMsg('command.set_agent_rate')
                            : !unlocked
                                ? t.lab.lockedTip
                                : t.lab.rateTip
                    }
                    placement="top"
                >
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
                            disabled={!unlocked || !canSetRate}
                            onChange={(e) => setRateInput(Number(e.target.value))}
                            onMouseUp={() => onSetRate(agent.name, rateInput)}
                            onTouchEnd={() => onSetRate(agent.name, rateInput)}
                            className="flex-1 accent-brand-500 disabled:opacity-40 disabled:cursor-not-allowed"
                        />
                        <span className="text-[10px] font-mono text-gray-300 w-16 text-right shrink-0">
                            {rateInput.toFixed(0)} rps
                        </span>
                    </div>
                </Tooltip>
            )}
            {onSetErrorRate && (
                <Tooltip
                    content={
                        !canSetErrorRate
                            ? tierLockMsg('command.set_agent_error_rate')
                            : !unlocked
                                ? t.lab.lockedTip
                                : t.lab.errorsTip
                    }
                    placement="top"
                >
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
                            disabled={!unlocked || !canSetErrorRate}
                            onChange={(e) => setErrorInput(Number(e.target.value))}
                            onMouseUp={() => onSetErrorRate(agent.name, errorInput / 100)}
                            onTouchEnd={() => onSetErrorRate(agent.name, errorInput / 100)}
                            className="flex-1 accent-amber-500 disabled:opacity-40 disabled:cursor-not-allowed"
                        />
                        <span className="text-[10px] font-mono text-gray-300 w-16 text-right shrink-0">
                            {errorInput}%
                        </span>
                    </div>
                </Tooltip>
            )}
            {onBurst && (
                <Tooltip
                    content={canBurst ? t.lab.burstTip : tierLockMsg('command.generate_burst')}
                    placement="top"
                >
                    <div className="flex items-center gap-2 w-full">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider w-10">
                            {t.lab.burst}
                        </span>
                        <input
                            type="number"
                            min={1}
                            max={100000}
                            value={burstInput}
                            disabled={!canBurst}
                            onChange={(e) => setBurstInput(Number(e.target.value))}
                            className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                        />
                        <button
                            onClick={handleBurstClick}
                            disabled={!canBurst}
                            className="px-2 py-1 bg-purple-700 hover:bg-purple-600 text-white text-xs font-medium rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-purple-700"
                        >
                            {t.lab.send}
                        </button>
                    </div>
                </Tooltip>
            )}
        </div>
    )
}
