import { FastForward, Lock, Pause, Play, SkipForward, Square, Zap } from 'lucide-react'
import type { EngineSnapshot } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'
import Tooltip from '@/components/Tooltip'
import { useAuthStore } from '@/store/useAuthStore'
import { hasPermission, requiredTierName } from '@/utils/permissions'

const kAdvanceOneSecondNs = 1_000_000_000
const kAdvanceTenSecondsNs = 10_000_000_000
const kSpeedPresets = [0.5, 1, 2, 5]

interface Props {
    snapshot: EngineSnapshot | null
    hasEngine: boolean
    onStart: () => void
    onStop: () => void
    onPlay?: () => void
    onPause?: () => void
    onSetPlaybackSpeed?: (multiplier: number) => void
    onAdvance?: (durationNs: number) => void
    onCascade?: () => void
}

export default function EngineControls({
    snapshot,
    hasEngine,
    onStart,
    onStop,
    onPlay,
    onPause,
    onSetPlaybackSpeed,
    onAdvance,
    onCascade,
}: Props) {
    const t = useTranslation()
    const tier = useAuthStore((s) => s.tier)
    const isRunning = snapshot?.state === 'running'
    const isDeterministic = snapshot?.engine_mode === 'deterministic'
    const playbackState = snapshot?.playback_state ?? 'playing'
    const hasCascade = snapshot?.has_cascade ?? false
    const currentSpeed = snapshot?.speed_multiplier ?? 1

    const canStart = hasPermission(tier, 'command.start_engine')
    const canStop = hasPermission(tier, 'command.stop_engine')
    const canPlay = hasPermission(tier, 'command.play_engine')
    const canPause = hasPermission(tier, 'command.pause_engine')
    const canSetPlaybackSpeed = hasPermission(tier, 'command.set_playback_speed')
    const canAdvance = hasPermission(tier, 'command.advance_engine')
    const canCascade = hasPermission(tier, 'command.evaluate_cascade')

    const tierLockMsg = (key: string) =>
        t.lab.lockedTierRequired.replace('{tier}', requiredTierName(key))

    if (!hasEngine) return null

    return (
        <div className="flex items-center gap-3 flex-wrap justify-end">
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

            {isRunning && isDeterministic && (
                <>
                    {playbackState === 'paused' ? (
                        <Tooltip content={canPlay ? t.lab.play : tierLockMsg('command.play_engine')}>
                            <button
                                onClick={onPlay}
                                disabled={!canPlay || !onPlay}
                                className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-sky-600"
                            >
                                {canPlay ? <Play className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                {t.lab.play}
                            </button>
                        </Tooltip>
                    ) : (
                        <Tooltip content={canPause ? t.lab.pause : tierLockMsg('command.pause_engine')}>
                            <button
                                onClick={onPause}
                                disabled={!canPause || !onPause}
                                className="flex items-center gap-2 px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-sky-700"
                            >
                                {canPause ? <Pause className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                {t.lab.pause}
                            </button>
                        </Tooltip>
                    )}

                    <div className="flex items-center gap-1 rounded-lg border border-gray-700 bg-gray-900/80 p-1">
                        {kSpeedPresets.map((preset) => {
                            const active = Math.abs(currentSpeed - preset) < 0.001
                            return (
                                <Tooltip
                                    key={preset}
                                    content={
                                        canSetPlaybackSpeed
                                            ? `${t.lab.speed} ${preset}x`
                                            : tierLockMsg('command.set_playback_speed')
                                    }
                                >
                                    <button
                                        onClick={() => onSetPlaybackSpeed?.(preset)}
                                        disabled={!canSetPlaybackSpeed || !onSetPlaybackSpeed}
                                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${active
                                                ? 'bg-brand-500 text-white'
                                                : 'text-gray-300 hover:bg-gray-800'
                                            }`}
                                    >
                                        <span className="inline-flex items-center gap-1">
                                            <FastForward className="w-3 h-3" />
                                            {preset}x
                                        </span>
                                    </button>
                                </Tooltip>
                            )
                        })}
                    </div>

                    {playbackState === 'paused' && (
                        <div className="flex items-center gap-1 rounded-lg border border-gray-700 bg-gray-900/80 p-1">
                            <Tooltip
                                content={canAdvance ? `${t.lab.advance} +1s` : tierLockMsg('command.advance_engine')}
                            >
                                <button
                                    onClick={() => onAdvance?.(kAdvanceOneSecondNs)}
                                    disabled={!canAdvance || !onAdvance}
                                    className="px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <span className="inline-flex items-center gap-1">
                                        <SkipForward className="w-3 h-3" />
                                        +1s
                                    </span>
                                </button>
                            </Tooltip>
                            <Tooltip
                                content={canAdvance ? `${t.lab.advance} +10s` : tierLockMsg('command.advance_engine')}
                            >
                                <button
                                    onClick={() => onAdvance?.(kAdvanceTenSecondsNs)}
                                    disabled={!canAdvance || !onAdvance}
                                    className="px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <span className="inline-flex items-center gap-1">
                                        <SkipForward className="w-3 h-3" />
                                        +10s
                                    </span>
                                </button>
                            </Tooltip>
                        </div>
                    )}
                </>
            )}

            {isRunning && !isDeterministic && onCascade && hasCascade && (
                <Tooltip
                    content={canCascade ? t.lab.cascadeTip : tierLockMsg('command.evaluate_cascade')}
                >
                    <button
                        onClick={onCascade}
                        disabled={!canCascade}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-purple-700"
                    >
                        {canCascade ? <Zap className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        {t.lab.cascade}
                    </button>
                </Tooltip>
            )}
        </div>
    )
}
