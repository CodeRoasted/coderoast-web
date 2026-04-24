import { useCallback, useEffect, useRef, useState } from 'react'
import {
    createEngine,
    deleteEngine,
    getEngineScenario,
    TierRequiredError,
    validateScenario,
} from '@/services/api'
import { engineWs } from '@/services/websocket'
import { useEngineStore } from '@/store/useEngineStore'
import { useTranslation } from '@/hooks/useTranslation'

/**
 * Owns the entire engine lifecycle for the Lab page:
 *   – validation + creation (handleRun)
 *   – WebSocket wiring + auto-start handshake
 *   – live commands (start / stop / cascade / set_rate / set_error_rate / burst)
 *   – tear-down on unmount + on "back to scenarios"
 *   – validation/capability/tier errors and the seed-breach flag
 *
 * Pulling this out of the page lets the view layers be pure markup, and
 * makes the lifecycle testable in isolation.
 */
export function useEngineLifecycle() {
    const t = useTranslation()
    const engineId = useEngineStore((s) => s.engineId)
    const scenarioYaml = useEngineStore((s) => s.scenarioYaml)
    const setEngineId = useEngineStore((s) => s.setEngineId)
    const setSnapshot = useEngineStore((s) => s.setSnapshot)
    const setConnected = useEngineStore((s) => s.setConnected)
    const setStatusMessage = useEngineStore((s) => s.setStatusMessage)
    const setScenarioYaml = useEngineStore((s) => s.setScenarioYaml)
    const appendToLiveTail = useEngineStore((s) => s.appendToLiveTail)

    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const [unavailableCapabilities, setUnavailableCapabilities] = useState<string[]>([])
    const [tierError, setTierError] = useState<TierRequiredError | null>(null)
    const [autoStart, setAutoStart] = useState(true)
    const autoStartRef = useRef(true)
    const [seedBroken, setSeedBroken] = useState(false)
    const [runKey, setRunKey] = useState(0)

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

    // Reset seed-breach flag whenever the engine changes so the
    // determinism warning fires again for a fresh scenario run.
    useEffect(() => {
        setSeedBroken(false)
    }, [engineId])

    const connectToEngine = useCallback(
        (id: string) => {
            engineWs.connect(id, {
                onSnapshot: (snap) => {
                    setSnapshot(snap)
                    if (snap.tail && snap.tail.length > 0) appendToLiveTail(snap.tail)
                },
                onConnected: () => {
                    setConnected(true)
                    // Auto-start right after the WS handshake so "Run scenario"
                    // is one click instead of "create then remember to start".
                    if (autoStartRef.current) engineWs.sendCommand({ type: 'start' })
                },
                onResult: (success, message) => {
                    setStatusMessage(`${success ? '✓' : '✗'} ${message}`)
                    setTimeout(() => setStatusMessage(null), 4000)
                },
                onError: (err) => setStatusMessage(err),
                onClose: () => setConnected(false),
            })
        },
        [setSnapshot, appendToLiveTail, setConnected, setStatusMessage],
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
            if (e instanceof TierRequiredError) {
                setTierError(e)
                return
            }
            setStatusMessage(`${t.lab.error}: ${e instanceof Error ? e.message : String(e)}`)
            return
        }
        try {
            autoStartRef.current = autoStart
            const { engine_id } = await createEngine(yaml)
            setEngineId(engine_id)
            setStatusMessage(autoStart ? t.lab.created : t.lab.emptyEngineHint)
            connectToEngine(engine_id)
        } catch (e) {
            if (e instanceof TierRequiredError) {
                setTierError(e)
                return
            }
            setStatusMessage(`${t.lab.error}: ${e instanceof Error ? e.message : String(e)}`)
        }
    }, [scenarioYaml, autoStart, setEngineId, setStatusMessage, connectToEngine, t])

    const handleStart = useCallback(() => {
        setSeedBroken(false)
        setRunKey((k) => k + 1)
        engineWs.sendCommand({ type: 'start' })
    }, [])

    const handleStop = useCallback(() => engineWs.sendCommand({ type: 'stop' }), [])
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
        tierError,
        setTierError,
        autoStart,
        setAutoStart,
        seedBroken,
        setSeedBroken,
        runKey,
        // commands
        handleRun,
        handleStart,
        handleStop,
        handleCascade,
        handleSetRate,
        handleSetErrorRate,
        handleBurst,
        handleBackToScenarios,
    } as const
}
