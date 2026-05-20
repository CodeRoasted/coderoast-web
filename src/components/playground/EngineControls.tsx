import { useEffect, useState } from 'react'
import { FastForward, Loader2, Lock, Pause, Play, RotateCcw, SkipForward, Square, Zap } from 'lucide-react'
import type { EngineSnapshot } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'
import Tooltip from '@/components/Tooltip'
import { useAuthStore } from '@/store/useAuthStore'
import { hasOperation } from '@/utils/permissions'

const kAdvanceOneSecondNs = 1_000_000_000
const kAdvanceTenSecondsNs = 10_000_000_000
const kNanosecondsPerSecond = 1_000_000_000
const kSpeedPresets = [0.5, 1, 2, 5]

function formatTargetSeconds(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds <= 0) return '0'
    return seconds.toFixed(3).replace(/0+$/u, '').replace(/\.$/u, '')
}

interface Props {
    snapshot: EngineSnapshot | null
    hasEngine: boolean
    onStart: () => void
    onStop: () => void
    onPlay?: () => void
    onPause?: () => void
    onSetPlaybackSpeed?: (multiplier: number) => void
    onAdvance?: (durationNs: number) => void
    onPlayToTarget?: (targetElapsedNs: number) => void
    playToTargetPending?: boolean
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
    onPlayToTarget,
    playToTargetPending = false,
    onCascade,
}: Props) {
    const t = useTranslation()
    const operations = useAuthStore((s) => s.operations)
    const isRunning = snapshot?.state === 'running'
    const isDeterministic = snapshot?.engine_mode === 'deterministic'
    const playbackState = snapshot?.playback_state ?? 'playing'
    const hasCascade = snapshot?.has_cascade ?? false
    const currentSpeed = snapshot?.speed_multiplier ?? 1
    const simulationElapsedSeconds = snapshot?.simulation_elapsed_seconds ?? 0
    const [targetSeconds, setTargetSeconds] = useState(() =>
        formatTargetSeconds(simulationElapsedSeconds),
    )
    const [targetDirty, setTargetDirty] = useState(false)

    const canStart = hasOperation(operations, 'engine.start')
    const canStop = hasOperation(operations, 'engine.stop')
    const canPlay = hasOperation(operations, 'engine.playback.play')
    const canPause = hasOperation(operations, 'engine.playback.pause')
    const canSetPlaybackSpeed = hasOperation(operations, 'engine.speed.set')
    const canAdvance = hasOperation(operations, 'engine.advance')
    const canCascade = hasOperation(operations, 'engine.cascade.trigger')

    const lockMsg = (operationKey: string) =>
        t.lab.lockedOperationRequired.replace('{operation}', operationKey)

    useEffect(() => {
        if (!targetDirty) setTargetSeconds(formatTargetSeconds(simulationElapsedSeconds))
    }, [simulationElapsedSeconds, targetDirty])

    const parsedTargetSeconds = Number(targetSeconds)
    const hasValidReplayTarget = Number.isFinite(parsedTargetSeconds) && parsedTargetSeconds >= 0
    const handlePlayToTarget = () => {
        if (!onPlayToTarget || !hasValidReplayTarget) return
        onPlayToTarget(Math.round(parsedTargetSeconds * kNanosecondsPerSecond))
        setTargetDirty(false)
    }

    if (!hasEngine) return null

    return (
        <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* ── Transport pill: Stop/Start + Play/Pause + Speed ─────────── */}
            <div className="flex items-center gap-0 rounded-lg border border-gray-700 bg-gray-900/80 overflow-hidden">
                {!isRunning ? (
                    <Tooltip content={canStart ? t.lab.start : lockMsg('engine.start')}>
                        <button
                            onClick={onStart}
                            disabled={!canStart}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-700/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {canStart ? <Play className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            {t.lab.start}
                        </button>
                    </Tooltip>
                ) : (
                    <Tooltip content={canStop ? t.lab.stop : lockMsg('engine.stop')}>
                        <button
                            onClick={onStop}
                            disabled={!canStop}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-300 hover:bg-amber-700/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        >
                            {canStop ? <Square className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            {t.lab.stop}
                        </button>
                    </Tooltip>
                )}

                {isRunning && isDeterministic && (
                    <>
                        <div className="w-px h-6 bg-gray-700 shrink-0" />
                        {playbackState === 'paused' ? (
                            <Tooltip content={canPlay ? t.lab.play : lockMsg('engine.playback.play')}>
                                <button
                                    onClick={onPlay}
                                    disabled={!canPlay || !onPlay}
                                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-sky-300 hover:bg-sky-700/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {canPlay ? <Play className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                    {t.lab.play}
                                </button>
                            </Tooltip>
                        ) : (
                            <Tooltip content={canPause ? t.lab.pause : lockMsg('engine.playback.pause')}>
                                <button
                                    onClick={onPause}
                                    disabled={!canPause || !onPause}
                                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-sky-300 hover:bg-sky-700/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {canPause ? <Pause className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                    {t.lab.pause}
                                </button>
                            </Tooltip>
                        )}

                        <div className="w-px h-6 bg-gray-700 shrink-0" />
                        {kSpeedPresets.map((preset) => {
                            const active = Math.abs(currentSpeed - preset) < 0.001
                            return (
                                <Tooltip
                                    key={preset}
                                    content={
                                        canSetPlaybackSpeed
                                            ? `${t.lab.speed} ${preset}x`
                                            : lockMsg('engine.speed.set')
                                    }
                                >
                                    <button
                                        onClick={() => onSetPlaybackSpeed?.(preset)}
                                        disabled={!canSetPlaybackSpeed || !onSetPlaybackSpeed}
                                        className={`flex items-center gap-0.5 px-2 py-2 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${active
                                                ? 'bg-brand-600/80 text-white'
                                                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                            }`}
                                    >
                                        <FastForward className="w-2.5 h-2.5" />
                                        {preset}x
                                    </button>
                                </Tooltip>
                            )
                        })}
                    </>
                )}
            </div>

            {/* ── Seek pill: visible only when running + paused ───────────── */}
            {isRunning && isDeterministic && playbackState === 'paused' && (
                <div className="flex items-center gap-0 rounded-lg border border-gray-700 bg-gray-900/80 overflow-hidden">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5">
                        <RotateCcw className="w-3 h-3 text-gray-500 shrink-0" />
                        <input
                            type="text"
                            inputMode="decimal"
                            value={targetSeconds}
                            onChange={(event) => {
                                setTargetDirty(true)
                                setTargetSeconds(event.target.value)
                            }}
                            aria-label={t.lab.targetSeconds}
                            className="w-16 bg-gray-950/80 border border-gray-700 rounded px-1.5 py-0.5 text-xs text-gray-100 text-right font-mono outline-none focus:border-brand-500/70 focus:ring-1 focus:ring-brand-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                            disabled={!canAdvance || !onPlayToTarget || playToTargetPending}
                        />
                        <span className="text-[10px] text-gray-500">s</span>
                    </div>

                    <div className="w-px h-6 bg-gray-700 shrink-0" />

                    <Tooltip content={canAdvance ? t.lab.playToTarget : lockMsg('engine.advance')}>
                        <button
                            onClick={handlePlayToTarget}
                            disabled={!canAdvance || !onPlayToTarget || !hasValidReplayTarget || playToTargetPending}
                            aria-label={t.lab.playToTarget}
                            className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {playToTargetPending ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                <RotateCcw className="w-3 h-3" />
                            )}
                            {playToTargetPending ? t.lab.replaying : t.lab.replay}
                        </button>
                    </Tooltip>

                    <div className="w-px h-6 bg-gray-700 shrink-0" />

                    <Tooltip content={canAdvance ? `${t.lab.advance} +1s` : lockMsg('engine.advance')}>
                        <button
                            onClick={() => onAdvance?.(kAdvanceOneSecondNs)}
                            disabled={!canAdvance || !onAdvance}
                            className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <SkipForward className="w-3 h-3" />
                            +1s
                        </button>
                    </Tooltip>
                    <Tooltip content={canAdvance ? `${t.lab.advance} +10s` : lockMsg('engine.advance')}>
                        <button
                            onClick={() => onAdvance?.(kAdvanceTenSecondsNs)}
                            disabled={!canAdvance || !onAdvance}
                            className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <SkipForward className="w-3 h-3" />
                            +10s
                        </button>
                    </Tooltip>
                </div>
            )}

            {/* ── Non-deterministic: Cascade ──────────────────────────────── */}
            {isRunning && !isDeterministic && onCascade && hasCascade && (
                <Tooltip
                    content={canCascade ? t.lab.cascadeTip : lockMsg('engine.cascade.trigger')}
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
