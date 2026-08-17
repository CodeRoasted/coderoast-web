import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
    Activity,
    AlertTriangle,
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    ArrowLeftRight,
    BadgeCheck,
    Check,
    Flag,
    FlaskConical,
    GitCompareArrows,
    Loader2,
    Pencil,
    Pin,
    TrendingUp,
    Waves,
} from 'lucide-react'
import { runInsightDiff, PolicyDenialError } from '@/services/api'
import type { ChangeReportResponse, DiffRankedChange, DiffSeverity } from '@/types/diff'
import ProductNavbar from '@/components/ProductNavbar'
import Footer from '@/components/Footer'
import { siftChrome } from '@/config/productChrome'
import { useTranslation } from '@/hooks/useTranslation'
import { diffPresets, type DiffPreset, type DiffProvenance } from '@/data/diffPresets'
import { groupThousands } from '@/utils/format'

// Severity = a neutral→warm HEAT ladder (slate → amber → orange → crimson),
// deliberately NOT git red/green. Color carries *importance*; change-type
// (the icon below) and *which pane lights up* carry appeared-vs-vanished — so
// the user never reads color as added/removed. Classes are literal so Tailwind
// emits them. `line` styles both a highlighted log line and the active row.
// Display labels are i18n (t.diff.severity / t.diff.kind); these consts carry only
// the locale-invariant CSS + icon mapping.
const SEVERITY: Record<DiffSeverity, { badge: string; line: string }> = {
    critical: {
        badge: 'bg-rose-600/15 text-rose-300 border-rose-600/50',
        line: 'border-rose-500 bg-rose-500/10',
    },
    high: {
        badge: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
        line: 'border-orange-500 bg-orange-500/10',
    },
    medium: {
        badge: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
        line: 'border-amber-400 bg-amber-400/10',
    },
    low: {
        badge: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
        line: 'border-slate-500 bg-slate-500/10',
    },
}

const SEV_RANK: Record<DiffSeverity, number> = { low: 0, medium: 1, high: 2, critical: 3 }

// Tone = what colour a change/line gets. Regressions use the severity heat;
// a RECOVERY (an error cleared) reads GREEN — a *semantic* better/worse signal,
// NOT git add/remove. One tone drives both the row badge and the line highlight.
type Tone = DiffSeverity | 'recovery'
const TONE: Record<Tone, { badge: string; line: string }> = {
    ...SEVERITY,
    recovery: {
        badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
        line: 'border-emerald-500 bg-emerald-500/10',
    },
}
const TONE_RANK: Record<Tone, number> = { low: 0, medium: 1, recovery: 2, high: 3, critical: 4 }
const toneOf = (change: DiffRankedChange): Tone =>
    change.polarity === 'recovery' ? 'recovery' : change.severity

// Change-type: a neutral (uncolored) icon, decoupled from severity. The label is
// i18n (t.diff.kind[change.kind] ?? t.diff.kind.fallback).
const KIND_ICON: Record<string, typeof Activity> = {
    new_error_pattern: AlertTriangle,
    escalated_pattern: TrendingUp,
    resolved_pattern: Check,
    new_template: ArrowUpRight,
    vanished_template: ArrowDownRight,
    frequency_shift: ArrowLeftRight,
    entropy_shift: Activity,
    emerging_tail: Waves,
    // DN-31.D9 — the roll-up row: a unit of work that changed outcome. Flag, not
    // AlertTriangle: this row is the headline regardless of DIRECTION (a unit can flip
    // red→green too), so it must not borrow the error glyph.
    unit_outcome_changed: Flag,
}

// Provenance is a two-value closed set (see t.diff.provenance). Its chrome —
// icon + colour — is locale-invariant, so it lives here; the two labels are i18n.
const PROVENANCE: Record<DiffProvenance, { icon: typeof Activity; chip: string; caption: string }> = {
    'real-ci': {
        icon: BadgeCheck,
        chip: 'bg-brand-500/15 text-brand-300 border-brand-500/40',
        caption: 'text-brand-400/90',
    },
    generated: {
        icon: FlaskConical,
        chip: 'bg-gray-700/30 text-gray-400 border-gray-600/50',
        caption: 'text-gray-500',
    },
}

/** The i18n shape behind one preset id. `story` is present only where the copy
 *  carries a narrative; otherwise the one-line description is the narrative. */
interface PresetCopy {
    label: string
    description: string
    story?: string[]
}

function countLines(text: string): number {
    if (text.length === 0) return 0
    return text.split('\n').filter((line) => line.trim().length > 0).length
}

// EVERY number this page renders goes through here — there is no second formatter on
// this surface, and `toLocaleString` is not used on it. The grouping policy and the
// argument for it live with the shared helper (`@/utils/format`), which `/tiers` now
// renders through as well: one formatter, so two shipped surfaces cannot drift apart.

// Build lineIndex -> tone for one pane, from all active changes. When two
// changes touch the same line, the higher-ranked tone wins.
function buildHighlights(
    changes: DiffRankedChange[],
    active: Set<number>,
    key: 'baseline_line_refs' | 'changed_line_refs'
): Map<number, Tone> {
    const map = new Map<number, Tone>()
    for (const idx of active) {
        const change = changes[idx]
        if (!change) continue
        const tone = toneOf(change)
        for (const line of change[key] ?? []) {
            const prev = map.get(line)
            if (prev === undefined || TONE_RANK[tone] > TONE_RANK[prev]) map.set(line, tone)
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
    highlights: Map<number, Tone>
    focusLine: number
    focusNonce: number // bumped on every hover/click so re-focusing the same line re-scrolls
}) {
    const t = useTranslation()
    const lines = useMemo(() => text.split('\n'), [text])
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (focusLine < 0 || !container) return
        const el = container.querySelector<HTMLElement>(`[data-line="${focusLine}"]`)
        if (!el) return
        // Scroll WITHIN the pane only. scrollIntoView would also scroll the page
        // (every scrollable ancestor), which moves the window scrollbar and makes
        // pinning multiple changes unusable — so centre the line by nudging the
        // container's own scrollTop instead.
        const delta =
            el.getBoundingClientRect().top -
            container.getBoundingClientRect().top -
            container.clientHeight / 2 +
            el.clientHeight / 2
        container.scrollTo({ top: container.scrollTop + delta, behavior: 'smooth' })
    }, [focusNonce, focusLine])

    return (
        <div className="min-w-0">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-400">{title}</span>
                <span className="text-xs text-gray-600">
                    {highlights.size > 0
                        ? `${highlights.size} ${t.diff.flagged}`
                        : `${lines.length} ${t.diff.lines}`}
                </span>
            </div>
            <div
                ref={containerRef}
                className="h-80 overflow-auto rounded-lg border border-gray-800 bg-gray-900/60 font-mono text-[11px] leading-relaxed py-1"
            >
                {lines.map((line, idx) => {
                    const tone = highlights.get(idx)
                    return (
                        <div
                            key={idx}
                            data-line={idx}
                            className={`flex border-l-2 ${tone ? TONE[tone].line : 'border-transparent'}`}
                        >
                            <span className="select-none w-10 shrink-0 px-2 text-right text-gray-700">
                                {idx + 1}
                            </span>
                            <span
                                className={`px-2 whitespace-pre-wrap break-all ${tone ? 'text-gray-100' : 'text-gray-500'}`}
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
    const t = useTranslation()
    const tone = toneOf(change)
    const style = TONE[tone]
    const Icon = KIND_ICON[change.kind] ?? Activity
    const kindLabel = (t.diff.kind as Record<string, string>)[change.kind] ?? t.diff.kind.fallback
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
                    active ? style.line : 'border-transparent hover:bg-gray-800/20'
                }`}
            >
                <span
                    className={`mt-0.5 h-fit px-1.5 py-0.5 rounded text-[10px] font-semibold border ${style.badge}`}
                >
                    {t.diff.severity[tone]}
                </span>
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-0.5">
                        <Icon className="w-3.5 h-3.5" />
                        <span className="font-mono">{kindLabel}</span>
                        {refCount > 0 && (
                            <span className="text-gray-600">
                                · {refCount} {refCount > 1 ? t.diff.lines : t.diff.line}
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
    const t = useTranslation()
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
    // Which preset the inputs currently hold, and which one is still being
    // fetched. The real CI pairs are ~340-440 KB assets pulled on demand, so
    // choosing one is asynchronous and can fail.
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
    const [presetLoading, setPresetLoading] = useState<string | null>(null)
    // Monotonic token: a second click must not be overwritten by a slower first
    // fetch landing after it.
    const presetRequest = useRef(0)

    const canCompare = useMemo(
        () => baseline.trim().length > 0 && changed.trim().length > 0 && !loading,
        [baseline, changed, loading]
    )

    const runCompare = useCallback(async (base: string, chg: string) => {
        setLoading(true)
        setError(null)
        try {
            const result = await runInsightDiff({ baseline: base, changed: chg })
            setReport(result)
            setSubmitted({ baseline: base, changed: chg })
            // Auto-pin everything notable-or-worse so all the suspicious lines
            // light up across both panes the moment the report lands.
            const autoPinned = new Set<number>()
            result.ranked_changes.forEach((change, index) => {
                if (SEV_RANK[change.severity] >= SEV_RANK.medium) autoPinned.add(index)
            })
            setPinned(autoPinned)
            setHovered(null)
            setFocus({ baseline: -1, changed: -1, nonce: 0 })
        } catch (err) {
            setReport(null)
            if (err instanceof PolicyDenialError) {
                setError(
                    err.quotaKey
                        ? t.diff.error.quotaReached.replace(
                              '{perDay}',
                              err.quotaLimit !== null ? ` (${err.quotaLimit}/day)` : ''
                          )
                        : err.reason || t.diff.error.accessDenied
                )
            } else {
                setError(err instanceof Error ? err.message : t.diff.error.failed)
            }
        } finally {
            setLoading(false)
        }
    }, [t])

    const handleCompare = useCallback(
        () => runCompare(baseline, changed),
        [runCompare, baseline, changed]
    )

    // Swap which side is baseline vs changed. A regression one way is a recovery
    // the other, so flipping is the fastest way to sanity-check polarity. If a
    // report is on screen, re-run flipped so the other direction is one click away.
    const handleSwap = useCallback(() => {
        setBaseline(changed)
        setChanged(baseline)
        setError(null)
        // A swapped pair is no longer the pair the sample brief describes — its
        // narrative and its published figures are directional.
        setSelectedPreset(null)
        if (report) runCompare(changed, baseline)
    }, [baseline, changed, report, runCompare])

    const resetResult = useCallback(() => {
        setReport(null)
        setPinned(new Set())
        setHovered(null)
        setFocus({ baseline: -1, changed: -1, nonce: 0 })
    }, [])

    // Load a built-in sample pair into the inputs — the visitor then hits Compare.
    // Generated fixtures resolve on the spot; the real CI pairs fetch their
    // published logs the first time they are chosen (cached thereafter).
    const loadPreset = useCallback(
        async (preset: DiffPreset) => {
            const token = ++presetRequest.current
            setError(null)
            setSelectedPreset(preset.id)
            setPresetLoading(preset.id)
            try {
                const pair = await preset.load()
                if (presetRequest.current !== token) return // superseded by a later click
                setBaseline(pair.baseline)
                setChanged(pair.changed)
            } catch {
                if (presetRequest.current !== token) return
                setSelectedPreset(null)
                setError(t.diff.error.presetFailed)
            } finally {
                if (presetRequest.current === token) setPresetLoading(null)
            }
        },
        [t]
    )

    const selected = useMemo(
        () => diffPresets.find((preset) => preset.id === selectedPreset) ?? null,
        [selectedPreset]
    )
    const presetCopy = t.diff.presets as Record<string, PresetCopy | undefined>

    // Highlight = every pinned change, plus the one being hovered (preview).
    const activeSet = useMemo(() => {
        const set = new Set(pinned)
        if (hovered != null) set.add(hovered)
        return set
    }, [pinned, hovered])

    const changes = useMemo(() => report?.ranked_changes ?? [], [report])
    // Render in the backend's order — it already ranks regressions → recoveries
    // → presence → rate → shape, then significance; re-sorting here would undo
    // that. The source index rides along for pin / hover / focus.
    const sortedChanges = useMemo(
        () => changes.map((change, index) => ({ change, index })),
        [changes]
    )
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
        <>
            <ProductNavbar {...siftChrome(t)} />
            <main className="bg-gray-950 min-h-screen pt-28 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold mb-3">
                    <GitCompareArrows className="w-4 h-4" />
                    {t.diff.eyebrow}
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
                    {t.diff.title}
                </h1>
                <p className="text-gray-400 mt-2 max-w-2xl">
                    {t.diff.subtitle}
                </p>

                {/* Input */}
                {!report && (
                    <>
                        <div className="mt-8">
                            <span className="text-xs text-gray-500">{t.diff.loadSample}</span>
                            {/* Every preset states its provenance HERE, at the point of
                                choosing — not in a tooltip. An unlabelled fixture beside a
                                labelled real log would let a visitor assume both are real. */}
                            <div className="mt-2 flex flex-wrap items-stretch gap-2">
                                {diffPresets.map((preset) => {
                                    const meta = presetCopy[preset.id]
                                    const chrome = PROVENANCE[preset.provenance]
                                    const isLoading = presetLoading === preset.id
                                    const isSelected = selectedPreset === preset.id
                                    const Icon = isLoading ? Loader2 : chrome.icon
                                    return (
                                        <button
                                            key={preset.id}
                                            type="button"
                                            onClick={() => loadPreset(preset)}
                                            disabled={presetLoading !== null}
                                            aria-pressed={isSelected}
                                            title={meta?.description}
                                            className={`px-3 py-1.5 rounded-xl border text-left transition-colors disabled:opacity-50 disabled:cursor-wait ${
                                                isSelected
                                                    ? 'border-brand-500/60 bg-brand-500/5'
                                                    : 'border-gray-700 hover:border-brand-500/60'
                                            }`}
                                        >
                                            <span
                                                className={`flex items-center gap-1.5 text-xs ${
                                                    isSelected ? 'text-brand-300' : 'text-gray-300'
                                                }`}
                                            >
                                                <Icon
                                                    className={`w-3.5 h-3.5 shrink-0 ${isLoading ? 'animate-spin' : ''}`}
                                                />
                                                {meta?.label ?? preset.id}
                                            </span>
                                            <span className={`block mt-0.5 text-[10px] ${chrome.caption}`}>
                                                {isLoading
                                                    ? t.diff.loadingSample
                                                    : preset.provenance === 'real-ci'
                                                      ? t.diff.provenance.realCi
                                                      : t.diff.provenance.generated}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* The chosen sample, in full: what it is, where it comes from,
                            and — for a real pair — the two published figures it headlines. */}
                        {selected && (
                            <div className="mt-4 rounded-lg border border-gray-800 bg-gray-900/40 p-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span
                                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                                            PROVENANCE[selected.provenance].chip
                                        }`}
                                    >
                                        {selected.provenance === 'real-ci'
                                            ? t.diff.provenance.realCi
                                            : t.diff.provenance.generated}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-100">
                                        {presetCopy[selected.id]?.label ?? selected.id}
                                    </span>
                                </div>

                                {selected.provenance === 'real-ci' && (
                                    <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
                                        <div>
                                            <p className="text-2xl font-bold text-gray-400 leading-none">
                                                {groupThousands(selected.figures.plainTextDiffLines)}
                                            </p>
                                            <p className="text-[11px] text-gray-500 mt-1">
                                                {t.diff.figures.plainDiff}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-700 shrink-0" />
                                        <div>
                                            <p className="text-2xl font-bold text-brand-400 leading-none">
                                                {groupThousands(selected.figures.significantChanges)}
                                            </p>
                                            <p className="text-[11px] text-gray-500 mt-1">
                                                {t.diff.figures.sift}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* A narrative where the copy carries one; otherwise the
                                    one-line description IS the narrative. */}
                                {(presetCopy[selected.id]?.story ?? [presetCopy[selected.id]?.description])
                                    .filter((paragraph): paragraph is string => Boolean(paragraph))
                                    .map((paragraph, idx) => (
                                        <p key={idx} className="text-sm text-gray-400 mt-3 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ))}

                                <p className="text-xs text-gray-600 mt-3 italic leading-relaxed">
                                    {selected.provenance === 'real-ci'
                                        ? t.diff.provenanceNote.realCi
                                        : t.diff.provenanceNote.generated}
                                </p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {(
                                [
                                    { id: 'baseline', label: t.diff.baselineLog, value: baseline, setter: setBaseline },
                                    { id: 'changed', label: t.diff.changedLog, value: changed, setter: setChanged },
                                ] as const
                            ).map(({ id, label, value, setter }) => (
                                <div key={id}>
                                    <div className="flex items-center justify-between mb-1">
                                        <label
                                            htmlFor={`diff-input-${id}`}
                                            className="text-sm font-medium text-gray-300"
                                        >
                                            {label}
                                        </label>
                                        <span className="text-xs text-gray-600">
                                            {countLines(value)} {t.diff.lines}
                                        </span>
                                    </div>
                                    <textarea
                                        id={`diff-input-${id}`}
                                        value={value}
                                        onChange={(event) => {
                                            setter(event.target.value)
                                            // The brief below describes a specific pair; the
                                            // moment the visitor edits, it no longer does.
                                            setSelectedPreset(null)
                                        }}
                                        spellCheck={false}
                                        placeholder={t.diff.placeholder}
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
                                {loading ? t.diff.comparing : t.diff.compare}
                            </button>
                            <button
                                type="button"
                                onClick={handleSwap}
                                disabled={(!baseline && !changed) || loading}
                                title={t.diff.swapTitle}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-700 text-gray-300 text-sm hover:border-brand-500/60 hover:text-brand-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ArrowLeftRight className="w-4 h-4" />
                                {t.diff.swap}
                            </button>
                            <span className="text-xs text-gray-600">
                                {t.diff.trust}
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
                                    {groupThousands(report.summary.total_changes)} changes,{' '}
                                    <span className="text-brand-400">
                                        {groupThousands(report.summary.significant_changes)}
                                    </span>{' '}
                                    structurally significant
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {typeof report.summary.stability_score === 'number' && (
                                        <>stability {report.summary.stability_score.toFixed(2)} · </>
                                    )}
                                    {groupThousands(report.inputs.baseline.lines_observed)} →{' '}
                                    {groupThousands(report.inputs.changed.lines_observed)} lines
                                </p>
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleSwap}
                                    disabled={loading}
                                    title={t.diff.swapSidesTitle}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 text-sm hover:border-brand-500/60 hover:text-brand-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ArrowLeftRight className="w-3.5 h-3.5" />
                                    {t.diff.swapSides}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetResult}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 text-sm hover:border-brand-500/60 hover:text-brand-300 transition-colors"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                    {t.diff.newComparison}
                                </button>
                            </div>
                        </div>

                        {report.ranked_changes.length === 0 ? (
                            <p className="text-gray-400 text-sm">
                                {t.diff.emptyResult.replace(
                                    '{count}',
                                    groupThousands(report.summary.total_changes)
                                )}
                            </p>
                        ) : (
                            <>
                                {/* Log panes, side by side */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <LogPane
                                        title={t.diff.paneBaseline}
                                        text={submitted.baseline}
                                        highlights={baselineHl}
                                        focusLine={focus.baseline}
                                        focusNonce={focus.nonce}
                                    />
                                    <LogPane
                                        title={t.diff.paneChanged}
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
                                            {t.diff.significantChanges}
                                        </h2>
                                        {pinned.size > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setPinned(new Set())}
                                                className="text-xs text-gray-500 hover:text-gray-300"
                                            >
                                                {t.diff.clearPinned.replace('{count}', String(pinned.size))}
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">
                                        {t.diff.hint}
                                    </p>
                                    <ul
                                        onMouseLeave={() => setHovered(null)}
                                        className="max-h-[28rem] overflow-auto rounded-lg border border-gray-800 divide-y divide-gray-800/60"
                                    >
                                        {sortedChanges.map(({ change, index: idx }) => (
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
                                            {t.diff.suppressed
                                                .replace('{count}', groupThousands(suppressed))
                                                .replace(
                                                    '{total}',
                                                    groupThousands(report.summary.total_changes)
                                                )}
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
                        {t.diff.ciCallout}
                    </div>
                )}
            </div>
            </main>
            <Footer />
        </>
    )
}
