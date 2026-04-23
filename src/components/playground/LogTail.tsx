import { useRef, useEffect, useMemo, useState } from 'react'
import { Pause, Play, Trash2, Filter, X } from 'lucide-react'
import type { LogTailEntry, LogLevelName } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    entries: LogTailEntry[]
    totalEntries?: number
    onClear?: () => void
    agentNames?: string[]
}

const levelColors: Record<LogLevelName, string> = {
    TRACE: 'text-gray-500',
    DEBUG: 'text-gray-400',
    INFO: 'text-blue-400',
    WARN: 'text-amber-400',
    ERROR: 'text-red-400',
    FATAL: 'text-red-500 font-bold',
}

const ALL_LEVELS: LogLevelName[] = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']

export default function LogTail({ entries, totalEntries = 0, onClear, agentNames = [] }: Props) {
    const t = useTranslation()
    const containerRef = useRef<HTMLDivElement>(null)
    const [isPaused, setIsPaused] = useState(false)
    const [frozenEntries, setFrozenEntries] = useState<LogTailEntry[]>([])

    const [levelFilter, setLevelFilter] = useState<LogLevelName | 'ALL'>('ALL')
    const [agentFilter, setAgentFilter] = useState<string>('ALL')
    const [textFilter, setTextFilter] = useState('')
    const [showFilters, setShowFilters] = useState(false)

    const handlePauseToggle = () => {
        if (!isPaused) {
            setFrozenEntries(entries)
        } else {
            setFrozenEntries([])
        }
        setIsPaused(!isPaused)
    }

    const sourceEntries = isPaused ? frozenEntries : entries

    const filtered = useMemo(() => {
        const text = textFilter.trim().toLowerCase()
        if (levelFilter === 'ALL' && agentFilter === 'ALL' && !text) return sourceEntries
        return sourceEntries.filter((e) => {
            if (levelFilter !== 'ALL' && e.level !== levelFilter) return false
            if (agentFilter !== 'ALL' && e.agent !== agentFilter) return false
            if (text && !e.message.toLowerCase().includes(text)) return false
            return true
        })
    }, [sourceEntries, levelFilter, agentFilter, textFilter])

    useEffect(() => {
        if (!isPaused && containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [filtered, isPaused])

    const filtersActive =
        levelFilter !== 'ALL' || agentFilter !== 'ALL' || textFilter.trim().length > 0

    const clearFilters = () => {
        setLevelFilter('ALL')
        setAgentFilter('ALL')
        setTextFilter('')
    }

    return (
        <div className="bg-gray-900 border border-gray-700/50 rounded-xl overflow-hidden flex flex-col h-full min-h-0">
            <div className="px-4 py-3 border-b border-gray-700/50 shrink-0">
                <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="text-sm font-medium text-gray-300">{t.lab.logTail}</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters((v) => !v)}
                            className={`p-1.5 rounded transition-colors ${showFilters || filtersActive
                                ? 'bg-brand-900/40 text-brand-400 hover:bg-brand-900/60'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                                }`}
                            title={t.lab.filters}
                        >
                            <Filter className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handlePauseToggle}
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
                                {filtered.length}
                                {filtersActive && filtered.length !== sourceEntries.length && (
                                    <span className="text-gray-600"> / {sourceEntries.length}</span>
                                )}
                                {' sampled'}
                            </span>
                            <span
                                className="text-gray-600 cursor-help"
                                title="Total log entries produced by the engine since start — includes all records never transmitted"
                            >
                                {' · '}{totalEntries} total
                            </span>
                        </span>
                    </div>
                </div>
                <p className="text-xs text-gray-600">{t.lab.logTailDesc}</p>

                {showFilters && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value as LogLevelName | 'ALL')}
                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-200 focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 outline-none"
                        >
                            <option value="ALL">{t.lab.filterAllLevels}</option>
                            {ALL_LEVELS.map((lvl) => (
                                <option key={lvl} value={lvl}>
                                    {lvl}
                                </option>
                            ))}
                        </select>
                        <select
                            value={agentFilter}
                            onChange={(e) => setAgentFilter(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-200 focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 outline-none"
                        >
                            <option value="ALL">{t.lab.filterAllAgents}</option>
                            {agentNames.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                        <div className="relative">
                            <input
                                type="text"
                                value={textFilter}
                                onChange={(e) => setTextFilter(e.target.value)}
                                placeholder={t.lab.filterSearch}
                                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 pr-7 text-xs text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 outline-none"
                            />
                            {filtersActive && (
                                <button
                                    onClick={clearFilters}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-500 hover:text-gray-200"
                                    title={t.lab.filterClear}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-auto p-2 font-mono text-xs">
                {sourceEntries.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-600">
                        {t.lab.noLogs}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-600">
                        {t.lab.noLogsMatch}
                    </div>
                ) : (
                    filtered.map((entry, i) => (
                        <div key={i} className="flex gap-2 py-0.5 hover:bg-gray-800/50 px-1 rounded whitespace-nowrap">
                            <span className="text-gray-600 shrink-0 w-[68px]">
                                {/*
                                  Server emits HH:MM:SS already (8 chars,
                                  no date prefix). The legacy slice(11,23)
                                  assumed an ISO 8601 string and produced
                                  an empty span \u2014 leaving a visible blank
                                  column on the left of every row. Render
                                  as-is and size the column to fit.
                                */}
                                {entry.timestamp}
                            </span>
                            <span className="text-purple-400 shrink-0 w-[72px] truncate">
                                {entry.agent}
                            </span>
                            <span
                                className={`shrink-0 w-10 ${levelColors[entry.level] ?? 'text-gray-400'}`}
                            >
                                {entry.level}
                            </span>
                            <span className="text-gray-300">{entry.message}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
