import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
    Activity,
    AlertTriangle,
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    ArrowLeftRight,
    Check,
    GitCompareArrows,
    Loader2,
    Pencil,
    Pin,
    TrendingUp,
    Waves,
} from 'lucide-react'
import { runInsightDiff, PolicyDenialError } from '@/services/api'
import type { ChangeReportResponse, DiffRankedChange, DiffSeverity } from '@/types/diff'

// Severity = a neutral→warm HEAT ladder (slate → amber → orange → crimson),
// deliberately NOT git red/green. Color carries *importance*; change-type
// (the icon below) and *which pane lights up* carry appeared-vs-vanished — so
// the user never reads color as added/removed. Classes are literal so Tailwind
// emits them. `line` styles both a highlighted log line and the active row.
const SEVERITY: Record<DiffSeverity, { label: string; badge: string; line: string }> = {
    critical: {
        label: 'CRITICAL',
        badge: 'bg-rose-600/15 text-rose-300 border-rose-600/50',
        line: 'border-rose-500 bg-rose-500/10',
    },
    high: {
        label: 'SUSPICIOUS',
        badge: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
        line: 'border-orange-500 bg-orange-500/10',
    },
    medium: {
        label: 'NOTABLE',
        badge: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
        line: 'border-amber-400 bg-amber-400/10',
    },
    low: {
        label: 'WEAK',
        badge: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
        line: 'border-slate-500 bg-slate-500/10',
    },
}

const SEV_RANK: Record<DiffSeverity, number> = { low: 0, medium: 1, high: 2, critical: 3 }

// Change-type: a neutral (uncolored) icon + label, decoupled from severity.
const KIND: Record<string, { Icon: typeof Activity; label: string }> = {
    new_error_pattern: { Icon: AlertTriangle, label: 'error appeared' },
    escalated_pattern: { Icon: TrendingUp, label: 'escalated' },
    resolved_pattern: { Icon: Check, label: 'resolved' },
    new_template: { Icon: ArrowUpRight, label: 'appeared' },
    vanished_template: { Icon: ArrowDownRight, label: 'vanished' },
    frequency_shift: { Icon: ArrowLeftRight, label: 'shifted' },
    entropy_shift: { Icon: Activity, label: 'branching' },
    emerging_tail: { Icon: Waves, label: 'emerging in tail' },
}
const KIND_FALLBACK = { Icon: Activity, label: 'changed' }

function countLines(text: string): number {
    if (text.length === 0) return 0
    return text.split('\n').filter((line) => line.trim().length > 0).length
}

// Build lineIndex -> severity for one pane, from all active changes. When two
// changes touch the same line, the higher severity wins.
function buildHighlights(
    changes: DiffRankedChange[],
    active: Set<number>,
    key: 'baseline_line_refs' | 'changed_line_refs'
): Map<number, DiffSeverity> {
    const map = new Map<number, DiffSeverity>()
    for (const idx of active) {
        const change = changes[idx]
        if (!change) continue
        for (const line of change[key] ?? []) {
            const prev = map.get(line)
            if (prev === undefined || SEV_RANK[change.severity] > SEV_RANK[prev])
                map.set(line, change.severity)
        }
    }
    return map
}

function LogPane({
    title,
    text,
    highlights,
    focusLine,
    focusNonce,
}: {
    title: string
    text: string
    highlights: Map<number, DiffSeverity>
    focusLine: number
    focusNonce: number // bumped on every hover/click so re-focusing the same line re-scrolls
}) {
    const lines = useMemo(() => text.split('\n'), [text])
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (focusLine < 0 || !containerRef.current) return
        containerRef.current
            .querySelector<HTMLElement>(`[data-line="${focusLine}"]`)
            ?.scrollIntoView({ block: 'center' })
    }, [focusNonce, focusLine])

    return (
        <div className="min-w-0">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-400">{title}</span>
                <span className="text-xs text-gray-600">
                    {highlights.size > 0 ? `${highlights.size} flagged` : `${lines.length} lines`}
                </span>
            </div>
            <div
                ref={containerRef}
                className="h-80 overflow-auto rounded-lg border border-gray-800 bg-gray-900/60 font-mono text-[11px] leading-relaxed py-1"
            >
                {lines.map((line, idx) => {
                    const sev = highlights.get(idx)
                    return (
                        <div
                            key={idx}
                            data-line={idx}
                            className={`flex border-l-2 ${sev ? SEVERITY[sev].line : 'border-transparent'}`}
                        >
                            <span className="select-none w-10 shrink-0 px-2 text-right text-gray-700">
                                {idx + 1}
                            </span>
                            <span
                                className={`px-2 whitespace-pre-wrap break-all ${sev ? 'text-gray-100' : 'text-gray-500'}`}
                            >
                                {line || ' '}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function ChangeRow({
    change,
    index,
    active,
    pinned,
    onHover,
    onPin,
}: {
    change: DiffRankedChange
    index: number
    active: boolean
    pinned: boolean
    onHover: (index: number) => void
    onPin: (index: number) => void
}) {
    const sev = SEVERITY[change.severity] ?? SEVERITY.low
    const kind = KIND[change.kind] ?? KIND_FALLBACK
    const Icon = kind.Icon
    const refCount = (change.baseline_line_refs?.length ?? 0) + (change.changed_line_refs?.length ?? 0)
    return (
        <li>
            <button
                type="button"
                onMouseEnter={() => onHover(index)}
                onFocus={() => onHover(index)}
                onClick={() => onPin(index)}
                aria-pressed={pinned}
                className={`w-full text-left flex gap-3 py-3 pl-3 pr-2 border-l-2 transition-colors ${
                    active ? sev.line : 'border-transparent hover:bg-gray-800/20'
                }`}
            >
                <span
                    className={`mt-0.5 h-fit px-1.5 py-0.5 rounded text-[10px] font-semibold border ${sev.badge}`}
                >
                    {sev.label}
                </span>
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-0.5">
                        <Icon className="w-3.5 h-3.5" />
                        <span className="font-mono">{kind.label}</span>
                        {refCount > 0 && (
                            <span className="text-gray-600">
                                · {refCount} line{refCount > 1 ? 's' : ''}
                            </span>
                        )}
                        {pinned && <Pin className="w-3 h-3 text-brand-400 fill-brand-400" />}
                    </div>
                    <p className="text-gray-100 text-sm break-words leading-snug">{change.summary}</p>
                    {change.evidence?.map((line, idx) => (
                        <p key={idx} className="text-gray-500 text-xs font-mono break-words">
                            — {line}
                        </p>
                    ))}
                </div>
            </button>
        </li>
    )
}

export default function InsightDiff() {
    const [baseline, setBaseline] = useState('')
    const [changed, setChanged] = useState('')
    const [report, setReport] = useState<ChangeReportResponse | null>(null)
    const [submitted, setSubmitted] = useState<{ baseline: string; changed: string } | null>(null)
    const [pinned, setPinned] = useState<Set<number>>(new Set()) // click-to-stick (multiple)
    const [hovered, setHovered] = useState<number | null>(null) // transient preview
    // Scroll target — INDEPENDENT of pin/hover state. The nonce bumps on every
    // interaction so re-focusing the same (e.g. already-pinned) change re-scrolls.
    const [focus, setFocus] = useState<{ baseline: number; changed: number; nonce: number }>({
        baseline: -1,
        changed: -1,
        nonce: 0,
    })
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const canCompare = useMemo(
        () => baseline.trim().length > 0 && changed.trim().length > 0 && !loading,
        [baseline, changed, loading]
    )

    const handleCompare = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await runInsightDiff({ baseline, changed })
            setReport(result)
            setSubmitted({ baseline, changed })
            setPinned(new Set())
            setHovered(null)
            setFocus({ baseline: -1, changed: -1, nonce: 0 })
        } catch (err) {
            setReport(null)
            if (err instanceof PolicyDenialError) {
                setError(
                    err.quotaKey
                        ? `Daily free limit reached${err.quotaLimit !== null ? ` (${err.quotaLimit}/day)` : ''}. Try again tomorrow, or run it locally with the CLI.`
                        : err.reason || 'Access denied.'
                )
            } else {
                setError(err instanceof Error ? err.message : 'Comparison failed.')
            }
        } finally {
            setLoading(false)
        }
    }, [baseline, changed])

    const resetResult = useCallback(() => {
        setReport(null)
        setPinned(new Set())
        setHovered(null)
        setFocus({ baseline: -1, changed: -1, nonce: 0 })
    }, [])

    // Highlight = every pinned change, plus the one being hovered (preview).
    const activeSet = useMemo(() => {
        const set = new Set(pinned)
        if (hovered != null) set.add(hovered)
        return set
    }, [pinned, hovered])

    const changes = useMemo(() => report?.ranked_changes ?? [], [report])
    const baselineHl = useMemo(
        () => buildHighlights(changes, activeSet, 'baseline_line_refs'),
        [changes, activeSet]
    )
    const changedHl = useMemo(
        () => buildHighlights(changes, activeSet, 'changed_line_refs'),
        [changes, activeSet]
    )
    // Re-aim the panes at a change's first line in each, bumping the nonce so an
    // identical target (e.g. re-hovering a pinned change) still re-scrolls.
    const focusOn = useCallback(
        (idx: number) =>
            setFocus((prev) => ({
                baseline: changes[idx]?.baseline_line_refs?.[0] ?? -1,
                changed: changes[idx]?.changed_line_refs?.[0] ?? -1,
                nonce: prev.nonce + 1,
            })),
        [changes]
    )
    const togglePin = useCallback(
        (idx: number) =>
            setPinned((cur) => {
                const next = new Set(cur)
                if (next.has(idx)) next.delete(idx)
                else next.add(idx)
                return next
            }),
        []
    )
    const suppressed = report ? report.summary.total_changes - report.summary.significant_changes : 0

    return (
        <main className="bg-gray-950 min-h-screen pt-28 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold mb-3">
                    <GitCompareArrows className="w-4 h-4" />
                    INSIGHT DIFF
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
                    What changed between two logs — and what's just noise
                </h1>
                <p className="text-gray-400 mt-2 max-w-2xl">
                    Paste two log streams (a baseline run and a changed run). InSight ingests both and
                    ranks the structurally significant changes — hover or pin a change to see exactly
                    which lines it touched.
                </p>

                {/* Input */}
                {!report && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            {(
                                [
                                    ['Baseline log', baseline, setBaseline],
                                    ['Changed log', changed, setChanged],
                                ] as const
                            ).map(([label, value, setter]) => (
                                <div key={label}>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="text-sm font-medium text-gray-300">{label}</label>
                                        <span className="text-xs text-gray-600">{countLines(value)} lines</span>
                                    </div>
                                    <textarea
                                        value={value}
                                        onChange={(event) => setter(event.target.value)}
                                        spellCheck={false}
                                        placeholder="paste log lines…"
                                        className="w-full h-64 rounded-lg border border-gray-800 bg-gray-900/60 p-3 font-mono text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-600 resize-y"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleCompare}
                                disabled={!canCompare}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {loading ? 'Comparing…' : 'Compare'}
                            </button>
                            <span className="text-xs text-gray-600">
                                Free · metered per day · logs are not stored
                            </span>
                        </div>
                    </>
                )}

                {error && (
                    <div className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
                        {error}
                    </div>
                )}

                {/* Result */}
                {report && submitted && (
                    <div className="mt-8 space-y-6">
                        <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-800 bg-gray-900/60 p-5">
                            <div>
                                <p className="text-2xl font-bold text-white">
                                    {report.summary.total_changes.toLocaleString()} changes,{' '}
                                    <span className="text-brand-400">
                                        {report.summary.significant_changes}
                                    </span>{' '}
                                    structurally significant
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {typeof report.summary.stability_score === 'number' && (
                                        <>stability {report.summary.stability_score.toFixed(2)} · </>
                                    )}
                                    {report.inputs.baseline.lines_observed.toLocaleString()} →{' '}
                                    {report.inputs.changed.lines_observed.toLocaleString()} lines
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={resetResult}
                                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 text-sm hover:border-brand-500/60 hover:text-brand-300 transition-colors"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                                New comparison
                            </button>
                        </div>

                        {report.ranked_changes.length === 0 ? (
                            <p className="text-gray-400 text-sm">
                                No structurally significant changes — all{' '}
                                {report.summary.total_changes.toLocaleString()} observed changes are within
                                noise.
                            </p>
                        ) : (
                            <>
                                {/* Log panes, side by side */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <LogPane
                                        title="Baseline"
                                        text={submitted.baseline}
                                        highlights={baselineHl}
                                        focusLine={focus.baseline}
                                        focusNonce={focus.nonce}
                                    />
                                    <LogPane
                                        title="Changed"
                                        text={submitted.changed}
                                        highlights={changedHl}
                                        focusLine={focus.changed}
                                        focusNonce={focus.nonce}
                                    />
                                </div>

                                {/* Ranked changes, below + scrollable */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                                            Significant changes
                                        </h2>
                                        {pinned.size > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setPinned(new Set())}
                                                className="text-xs text-gray-500 hover:text-gray-300"
                                            >
                                                clear {pinned.size} pinned
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">
                                        hover to preview · click to pin (stack multiple) · color = severity,
                                        not add/remove
                                    </p>
                                    <ul
                                        onMouseLeave={() => setHovered(null)}
                                        className="max-h-[28rem] overflow-auto rounded-lg border border-gray-800 divide-y divide-gray-800/60"
                                    >
                                        {report.ranked_changes.map((change, idx) => (
                                            <ChangeRow
                                                key={idx}
                                                change={change}
                                                index={idx}
                                                active={activeSet.has(idx)}
                                                pinned={pinned.has(idx)}
                                                onHover={(i) => {
                                                    setHovered(i)
                                                    focusOn(i)
                                                }}
                                                onPin={(i) => {
                                                    togglePin(i)
                                                    focusOn(i)
                                                }}
                                            />
                                        ))}
                                    </ul>
                                    {suppressed > 0 && (
                                        <p className="text-gray-600 text-xs mt-3 italic">
                                            {suppressed.toLocaleString()} changes suppressed as noise
                                            (proportional / low-frequency).
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {report && (
                    <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
                        <ArrowRight className="w-3 h-3 text-brand-400" />
                        Want this in CI? The same engine runs as a local CLI and a GitHub Action.
                    </div>
                )}
            </div>
        </main>
    )
}
