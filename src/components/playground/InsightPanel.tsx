import { useMemo, useState } from 'react'
import { AlertTriangle, Brain, Loader2 } from 'lucide-react'
import type { InsightLatestWindow, InsightReport, InsightStatus } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'
import { EmptyState, ExplainModeBadge, StatusBadge } from './InsightPrimitives'
import { capabilityIcons, renderCapability } from './insightCapabilities'
import type { CapabilityKey } from './insightCapabilities'
import { formatCompact, unique } from './insightFormat'

// InSight panel SHELL. Owns the props, the derived per-window counts, the tab
// bar, and which capability is active — then delegates the body to
// renderCapability. The pieces live next door:
//   * insightFormat.tsx        pure value/style helpers
//   * InsightPrimitives.tsx    generic presentational atoms
//   * InsightCards.tsx         report / evidence-packet cards
//   * ReconfigurePanel.tsx     the one writing surface
//   * insightCapabilities.tsx  one body per tab

interface Props {
    engineId: string | null
    status: InsightStatus | null
    reports: InsightReport[]
    latestWindow?: InsightLatestWindow | null
    loading: boolean
    error: string | null
    catchingUp?: boolean
}

export default function InsightPanel({ engineId, status, reports, latestWindow = null, loading, error, catchingUp = false }: Props) {
    const t = useTranslation()
    const copy = t.lab.insight
    const [activeCapability, setActiveCapability] = useState<CapabilityKey>('explain')

    const orderedReports = useMemo(() => [...reports].reverse(), [reports])
    const latestReport = orderedReports[0]
    const linesIngested = status?.lines_ingested ?? 0
    const running = status?.running ?? false

    const affectedTemplates = useMemo(
        // Only from current window detectionReports — avoids compound keys from InsightReport.affected_templates.
        () => unique(
            (latestWindow?.detectionReports ?? []).map((dr) => dr.template_id)
        ).slice(0, 32),
        [latestWindow?.detectionReports],
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
                key: 'evidence' as const,
                label: copy.tabs.evidence,
                value: (latestWindow?.contextPackets.length ?? 0) > 0
                    ? String(latestWindow!.contextPackets.length)
                    : copy.states.ready,
                active: (latestWindow?.contextPackets.length ?? 0) > 0,
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
            {
                key: 'config' as const,
                label: copy.tabs.config,
                value: latestReport?.window_count != null
                    ? String(latestReport.window_count)
                    : copy.states.ready,
                active: true,
            },
        ],
        [affectedTemplates.length, copy, evidenceCount, latestReport, latestWindow, linesIngested, reports.length, running, severityCounts.length],
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
                        {catchingUp && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                {copy.insightCatchingUp}
                            </span>
                        )}
                        <ExplainModeBadge
                            mode={status?.explain_mode}
                            enabled={status?.llm_enabled}
                            model={status?.llm_model}
                        />
                    </div>
                </div>

                <div className="space-y-1.5" role="tablist" aria-label={copy.capabilityLabel}>
                    {[capabilities.slice(0, 4), capabilities.slice(4)].map((row, rowIdx) => (
                        <div key={rowIdx} className="flex gap-1.5">
                            {row.map((capability) => (
                                <button
                                    key={capability.key}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeCapability === capability.key}
                                    onClick={() => setActiveCapability(capability.key)}
                                    className={`flex-1 rounded-lg border px-2 py-2 text-left transition-colors ${activeCapability === capability.key
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
                        engineId,
                        evidenceCount,
                        latestReport,
                        latestWindow,
                        linesIngested,
                        orderedReports,
                        running,
                        severityCounts,
                        status,
                        windowCount: status?.window_count ?? latestReport?.window_count ?? null,
                    })
                )}
            </div>
        </div>
    )
}

// ---------------------------------------------------------------------------
// ReconfigurePanel — live hot-reconfigure controls for the Config tab
// ---------------------------------------------------------------------------
