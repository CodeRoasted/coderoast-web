import { AlertCircle } from 'lucide-react'
import EngineControls from '@/components/playground/EngineControls'
import EngineHeader from '@/components/playground/EngineHeader'
import AgentGrid from '@/components/playground/AgentGrid'
import SinkGrid from '@/components/playground/SinkGrid'
import ObservationPanel from '@/components/playground/ObservationPanel'
import ScenarioPanel from '@/components/playground/ScenarioPanel'
import type { EngineSnapshot, InsightReport, InsightStatus, LogTailEntry } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    engineId: string
    snapshot: EngineSnapshot | null
    scenarioYaml: string
    liveTail: LogTailEntry[]
    clearLiveTail: () => void
    agentNames: string[]
    insightStatus: InsightStatus | null
    insightReports: InsightReport[]
    insightLoading: boolean
    insightError: string | null
    isRunning: boolean
    onStart: () => void
    onStop: () => void
    onPlay: () => void
    onPause: () => void
    onSetPlaybackSpeed: (multiplier: number) => void
    onAdvance: (durationNs: number) => void
    onCascade?: () => void
    onSetRate?: (name: string, rps: number) => void
    onSetErrorRate?: (name: string, rate: number) => void
    onBurst?: (name: string, count: number) => void
}

/**
 * Phase 2 of the Lab — live dashboard once an engine is attached.
 *
 * 3-zone workspace built so the operator can keep an eye on log tail +
 * incidents while controlling agents/sinks:
 *   Zone A (sticky top): EngineHeader + EngineControls — controls (incl.
 *                        Cascade) stay one click away while scrolling.
 *   Zone B (main, xl:col-span-2): collapsible scenario panel, AgentGrid,
 *                        SinkGrid.
 *   Zone C (sticky side, xl:col-span-1): ObservationPanel (Logs /
 *                        Incidents / Drain). On <xl viewports this
 *                        collapses below B.
 */
export default function LabDashboardView({
    engineId,
    snapshot,
    scenarioYaml,
    liveTail,
    clearLiveTail,
    agentNames,
    insightStatus,
    insightReports,
    insightLoading,
    insightError,
    isRunning,
    onStart,
    onStop,
    onPlay,
    onPause,
    onSetPlaybackSpeed,
    onAdvance,
    onCascade,
    onSetRate,
    onSetErrorRate,
    onBurst,
}: Props) {
    const t = useTranslation()
    return (
        <div className="space-y-4">
            {/* Zone A — sticky control bar */}
            <div className="sticky top-14 z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-3 bg-gray-950/85 backdrop-blur-md border-b border-gray-800/60">
                <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
                    <EngineHeader snapshot={snapshot} engineId={engineId} />
                    <EngineControls
                        snapshot={snapshot}
                        hasEngine
                        onStart={onStart}
                        onStop={onStop}
                        onPlay={onPlay}
                        onPause={onPause}
                        onSetPlaybackSpeed={onSetPlaybackSpeed}
                        onAdvance={onAdvance}
                        onCascade={onCascade}
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
                    {scenarioYaml && <ScenarioPanel yaml={scenarioYaml} engineId={engineId} />}
                    <AgentGrid
                        agents={snapshot?.agents ?? []}
                        onSetRate={onSetRate}
                        onSetErrorRate={onSetErrorRate}
                        onBurst={onBurst}
                    />
                    <SinkGrid sinks={snapshot?.sinks ?? []} />
                </div>

                {/* Zone C — sticky right column for live observation.
                    On <xl viewports it stacks below Zone B; give it a
                    fixed 520 px height so the flex-1 chain inside
                    ObservationPanel / LogTail has something to fill.
                    On xl+ the sticky viewport-height column takes over. */}
                <div className="xl:col-span-1 xl:sticky xl:top-[10.5rem] h-[520px] xl:h-[calc(100vh-12rem)] flex flex-col min-w-0">
                    <ObservationPanel
                        engineId={engineId}
                        snapshot={snapshot}
                        liveTail={liveTail}
                        clearLiveTail={clearLiveTail}
                        agentNames={agentNames}
                        insightStatus={insightStatus}
                        insightReports={insightReports}
                        insightLoading={insightLoading}
                        insightError={insightError}
                    />
                </div>
            </div>
        </div>
    )
}
