import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Radio, Globe2, Copy, ChevronDown, ChevronRight, Filter, X, Search } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getDrainSnapshot } from '@/services/api'
import type { DrainRecord, DrainSnapshot } from '@/services/api'
import type { SinkSnapshot } from '@/types/engine'

interface Props {
    engineId: string | null
    sinks: SinkSnapshot[]
    /// Notify the parent how many records are currently buffered + how
    /// many of those match the active filter. The Playground uses this
    /// to badge the Drain tab without instantiating its own poller.
    onCountsChange?: (counts: { total: number; filtered: number; dropped: number }) => void
}

const POLL_INTERVAL_MS = 2000
const MAX_VISIBLE_RECORDS = 200

/// Heuristic: any HTTP sink whose target host ends in logcraft.demo (or
/// has been rewritten to our loopback) is one we will (have)
/// intercepted. Exported so the parent can decide whether to render the
/// tab at all without instantiating the component.
export function hasDemoHttpSink(sinks: SinkSnapshot[]): boolean {
    return sinks.some(
        (sink) =>
            sink.type === 'http' &&
            (sink.target.includes('logcraft.demo') || sink.target.includes('127.0.0.1')),
    )
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MiB`
}

function formatTime(receivedMs: number): string {
    return new Date(receivedMs).toLocaleTimeString()
}

/// Pretty-print JSON payloads, leave anything else verbatim. The
/// content-type drives the decision; we still defensively try-parse so
/// a mislabeled body doesn't crash the panel.
function formatBody(body: string, contentType: string): string {
    if (!contentType.toLowerCase().includes('json')) return body
    try {
        return JSON.stringify(JSON.parse(body), null, 2)
    } catch {
        return body
    }
}

export default function DrainPanel({ engineId, sinks, onCountsChange }: Props) {
    const t = useTranslation()
    const [snapshot, setSnapshot] = useState<DrainSnapshot | null>(null)
    const [expanded, setExpanded] = useState<Record<number, boolean>>({})
    const [copiedSeq, setCopiedSeq] = useState<number | null>(null)
    const cursorRef = useRef<number>(0)
    const recordsRef = useRef<DrainRecord[]>([])

    /// Filter state — a sink is on the allow-list when its host is in
    /// `targetFilter`; empty Set means "show all". Text filter is a
    /// case-insensitive substring match against body + target. Mirrors
    /// the LogTail filter pattern for consistency.
    const [targetFilter, setTargetFilter] = useState<Set<string>>(new Set())
    const [textFilter, setTextFilter] = useState('')
    const [showSearch, setShowSearch] = useState(false)

    const shouldRender = useMemo(() => hasDemoHttpSink(sinks), [sinks])

    const poll = useCallback(async () => {
        if (!engineId) return
        try {
            const fresh = await getDrainSnapshot(engineId, cursorRef.current)
            if (fresh.records.length > 0) {
                const merged = [...recordsRef.current, ...fresh.records]
                recordsRef.current = merged.slice(-MAX_VISIBLE_RECORDS)
            }
            cursorRef.current = fresh.cursor
            setSnapshot({ ...fresh, records: recordsRef.current })
        } catch {
            // Silent: drain is best-effort. A 403 just means the user
            // lacks the snapshot permission; the rest of the playground
            // keeps working.
        }
    }, [engineId])

    useEffect(() => {
        cursorRef.current = 0
        recordsRef.current = []
        setSnapshot(null)
        setExpanded({})
        setTargetFilter(new Set())
        setTextFilter('')
    }, [engineId])

    useEffect(() => {
        if (!engineId || !shouldRender) return
        let cancelled = false
        const tick = async () => {
            if (cancelled) return
            await poll()
        }
        void tick()
        const id = window.setInterval(() => {
            void tick()
        }, POLL_INTERVAL_MS)
        return () => {
            cancelled = true
            window.clearInterval(id)
        }
    }, [engineId, shouldRender, poll])

    const records = useMemo(() => snapshot?.records ?? [], [snapshot?.records])
    const targets = snapshot?.targets ?? []
    const dropped = snapshot?.dropped ?? 0

    // Apply filters before rendering. We always render newest-first.
    const filtered = useMemo(() => {
        const text = textFilter.trim().toLowerCase()
        const allowList = targetFilter
        if (allowList.size === 0 && !text) return records
        return records.filter((record) => {
            if (allowList.size > 0 && !allowList.has(record.sink_target)) return false
            if (text) {
                const haystack = `${record.sink_target} ${record.body}`.toLowerCase()
                if (!haystack.includes(text)) return false
            }
            return true
        })
    }, [records, targetFilter, textFilter])

    // Notify parent so the surrounding tab can show a badge.
    useEffect(() => {
        onCountsChange?.({
            total: records.length,
            filtered: filtered.length,
            dropped,
        })
    }, [records.length, filtered.length, dropped, onCountsChange])

    if (!shouldRender) return null

    const filtersActive = targetFilter.size > 0 || textFilter.trim().length > 0

    const toggleTarget = (target: string) => {
        setTargetFilter((prev) => {
            const next = new Set(prev)
            if (next.has(target)) next.delete(target)
            else next.add(target)
            return next
        })
    }

    const clearFilters = () => {
        setTargetFilter(new Set())
        setTextFilter('')
    }

    const copyBody = async (record: DrainRecord) => {
        try {
            await navigator.clipboard.writeText(record.body)
            setCopiedSeq(record.seq)
            window.setTimeout(() => setCopiedSeq((s) => (s === record.seq ? null : s)), 1500)
        } catch {
            // Clipboard may be blocked (insecure context, …). Body is
            // already visible — silent no-op is fine.
        }
    }

    return (
        <div className="bg-gray-900 border border-amber-700/30 rounded-xl overflow-hidden flex flex-col h-full min-h-0">
            {/* Header — explicit ownership banner. The user must
                understand the request never left our process. */}
            <div className="px-4 py-3 border-b border-gray-700/50 shrink-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                        <Radio className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-sm font-medium text-amber-300">
                            {t.lab.drain.title}
                        </span>
                        <span className="text-[10px] text-amber-400/80 bg-amber-900/30 border border-amber-700/40 px-2 py-0.5 rounded-full font-mono shrink-0">
                            *.logcraft.demo
                        </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => setShowSearch((v) => !v)}
                            className={`p-1.5 rounded transition-colors ${showSearch || textFilter
                                    ? 'bg-amber-900/40 text-amber-300 hover:bg-amber-900/60'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                                }`}
                            title={t.lab.filters}
                        >
                            <Filter className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                            {filtered.length}
                            {filtersActive && filtered.length !== records.length && (
                                <span className="text-gray-600"> / {records.length}</span>
                            )}
                            {' captured'}
                        </span>
                    </div>
                </div>
                <p className="text-xs text-gray-500">{t.lab.drain.caption}</p>

                {/* Always-visible target chips — clicking one filters
                    to that target. Mirrors how operators triage real
                    multi-sink incidents: pick the suspect, drill in. */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <Globe2 className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <span className="text-[11px] text-gray-500 uppercase tracking-wider shrink-0">
                        {t.lab.drain.targets}:
                    </span>
                    {targets.length === 0 ? (
                        <span className="text-[11px] text-gray-600 italic">
                            {t.lab.drain.noTargets}
                        </span>
                    ) : (
                        targets.map((target) => {
                            const active = targetFilter.has(target)
                            return (
                                <button
                                    key={target}
                                    type="button"
                                    onClick={() => toggleTarget(target)}
                                    className={`text-[10px] px-2 py-0.5 rounded font-mono border transition-colors ${active
                                            ? 'bg-amber-500/20 border-amber-500/60 text-amber-200'
                                            : 'bg-gray-800 border-amber-800/40 text-amber-300 hover:bg-amber-900/20'
                                        }`}
                                    title={active ? t.lab.filterClear : target}
                                >
                                    {target}
                                </button>
                            )
                        })
                    )}
                    {filtersActive && (
                        <button
                            onClick={clearFilters}
                            className="ml-auto text-[10px] text-gray-500 hover:text-amber-300 flex items-center gap-1"
                        >
                            <X className="w-3 h-3" />
                            {t.lab.filterClear}
                        </button>
                    )}
                </div>

                {showSearch && (
                    <div className="mt-3 relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                        <input
                            type="text"
                            value={textFilter}
                            onChange={(e) => setTextFilter(e.target.value)}
                            placeholder={t.lab.filterSearch}
                            className="w-full bg-gray-800 border border-gray-700 rounded pl-7 pr-7 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 outline-none"
                        />
                        {textFilter && (
                            <button
                                onClick={() => setTextFilter('')}
                                className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-500 hover:text-gray-200"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Records list — fills remaining height, scrolls. */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
                {records.length === 0 ? (
                    <p className="text-xs text-gray-600 italic py-4 text-center">
                        {t.lab.drain.empty}
                    </p>
                ) : filtered.length === 0 ? (
                    <p className="text-xs text-gray-600 italic py-4 text-center">
                        {t.lab.noLogsMatch}
                    </p>
                ) : (
                    [...filtered].reverse().map((record) => {
                        const isOpen = expanded[record.seq] ?? false
                        return (
                            <div
                                key={record.seq}
                                className="border border-gray-700/50 rounded-lg bg-gray-950/40"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExpanded((prev) => ({
                                            ...prev,
                                            [record.seq]: !isOpen,
                                        }))
                                    }
                                    className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-800/40 transition-colors"
                                >
                                    {isOpen ? (
                                        <ChevronDown className="w-3 h-3 text-gray-500 shrink-0" />
                                    ) : (
                                        <ChevronRight className="w-3 h-3 text-gray-500 shrink-0" />
                                    )}
                                    <span className="text-[10px] text-gray-500 font-mono shrink-0">
                                        #{record.seq}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-mono shrink-0">
                                        {formatTime(record.received_ms)}
                                    </span>
                                    {record.sink_target && (
                                        <span
                                            className="text-[10px] text-amber-300 font-mono truncate"
                                            title={`${t.lab.drain.sentTo} ${record.sink_target}`}
                                        >
                                            → {record.sink_target}
                                        </span>
                                    )}
                                    <span className="ml-auto text-[10px] text-gray-600 font-mono shrink-0">
                                        {formatBytes(record.bytes)}
                                    </span>
                                    <span className="text-[10px] text-gray-600 font-mono shrink-0">
                                        {record.content_type}
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="border-t border-gray-700/50">
                                        <div className="flex items-center justify-end px-3 py-1 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => void copyBody(record)}
                                                className="text-[10px] text-gray-500 hover:text-amber-300 flex items-center gap-1"
                                            >
                                                <Copy className="w-3 h-3" />
                                                {copiedSeq === record.seq
                                                    ? t.lab.drain.copied
                                                    : t.lab.drain.copy}
                                            </button>
                                        </div>
                                        <pre className="px-3 pb-3 text-[11px] text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap break-all">
                                            {formatBody(record.body, record.content_type)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            {dropped > 0 && (
                <div className="px-3 py-1 text-[10px] text-gray-600 text-right border-t border-gray-700/50 shrink-0">
                    {dropped}
                    {t.lab.drain.droppedSuffix}
                </div>
            )}
        </div>
    )
}
