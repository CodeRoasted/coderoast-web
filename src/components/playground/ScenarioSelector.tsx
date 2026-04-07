import { useEffect, useState, useMemo, useCallback } from 'react'
import { CheckCircle, Clock, Tag, Loader2, AlertCircle } from 'lucide-react'
import { useEngineStore } from '@/store/useEngineStore'
import { listScenarios, getScenario, type ScenarioMeta } from '@/services/api'
import { useTranslation } from '@/hooks/useTranslation'

const CATEGORY_ORDER = ['Simple', 'Demo', 'Showcase']

export default function ScenarioPicker() {
    const { selectedScenarioId, setSelectedScenarioId, setScenarioYaml } = useEngineStore()
    const t = useTranslation()
    const [scenarios, setScenarios] = useState<ScenarioMeta[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        listScenarios()
            .then(({ scenarios: list }) => setScenarios(list))
            .catch((e) => setError(e instanceof Error ? e.message : String(e)))
            .finally(() => setLoading(false))
    }, [])

    const handleSelectScenario = useCallback(
        async (id: string, isCurrentlySelected: boolean) => {
            if (isCurrentlySelected) {
                // Deselect
                setSelectedScenarioId(null)
                setScenarioYaml('')
            } else {
                // Select and fetch YAML
                setSelectedScenarioId(id)
                try {
                    const { yaml } = await getScenario(id)
                    setScenarioYaml(yaml)
                } catch {
                    // If YAML fetch fails, clear selection
                    setSelectedScenarioId(null)
                    setScenarioYaml('')
                }
            }
        },
        [setSelectedScenarioId, setScenarioYaml]
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
                                        {selected && (
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
    )
}
