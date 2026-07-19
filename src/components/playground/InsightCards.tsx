import type { ContextPacket, InsightReport } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'
import { DetailList, ExplainModeBadge, Metric } from './InsightPrimitives'
import { formatPercent, severityStyle } from './insightFormat'
import type { InsightCopy } from './insightFormat'

// The two DOMAIN-shaped cards: one insight report, one evidence context packet.
// Distinct from InsightPrimitives — those are generic atoms, these know the
// shape of an InsightReport / ContextPacket.

export function InsightCard({ report, featured = false }: { report: InsightReport; featured?: boolean }) {
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

export function EvidencePacketCard({
    packet,
    copy,
}: {
    packet: ContextPacket
    copy: InsightCopy
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
