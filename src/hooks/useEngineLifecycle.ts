import { useCallback, useEffect, useRef, useState } from 'react'
import {
    createEngine,
    deleteEngine,
    getEngineScenario,
    getInsightReports,
    getInsightStatus,
    PolicyDenialError,
    validateScenario,
} from '@/services/api'
import { engineWs } from '@/services/websocket'
import { useEngineStore } from '@/store/useEngineStore'
import { useTranslation } from '@/hooks/useTranslation'
import { commandLabel } from '@/i18n/commandLabels'
import type { InsightReport, InsightReportsResponse } from '@/types/engine'

interface EngineLifecycleOptions {
    insightEnabled?: boolean
}

/**
 * Owns the entire engine lifecycle for the Lab page:
 *   – validation + creation (handleRun)
 *   – WebSocket wiring + auto-start handshake
 *   – the live engine commands (W4/D7: the prose list that used to be spelled out here is
 *     DELETED, not updated — a hand-maintained copy of the vocabulary has no checker and
 *     rots. The server's command_catalog.hpp is the vocabulary, and the superproject's
 *     scripts/command_vocabulary_lint.py reds if this client sends a token naming no row
 *     in it, or if the set it sends stops equalling that catalog's own kWebUiCommands.
 *     The gate is NOT in this repo's suite, and that is deliberate: a vitest arm here
 *     reached the catalog by relative path, this repo's CI checks out one repo, and it
 *     threw ENOENT on every run for a month while the pipeline reported green. Only the
 *     superproject checkout holds both sides of the seam.)
 *   – tear-down on unmount + on "back to scenarios"
 *   – validation/capability/tier errors
 *
 * Pulling this out of the page lets the view layers be pure markup, and
 * makes the lifecycle testable in isolation.
 */
export function useEngineLifecycle({ insightEnabled = true }: EngineLifecycleOptions = {}) {
    const t = useTranslation()
    const engineId = useEngineStore((s) => s.engineId)
    const scenarioYaml = useEngineStore((s) => s.scenarioYaml)
    const setEngineId = useEngineStore((s) => s.setEngineId)
    const setSnapshot = useEngineStore((s) => s.setSnapshot)
    const setConnected = useEngineStore((s) => s.setConnected)
    const setStatusMessage = useEngineStore((s) => s.setStatusMessage)
    const setScenarioYaml = useEngineStore((s) => s.setScenarioYaml)
    const appendToLiveTail = useEngineStore((s) => s.appendToLiveTail)
    const setInsightStatus = useEngineStore((s) => s.setInsightStatus)
    const setInsightReports = useEngineStore((s) => s.setInsightReports)
    const setInsightLatestWindow = useEngineStore((s) => s.setInsightLatestWindow)
    const setInsightLoading = useEngineStore((s) => s.setInsightLoading)
    const setInsightError = useEngineStore((s) => s.setInsightError)
    const clearInsightData = useEngineStore((s) => s.clearInsightData)

    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const [unavailableCapabilities, setUnavailableCapabilities] = useState<string[]>([])
    const [accessError, setAccessError] = useState<string | null>(null)
    const [playToTargetPending, setPlayToTargetPending] = useState(false)
    const [insightCatchingUp, setInsightCatchingUp] = useState(false)
    const playToTargetPendingRef = useRef(false)
    const lastStatusLinesRef = useRef<number>(0)
    const linesAtSeekRef = useRef<number | null>(null)

    const setReplayPending = useCallback((pending: boolean) => {
        playToTargetPendingRef.current = pending
        setPlayToTargetPending(pending)
    }, [])

    // Mirror engineId into a ref so the unmount effect can read the latest
    // value without re-binding (the cleanup is registered exactly once).
    const engineIdRef = useRef<string | null>(engineId)
    useEffect(() => {
        engineIdRef.current = engineId
    }, [engineId])

    // SPA-leave cleanup: tear down the engine and reset the store so a
    // later mount lands back on the scenario picker. Best-effort delete —
    // the server's idle reaper covers any in-flight failure.
    useEffect(() => {
        return () => {
            const id = engineIdRef.current
            engineWs.disconnect()
            if (id) deleteEngine(id).catch(() => undefined)
            useEngineStore.getState().reset()
        }
    }, [])

    // Re-fetch the YAML when an engine attaches (covers both "we just
    // created it" and "page reload while an engine is running").
    useEffect(() => {
        if (!engineId) return
        getEngineScenario(engineId)
            .then((data) => setScenarioYaml(data.yaml))
            .catch(() => undefined)
    }, [engineId, setScenarioYaml])

    useEffect(() => {
        if (!engineId || !insightEnabled) {
            clearInsightData()
            return
        }

        let cancelled = false
        let inFlight = false
        let lastReportLines = -1
        let lastReportRevision = -1
        let hasInitialData = false

        clearInsightData()

        const pollInsight = async () => {
            if (inFlight) return
            inFlight = true
            // Only show the loading badge on the very first fetch.
            // Subsequent polls are silent to avoid a layout shift every 3 s.
            if (!hasInitialData) setInsightLoading(true)
            try {
                const status = await getInsightStatus(engineId)
                if (cancelled) return
                setInsightStatus(status)
                hasInitialData = true
                const currentLines = status.lines_ingested ?? 0
                lastStatusLinesRef.current = currentLines
                if (linesAtSeekRef.current !== null && currentLines > linesAtSeekRef.current) {
                    linesAtSeekRef.current = null
                    setInsightCatchingUp(false)
                }

                const statusRevision = status.insight_revision ?? status.lines_ingested
                if (
                    status.running &&
                    (status.lines_ingested !== lastReportLines || statusRevision !== lastReportRevision)
                ) {
                    try {
                        const reportSnapshot = await getInsightReports(engineId)
                        if (cancelled) return
                        lastReportLines = reportSnapshot.lines_ingested
                        lastReportRevision = reportSnapshot.insight_revision ?? statusRevision
                        setInsightReports(
                            annotateInsightReports(reportSnapshot),
                            reportSnapshot.lines_ingested,
                        )
                        setInsightLatestWindow({
                            metalog: reportSnapshot.latest_metalog ?? null,
                            acuteDiff: reportSnapshot.latest_acute_diff ?? null,
                            detectionReports: reportSnapshot.latest_detection_reports ?? [],
                            contextPackets: reportSnapshot.latest_context_packets ?? [],
                        })
                    } catch (reportsError) {
                        const message = reportsError instanceof Error ? reportsError.message : String(reportsError)
                        if (!/409|not yet started|not initialised/i.test(message)) {
                            throw reportsError
                        }
                    }
                }

                setInsightError(null)
            } catch (e) {
                if (cancelled) return
                if (e instanceof PolicyDenialError) {
                    setAccessError(e.message)
                } else {
                    setInsightError(e instanceof Error ? e.message : String(e))
                }
            } finally {
                inFlight = false
                if (!cancelled) setInsightLoading(false)
            }
        }

        void pollInsight()
        const intervalId = window.setInterval(() => {
            void pollInsight()
        }, 3000)

        return () => {
            cancelled = true
            window.clearInterval(intervalId)
        }
    }, [
        engineId,
        insightEnabled,
        clearInsightData,
        setInsightStatus,
        setInsightLatestWindow,
        setInsightReports,
        setInsightLoading,
        setInsightError,
    ])

    const connectToEngine = useCallback(
        (id: string) => {
            engineWs.connect(id, {
                onSnapshot: (snap) => {
                    setSnapshot(snap)
                    if (snap.tail && snap.tail.length > 0) appendToLiveTail(snap.tail)
                },
                onConnected: () => {
                    setConnected(true)
                    // Always start on connect so the engine lands in running+paused
                    // (deterministic) or running+playing (stochastic) immediately.
                    engineWs.sendCommand({ type: 'start' })
                },
                onResult: (success, message) => {
                    if (playToTargetPendingRef.current) {
                        setReplayPending(false)
                        if (success) {
                            linesAtSeekRef.current = lastStatusLinesRef.current
                            setInsightCatchingUp(true)
                            // Fallback: clear badge after 15 s if lines_ingested never advances
                            const capturedBaseline = lastStatusLinesRef.current
                            setTimeout(() => {
                                if (linesAtSeekRef.current === capturedBaseline) {
                                    linesAtSeekRef.current = null
                                    setInsightCatchingUp(false)
                                }
                            }, 15_000)
                        }
                    }
                    setStatusMessage(`${success ? '✓' : '✗'} ${message}`)
                    setTimeout(() => setStatusMessage(null), 4000)
                },
                // The connection predicate, told ONCE for all command paths. It is not the
                // permission predicate: `EngineControls` disables a button the caller may not
                // press (`hasOperation`), which is a different question from whether a press
                // reached the engine. Merging them would hide one behind the other.
                //
                // Told once, but never anonymously: the refused command is named by the label
                // of the control that sent it, so the operator reads "Pause not sent" rather
                // than "a command was not sent". One shared sentence, one attributable subject.
                onCommandRefused: (command) => {
                    const named = t.lab.commandNotSent.replace(
                        '{command}',
                        commandLabel(t.lab, command.type),
                    )
                    setStatusMessage(`✗ ${named}`)
                    setTimeout(() => setStatusMessage(null), 4000)
                },
                onError: (err) => setStatusMessage(err),
                onFatalError: (err) => {
                    // Server explicitly rejected our engine ID (e.g. after a
                    // restart). Reset local state so the user lands back on the
                    // scenario picker instead of looping reconnect attempts.
                    setStatusMessage(`✗ ${err}`)
                    setTimeout(() => setStatusMessage(null), 6000)
                    engineWs.disconnect()
                    setReplayPending(false)
                    setInsightCatchingUp(false)
                    linesAtSeekRef.current = null
                    useEngineStore.getState().reset()
                    setValidationErrors([])
                    setUnavailableCapabilities([])
                },
                onClose: () => {
                    setConnected(false)
                    setReplayPending(false)
                    setInsightCatchingUp(false)
                    linesAtSeekRef.current = null
                },
            })
        },
        // `t.lab` is a real dependency: the refusal renders BOTH the sentence and the refused
        // control's label out of it. Re-creating this callback on a language change costs
        // nothing — its only caller is `handleRun`, on a click, and no effect depends on it,
        // so nothing reconnects when the locale flips.
        [setSnapshot, appendToLiveTail, setConnected, setStatusMessage, setValidationErrors, setUnavailableCapabilities, setReplayPending, t.lab],
    )

    const handleRun = useCallback(async () => {
        const yaml = scenarioYaml.trim()
        if (!yaml) {
            setStatusMessage(t.lab.noScenarioSelected)
            return
        }
        try {
            const result = await validateScenario(yaml)
            if (!result.valid) {
                setValidationErrors(result.errors)
                return
            }
            if (result.unavailable_capabilities?.length) {
                setUnavailableCapabilities(result.unavailable_capabilities)
                return
            }
            setValidationErrors([])
            setUnavailableCapabilities([])
        } catch (e) {
            if (e instanceof PolicyDenialError) {
                setAccessError(e.message)
                return
            }
            setStatusMessage(`${t.lab.error}: ${e instanceof Error ? e.message : String(e)}`)
            return
        }
        try {
            const { engine_id } = await createEngine(yaml)
            setEngineId(engine_id)
            setStatusMessage(t.lab.created)
            connectToEngine(engine_id)
        } catch (e) {
            if (e instanceof PolicyDenialError) {
                setAccessError(e.message)
                return
            }
            setStatusMessage(`${t.lab.error}: ${e instanceof Error ? e.message : String(e)}`)
        }
    }, [scenarioYaml, setEngineId, setStatusMessage, connectToEngine, t])

    const handleStart = useCallback(() => engineWs.sendCommand({ type: 'start' }), [])

    const handleStop = useCallback(() => engineWs.sendCommand({ type: 'stop' }), [])
    const handlePlay = useCallback(() => engineWs.sendCommand({ type: 'play' }), [])
    const handlePause = useCallback(() => engineWs.sendCommand({ type: 'pause' }), [])
    const handleSetPlaybackSpeed = useCallback(
        (multiplier: number) => engineWs.sendCommand({ type: 'set_speed', multiplier }),
        [],
    )
    const handleAdvance = useCallback(
        (durationNs: number) => engineWs.sendCommand({ type: 'advance', duration_ns: durationNs }),
        [],
    )
    const handlePlayToTarget = useCallback(
        (targetElapsedNs: number) => {
            // Reads the send's own answer rather than `connected` beforehand: the optimistic
            // UI below is a claim that the engine is seeking, and only a command that reached
            // the wire earns it. A prior liveness check would also be a different fact by the
            // time the send ran. The refusal itself is announced by `onCommandRefused`.
            if (
                !engineWs.sendCommand({
                    type: 'play_to_target',
                    target_elapsed_ns: targetElapsedNs,
                })
            ) {
                return
            }
            setReplayPending(true)
            setStatusMessage(t.lab.playingToTarget)
        },
        [setReplayPending, setStatusMessage, t],
    )
    const handleCascade = useCallback(() => engineWs.sendCommand({ type: 'cascade' }), [])
    const handleSetRate = useCallback(
        (name: string, rps: number) => engineWs.sendCommand({ type: 'set_rate', agent: name, rps }),
        [],
    )
    const handleSetErrorRate = useCallback(
        (name: string, rate: number) =>
            engineWs.sendCommand({ type: 'set_error_rate', agent: name, rate }),
        [],
    )
    const handleBurst = useCallback(
        (name: string, count: number) =>
            engineWs.sendCommand({ type: 'burst', agent: name, count }),
        [],
    )

    const handleBackToScenarios = useCallback(() => {
        const id = engineIdRef.current
        engineWs.disconnect()
        if (id) deleteEngine(id).catch(() => undefined)
        useEngineStore.getState().reset()
        setValidationErrors([])
        setUnavailableCapabilities([])
        setStatusMessage(null)
    }, [setStatusMessage])

    return {
        // state
        validationErrors,
        setValidationErrors,
        unavailableCapabilities,
        setUnavailableCapabilities,
        accessError,
        setAccessError,
        playToTargetPending,
        insightCatchingUp,
        // commands
        handleRun,
        handleStart,
        handleStop,
        handlePlay,
        handlePause,
        handleSetPlaybackSpeed,
        handleAdvance,
        handlePlayToTarget,
        handleCascade,
        handleSetRate,
        handleSetErrorRate,
        handleBurst,
        handleBackToScenarios,
    } as const
}

function annotateInsightReports(snapshot: InsightReportsResponse): InsightReport[] {
    return snapshot.insights.map((report) => ({
        ...report,
        explain_mode: report.explain_mode ?? snapshot.explain_mode,
        llm_enabled: report.llm_enabled ?? snapshot.llm_enabled,
        llm_model: report.llm_model ?? snapshot.llm_model,
    }))
}
