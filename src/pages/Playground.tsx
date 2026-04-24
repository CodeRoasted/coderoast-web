import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ONBOARDING_COOKIE, getCookie, setCookie } from '@/utils/cookies'
import {
    ArrowLeft,
    FlaskConical,
    AlertCircle,
    Play,
    HelpCircle,
} from 'lucide-react'
import { useEngineStore } from '@/store/useEngineStore'
import { engineWs } from '@/services/websocket'
import {
    createEngine,
    deleteEngine,
    validateScenario,
    getEngineScenario,
    getScenario,
    listScenarios,
    TierRequiredError,
} from '@/services/api'
import { useTranslation } from '@/hooks/useTranslation'
import ScenarioSelector from '@/components/playground/ScenarioSelector'
import EngineControls from '@/components/playground/EngineControls'
import EngineHeader from '@/components/playground/EngineHeader'
import AgentGrid from '@/components/playground/AgentGrid'
import SinkGrid from '@/components/playground/SinkGrid'
import ObservationPanel from '@/components/playground/ObservationPanel'
import ScenarioPanel from '@/components/playground/ScenarioPanel'
import UserSelector from '@/components/UserSelector'
import TierLockModal from '@/components/playground/TierLockModal'
import OnboardingModal from '@/components/playground/OnboardingModal'

// CodeMirror is ~200kB gzipped — only loaded once the user actually
// reaches the scenario-edit phase. Keeps the initial Playground chunk
// under the 500 kB warning threshold.
const YamlEditor = lazy(() => import('@/components/playground/YamlEditor'))

// Cookie key is in @/utils/cookies — exported as ONBOARDING_COOKIE
const HELLO_WORLD_HINTS = ['hello_world', 'hello-world', 'hello']

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
        appendToLiveTail,
        clearLiveTail,
        liveTail,
        setConnected,
        setStatusMessage,
        selectedScenarioId,
        setSelectedScenarioId,
    } = useEngineStore()
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const [unavailableCapabilities, setUnavailableCapabilities] = useState<string[]>([])
    const [tierError, setTierError] = useState<TierRequiredError | null>(null)
    const [autoStart, setAutoStart] = useState(true)
    const autoStartRef = useRef(true)
    const [showFirstVisit, setShowFirstVisit] = useState(false)
    const [helloWorldLoading, setHelloWorldLoading] = useState(false)
    const [seedBroken, setSeedBroken] = useState(false)
    const [runKey, setRunKey] = useState(0)

    // Clear validation state whenever the user picks a different scenario.
    // Scenario selection writes directly to the store (bypassing the YAML
    // editor's onChange), so we watch selectedScenarioId here instead.
    useEffect(() => {
        setValidationErrors([])
        setUnavailableCapabilities([])
    }, [selectedScenarioId])

    // Show first-visit help unless the onboarding cookie is present.
    // Incognito / cleared cookies = fresh first-visit experience.
    useEffect(() => {
        if (!getCookie(ONBOARDING_COOKIE)) {
            setShowFirstVisit(true)
        }
    }, [])

    const dismissFirstVisit = useCallback(() => {
        setShowFirstVisit(false)
        setCookie(ONBOARDING_COOKIE, '1')
    }, [])

    // Pre-load the "Hello World" starter scenario on first visit so the
    // user lands on a runnable YAML, not an empty textarea.
    useEffect(() => {
        if (engineId || scenarioYaml || selectedScenarioId || helloWorldLoading) return
        let cancelled = false
        setHelloWorldLoading(true)
        listScenarios()
            .then(({ scenarios }) => {
                if (cancelled) return
                const hello = scenarios.find((s) =>
                    HELLO_WORLD_HINTS.some((h) => s.id.toLowerCase().includes(h)),
                )
                if (!hello) return
                return getScenario(hello.id).then(({ yaml }) => {
                    if (cancelled) return
                    setSelectedScenarioId(hello.id)
                    setScenarioYaml(yaml)
                })
            })
            .catch(() => {
                // Non-fatal: user can pick a scenario manually.
            })
            .finally(() => {
                if (!cancelled) setHelloWorldLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [
        engineId,
        scenarioYaml,
        selectedScenarioId,
        helloWorldLoading,
        setScenarioYaml,
        setSelectedScenarioId,
    ])

    // Cleanup on unmount: tear down the engine when the operator
    // leaves the page (SPA navigation, route change, etc.). Without
    // this the engineId persists in the Zustand store, so coming back
    // via "Open the lab" would land on the (now stale) dashboard
    // instead of the scenario picker, and the server would keep
    // running the engine until the next stop / restart.
    //
    // engineId lives in the store and changes over the page's life,
    // so we mirror the latest value into a ref to read at teardown
    // without having to re-register the effect on every change.
    const engineIdRef = useRef<string | null>(engineId)
    useEffect(() => {
        engineIdRef.current = engineId
    }, [engineId])
    useEffect(() => {
        return () => {
            const id = engineIdRef.current
            engineWs.disconnect()
            if (id) {
                // Best-effort — if the request never lands (e.g. the
                // server already forgot the engine, or the user is
                // closing the tab) the server's idle reaper handles
                // the leftover.
                deleteEngine(id).catch(() => { })
            }
            // Reset the store regardless so the next mount starts at
            // the scenario picker with no stale snapshot/tail.
            useEngineStore.getState().reset()
        }
    }, [])

    const connectToEngine = useCallback(
        (id: string) => {
            engineWs.connect(id, {
                onSnapshot: (snap) => {
                    setSnapshot(snap)
                    if (snap.tail && snap.tail.length > 0) {
                        appendToLiveTail(snap.tail)
                    }
                },
                onConnected: () => {
                    setConnected(true)
                    // Auto-start the engine right after the WS handshake so
                    // "Run scenario" is a single-click experience instead
                    // of "create then remember to press start".
                    if (autoStartRef.current) {
                        engineWs.sendCommand({ type: 'start' })
                    }
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

    // Fetch scenario YAML when an engine is created or reconnected.
    useEffect(() => {
        if (!engineId) return
        getEngineScenario(engineId)
            .then((data) => setScenarioYaml(data.yaml))
            .catch(() => {
                // Scenario might not be available yet; silently ignore.
            })
    }, [engineId, setScenarioYaml])

    // Reset seed-breach flag whenever the engine changes so the determinism
    // warning fires again for a fresh scenario run.
    useEffect(() => {
        setSeedBroken(false)
    }, [engineId])

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
    const handleStop = useCallback(() => {
        engineWs.sendCommand({ type: 'stop' })
    }, [])
    const handleCascade = useCallback(() => {
        engineWs.sendCommand({ type: 'cascade' })
    }, [])
    const handleSetRate = useCallback((name: string, rps: number) => {
        engineWs.sendCommand({ type: 'set_rate', agent: name, rps })
    }, [])
    const handleSetErrorRate = useCallback((name: string, rate: number) => {
        engineWs.sendCommand({ type: 'set_error_rate', agent: name, rate })
    }, [])
    const handleBurst = useCallback((name: string, count: number) => {
        engineWs.sendCommand({ type: 'burst', agent: name, count })
    }, [])

    // "Back to scenarios" from inside the engine view: tear down the
    // current engine (mirrors the unmount cleanup in the SPA-leave
    // effect) and reset store state so the picker phase renders again
    // without stale snapshot/tail. Stays on the /lab route — no
    // navigation, just a state reset.
    const handleBackToScenarios = useCallback(() => {
        const id = engineId
        engineWs.disconnect()
        if (id) {
            deleteEngine(id).catch(() => {
                // Best-effort: idle reaper picks up leftovers.
            })
        }
        useEngineStore.getState().reset()
        setValidationErrors([])
        setUnavailableCapabilities([])
        setStatusMessage(null)
    }, [engineId, setStatusMessage])

    const isRunning = snapshot?.state === 'running'
    const isSeeded = snapshot?.has_seed ?? false
    const hasYaml = scenarioYaml.trim().length > 0

    const agentNames = useMemo(
        () => snapshot?.agents?.map((a) => a.name) ?? [],
        [snapshot?.agents],
    )

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            {/* Top navigation bar */}
            <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-gray-700/50">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        {engineId ? (
                            <button
                                type="button"
                                onClick={handleBackToScenarios}
                                className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-400 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">{t.lab.backToScenarios}</span>
                            </button>
                        ) : (
                            <Link
                                to="/logcraft"
                                className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-400 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">{t.lab.backToLogCraft}</span>
                            </Link>
                        )}
                        <div className="h-5 w-px bg-gray-700 hidden sm:block" />
                        <h1 className="font-display font-bold text-lg flex items-center gap-2 min-w-0">
                            <FlaskConical className="w-4 h-4 text-brand-500 shrink-0" />
                            <span className="text-brand-500">LogCraft</span>{' '}
                            <span className="text-gray-300">{t.lab.title}</span>
                        </h1>
                        <span
                            className="ml-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/40"
                            title={t.lab.simulatedBadge}
                        >
                            {t.lab.simulatedBadge}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {connected && (
                            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                {t.lab.live}
                            </span>
                        )}
                        <button
                            onClick={() => setShowFirstVisit(true)}
                            className="p-1.5 rounded text-gray-400 hover:text-brand-400 hover:bg-gray-800/60 transition-colors"
                            aria-label="Help"
                            title={t.lab.firstVisitTitle}
                        >
                            <HelpCircle className="w-4 h-4" />
                        </button>
                        <Link
                            to="/tiers"
                            className="text-xs text-gray-400 hover:text-brand-400 transition-colors hidden sm:inline"
                        >
                            {t.auth.tierMatrix}
                        </Link>
                        <UserSelector />
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* First-visit 3-step onboarding wizard. Drives the user
                    through intent → complexity → scenario load + launch.
                    Replaces the old static help banner so the time-to-first-
                    running-engine collapses to ~10 seconds for newcomers. */}
                <OnboardingModal
                    open={showFirstVisit && !engineId}
                    onClose={dismissFirstVisit}
                    onReady={() => {
                        // Wizard pre-loaded a scenario into the store — nothing
                        // else to do until the user clicks "Launch".
                    }}
                    onLaunch={() => {
                        dismissFirstVisit()
                        // Use a microtask so the modal close animation can
                        // start before we kick the (potentially heavy) engine
                        // creation request — keeps the click feel snappy.
                        queueMicrotask(() => {
                            void handleRun()
                        })
                    }}
                />

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

                        {/* Right: YAML Editor + Run */}
                        <div className="lg:w-[500px] flex-shrink-0 flex flex-col">
                            <div className="flex items-center justify-between mb-3 gap-2">
                                <h3 className="text-sm font-semibold text-gray-300">
                                    {t.lab.scenarioYaml}
                                </h3>
                                <label className="flex items-center gap-1.5 text-[11px] text-gray-400 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={autoStart}
                                        onChange={(e) => setAutoStart(e.target.checked)}
                                        className="w-3.5 h-3.5 accent-brand-500"
                                    />
                                    <span>{t.lab.autoStartHint}</span>
                                </label>
                            </div>

                            <button
                                onClick={handleRun}
                                disabled={!hasYaml}
                                className="w-full mb-3 inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-brand-600/20"
                            >
                                {autoStart ? <Play className="w-4 h-4" /> : <FlaskConical className="w-4 h-4" />}
                                {autoStart ? t.lab.launchAndStart : t.lab.launchPaused}
                            </button>

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

                            {unavailableCapabilities.length > 0 && (
                                <div className="mb-3 p-3 rounded-lg bg-amber-900/20 border border-amber-700/50">
                                    <div className="flex items-start gap-2 text-sm text-amber-400">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold mb-1">{t.auth.scenarioNotAvailable}</p>
                                            {unavailableCapabilities.map((cap, i) => (
                                                <p key={i} className="text-xs opacity-80">{cap}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Suspense
                                fallback={
                                    <div
                                        className="bg-gray-900 border border-gray-700/50 rounded-lg animate-pulse"
                                        style={{ minHeight: '360px' }}
                                    />
                                }
                            >
                                <YamlEditor
                                    value={scenarioYaml}
                                    onChange={(next) => {
                                        setScenarioYaml(next)
                                        if (validationErrors.length) setValidationErrors([])
                                        if (unavailableCapabilities.length)
                                            setUnavailableCapabilities([])
                                    }}
                                    errors={validationErrors}
                                    placeholder={t.lab.yamlPlaceholder}
                                    minHeight="360px"
                                />
                            </Suspense>
                        </div>
                    </div>
                ) : (
                    /*
                      ── Live Dashboard Phase ──
                      3-zone workspace built so the operator can keep an eye
                      on log tail + incidents while controlling agents/sinks:
                        Zone A (sticky top): EngineHeader + EngineControls
                                             — controls (incl. Cascade) stay
                                             one click away while scrolling.
                        Zone B (main, xl:col-span-2): collapsible scenario
                                             panel, AgentGrid, SinkGrid.
                        Zone C (sticky side, xl:col-span-1): LogTail above
                                             IncidentTimeline. On <xl viewports
                                             the side panel collapses below B.
                    */
                    <div className="space-y-4">
                        {/* Zone A — sticky control bar */}
                        <div className="sticky top-14 z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-3 bg-gray-950/85 backdrop-blur-md border-b border-gray-800/60">
                            <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
                                <EngineHeader snapshot={snapshot} engineId={engineId} />
                                <EngineControls
                                    isRunning={isRunning}
                                    hasEngine={!!engineId}
                                    onStart={handleStart}
                                    onStop={handleStop}
                                    onCascade={handleCascade}
                                    isSeeded={isSeeded}
                                    seedBroken={seedBroken}
                                    onSeedBreachConfirm={() => setSeedBroken(true)}
                                />
                            </div>
                            {!isRunning && (
                                <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {t.lab.emptyEngineHint}
                                </div>
                            )}
                        </div>

                        {/* Main split: Zone B (left) + Zone C (right sticky side panel) */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                            {/* Zone B — agents, sinks, scenario */}
                            <div className="xl:col-span-2 space-y-4 min-w-0">
                                {scenarioYaml && (
                                    <ScenarioPanel yaml={scenarioYaml} engineId={engineId} />
                                )}
                                <AgentGrid
                                    agents={snapshot?.agents ?? []}
                                    onSetRate={isRunning ? handleSetRate : undefined}
                                    onSetErrorRate={isRunning ? handleSetErrorRate : undefined}
                                    onBurst={isRunning ? handleBurst : undefined}
                                    isSeeded={isSeeded}
                                    seedBroken={seedBroken}
                                    onSeedBreachConfirm={() => setSeedBroken(true)}
                                    runKey={runKey}
                                />
                                <SinkGrid sinks={snapshot?.sinks ?? []} />
                            </div>

                            {/* Zone C — sticky right column for live observation.
                                Tabbed (Logs / Incidents / Drain) so each stream
                                gets the full column height instead of fighting
                                two siblings for 256px each. */}
                            <div className="xl:col-span-1 xl:sticky xl:top-[10.5rem] xl:h-[calc(100vh-12rem)] flex flex-col min-w-0">
                                <ObservationPanel
                                    engineId={engineId}
                                    snapshot={snapshot}
                                    liveTail={liveTail}
                                    clearLiveTail={clearLiveTail}
                                    agentNames={agentNames}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <TierLockModal error={tierError} onClose={() => setTierError(null)} />

            {/* Action result toast — fixed bottom-right, auto-dismissed after 4 s */}
            <AnimatePresence>
                {statusMessage && (
                    <motion.div
                        key={statusMessage}
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium border backdrop-blur-md max-w-sm ${statusMessage.startsWith('✓')
                            ? 'bg-emerald-900/90 border-emerald-500/40 text-emerald-200'
                            : statusMessage.startsWith('✗')
                                ? 'bg-red-900/90 border-red-500/40 text-red-200'
                                : 'bg-gray-800/95 border-gray-600/50 text-gray-200'
                            }`}
                    >
                        {statusMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
