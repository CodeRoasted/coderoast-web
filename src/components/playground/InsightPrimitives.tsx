import type { ReactNode } from 'react'
import { AlertTriangle, Brain, CheckCircle, Clock, FileText, Loader2 } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { explainModeLabel } from './insightFormat'
import type { InsightCopy } from './insightFormat'

// Small presentational atoms shared by every capability tab of the InSight panel.
// All are stateless. Copy reaches them two ways, and the split is deliberate:
// the self-contained badges (StatusBadge, ExplainModeBadge) call useTranslation
// themselves because they render fixed labels; the layout atoms (WindowStamp,
// EmptyState, ConfigRow, ...) take their strings as props because the caller
// chooses them per tab.

export function StatusBadge({ running, loading, error }: { running: boolean; loading: boolean; error: string | null }) {
    const t = useTranslation()
    const copy = t.lab.insight
    if (error) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-red-300">
                <AlertTriangle className="w-3 h-3" />
                {copy.errorShort}
            </span>
        )
    }
    if (loading) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-950 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                <Clock className="w-3 h-3 animate-pulse" />
                {copy.syncing}
            </span>
        )
    }
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${running
            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
            : 'border-gray-700 bg-gray-950 text-gray-500'
            }`}>
            {running ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {running ? copy.running : copy.idle}
        </span>
    )
}

export function ExplainModeBadge({
    mode,
    enabled,
    model,
    compact = false,
}: {
    mode?: string
    enabled?: boolean
    model?: string
    compact?: boolean
}) {
    const t = useTranslation()
    const copy = t.lab.insight
    if (!mode) return null

    const llmActive = enabled ?? (mode === 'llm_augmented' || mode === 'llm_full')
    const label = explainModeLabel(mode, copy)
    const showModel = llmActive && model && !compact
    const tone = llmActive
        ? 'border-violet-500/40 bg-violet-500/10 text-violet-200'
        : 'border-gray-700 bg-gray-950 text-gray-500'

    return (
        <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tone}`}>
            <Brain className="w-3 h-3 shrink-0" />
            <span className="truncate">{label}</span>
            {showModel && <span className="max-w-[8rem] truncate font-mono normal-case text-violet-100">{model}</span>}
        </span>
    )
}

export function PyramidMaturityBadge({
    maturity,
    copy,
}: {
    maturity: string | null
    copy: InsightCopy
}) {
    if (!maturity) return <span className="text-[11px] text-gray-600">{copy.configNotAvailable}</span>
    if (maturity === 'mature')
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                <CheckCircle className="w-2.5 h-2.5" />
                {copy.pyramidMature}
            </span>
        )
    if (maturity === 'warming_up')
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                {copy.pyramidWarmingUp}
            </span>
        )
    return <span className="text-[11px] text-gray-500">{copy.pyramidUninitialized}</span>
}

export function WindowStamp({
    windowNum,
    timeRange,
    windowLabel,
}: {
    windowNum: number | null | undefined
    timeRange: string | null
    windowLabel: string
}) {
    if (windowNum == null && !timeRange) return null
    return (
        <div className="flex flex-col items-end gap-0.5 shrink-0 ml-2">
            {windowNum != null && (
                <span className="font-mono text-[10px] text-gray-600 leading-none">{windowLabel} #{windowNum}</span>
            )}
            {timeRange && (
                <span className="font-mono text-[10px] text-gray-700 leading-none">{timeRange}</span>
            )}
        </div>
    )
}

export function Metric({ label, value, large = false }: { label: string; value: string; large?: boolean }) {
    return (
        <div className={`rounded-lg border border-gray-800 bg-gray-950/60 ${large ? 'p-3' : 'px-2 py-1.5'}`}>
            <div className={`font-mono font-semibold text-gray-100 ${large ? 'text-lg' : 'text-xs'}`}>
                {value}
            </div>
            <div className="mt-0.5 truncate text-[10px] uppercase tracking-wide text-gray-600">
                {label}
            </div>
        </div>
    )
}

export function EmptyState({
    icon,
    title,
    body,
    tone,
}: {
    icon: ReactNode
    title: string
    body: string
    tone: 'brand' | 'gray' | 'red'
}) {
    const toneClass =
        tone === 'red'
            ? 'text-red-300 border-red-500/30 bg-red-500/10'
            : tone === 'brand'
                ? 'text-brand-300 border-brand-500/30 bg-brand-500/10'
                : 'text-gray-400 border-gray-800 bg-gray-950/60'
    return (
        <div className={`flex h-full min-h-[14rem] flex-col items-center justify-center rounded-lg border p-5 text-center ${toneClass}`}>
            <div className="mb-3">{icon}</div>
            <h3 className="text-sm font-semibold text-gray-100">{title}</h3>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-gray-500">{body}</p>
        </div>
    )
}

export function SectionTitle({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-brand-400" />
            <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400">{title}</h3>
            <div className="h-px flex-1 bg-gray-800" />
        </div>
    )
}

export function ConfigRow({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-800 bg-gray-950/60 px-3 py-2">
            <span className="text-[11px] uppercase tracking-wide text-gray-500 shrink-0">{label}</span>
            <div className="flex items-center justify-end min-w-0">{children}</div>
        </div>
    )
}

export function DetailList({
    title,
    empty,
    values,
    mono = false,
}: {
    title: string
    empty: string
    values: string[]
    mono?: boolean
}) {
    return (
        <details className="rounded-md border border-gray-800 bg-gray-950/50 px-2 py-1.5">
            <summary className="cursor-pointer text-[11px] font-semibold text-gray-400">
                {title} ({values.length})
            </summary>
            <div className="mt-2 space-y-1.5">
                {values.length === 0 ? (
                    <p className="text-xs text-gray-600">{empty}</p>
                ) : (
                    values.map((value, index) => (
                        <div
                            key={`${value}-${index}`}
                            className={`rounded border border-gray-800 bg-gray-900/70 px-2 py-1 text-[11px] leading-relaxed text-gray-300 break-words ${mono ? 'font-mono' : ''}`}
                        >
                            {value}
                        </div>
                    ))
                )}
            </div>
        </details>
    )
}
