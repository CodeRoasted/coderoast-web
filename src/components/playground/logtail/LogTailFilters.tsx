import { X } from 'lucide-react'
import type { LogLevelName } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'

const ALL_LEVELS: readonly LogLevelName[] = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']

interface Props {
    levelFilter: LogLevelName | 'ALL'
    agentFilter: string
    textFilter: string
    agentNames: readonly string[]
    onLevelChange: (level: LogLevelName | 'ALL') => void
    onAgentChange: (agent: string) => void
    onTextChange: (text: string) => void
    onClear: () => void
    filtersActive: boolean
}

/**
 * Three-column filter row: level dropdown, agent dropdown, text search.
 * Surfaced when the user clicks the filter button in `LogTailHeader`.
 */
export default function LogTailFilters({
    levelFilter,
    agentFilter,
    textFilter,
    agentNames,
    onLevelChange,
    onAgentChange,
    onTextChange,
    onClear,
    filtersActive,
}: Props) {
    const t = useTranslation()
    return (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select
                value={levelFilter}
                onChange={(e) => onLevelChange(e.target.value as LogLevelName | 'ALL')}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-200 focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 outline-none"
            >
                <option value="ALL">{t.lab.filterAllLevels}</option>
                {ALL_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                        {`\u2265 ${lvl}`}
                    </option>
                ))}
            </select>
            <select
                value={agentFilter}
                onChange={(e) => onAgentChange(e.target.value)}
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
                    onChange={(e) => onTextChange(e.target.value)}
                    placeholder={t.lab.filterSearch}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 pr-7 text-xs text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 outline-none"
                />
                {filtersActive && (
                    <button
                        onClick={onClear}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-500 hover:text-gray-200"
                        title={t.lab.filterClear}
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    )
}
