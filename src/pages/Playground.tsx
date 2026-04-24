import { useEffect, useMemo } from 'react'
import { useEngineStore } from '@/store/useEngineStore'
import OnboardingModal from '@/components/playground/OnboardingModal'
import TierLockModal from '@/components/playground/TierLockModal'
import LabTopBar from '@/components/playground/lab/LabTopBar'
import LabPickerView from '@/components/playground/lab/LabPickerView'
import LabDashboardView from '@/components/playground/lab/LabDashboardView'
import LabStatusToast from '@/components/playground/lab/LabStatusToast'
import { useEngineLifecycle } from '@/hooks/useEngineLifecycle'
import { useFirstVisitOnboarding } from '@/hooks/useFirstVisitOnboarding'

/**
 * The Lab page — thin orchestrator that wires:
 *   – `useEngineLifecycle` (engine state machine + commands)
 *   – `useFirstVisitOnboarding` (cookie-gated wizard + hello-world preload)
 *   – `LabTopBar` (sticky nav)
 *   – `LabPickerView` (no engine yet) OR `LabDashboardView` (engine attached)
 *   – `OnboardingModal`, `TierLockModal`, `LabStatusToast` (overlays)
 */
export default function Lab() {
    const engineId = useEngineStore((s) => s.engineId)
    const snapshot = useEngineStore((s) => s.snapshot)
    const connected = useEngineStore((s) => s.connected)
    const scenarioYaml = useEngineStore((s) => s.scenarioYaml)
    const setScenarioYaml = useEngineStore((s) => s.setScenarioYaml)
    const statusMessage = useEngineStore((s) => s.statusMessage)
    const liveTail = useEngineStore((s) => s.liveTail)
    const clearLiveTail = useEngineStore((s) => s.clearLiveTail)
    const selectedScenarioId = useEngineStore((s) => s.selectedScenarioId)

    const lifecycle = useEngineLifecycle()
    const onboarding = useFirstVisitOnboarding()

    // Clear validation state whenever the user picks a different scenario.
    // (Lives here rather than the hook because it's purely a UI concern.)
    useEffect(() => {
        lifecycle.setValidationErrors([])
        lifecycle.setUnavailableCapabilities([])
        // setters are stable; we only want to react to scenario id changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedScenarioId])

    const isRunning = snapshot?.state === 'running'
    const isSeeded = snapshot?.has_seed ?? false

    const agentNames = useMemo(
        () => snapshot?.agents?.map((a) => a.name) ?? [],
        [snapshot?.agents],
    )

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            <LabTopBar
                engineId={engineId}
                connected={connected}
                onBackToScenarios={lifecycle.handleBackToScenarios}
                onRequestHelp={onboarding.requestFirstVisit}
            />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* First-visit 3-step onboarding wizard. Drives the user
                    through intent → complexity → scenario load + launch.
                    Time-to-first-running-engine collapses to ~10 seconds. */}
                <OnboardingModal
                    open={onboarding.showFirstVisit && !engineId}
                    onClose={onboarding.dismissFirstVisit}
                    onReady={() => {
                        // Wizard pre-loaded a scenario into the store — nothing
                        // else to do until the user clicks "Launch".
                    }}
                    onLaunch={() => {
                        onboarding.dismissFirstVisit()
                        // Microtask so the modal close animation can start
                        // before the (potentially heavy) engine creation
                        // request — keeps the click feel snappy.
                        queueMicrotask(() => {
                            void lifecycle.handleRun()
                        })
                    }}
                />

                {!engineId ? (
                    <LabPickerView
                        scenarioYaml={scenarioYaml}
                        setScenarioYaml={setScenarioYaml}
                        autoStart={lifecycle.autoStart}
                        setAutoStart={lifecycle.setAutoStart}
                        validationErrors={lifecycle.validationErrors}
                        setValidationErrors={lifecycle.setValidationErrors}
                        unavailableCapabilities={lifecycle.unavailableCapabilities}
                        setUnavailableCapabilities={lifecycle.setUnavailableCapabilities}
                        onRun={lifecycle.handleRun}
                    />
                ) : (
                    <LabDashboardView
                        engineId={engineId}
                        snapshot={snapshot}
                        scenarioYaml={scenarioYaml}
                        liveTail={liveTail}
                        clearLiveTail={clearLiveTail}
                        agentNames={agentNames}
                        isRunning={isRunning}
                        isSeeded={isSeeded}
                        seedBroken={lifecycle.seedBroken}
                        runKey={lifecycle.runKey}
                        onSeedBreachConfirm={() => lifecycle.setSeedBroken(true)}
                        onStart={lifecycle.handleStart}
                        onStop={lifecycle.handleStop}
                        onCascade={lifecycle.handleCascade}
                        onSetRate={lifecycle.handleSetRate}
                        onSetErrorRate={lifecycle.handleSetErrorRate}
                        onBurst={lifecycle.handleBurst}
                    />
                )}
            </div>

            <TierLockModal
                error={lifecycle.tierError}
                onClose={() => lifecycle.setTierError(null)}
            />
            <LabStatusToast message={statusMessage} />
        </div>
    )
}
