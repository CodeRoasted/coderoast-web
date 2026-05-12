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
    GitBranch,
    Layers,
    Lightbulb,
    Loader2,
    Search,
    Settings,
    Zap,
} from 'lucide-react'
import type { ContextPacket, InsightExplainMode, InsightLatestWindow, InsightReconfigureRequest, InsightReport, InsightStatus } from '@/types/engine'
import { reconfigureInsight } from '@/services/api'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    engineId: string | null
    status: InsightStatus | null
    reports: InsightReport[]
    latestWindow?: InsightLatestWindow | null
    loading: boolean
    error: string | null
    catchingUp?: boolean
}

type CapabilityKey = 'explain' | 'detect' | 'metalog' | 'templates' | 'evidence' | 'ingest' | 'config'

const capabilityIcons: Record<CapabilityKey, ReactNode> = {
    explain: <Lightbulb className="w-3.5 h-3.5" />,
    detect: <Gauge className="w-3.5 h-3.5" />,
    metalog: <Layers className="w-3.5 h-3.5" />,
    templates: <Search className="w-3.5 h-3.5" />,
    evidence: <FileText className="w-3.5 h-3.5" />,
    ingest: <Activity className="w-3.5 h-3.5" />,
    config: <Settings className="w-3.5 h-3.5" />,
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

interface ReconfigurePanelProps {
    engineId: string | null
    currentWindowDuration: number | null
    currentExplainMode: InsightExplainMode | null
    currentLlmModel: string | null
    copy: ReturnType<typeof useTranslation>['lab']['insight']
}

function ReconfigurePanel({ engineId, currentWindowDuration, currentExplainMode, currentLlmModel, copy }: ReconfigurePanelProps) {
    const kDefaultWindowDuration = 25
    const [windowDuration, setWindowDuration] = useState<string>(
        String(currentWindowDuration ?? kDefaultWindowDuration)
    )
    const [minConfidence, setMinConfidence] = useState<string>('')
    const [maxInsights, setMaxInsights] = useState<string>('')
    // LLM model: empty string = 'None' (no LLM / rules mode)
    const [llmModel, setLlmModel] = useState<string>(currentLlmModel ?? '')
    // LLM full: true = llm_full, false = llm_augmented (only relevant when model != '')
    const [llmFull, setLlmFull] = useState<boolean>(currentExplainMode === 'llm_full')
    const [status, setStatus] = useState<'idle' | 'applying' | 'applied' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    // When model changes, if switching from None to a model, keep llmFull as-is.
    // If switching to None, clear llmFull.
    function handleModelChange(model: string) {
        setLlmModel(model)
        if (!model) setLlmFull(false)
    }

    async function handleApply() {
        if (!engineId) return
        const params: InsightReconfigureRequest = {}
        const dur = parseInt(windowDuration, 10)
        if (windowDuration.trim() && !isNaN(dur) && dur > 0) params.window_duration_seconds = dur
        const conf = parseFloat(minConfidence)
        if (minConfidence.trim() && !isNaN(conf)) params.min_confidence = conf
        const maxI = parseInt(maxInsights, 10)
        if (maxInsights.trim() && !isNaN(maxI) && maxI > 0) params.max_insights = maxI
        if (llmModel) {
            // A model is selected — derive explain_mode from the full checkbox
            params.llm_model = llmModel
            params.explain_mode = llmFull ? 'llm_full' : 'llm_augmented'
        } else {
            // None selected — switch to rules mode
            params.explain_mode = 'rules'
        }
        if (Object.keys(params).length === 0) return
        setStatus('applying')
        setErrorMsg(null)
        try {
            await reconfigureInsight(engineId, params)
            setStatus('applied')
            setTimeout(() => setStatus('idle'), 3000)
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
            setStatus('error')
        }
    }

    const fieldCls = 'w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 text-[11px] text-gray-200 font-mono focus:border-brand-500 focus:outline-none placeholder:text-gray-700'
    const labelCls = 'text-[10px] text-gray-500'

    return (
        <div className="rounded-lg border border-gray-700/60 bg-gray-950/40 p-3 space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{copy.configReconfigureTitle}</p>
                {status === 'applied' && (
                    <span className="text-[10px] text-emerald-400">{copy.configReconfigureApplied}</span>
                )}
                {status === 'error' && (
                    <span className="text-[10px] text-red-400">{copy.configReconfigureError}{errorMsg ? `: ${errorMsg}` : ''}</span>
                )}
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <label className={labelCls}>{copy.configWindowDuration}</label>
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            min={1}
                            placeholder={String(currentWindowDuration ?? kDefaultWindowDuration)}
                            value={windowDuration}
                            onChange={(e) => setWindowDuration(e.target.value)}
                            className={fieldCls}
                        />
                        <span className="text-[10px] text-gray-600 shrink-0">s</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <label className={labelCls}>{copy.configMinConfidence}</label>
                    <input
                        type="number"
                        min={0} max={1} step={0.05}
                        placeholder="0.65"
                        value={minConfidence}
                        onChange={(e) => setMinConfidence(e.target.value)}
                        className={fieldCls}
                    />
                </div>
                <div className="col-span-2 space-y-1">
                    <label className={labelCls}>{copy.configMaxInsights}</label>
                    <input
                        type="number"
                        min={1}
                        placeholder="10"
                        value={maxInsights}
                        onChange={(e) => setMaxInsights(e.target.value)}
                        className={fieldCls}
                    />
                </div>
                <div className="col-span-2 space-y-1">
                    <label className={labelCls}>{copy.configLlmModelLabel}</label>
                    <select
                        value={llmModel}
                        onChange={(e) => handleModelChange(e.target.value)}
                        className={fieldCls}
                    >
                        <option value="">{copy.configLlmModelNone}</option>
                        <option value="gpt-4o-mini">gpt-4o-mini</option>
                        <option value="gpt-4.1">gpt-4.1</option>
                        <option value="gpt-5-mini">gpt-5-mini</option>
                        <option value="raptor-mini">raptor-mini</option>
                    </select>
                </div>
                {llmModel && (
                    <div className="col-span-2 flex items-center gap-2">
                        <input
                            id="llm-full-checkbox"
                            type="checkbox"
                            checked={llmFull}
                            onChange={(e) => setLlmFull(e.target.checked)}
                            className="h-3 w-3 rounded border-gray-600 bg-gray-900 accent-brand-500"
                        />
                        <label htmlFor="llm-full-checkbox" className="text-[11px] text-gray-400 cursor-pointer select-none">
                            {copy.configLlmFull}
                        </label>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] text-gray-700 italic">{copy.configReconfigureHint}</p>
                <button
                    onClick={handleApply}
                    disabled={status === 'applying' || !engineId}
                    className="rounded bg-brand-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                    {status === 'applying' ? copy.configReconfigureApplying : copy.configReconfigureApply}
                </button>
            </div>
        </div>
    )
}

function renderCapability({
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
    windowCount,
}: {
    activeCapability: CapabilityKey
    copy: ReturnType<typeof useTranslation>['lab']['insight']
    engineId: string | null
    evidenceCount: number
    latestReport: InsightReport | undefined
    latestWindow: InsightLatestWindow | null
    linesIngested: number
    orderedReports: InsightReport[]
    running: boolean
    severityCounts: [string, number][]
    status: InsightStatus | null
    windowCount: number | null
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
        const windowNum = latestReport.window_count ?? status?.window_count
        const windowTimeRange = latestWindow?.metalog
            ? `${formatSimTime(latestWindow.metalog.window.start)} → ${formatSimTime(latestWindow.metalog.window.end)}`
            : null
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <SectionTitle title={copy.latest} />
                    <WindowStamp windowNum={windowNum} timeRange={windowTimeRange} windowLabel={copy.windowLabel} />
                </div>
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
        const detectionReports = latestWindow?.detectionReports ?? []
        const windowNum = latestReport?.window_count ?? status?.window_count
        const windowTimeRange = latestWindow?.metalog
            ? `${formatSimTime(latestWindow.metalog.window.start)} → ${formatSimTime(latestWindow.metalog.window.end)}`
            : null
        return (
            <div className="space-y-3">
                {detectionReports.length > 0 ? (
                    <>
                        <div className="flex items-center justify-between">
                            <SectionTitle title={copy.detectSignalsTitle} />
                            <WindowStamp windowNum={windowNum} timeRange={windowTimeRange} windowLabel={copy.windowLabel} />
                        </div>
                        <div className="space-y-1.5">
                            {detectionReports.map((dr, i) => {
                                const sigStyle = detectionSignalStyle(dr.score)
                                return (
                                    <div key={`${dr.template_id}-${dr.type}-${i}`} className={`rounded-lg border p-2.5 space-y-1 ${sigStyle.card}`}>
                                        <div className="flex items-center justify-between gap-2">
                                            <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${sigStyle.badge}`}>
                                                <Zap className="w-2.5 h-2.5" />
                                                {dr.type}
                                            </span>
                                            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                                                <span>{copy.detectScore}: <span className="text-white">{dr.score.toFixed(2)}</span></span>
                                                <span>{copy.detectConf}: <span className="text-white">{formatPercent(dr.confidence)}</span></span>
                                                {dr.scale > 0 && <span>×{dr.scale}</span>}
                                            </div>
                                        </div>
                                        <p className="font-mono text-[10px] text-gray-300 break-all leading-relaxed">{dr.template}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                ) : (
                    <EmptyState
                        icon={<Gauge className="w-5 h-5" />}
                        title={copy.detectEmptyTitle}
                        body={copy.detectEmptyBody}
                        tone="gray"
                    />
                )}
                {severityCounts.length > 0 && (
                    <>
                        <div className="flex items-center justify-between">
                            <SectionTitle title={copy.detectTitle} />
                            <span className="shrink-0 text-[10px] text-gray-700 italic">{copy.detectSeveritySource}</span>
                        </div>
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
                    </>
                )}
            </div>
        )
    }

    if (activeCapability === 'metalog') {
        const metalog = latestWindow?.metalog ?? null
        const acuteDiff = latestWindow?.acuteDiff ?? null
        const windowTimeRange = metalog
            ? `${formatSimTime(metalog.window.start)} → ${formatSimTime(metalog.window.end)}`
            : null
        const windowNum = status?.window_count
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <SectionTitle title={copy.metalogWindowTitle} />
                    <WindowStamp windowNum={windowNum} timeRange={windowTimeRange} windowLabel={copy.windowLabel} />
                </div>
                {!metalog ? (
                    <>
                        <EmptyState
                            icon={<Layers className="w-5 h-5" />}
                            title={copy.metalogNoData}
                            body={copy.metalogNoDataBody}
                            tone="gray"
                        />
                        <p className="text-xs leading-relaxed text-gray-500">{copy.metalogBody}</p>
                    </>
                ) : (
                    <div className="space-y-3">
                        <p className="text-xs leading-relaxed text-gray-400">{copy.metalogBody}</p>
                        <div className="grid grid-cols-2 gap-2">
                            <Metric label={copy.metalogWindowDuration} value={`${metalog.window.duration_seconds.toFixed(1)}${copy.configWindowSeconds}`} large />
                            <Metric label={copy.metalogUniqueTemplates} value={String(metalog.stats.unique_templates)} large />
                            {metalog.stats.entropy_bits != null && (
                                <Metric label={copy.metalogEntropy} value={`${metalog.stats.entropy_bits.toFixed(2)} bits`} large />
                            )}
                            {metalog.stability?.stability_score != null && (
                                <Metric label={copy.metalogStabilityScore} value={`${(metalog.stability.stability_score * 100).toFixed(0)}%`} large />
                            )}
                            {metalog.stability?.js_divergence != null && (
                                <Metric label={copy.metalogJsDivergence} value={metalog.stability.js_divergence.toFixed(3)} large />
                            )}
                            <Metric label={copy.metrics.evidence} value={String(evidenceCount)} large />
                        </div>
                        {metalog.stats.top_k.length > 0 && (
                            <div className="space-y-2 pt-1">
                                <SectionTitle title={copy.metalogTopKTitle} />
                                <div className="space-y-1.5">
                                    {metalog.stats.top_k.slice(0, 8).map((entry) => (
                                        <div key={entry.template_id} className="flex items-center gap-2 rounded border border-gray-800 bg-gray-950/60 px-2 py-1.5">
                                            <span className="flex-1 min-w-0 font-mono text-[10px] text-gray-300 truncate">{entry.template}</span>
                                            <span className="shrink-0 font-mono text-[10px] text-brand-300">{(entry.frequency * 100).toFixed(1)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {acuteDiff && (
                            <div className="space-y-2 pt-1">
                                <SectionTitle title={copy.acuteDiffTitle} />
                                <div className="grid grid-cols-2 gap-2">
                                    <Metric label={copy.acuteDiffNew} value={acuteDiff.new_templates_count > 0 ? `+${acuteDiff.new_templates_count}` : '0'} large />
                                    <Metric label={copy.acuteDiffVanished} value={acuteDiff.vanished_templates_count > 0 ? `-${acuteDiff.vanished_templates_count}` : '0'} large />
                                    <Metric label={copy.acuteDiffTemplateDelta} value={String(acuteDiff.template_delta_count)} large />
                                    {acuteDiff.js_divergence != null && (
                                        <Metric label={copy.metalogJsDivergence} value={acuteDiff.js_divergence.toFixed(3)} large />
                                    )}
                                    {acuteDiff.stability_score != null && (
                                        <Metric label={copy.metalogStabilityScore} value={`${(acuteDiff.stability_score * 100).toFixed(0)}%`} large />
                                    )}
                                </div>
                                {acuteDiff.branching_delta_count > 0 && (
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300">
                                        <GitBranch className="w-3 h-3" />
                                        {acuteDiff.branching_delta_count} branching delta{acuteDiff.branching_delta_count !== 1 ? 's' : ''}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    if (activeCapability === 'templates') {
        const templateRows = latestWindow?.detectionReports ?? []
        // Also include any template IDs from explain that aren't already covered
        const seenIds = new Set(templateRows.map((dr) => dr.template_id))
        const explainOnlyIds = (latestReport?.affected_templates ?? [])
            // Skip compound IDs (contain unit-separator \x1f) — they're internal composite keys
            .filter((id) => !id.includes('\x1f') && !seenIds.has(id))
        return (
            <div className="space-y-3">
                <SectionTitle title={copy.templatesTitle} />
                {templateRows.length === 0 && explainOnlyIds.length === 0 ? (
                    <EmptyState
                        icon={<Search className="w-5 h-5" />}
                        title={copy.templatesEmptyTitle}
                        body={copy.templatesEmptyBody}
                        tone="gray"
                    />
                ) : (
                    <div className="space-y-1.5">
                        {templateRows.map((dr, i) => {
                            const sigStyle = detectionSignalStyle(dr.score)
                            return (
                                <div key={`${dr.template_id}-${i}`} className={`rounded-md border px-2.5 py-2 space-y-1 ${sigStyle.card}`}>
                                    <span className={`inline-flex items-center gap-1 rounded border px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide ${sigStyle.badge}`}>
                                        {dr.type}
                                    </span>
                                    <p className="font-mono text-[10px] text-gray-200 break-all leading-relaxed">{dr.template || dr.template_id}</p>
                                </div>
                            )
                        })}
                        {explainOnlyIds.map((id) => (
                            <div key={id} className="rounded-md border border-gray-700 bg-gray-950/70 px-2.5 py-2">
                                <p className="font-mono text-[10px] text-gray-400 break-all leading-relaxed">{id}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    if (activeCapability === 'config') {
        const windowDuration = status?.configured_window_duration_seconds
            ?? latestReport?.configured_window_duration_seconds
            ?? null
        const windowCount = status?.window_count ?? latestReport?.window_count ?? null
        const explainMode = status?.explain_mode ?? latestReport?.explain_mode ?? null
        const llmEnabled = status?.llm_enabled ?? latestReport?.llm_enabled ?? null
        const llmModel = status?.llm_model ?? latestReport?.llm_model ?? null
        const pyramidMaturity = status?.pyramid_maturity ?? null
        const windowsSeen = status?.windows_seen ?? null
        const warmupTarget = status?.pyramid_warmup_windows ?? null
        const lastWindowSimTime = latestWindow?.metalog?.window.end
            ? formatSimTime(latestWindow.metalog.window.end)
            : null
        // Show the warmup bar whenever the server says we're warming up — even if the
        // exact counters aren't returned yet (e.g. older binary before restart).
        const showWarmupBar = pyramidMaturity === 'warming_up'
        // Fall back to window_count if windows_seen isn't in the response yet.
        const effectiveWindowsSeen = windowsSeen ?? windowCount ?? 0
        const effectiveWarmupTarget = warmupTarget ?? 13 // default fanout+1
        const warmupPct = showWarmupBar && effectiveWarmupTarget > 0
            ? Math.min(100, Math.round((effectiveWindowsSeen / effectiveWarmupTarget) * 100))
            : 0
        const windowsRemaining = Math.max(0, effectiveWarmupTarget - effectiveWindowsSeen)
        // Use configured duration, fall back to actual metalog window duration
        const durationForEta = windowDuration ?? latestWindow?.metalog?.window.duration_seconds ?? null
        const timeToMaturity = showWarmupBar && windowsRemaining > 0 && durationForEta != null
            ? formatDuration(windowsRemaining * durationForEta)
            : null
        return (
            <div className="space-y-3">
                <SectionTitle title={copy.configTitle} />
                <div className="grid grid-cols-2 gap-2">
                    <Metric
                        label={copy.configWindowDuration}
                        value={windowDuration != null ? `${windowDuration}${copy.configWindowSeconds}` : copy.configNotAvailable}
                        large
                    />
                    <Metric
                        label={copy.configWindowCount}
                        value={windowCount != null ? String(windowCount) : copy.configNotAvailable}
                        large
                    />
                </div>
                <div className="space-y-1.5">
                    <ConfigRow label={copy.configPyramidMaturity}>
                        <div className="flex items-center gap-2">
                            {windowsSeen != null && (
                                <span className="font-mono text-[10px] text-gray-500">{windowsSeen}{warmupTarget != null ? `/${warmupTarget}` : ''}w</span>
                            )}
                            <PyramidMaturityBadge maturity={pyramidMaturity} copy={copy} />
                        </div>
                    </ConfigRow>
                    {showWarmupBar && (
                        <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2 space-y-1.5">
                            <div className="flex items-center justify-between text-[10px]">
                                <span className="text-amber-300 font-semibold uppercase tracking-wide">{copy.pyramidWarmingUpProgress}</span>
                                <span className="font-mono text-amber-400">{warmupPct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-amber-400/70 transition-all duration-700"
                                    style={{ width: `${warmupPct}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-gray-600">
                                {effectiveWindowsSeen} / {effectiveWarmupTarget} windows
                                {timeToMaturity
                                    ? <> · <span className="text-amber-500/80">~{timeToMaturity} to maturity</span></>
                                    : windowsRemaining === 0 && <> · <span className="text-amber-500/60">finalising…</span></>}
                            </p>
                        </div>
                    )}
                    {lastWindowSimTime && (
                        <ConfigRow label={copy.streamLastWindow}>
                            <span className="font-mono text-[11px] text-gray-400">{lastWindowSimTime}</span>
                        </ConfigRow>
                    )}
                    <ConfigRow label={copy.configExplainMode}>
                        {explainMode ? (
                            <ExplainModeBadge mode={explainMode} enabled={llmEnabled ?? undefined} model={llmModel ?? undefined} />
                        ) : (
                            <span className="text-[11px] text-gray-600">{copy.configNotAvailable}</span>
                        )}
                    </ConfigRow>
                    <ConfigRow label={copy.configLlmModel}>
                        <span className="font-mono text-[11px] text-gray-300 truncate max-w-[10rem]">
                            {llmModel ?? copy.configLlmNotSet}
                        </span>
                    </ConfigRow>
                    <ConfigRow label={copy.configLlmEnabled}>
                        <span className={`text-[11px] font-semibold ${llmEnabled ? 'text-emerald-300' : 'text-gray-500'}`}>
                            {llmEnabled ? copy.configLlmEnabled : copy.configLlmDisabled}
                        </span>
                    </ConfigRow>
                </div>
                {/* Live reconfigure */}
                <ReconfigurePanel
                    engineId={engineId}
                    currentWindowDuration={windowDuration}
                    currentExplainMode={explainMode}
                    currentLlmModel={llmModel}
                    copy={copy}
                />
            </div>
        )
    }

    if (activeCapability === 'evidence') {
        const packets = latestWindow?.contextPackets ?? []
        const windowTimeRange = latestWindow?.metalog
            ? `${formatSimTime(latestWindow.metalog.window.start)} \u2192 ${formatSimTime(latestWindow.metalog.window.end)}`
            : null
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <SectionTitle title={copy.evidenceTitle} />
                    <WindowStamp windowNum={windowCount} timeRange={windowTimeRange} windowLabel={copy.windowLabel} />
                </div>
                {packets.length === 0 ? (
                    <EmptyState
                        icon={<FileText className="w-5 h-5" />}
                        title={copy.evidenceEmptyTitle}
                        body={copy.evidenceEmptyBody}
                        tone="brand"
                    />
                ) : (
                    <div className="space-y-3">
                        {packets.map((packet, pi) => (
                            <EvidencePacketCard key={pi} packet={packet} copy={copy} />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <SectionTitle title={copy.ingestTitle} />
            <div className="grid grid-cols-2 gap-2">
                <Metric
                    label={copy.metrics.lines}
                    value={formatCompact(linesIngested)}
                    large
                />
                <Metric
                    label={copy.ingestWindows}
                    value={windowCount != null ? String(windowCount) : '—'}
                    large
                />
                {windowCount != null && windowCount > 0 && (
                    <Metric
                        label={copy.ingestAvgLines}
                        value={formatCompact(Math.round(linesIngested / windowCount))}
                        large
                    />
                )}
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-3">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-gray-100">
                        {running ? copy.running : copy.idle}
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

function ConfigRow({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-800 bg-gray-950/60 px-3 py-2">
            <span className="text-[11px] uppercase tracking-wide text-gray-500 shrink-0">{label}</span>
            <div className="flex items-center justify-end min-w-0">{children}</div>
        </div>
    )
}

function PyramidMaturityBadge({
    maturity,
    copy,
}: {
    maturity: string | null
    copy: ReturnType<typeof useTranslation>['lab']['insight']
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

function formatSimTime(iso: string | undefined): string {
    if (!iso) return '?'
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso.slice(11, 19) || iso
    return d.toISOString().slice(11, 19) // HH:MM:SS UTC
}

/** Format seconds as a compact duration string: e.g. 90s → "1m 30s", 3700s → "1h 1m" */
function formatDuration(seconds: number): string {
    const s = Math.round(seconds)
    if (s < 60) return `${s}s`
    const m = Math.floor(s / 60)
    const rem = s % 60
    if (m < 60) return rem > 0 ? `${m}m ${rem}s` : `${m}m`
    const h = Math.floor(m / 60)
    const mRem = m % 60
    return mRem > 0 ? `${h}h ${mRem}m` : `${h}h`
}

/** Small stamp showing Window #N and/or HH:MM:SS → HH:MM:SS, shown top-right of tab headers. */
function WindowStamp({
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
function detectionSignalStyle(score: number) {
    if (score >= 0.9) {
        return {
            card: 'border-red-500/35 bg-red-500/8',
            badge: 'border-red-500/40 bg-red-500/15 text-red-300',
        }
    }
    if (score >= 0.6) {
        return {
            card: 'border-amber-500/35 bg-amber-500/8',
            badge: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
        }
    }
    return {
        card: 'border-blue-500/30 bg-blue-500/8',
        badge: 'border-blue-500/35 bg-blue-500/15 text-blue-300',
    }
}

function EvidencePacketCard({
    packet,
    copy,
}: {
    packet: ContextPacket
    copy: ReturnType<typeof useTranslation>['lab']['insight']
}) {
    return (
        <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-3 space-y-3">
            {/* Incident summary */}
            <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">{copy.evidenceIncident}</p>
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-gray-200">{packet.incident.class}</span>
                    <span className="font-mono text-xs text-brand-300">{formatPercent(packet.incident.confidence)}</span>
                </div>
            </div>

            {/* Template contexts */}
            {packet.templates.length > 0 && (
                <div>
                    <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1.5">{copy.evidenceTemplates}</p>
                    <div className="space-y-1.5">
                        {packet.templates.map((t) => (
                            <div key={t.id} className="rounded border border-gray-800 bg-gray-900/60 px-2 py-1.5 space-y-0.5">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[9px] text-gray-600">{copy.evidenceFreq}</span>
                                    <span className="font-mono text-[9px] text-gray-400">
                                        {t.current_frequency}
                                        {t.count_delta !== 0 && (
                                            <span className={t.count_delta > 0 ? 'text-red-400' : 'text-green-400'}>
                                                {' '}{copy.evidenceDelta}{t.count_delta > 0 ? '+' : ''}{t.count_delta}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <p className="font-mono text-[10px] text-gray-300 break-all leading-relaxed">{t.template}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Window evidence */}
            <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1.5">{copy.evidenceWindow}</p>
                <div className="grid grid-cols-2 gap-1.5">
                    <Metric label="Lines" value={String(packet.window.lines_observed)} />
                    {packet.window.new_templates != null && (
                        <Metric label="New tmpl" value={String(packet.window.new_templates)} />
                    )}
                    {packet.window.vanished_templates != null && (
                        <Metric label="Lost tmpl" value={String(packet.window.vanished_templates)} />
                    )}
                    {packet.window.js_divergence != null && (
                        <Metric label="JS div" value={packet.window.js_divergence.toFixed(4)} />
                    )}
                </div>
                {packet.window.new_ngrams.length > 0 && (
                    <div className="mt-2">
                        <p className="text-[9px] text-gray-700 mb-0.5">new n-grams</p>
                        <p className="font-mono text-[9px] text-gray-500 break-all">{packet.window.new_ngrams.slice(0, 8).join(', ')}{packet.window.new_ngrams.length > 8 ? '…' : ''}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
