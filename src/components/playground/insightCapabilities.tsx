import type { ReactNode } from 'react'
import { Activity, Clock, FileText, Gauge, GitBranch, Layers, Lightbulb, Search, Settings, Zap } from 'lucide-react'
import type { InsightLatestWindow, InsightReport, InsightStatus } from '@/types/engine'
import { ConfigRow, EmptyState, ExplainModeBadge, Metric, PyramidMaturityBadge, SectionTitle, WindowStamp } from './InsightPrimitives'
import { EvidencePacketCard, InsightCard } from './InsightCards'
import { ReconfigurePanel } from './ReconfigurePanel'
import { detectionSignalStyle, formatCompact, formatDuration, formatPercent, formatSimTime, insightCardKey, severityStyle } from './insightFormat'
import type { InsightCopy } from './insightFormat'

// One body per capability tab. Split from the panel shell because the shell owns
// WHICH tab is active and the derived counts; this owns what each tab renders.

export type CapabilityKey = 'explain' | 'detect' | 'metalog' | 'templates' | 'evidence' | 'ingest' | 'config'

export const capabilityIcons: Record<CapabilityKey, ReactNode> = {
    explain: <Lightbulb className="w-3.5 h-3.5" />,
    detect: <Gauge className="w-3.5 h-3.5" />,
    metalog: <Layers className="w-3.5 h-3.5" />,
    templates: <Search className="w-3.5 h-3.5" />,
    evidence: <FileText className="w-3.5 h-3.5" />,
    ingest: <Activity className="w-3.5 h-3.5" />,
    config: <Settings className="w-3.5 h-3.5" />,
}

export function renderCapability({
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
    copy: InsightCopy
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
        // WHERE narration goes. Absent means nothing is sent — the server omits the key rather
        // than emitting an empty one, so absence is a fact and not a formatting accident.
        const llmHost = status?.llm_host ?? latestReport?.llm_host ?? null
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
                    {llmHost && (
                        <ConfigRow label={copy.configLlmHost}>
                            <span className="font-mono text-[11px] text-amber-300 truncate max-w-[10rem]" title={llmHost}>
                                {llmHost}
                            </span>
                        </ConfigRow>
                    )}
                </div>
                {/* Live reconfigure */}
                <ReconfigurePanel
                    engineId={engineId}
                    currentWindowDuration={windowDuration}
                    currentExplainMode={explainMode}
                    currentLlmModel={llmModel}
                    currentLlmHost={llmHost ?? ''}
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
