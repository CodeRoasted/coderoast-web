import { useEffect, useRef, useState } from 'react'
import { Activity, AlertTriangle, Lock, Unlock, Zap } from 'lucide-react'
import type { AgentSnapshot, HealthState } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'
import Tooltip from '@/components/Tooltip'
import SeedConfirmModal from './SeedConfirmModal'
import { useAuthStore } from '@/store/useAuthStore'
import { hasPermission, requiredTierName } from '@/utils/permissions'

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

const healthStyles: Record<HealthState, { bg: string; text: string; border: string }> = {
    Healthy: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    Degraded: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    Failing: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
    Recovering: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
}

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
    const style = healthStyles[agent.health] ?? healthStyles.Healthy
    const hasLiveControls = Boolean(onSetRate || onSetErrorRate || onBurst)

    const tier = useAuthStore((s) => s.tier)
    const canSetRate = hasPermission(tier, 'command.set_agent_rate')
    const canSetErrorRate = hasPermission(tier, 'command.set_agent_error_rate')
    const canBurst = hasPermission(tier, 'command.generate_burst')
    const canOverride = canSetRate || canSetErrorRate

    // Locked-by-default ownership model. The backend has no "restore to
    // scenario" command — once you push a rate/error override, the agent
    // stops following its phases until the engine is reloaded. So instead
    // of an always-editable slider with a fake reset button, we ask the
    // operator to explicitly take ownership of the agent before tweaking
    // anything. Burst stays available because it doesn't break scenario
    // tracking (it just emits N records on top).
    const [unlocked, setUnlocked] = useState(false)
    const [seedPending, setSeedPending] = useState<{ label: string; fn: () => void } | null>(null)

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

    const handleBurstClick = () => {
        if (!onBurst || !canBurst) return
        const burst = onBurst
        requireSeedConfirm(t.lab.seedActionBurst, () => burst(agent.name, burstInput))
    }

    const tierLockMsg = (key: string) =>
        t.lab.lockedTierRequired.replace('{tier}', requiredTierName(key))

    const lockTooltip = !canOverride
        ? tierLockMsg('command.set_agent_rate')
        : unlocked
            ? t.lab.unlockedTip
            : t.lab.lockedTip

    return (
        <div className={`bg-gray-900 border rounded-xl p-4 transition-all ${style.border}`}>
            {/* Header */}
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
                        style={{
                            width: `${Math.min((agent.p95_latency / (agent.p99_latency || 1)) * 100, 100)}%`,
                        }}
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
