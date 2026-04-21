import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FlaskConical, AlertCircle } from 'lucide-react'
import { useEngineStore } from '@/store/useEngineStore'
import { engineWs } from '@/services/websocket'
import { createEngine, deleteEngine, validateScenario, getEngineScenario, TierRequiredError } from '@/services/api'
import { useTranslation } from '@/hooks/useTranslation'
import ScenarioSelector from '@/components/playground/ScenarioSelector'
import EngineControls from '@/components/playground/EngineControls'
import EngineHeader from '@/components/playground/EngineHeader'
import AgentGrid from '@/components/playground/AgentGrid'
import SinkGrid from '@/components/playground/SinkGrid'
import ScenarioPanel from '@/components/playground/ScenarioPanel'
import LogTail from '@/components/playground/LogTail'
import IncidentTimeline from '@/components/playground/IncidentTimeline'
import UserSelector from '@/components/UserSelector'

type LabTranslations = ReturnType<typeof useTranslation>

/**
 * Turn a backend 403 into a user-facing sentence like:
 *   "This feature requires the Pro tier — you are signed in as free_demo (free)."
 */
function formatTierMessage(err: TierRequiredError, t: LabTranslations): string {
    const required = err.requiredTier?.name ?? '—'
    const user = err.userTier?.name ?? err.userId ?? 'anonymous'
    return `${t.auth.requiresTier.replace('{tier}', required)} ${t.auth.youAre.replace('{role}', user)}`
}

export default function Lab() {
    const t = useTranslation()
    const {
        engineId,
        snapshot,
        connected,
        scenarioYaml,
        setScenarioYaml,
        statusMessage,
        setEngineId,
        setSnapshot,
        setConnected,
        setStatusMessage,
        reset,
    } = useEngineStore()
    const [validationErrors, setValidationErrors] = useState<string[]>([])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            engineWs.disconnect()
        }
    }, [])

    const connectToEngine = useCallback(
        (id: string) => {
            engineWs.connect(id, {
                onSnapshot: (snap) => setSnapshot(snap),
                onConnected: () => setConnected(true),
                onResult: (success, message) => {
                    setStatusMessage(`${success ? '✓' : '✗'} ${message}`)
                    setTimeout(() => setStatusMessage(null), 4000)
                },
                onError: (err) => setStatusMessage(err),
                onClose: () => setConnected(false),
            })
        },
        [setSnapshot, setConnected, setStatusMessage]
    )

    // Fetch scenario YAML when engine is created or connected
    useEffect(() => {
        if (!engineId) return
        getEngineScenario(engineId)
            .then((data) => setScenarioYaml(data.yaml))
            .catch(() => {
                // Scenario might not be available yet, silently fail
            })
    }, [engineId, setScenarioYaml])

    const handleCreate = useCallback(async () => {
        const yaml = scenarioYaml.trim()
        if (!yaml) {
            setStatusMessage(t.lab.noScenarioSelected)
            return
        }
        // Validate first
        try {
            const result = await validateScenario(yaml)
            if (!result.valid) {
                setValidationErrors(result.errors)
                return
            }
            setValidationErrors([])
        } catch (e) {
            if (e instanceof TierRequiredError) {
                setStatusMessage(formatTierMessage(e, t))
                return
            }
            setStatusMessage(`${t.lab.error}: ${e instanceof Error ? e.message : String(e)}`)
            return
        }
        // Create engine with YAML
        try {
            const { engine_id } = await createEngine(yaml)
            setEngineId(engine_id)
            setStatusMessage(t.lab.created)
            connectToEngine(engine_id)
        } catch (e) {
            if (e instanceof TierRequiredError) {
                setStatusMessage(formatTierMessage(e, t))
                return
            }
            setStatusMessage(`${t.lab.error}: ${e instanceof Error ? e.message : String(e)}`)
        }
    }, [scenarioYaml, setEngineId, setStatusMessage, connectToEngine, t])

    const handleDestroy = useCallback(async () => {
        if (!engineId) return
        try {
            engineWs.disconnect()
            await deleteEngine(engineId)
            reset()
        } catch (e) {
            setStatusMessage(`${t.lab.error}: ${e instanceof Error ? e.message : String(e)}`)
        }
    }, [engineId, reset, setStatusMessage, t])

    const handleStart = useCallback(() => {
        engineWs.sendCommand({ type: 'start' })
    }, [])

    const handleStop = useCallback(() => {
        engineWs.sendCommand({ type: 'stop' })
    }, [])

    const isRunning = snapshot?.state === 'running'

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            {/* Top navigation bar */}
            <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-gray-700/50">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/logcraft"
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-400 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t.lab.backToLogCraft}
                        </Link>
                        <div className="h-5 w-px bg-gray-700" />
                        <h1 className="font-display font-bold text-lg flex items-center gap-2">
                            <FlaskConical className="w-4 h-4 text-brand-500" />
                            <span className="text-brand-500">LogCraft</span>{' '}
                            <span className="text-gray-300">{t.lab.title}</span>
                            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-900/60 text-brand-400 border border-brand-700/50">
                                BETA
                            </span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        {connected && (
                            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                {t.lab.live}
                            </span>
                        )}
                        {statusMessage && (
                            <span className="text-xs text-gray-400 max-w-xs truncate">
                                {statusMessage}
                            </span>
                        )}
                        <Link
                            to="/tiers"
                            className="text-xs text-gray-400 hover:text-brand-400 transition-colors"
                        >
                            {t.auth.tierMatrix}
                        </Link>
                        <UserSelector />
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {!engineId ? (
                    /* ── Scenario Selection + Editor Phase ── */
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left: Scenario Picker */}
                        <div className="flex-1 min-w-0">
                            <div className="mb-6">
                                <h2 className="font-display text-xl font-bold text-gray-100 mb-1">
                                    {t.lab.selectScenario}
                                </h2>
                                <p className="text-gray-400 text-xs">
                                    {t.lab.selectScenarioDesc}
                                </p>
                            </div>
                            <ScenarioSelector />
                        </div>

                        {/* Right: YAML Editor + Launch */}
                        <div className="lg:w-[500px] flex-shrink-0 flex flex-col">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-gray-300">
                                    Scenario YAML
                                </h3>
                                <button
                                    onClick={handleCreate}
                                    disabled={!scenarioYaml.trim()}
                                    className="flex items-center gap-2 px-6 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-brand-600/20"
                                >
                                    <FlaskConical className="w-3.5 h-3.5" />
                                    {t.lab.launchEngine}
                                </button>
                            </div>

                            {validationErrors.length > 0 && (
                                <div className="mb-3 p-3 rounded-lg bg-red-900/20 border border-red-700/50">
                                    <div className="flex items-start gap-2 text-sm text-red-400">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <div>
                                            {validationErrors.map((err, i) => (
                                                <p key={i} className="text-xs">{err}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <textarea
                                value={scenarioYaml}
                                onChange={(e) => {
                                    setScenarioYaml(e.target.value)
                                    if (validationErrors.length) setValidationErrors([])
                                }}
                                spellCheck={false}
                                placeholder={t.lab.yamlPlaceholder}
                                className="flex-1 min-h-[300px] w-full bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 font-mono text-xs text-gray-300 placeholder-gray-600 resize-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 outline-none"
                            />
                        </div>
                    </div>
                ) : (
                    /* ── Live Dashboard Phase ── */
                    <div className="space-y-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            <EngineHeader snapshot={snapshot} engineId={engineId} />
                            <EngineControls
                                isRunning={isRunning}
                                hasEngine={!!engineId}
                                onStart={handleStart}
                                onStop={handleStop}
                                onDestroy={handleDestroy}
                            />
                        </div>

                        {/* Scenario YAML */}
                        {scenarioYaml && <ScenarioPanel yaml={scenarioYaml} engineId={engineId} />}

                        {/* Agent grid */}
                        <AgentGrid agents={snapshot?.agents ?? []} />

                        {/* Sink grid */}
                        <SinkGrid sinks={snapshot?.sinks ?? []} />

                        {/* Bottom panels */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <LogTail entries={snapshot?.tail ?? []} totalEntries={snapshot?.total_entries ?? 0} />
                            <IncidentTimeline incidents={snapshot?.incidents ?? []} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

