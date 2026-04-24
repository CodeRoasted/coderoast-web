import { Filter, Pause, Play, Trash2 } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    title: string
    description: string
    visibleCount: number
    sourceCount: number
    totalEntries: number
    filtersActive: boolean
    showFilters: boolean
    onToggleFilters: () => void
    isPaused: boolean
    onTogglePause: () => void
    onClear?: () => void
}

/**
 * Top bar of the log feed: title + the three control buttons (filter,
 * pause, clear) and the entry counters. Pure render — owns no state.
 */
export default function LogTailHeader({
    title,
    description,
    visibleCount,
    sourceCount,
    totalEntries,
    filtersActive,
    showFilters,
    onToggleFilters,
    isPaused,
    onTogglePause,
    onClear,
}: Props) {
    const t = useTranslation()
    return (
        <>
            <div className="flex items-center justify-between mb-1 gap-2">
                <span className="text-sm font-medium text-gray-300">{title}</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onToggleFilters}
                        className={`p-1.5 rounded transition-colors ${showFilters || filtersActive
                                ? 'bg-brand-900/40 text-brand-400 hover:bg-brand-900/60'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                            }`}
                        title={t.lab.filters}
                    >
                        <Filter className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onTogglePause}
                        className={`p-1.5 rounded transition-colors ${isPaused
                                ? 'bg-amber-900/40 text-amber-400 hover:bg-amber-900/60'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                            }`}
                        title={isPaused ? 'Resume' : 'Pause'}
                    >
                        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </button>
                    {onClear && (
                        <button
                            onClick={onClear}
                            className="p-1.5 rounded text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 transition-colors"
                            title="Clear feed"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                        <span title="Entries visible in the rolling buffer (last 1 000 received via WebSocket)">
                            {visibleCount}
                            {filtersActive && visibleCount !== sourceCount && (
                                <span className="text-gray-600"> / {sourceCount}</span>
                            )}
                            {' sampled'}
                        </span>
                        <span
                            className="text-gray-600 cursor-help"
                            title="Total log entries produced by the engine since start — includes all records never transmitted"
                        >
                            {' · '}
                            {totalEntries} total
                        </span>
                    </span>
                </div>
            </div>
            <p className="text-xs text-gray-600">{description}</p>
        </>
    )
}
