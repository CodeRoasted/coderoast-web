import { forwardRef } from 'react'
import type { LogLevelName, LogTailEntry } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'

const LEVEL_COLORS: Record<LogLevelName, string> = {
    TRACE: 'text-gray-500',
    DEBUG: 'text-gray-400',
    INFO: 'text-blue-400',
    WARN: 'text-amber-400',
    ERROR: 'text-red-400',
    FATAL: 'text-red-500 font-bold',
}

interface Props {
    sourceCount: number
    entries: readonly LogTailEntry[]
}

/**
 * Scrollable monospace viewport. The parent owns the auto-scroll-on-update
 * behavior by holding the ref and reaching into `.scrollHeight` directly,
 * so this component only renders rows + empty states.
 */
const LogTailViewport = forwardRef<HTMLDivElement, Props>(function LogTailViewport(
    { sourceCount, entries },
    ref,
) {
    const t = useTranslation()
    return (
        <div
            ref={ref}
            className="flex-1 min-h-0 overflow-y-auto overflow-x-auto p-2 font-mono text-xs"
        >
            {sourceCount === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-600">
                    {t.lab.noLogs}
                </div>
            ) : entries.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-600">
                    {t.lab.noLogsMatch}
                </div>
            ) : (
                entries.map((entry, i) => (
                    <div
                        key={i}
                        className="flex gap-2 py-0.5 hover:bg-gray-800/50 px-1 rounded whitespace-nowrap"
                    >
                        {/*
                          Server emits HH:MM:SS already (8 chars, no date
                          prefix). The legacy slice(11,23) assumed an ISO
                          8601 string and produced an empty span — leaving
                          a visible blank column on the left of every row.
                          Render as-is and size the column to fit.
                        */}
                        <span className="text-gray-600 shrink-0 w-[68px]">{entry.timestamp}</span>
                        <span className="text-purple-400 shrink-0 w-[72px] truncate">
                            {entry.agent}
                        </span>
                        <span
                            className={`shrink-0 w-10 ${LEVEL_COLORS[entry.level] ?? 'text-gray-400'}`}
                        >
                            {entry.level}
                        </span>
                        <span className="text-gray-300">{entry.message}</span>
                    </div>
                ))
            )}
        </div>
    )
})

export default LogTailViewport
