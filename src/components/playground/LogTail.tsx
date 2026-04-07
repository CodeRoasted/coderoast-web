import { useRef, useEffect, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import type { LogTailEntry, LogLevelName } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    entries: LogTailEntry[]
    totalEntries?: number
}

const levelColors: Record<LogLevelName, string> = {
    TRACE: 'text-gray-500',
    DEBUG: 'text-gray-400',
    INFO: 'text-blue-400',
    WARN: 'text-amber-400',
    ERROR: 'text-red-400',
    FATAL: 'text-red-500 font-bold',
}

export default function LogTail({ entries, totalEntries = 0 }: Props) {
    const t = useTranslation()
    const containerRef = useRef<HTMLDivElement>(null)
    const [isPaused, setIsPaused] = useState(false)
    const [frozenEntries, setFrozenEntries] = useState<LogTailEntry[]>([])

    const handlePauseToggle = () => {
        if (!isPaused) {
            // Pause: freeze current entries
            setFrozenEntries(entries)
        } else {
            // Resume: clear frozen entries
            setFrozenEntries([])
        }
        setIsPaused(!isPaused)
    }

    useEffect(() => {
        if (!isPaused && containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [entries, isPaused])

    const percentage =
        totalEntries > 0 ? Math.round((entries.length / totalEntries) * 100) : 0

    return (
        <div className="bg-gray-900 border border-gray-700/50 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-700/50">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-300">{t.lab.logTail}</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePauseToggle}
                            className={`p-1.5 rounded transition-colors ${isPaused
                                ? 'bg-amber-900/40 text-amber-400 hover:bg-amber-900/60'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                                }`}
                            title={isPaused ? 'Resume' : 'Pause'}
                        >
                            {isPaused ? (
                                <Play className="w-4 h-4" />
                            ) : (
                                <Pause className="w-4 h-4" />
                            )}
                        </button>
                        <span className="text-xs text-gray-500">
                            {entries.length} / {totalEntries} {t.lab.entries}
                            {totalEntries > 0 && (
                                <span className="ml-1 text-gray-600">
                                    ({percentage}%)
                                </span>
                            )}
                        </span>
                    </div>
                </div>
                <p className="text-xs text-gray-600">{t.lab.logTailDesc}</p>
            </div>
            <div ref={containerRef} className="h-64 overflow-y-auto p-2 font-mono text-xs">
                {entries.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-600">
                        {t.lab.noLogs}
                    </div>
                ) : (
                    (isPaused ? frozenEntries : entries).map((entry, i) => (
                        <div key={i} className="flex gap-2 py-0.5 hover:bg-gray-800/50 px-2 rounded">
                            <span className="text-gray-600 shrink-0 w-20 truncate">
                                {entry.timestamp.slice(11, 23)}
                            </span>
                            <span className="text-purple-400 shrink-0 w-20 truncate">
                                {entry.agent}
                            </span>
                            <span
                                className={`shrink-0 w-12 text-center ${levelColors[entry.level] ?? 'text-gray-400'}`}
                            >
                                {entry.level}
                            </span>
                            <span className="text-gray-300 truncate">{entry.message}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
