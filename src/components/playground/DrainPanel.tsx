import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Radio, Globe2, Copy, ChevronDown, ChevronRight } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getDrainSnapshot } from '@/services/api'
import type { DrainRecord, DrainSnapshot } from '@/services/api'
import type { SinkSnapshot } from '@/types/engine'

interface Props {
    engineId: string | null
    sinks: SinkSnapshot[]
}

const POLL_INTERVAL_MS = 2000
const MAX_VISIBLE_RECORDS = 50

/// Heuristic: any HTTP sink whose target host ends in logcraft.demo is
/// one we will (have) intercepted. We rely on the snapshot rather than
/// the drain response so the panel can render its banner *before* the
/// first record arrives — operators see the demo intercept is wired up
/// even if traffic hasn't started yet.
function hasDemoHttpSink(sinks: SinkSnapshot[]): boolean {
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

export default function DrainPanel({ engineId, sinks }: Props) {
    const t = useTranslation()
    const [snapshot, setSnapshot] = useState<DrainSnapshot | null>(null)
    const [expanded, setExpanded] = useState<Record<number, boolean>>({})
    const [copiedSeq, setCopiedSeq] = useState<number | null>(null)
    const cursorRef = useRef<number>(0)
    const recordsRef = useRef<DrainRecord[]>([])

    const shouldRender = useMemo(() => hasDemoHttpSink(sinks), [sinks])

    const poll = useCallback(async () => {
        if (!engineId) return
        try {
            const fresh = await getDrainSnapshot(engineId, cursorRef.current)
            // Merge: keep the existing tail + append new records (they
            // arrive ordered by seq from the server). Then clip to the
            // visible window so the DOM doesn't grow unbounded — the
            // server's bounded ring already caps total retention.
            if (fresh.records.length > 0) {
                const merged = [...recordsRef.current, ...fresh.records]
                const clipped = merged.slice(-MAX_VISIBLE_RECORDS)
                recordsRef.current = clipped
            }
            cursorRef.current = fresh.cursor
            setSnapshot({ ...fresh, records: recordsRef.current })
        } catch {
            // Silent: drain is a best-effort observation panel. A 403
            // here just means the user lacks the snapshot permission;
            // the rest of the playground keeps working.
        }
    }, [engineId])

    // Reset accumulated state when the engine changes — otherwise
    // records from the previous run would bleed into the new one.
    useEffect(() => {
        cursorRef.current = 0
        recordsRef.current = []
        setSnapshot(null)
        setExpanded({})
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

    if (!shouldRender) return null

    const records = snapshot?.records ?? []
    const targets = snapshot?.targets ?? []
    const dropped = snapshot?.dropped ?? 0

    const copyBody = async (record: DrainRecord) => {
        try {
            await navigator.clipboard.writeText(record.body)
            setCopiedSeq(record.seq)
            window.setTimeout(() => setCopiedSeq((s) => (s === record.seq ? null : s)), 1500)
        } catch {
            // Clipboard may be blocked (insecure context, permission
            // denied, …). Falls back to silent no-op; the body is
            // already visible on screen.
        }
    }

    return (
        <div>
            {/* Banner — explicit ownership: this is OUR sink, not a
                third-party endpoint. The user must understand the
                request never left our process. */}
            <div className="mb-3">
                <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                        {t.lab.drain.title}
                    </h3>
                    <span className="text-[10px] text-amber-400/80 bg-amber-900/30 border border-amber-700/40 px-2 py-0.5 rounded-full font-mono">
                        *.logcraft.demo
                    </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{t.lab.drain.caption}</p>
            </div>

            <div className="bg-gray-900 border border-amber-700/30 rounded-xl p-4">
                {/* Targets list — the real-world endpoints these
                    payloads would have hit. */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Globe2 className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-[11px] text-gray-500 uppercase tracking-wider">
                        {t.lab.drain.targets}:
                    </span>
                    {targets.length === 0 ? (
                        <span className="text-[11px] text-gray-600 italic">
                            {t.lab.drain.noTargets}
                        </span>
                    ) : (
                        targets.map((target) => (
                            <span
                                key={target}
                                className="text-[10px] text-amber-300 bg-gray-800 border border-amber-800/40 px-2 py-0.5 rounded font-mono"
                            >
                                {target}
                            </span>
                        ))
                    )}
                </div>

                {records.length === 0 ? (
                    <p className="text-xs text-gray-600 italic py-4 text-center">
                        {t.lab.drain.empty}
                    </p>
                ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                        {[...records].reverse().map((record) => {
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
                        })}
                    </div>
                )}

                {dropped > 0 && (
                    <p className="text-[10px] text-gray-600 mt-2 text-right">
                        {dropped}
                        {t.lab.drain.droppedSuffix}
                    </p>
                )}
            </div>
        </div>
    )
}
