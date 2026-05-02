import { useEffect, useMemo, useRef, useState } from 'react'
import type { LogLevelName, LogTailEntry } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'
import LogTailHeader from './logtail/LogTailHeader'
import LogTailFilters from './logtail/LogTailFilters'
import LogTailViewport from './logtail/LogTailViewport'

// Severity order — higher index = higher severity.
const LEVEL_ORDER: Record<LogLevelName, number> = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5,
}

interface Props {
    entries: LogTailEntry[]
    totalEntries?: number
    onClear?: () => void
    agentNames?: string[]
}

/**
 * Live log viewer with pause / clear / filter and auto-scroll. Owns all
 * filter & pause state; delegates rendering to header / filters / viewport
 * subcomponents.
 */
export default function LogTail({
    entries,
    totalEntries = 0,
    onClear,
    agentNames = [],
}: Props) {
    const t = useTranslation()
    const containerRef = useRef<HTMLDivElement>(null)

    const [isPaused, setIsPaused] = useState(false)
    const [frozenEntries, setFrozenEntries] = useState<LogTailEntry[]>([])

    const [levelFilter, setLevelFilter] = useState<LogLevelName | 'ALL'>('ALL')
    const [agentFilter, setAgentFilter] = useState<string>('ALL')
    const [textFilter, setTextFilter] = useState('')
    const [showFilters, setShowFilters] = useState(false)

    const handlePauseToggle = () => {
        if (!isPaused) setFrozenEntries(entries)
        else setFrozenEntries([])
        setIsPaused(!isPaused)
    }

    const handleClear = () => {
        setFrozenEntries([])
        setIsPaused(false)
        onClear?.()
    }

    const sourceEntries = isPaused ? frozenEntries : entries

    const filtered = useMemo(() => {
        const text = textFilter.trim().toLowerCase()
        if (levelFilter === 'ALL' && agentFilter === 'ALL' && !text) return sourceEntries
        return sourceEntries.filter((e) => {
            if (levelFilter !== 'ALL' && LEVEL_ORDER[e.level] < LEVEL_ORDER[levelFilter])
                return false
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
                <LogTailHeader
                    title={t.lab.logTail}
                    description={t.lab.logTailDesc}
                    visibleCount={filtered.length}
                    sourceCount={sourceEntries.length}
                    totalEntries={totalEntries}
                    filtersActive={filtersActive}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters((v) => !v)}
                    isPaused={isPaused}
                    onTogglePause={handlePauseToggle}
                    onClear={handleClear}
                />
                {showFilters && (
                    <LogTailFilters
                        levelFilter={levelFilter}
                        agentFilter={agentFilter}
                        textFilter={textFilter}
                        agentNames={agentNames}
                        onLevelChange={setLevelFilter}
                        onAgentChange={setAgentFilter}
                        onTextChange={setTextFilter}
                        onClear={clearFilters}
                        filtersActive={filtersActive}
                    />
                )}
            </div>
            <LogTailViewport
                ref={containerRef}
                sourceCount={sourceEntries.length}
                entries={filtered}
            />
        </div>
    )
}
