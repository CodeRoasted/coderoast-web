import { Suspense, lazy } from 'react'
import { AlertCircle, FlaskConical, Play } from 'lucide-react'
import ScenarioSelector from '@/components/playground/ScenarioSelector'
import PlaygroundModeSwitch from '@/components/playground/lab/PlaygroundModeSwitch'
import { useTranslation } from '@/hooks/useTranslation'
import type { PlaygroundMode } from '@/types/playground'

// CodeMirror is ~200kB gzipped — only loaded once the user actually
// reaches the scenario-edit phase. Keeps the initial Playground chunk
// under the 500 kB warning threshold.
const YamlEditor = lazy(() => import('@/components/playground/YamlEditor'))

interface Props {
    mode: PlaygroundMode
    onModeChange: (mode: PlaygroundMode) => void
    scenarioYaml: string
    setScenarioYaml: (next: string) => void
    autoStart: boolean
    setAutoStart: (next: boolean) => void
    validationErrors: string[]
    setValidationErrors: (next: string[]) => void
    unavailableCapabilities: string[]
    setUnavailableCapabilities: (next: string[]) => void
    onRun: () => void
}

/**
 * Phase 1 of the Lab: pick a scenario on the left, edit / inspect its
 * YAML and launch on the right. Renders the validation/capability
 * inline alerts above the editor when present.
 */
export default function LabPickerView({
    mode,
    onModeChange,
    scenarioYaml,
    setScenarioYaml,
    autoStart,
    setAutoStart,
    validationErrors,
    setValidationErrors,
    unavailableCapabilities,
    setUnavailableCapabilities,
    onRun,
}: Props) {
    const t = useTranslation()
    const modeCopy = t.lab.playgrounds[mode]
    const hasYaml = scenarioYaml.trim().length > 0

    return (
        <div className="space-y-6">
            <PlaygroundModeSwitch mode={mode} onModeChange={onModeChange} />

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Scenario Picker */}
                <div className="flex-1 min-w-0">
                    <div className="mb-6">
                        <h2 className="font-display text-xl font-bold text-gray-100 mb-1">
                            {modeCopy.selectScenario}
                        </h2>
                        <p className="text-gray-400 text-xs">{modeCopy.selectScenarioDesc}</p>
                    </div>
                    <ScenarioSelector mode={mode} />
                </div>

                {/* Right: YAML Editor + Run */}
                <div className="lg:w-[500px] flex-shrink-0 flex flex-col">
                    <div className="flex items-center justify-between mb-3 gap-2">
                        <h3 className="text-sm font-semibold text-gray-300">{t.lab.scenarioYaml}</h3>
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
                        onClick={onRun}
                        disabled={!hasYaml}
                        className="w-full mb-3 inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-brand-600/20"
                    >
                        {autoStart ? <Play className="w-4 h-4" /> : <FlaskConical className="w-4 h-4" />}
                        {autoStart ? modeCopy.launchAndStart : modeCopy.launchPaused}
                    </button>

                    {validationErrors.length > 0 && (
                        <div className="mb-3 p-3 rounded-lg bg-red-900/20 border border-red-700/50">
                            <div className="flex items-start gap-2 text-sm text-red-400">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <div>
                                    {validationErrors.map((err, i) => (
                                        <p key={i} className="text-xs">
                                            {err}
                                        </p>
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
                                    <p className="text-xs font-semibold mb-1">
                                        {t.auth.scenarioNotAvailable}
                                    </p>
                                    {unavailableCapabilities.map((cap, i) => (
                                        <p key={i} className="text-xs opacity-80">
                                            {cap}
                                        </p>
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
                                if (unavailableCapabilities.length) setUnavailableCapabilities([])
                            }}
                            errors={validationErrors}
                            placeholder={t.lab.yamlPlaceholder}
                            minHeight="360px"
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
