import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
    Activity,
    AlertTriangle,
    Brain,
    CheckCircle,
    Clock,
    FileText,
    Gauge,
    Layers,
    Lightbulb,
    Search,
} from 'lucide-react'
import type { InsightReport, InsightStatus } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    status: InsightStatus | null
    reports: InsightReport[]
    loading: boolean
    error: string | null
}

type CapabilityKey = 'explain' | 'detect' | 'metalog' | 'templates' | 'ingest'

const capabilityIcons: Record<CapabilityKey, ReactNode> = {
    explain: <Lightbulb className="w-3.5 h-3.5" />,
    detect: <Gauge className="w-3.5 h-3.5" />,
    metalog: <Layers className="w-3.5 h-3.5" />,
    templates: <Search className="w-3.5 h-3.5" />,
    ingest: <Activity className="w-3.5 h-3.5" />,
}

export default function InsightPanel({ status, reports, loading, error }: Props) {
    const t = useTranslation()
    const copy = t.lab.insight
    const [activeCapability, setActiveCapability] = useState<CapabilityKey>('explain')

    const orderedReports = useMemo(() => [...reports].reverse(), [reports])
    const latestReport = orderedReports[0]
    const linesIngested = status?.lines_ingested ?? 0
    const running = status?.running ?? false

    const affectedTemplates = useMemo(
        () => unique(reports.flatMap((report) => report.affected_templates)).slice(0, 16),
        [reports],
    )
    const evidenceCount = useMemo(
        () => reports.reduce((count, report) => count + report.supporting_evidence.length, 0),
        [reports],
    )
    const severityCounts = useMemo(() => {
        const counts = new Map<string, number>()
        for (const report of reports) {
            const label = String(report.severity || 'Info')
            counts.set(label, (counts.get(label) ?? 0) + 1)
        }
        return [...counts.entries()].sort((a, b) => b[1] - a[1])
    }, [reports])

    const capabilities = useMemo(
        () => [
            {
                key: 'explain' as const,
                label: copy.tabs.explain,
                value: reports.length > 0 ? String(reports.length) : copy.states.waiting,
                active: reports.length > 0,
            },
            {
                key: 'detect' as const,
                label: copy.tabs.detect,
                value: severityCounts.length > 0 ? String(severityCounts.length) : copy.states.waiting,
                active: severityCounts.length > 0,
            },
            {
                key: 'metalog' as const,
                label: copy.tabs.metalog,
                value: evidenceCount > 0 ? String(evidenceCount) : copy.states.ready,
                active: linesIngested > 0,
            },
            {
                key: 'templates' as const,
                label: copy.tabs.templates,
                value: affectedTemplates.length > 0 ? String(affectedTemplates.length) : copy.states.ready,
                active: affectedTemplates.length > 0,
            },
            {
                key: 'ingest' as const,
                label: copy.tabs.ingest,
                value: formatCompact(linesIngested),
                active: running || linesIngested > 0,
            },
        ],
        [affectedTemplates.length, copy, evidenceCount, linesIngested, reports.length, running, severityCounts.length],
    )

    return (
        <div className="bg-gray-900 border border-gray-700/50 rounded-xl overflow-hidden flex flex-col h-full min-h-0">
            <div className="px-4 py-3 border-b border-gray-700/50 shrink-0 space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-100">
                            <Brain className="w-4 h-4 text-brand-400 shrink-0" />
                            <span className="truncate">{copy.title}</span>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                            {copy.subtitle}
                        </p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                        <StatusBadge running={running} loading={loading} error={error} />
                        <ExplainModeBadge
                            mode={status?.explain_mode}
                            enabled={status?.llm_enabled}
                            model={status?.llm_model}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <Metric label={copy.metrics.lines} value={formatCompact(linesIngested)} />
                    <Metric label={copy.metrics.reports} value={String(reports.length)} />
                    <Metric label={copy.metrics.evidence} value={String(evidenceCount)} />
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label={copy.capabilityLabel}>
                    {capabilities.map((capability) => (
                        <button
                            key={capability.key}
                            type="button"
                            role="tab"
                            aria-selected={activeCapability === capability.key}
                            onClick={() => setActiveCapability(capability.key)}
                            className={`min-w-[5.6rem] flex-1 rounded-lg border px-2 py-2 text-left transition-colors ${activeCapability === capability.key
                                ? 'bg-brand-500/10 border-brand-500/50 text-brand-200'
                                : 'bg-gray-950/50 border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-700'
                                }`}
                        >
                            <span className="flex items-center justify-between gap-2">
                                <span className={capability.active ? 'text-brand-400' : 'text-gray-600'}>
                                    {capabilityIcons[capability.key]}
                                </span>
                                <span className="text-[10px] font-mono truncate">{capability.value}</span>
                            </span>
                            <span className="block mt-1 text-[11px] font-semibold truncate">
                                {capability.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-4">
                {error ? (
                    <EmptyState
                        icon={<AlertTriangle className="w-5 h-5" />}
                        title={copy.errorTitle}
                        body={error}
                        tone="red"
                    />
                ) : (
                    renderCapability({
                        activeCapability,
                        copy,
                        affectedTemplates,
                        evidenceCount,
                        latestReport,
                        linesIngested,
                        orderedReports,
                        reports,
                        running,
                        severityCounts,
                    })
                )}
            </div>
        </div>
    )
}

function renderCapability({
    activeCapability,
    copy,
    affectedTemplates,
    evidenceCount,
    latestReport,
    linesIngested,
    orderedReports,
    reports,
    running,
    severityCounts,
}: {
    activeCapability: CapabilityKey
    copy: ReturnType<typeof useTranslation>['lab']['insight']
    affectedTemplates: string[]
    evidenceCount: number
    latestReport: InsightReport | undefined
    linesIngested: number
    orderedReports: InsightReport[]
    reports: InsightReport[]
    running: boolean
    severityCounts: [string, number][]
}) {
    if (activeCapability === 'explain') {
        if (!latestReport) {
            return (
                <EmptyState
                    icon={<Clock className="w-5 h-5" />}
                    title={copy.noReportsTitle}
                    body={copy.noReportsBody}
                    tone="brand"
                />
            )
        }
        return (
            <div className="space-y-3">
                <SectionTitle title={copy.latest} />
                <InsightCard report={latestReport} featured />
                {orderedReports.length > 1 && (
                    <div className="space-y-2 pt-2">
                        <SectionTitle title={copy.previous} />
                        {orderedReports.slice(1, 5).map((report) => (
                            <InsightCard key={insightCardKey(report)} report={report} />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    if (activeCapability === 'detect') {
        return (
            <div className="space-y-3">
                <SectionTitle title={copy.detectTitle} />
                {severityCounts.length === 0 ? (
                    <EmptyState
                        icon={<Gauge className="w-5 h-5" />}
                        title={copy.detectEmptyTitle}
                        body={copy.detectEmptyBody}
                        tone="gray"
                    />
                ) : (
                    <div className="space-y-2">
                        {severityCounts.map(([severity, count]) => {
                            const style = severityStyle(severity)
                            return (
                                <div
                                    key={severity}
                                    className={`flex items-center justify-between rounded-lg border px-3 py-2 ${style.card}`}
                                >
                                    <span className="text-sm font-semibold text-gray-100">
                                        {severity}
                                    </span>
                                    <span className={`text-xs font-mono ${style.text}`}>{count}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        )
    }

    if (activeCapability === 'metalog') {
        return (
            <div className="space-y-3">
                <SectionTitle title={copy.metalogTitle} />
                <p className="text-xs leading-relaxed text-gray-400">{copy.metalogBody}</p>
                <div className="grid grid-cols-2 gap-2">
                    <Metric label={copy.metrics.lines} value={formatCompact(linesIngested)} large />
                    <Metric label={copy.metrics.reports} value={String(reports.length)} large />
                    <Metric label={copy.metrics.templates} value={String(affectedTemplates.length)} large />
                    <Metric label={copy.metrics.evidence} value={String(evidenceCount)} large />
                </div>
            </div>
        )
    }

    if (activeCapability === 'templates') {
        return (
            <div className="space-y-3">
                <SectionTitle title={copy.templatesTitle} />
                {affectedTemplates.length === 0 ? (
                    <EmptyState
                        icon={<Search className="w-5 h-5" />}
                        title={copy.templatesEmptyTitle}
                        body={copy.templatesEmptyBody}
                        tone="gray"
                    />
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {affectedTemplates.map((templateId) => (
                            <span
                                key={templateId}
                                className="max-w-full truncate rounded-md border border-gray-700 bg-gray-950/70 px-2 py-1 font-mono text-[11px] text-gray-300"
                            >
                                {templateId}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <SectionTitle title={copy.ingestTitle} />
            <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-3">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-gray-100">
                        {running ? copy.running : copy.idle}
                    </span>
                    <span className="font-mono text-xs text-brand-300">
                        {formatCompact(linesIngested)} {copy.linesIngested}
                    </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                    {running ? copy.ingestRunning : copy.ingestIdle}
                </p>
            </div>
        </div>
    )
}

function InsightCard({ report, featured = false }: { report: InsightReport; featured?: boolean }) {
    const t = useTranslation()
    const copy = t.lab.insight
    const style = severityStyle(report.severity)
    return (
        <article className={`rounded-lg border p-3 ${style.card} ${featured ? 'shadow-lg shadow-black/20' : ''}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <div className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${style.badge}`}>
                            {style.icon}
                            <span>{report.severity || 'Info'}</span>
                        </div>
                        <ExplainModeBadge
                            mode={report.explain_mode}
                            enabled={report.llm_enabled}
                            model={report.llm_model}
                            compact
                        />
                    </div>
                    <h3 className="mt-2 text-sm font-semibold leading-snug text-gray-100 break-words">
                        {report.headline}
                    </h3>
                </div>
                <div className="shrink-0 text-right">
                    <div className="text-lg font-mono font-bold text-white">
                        {formatPercent(report.confidence)}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-gray-500">
                        {copy.confidence}
                    </div>
                </div>
            </div>

            {report.body && (
                <p className="mt-3 text-xs leading-relaxed text-gray-300 break-words">
                    {report.body}
                </p>
            )}

            {report.action_hint && (
                <div className="mt-3 rounded-md border border-emerald-500/25 bg-emerald-500/10 p-2">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                        {copy.actionHint}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-emerald-100 break-words">
                        {report.action_hint}
                    </p>
                </div>
            )}

            <div className="mt-3 space-y-2">
                <DetailList
                    title={copy.templates}
                    empty={copy.noTemplates}
                    values={report.affected_templates}
                    mono
                />
                <DetailList
                    title={copy.evidence}
                    empty={copy.noEvidence}
                    values={report.supporting_evidence}
                    mono
                />
            </div>
        </article>
    )
}

function DetailList({
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

function ExplainModeBadge({
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

function explainModeLabel(
    mode: string,
    copy: ReturnType<typeof useTranslation>['lab']['insight'],
): string {
    if (mode === 'llm_augmented') return copy.sourceAugmented
    if (mode === 'llm_full') return copy.sourceFull
    if (mode === 'rules') return copy.sourceRules
    return copy.sourceUnknown
}

function StatusBadge({ running, loading, error }: { running: boolean; loading: boolean; error: string | null }) {
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

function Metric({ label, value, large = false }: { label: string; value: string; large?: boolean }) {
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

function EmptyState({
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

function SectionTitle({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-brand-400" />
            <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400">{title}</h3>
            <div className="h-px flex-1 bg-gray-800" />
        </div>
    )
}

function severityStyle(severity: string) {
    const normalized = severity.toLowerCase()
    if (normalized.includes('critical') || normalized.includes('fatal') || normalized.includes('high')) {
        return {
            card: 'border-red-500/35 bg-red-500/10',
            badge: 'border-red-500/45 bg-red-500/20 text-red-200',
            text: 'text-red-300',
            icon: <AlertTriangle className="w-3 h-3" />,
        }
    }
    if (normalized.includes('warn') || normalized.includes('medium')) {
        return {
            card: 'border-amber-500/35 bg-amber-500/10',
            badge: 'border-amber-500/45 bg-amber-500/20 text-amber-200',
            text: 'text-amber-300',
            icon: <AlertTriangle className="w-3 h-3" />,
        }
    }
    return {
        card: 'border-blue-500/30 bg-blue-500/10',
        badge: 'border-blue-500/40 bg-blue-500/20 text-blue-200',
        text: 'text-blue-300',
        icon: <Brain className="w-3 h-3" />,
    }
}

function unique(values: string[]): string[] {
    return [...new Set(values.filter(Boolean))]
}

function formatCompact(value: number): string {
    if (value < 1000) return String(value)
    if (value < 1_000_000) return `${(value / 1000).toFixed(value < 10_000 ? 1 : 0)}k`
    return `${(value / 1_000_000).toFixed(1)}M`
}

function formatPercent(value: number): string {
    const normalized = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0
    return `${Math.round(normalized * 100)}%`
}

function insightCardKey(report: InsightReport): string {
    return `${report.severity}|${report.headline}|${report.body}`
}
