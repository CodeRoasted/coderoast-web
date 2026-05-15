import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { CheckCircle, Clock, Tag, Loader2, AlertCircle, X } from 'lucide-react'
import { useEngineStore } from '@/store/useEngineStore'
import { listScenarios, getScenario, PolicyDenialError, type ScenarioMeta } from '@/services/api'
import { useTranslation } from '@/hooks/useTranslation'
import type { PlaygroundMode } from '@/types/playground'
import TierLockModal from './TierLockModal'

const CATEGORY_ORDER = ['Simple', 'Demo', 'Showcase']

interface Props {
    mode: PlaygroundMode
}

export default function ScenarioPicker({ mode }: Props) {
    const { selectedScenarioId, setSelectedScenarioId, setScenarioYaml } = useEngineStore()
    const t = useTranslation()
    const [scenarios, setScenarios] = useState<ScenarioMeta[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectError, setSelectError] = useState<string | null>(null)
    const [selectingId, setSelectingId] = useState<string | null>(null)
    const [accessError, setAccessError] = useState<PolicyDenialError | null>(null)
    const selectControllerRef = useRef<AbortController | null>(null)

    useEffect(() => {
        const controller = new AbortController()
        setLoading(true)
        setError(null)
        listScenarios(mode, controller.signal)
            .then(({ scenarios: list }) => setScenarios(list))
            .catch((e) => {
                // Ignore aborts caused by mode switches / unmounts
                if (e instanceof DOMException && e.name === 'AbortError') return
                if (e instanceof Error && e.message.startsWith('Request to') && e.message.endsWith('timed out') && controller.signal.aborted) return
                setError(e instanceof Error ? e.message : String(e))
            })
            .finally(() => setLoading(false))
        return () => controller.abort()
    }, [mode])

    const handleSelectScenario = useCallback(
        async (id: string, isCurrentlySelected: boolean) => {
            if (isCurrentlySelected) {
                setSelectedScenarioId(null)
                setScenarioYaml('')
                setSelectError(null)
                return
            }
            // Cancel any previous in-flight selection fetch
            selectControllerRef.current?.abort()
            const controller = new AbortController()
            selectControllerRef.current = controller

            setSelectedScenarioId(id)
            setSelectingId(id)
            setSelectError(null)
            try {
                const { yaml } = await getScenario(id, mode, controller.signal)
                setScenarioYaml(yaml)
            } catch (fetchError) {
                // Silently drop aborts — user clicked a different scenario
                if (controller.signal.aborted) return
                setSelectedScenarioId(null)
                setScenarioYaml('')
                if (fetchError instanceof PolicyDenialError) {
                    setAccessError(fetchError)
                } else {
                    setSelectError(fetchError instanceof Error ? fetchError.message : String(fetchError))
                }
            } finally {
                // Only clear spinner if we're still the active selection request
                if (selectControllerRef.current === controller) {
                    setSelectingId(null)
                }
            }
        },
        [mode, setSelectedScenarioId, setScenarioYaml],
    )

    const grouped = useMemo(() => {
        const map = new Map<string, ScenarioMeta[]>()
        for (const s of scenarios) {
            const cat = s.category || 'Other'
            if (!map.has(cat)) map.set(cat, [])
            map.get(cat)!.push(s)
        }
        // Sort categories by preferred order, then alphabetically
        return [...map.entries()].sort(([a], [b]) => {
            const ai = CATEGORY_ORDER.indexOf(a)
            const bi = CATEGORY_ORDER.indexOf(b)
            if (ai !== -1 && bi !== -1) return ai - bi
            if (ai !== -1) return -1
            if (bi !== -1) return 1
            return a.localeCompare(b)
        })
    }, [scenarios])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span className="text-sm">{t.lab.loadingScenarios}</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-900/20 border border-red-700/50 text-sm text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{t.lab.scenarioLoadError}: {error}</span>
            </div>
        )
    }

    return (
        <>
        <div className="space-y-8">
            {grouped.map(([category, items]) => (
                <div key={category}>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                            {category}
                        </span>
                        <div className="flex-1 h-px bg-gray-800" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {items.map((s) => {
                            const selected = selectedScenarioId === s.id
                            const fetching = selectingId === s.id
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => handleSelectScenario(s.id, selected)}
                                    className={`text-left p-4 rounded-xl border transition-all duration-200 ${selected
                                        ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10'
                                        : 'border-gray-700/50 bg-gray-900 hover:border-gray-600 hover:bg-gray-800/80'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-mono text-sm font-semibold text-white leading-tight">
                                            {s.name || s.id.split('/').pop()}
                                        </span>
                                        {fetching && (
                                            <Loader2 className="w-4 h-4 animate-spin text-brand-400 flex-shrink-0 mt-0.5" />
                                        )}
                                        {!fetching && selected && (
                                            <CheckCircle className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                                        )}
                                    </div>
                                    {s.description && (
                                        <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">
                                            {s.description}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-2">
                                        {s.duration && (
                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                {s.duration}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1 text-xs text-gray-600">
                                            <Tag className="w-3 h-3" />
                                            {s.id}
                                        </span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
        {selectError && (
            <div className="flex items-center justify-between gap-3 p-3 mt-4 rounded-xl bg-red-900/20 border border-red-700/50 text-sm text-red-400">
                <div className="flex items-center gap-2 min-w-0">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{selectError}</span>
                </div>
                <button onClick={() => setSelectError(null)} className="shrink-0 hover:text-red-300 transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>
        )}
        <TierLockModal error={accessError} onClose={() => setAccessError(null)} />
        </>
    )
}
