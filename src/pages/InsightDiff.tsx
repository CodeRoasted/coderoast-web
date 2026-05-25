import { useCallback, useMemo, useState } from 'react'
import { GitCompareArrows, Loader2 } from 'lucide-react'
import { runInsightDiff, PolicyDenialError } from '@/services/api'
import type { ChangeReportResponse, DiffRankedChange, DiffSeverity } from '@/types/diff'

const SEVERITY_STYLE: Record<DiffSeverity, string> = {
    critical: 'bg-red-500/15 text-red-300 border-red-500/40',
    high: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
    medium: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40',
    low: 'bg-gray-500/15 text-gray-300 border-gray-500/40',
}

function countLines(text: string): number {
    if (text.length === 0) return 0
    return text.split('\n').filter((line) => line.trim().length > 0).length
}

function ChangeRow({ change, index }: { change: DiffRankedChange; index: number }) {
    const style = SEVERITY_STYLE[change.severity] ?? SEVERITY_STYLE.low
    return (
        <li className="flex gap-3 py-3 border-b border-gray-800 last:border-0">
            <span className="text-gray-600 font-mono text-sm w-6 shrink-0 text-right">{index + 1}.</span>
            <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase border ${style}`}>
                        {change.severity}
                    </span>
                    <span className="text-gray-500 text-xs font-mono">{change.kind}</span>
                </div>
                <p className="text-gray-100 text-sm mt-1 break-words">{change.summary}</p>
                {change.evidence && change.evidence.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                        {change.evidence.map((line, idx) => (
                            <li key={idx} className="text-gray-500 text-xs font-mono break-words">
                                — {line}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </li>
    )
}

function ReportView({ report }: { report: ChangeReportResponse }) {
    const { summary, ranked_changes, inputs } = report
    const suppressed = summary.total_changes - summary.significant_changes
    return (
        <div className="mt-8">
            <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-5">
                <p className="text-2xl font-bold text-white">
                    {summary.total_changes.toLocaleString()} changes,{' '}
                    <span className="text-brand-400">{summary.significant_changes}</span> structurally
                    significant
                </p>
                <p className="text-sm text-gray-400 mt-1">
                    {typeof summary.stability_score === 'number' && (
                        <>stability {summary.stability_score.toFixed(2)} · </>
                    )}
                    baseline {inputs.baseline.lines_observed.toLocaleString()} lines /{' '}
                    {inputs.baseline.unique_templates} templates → changed{' '}
                    {inputs.changed.lines_observed.toLocaleString()} lines /{' '}
                    {inputs.changed.unique_templates} templates
                </p>
            </div>

            {ranked_changes.length === 0 ? (
                <p className="text-gray-400 text-sm mt-6">
                    No structurally significant changes — all {summary.total_changes.toLocaleString()}{' '}
                    observed changes are within noise.
                </p>
            ) : (
                <>
                    <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mt-6 mb-1">
                        Significant changes
                    </h2>
                    <ul>
                        {ranked_changes.map((change, idx) => (
                            <ChangeRow key={idx} change={change} index={idx} />
                        ))}
                    </ul>
                    {suppressed > 0 && (
                        <p className="text-gray-600 text-xs mt-4 italic">
                            {suppressed.toLocaleString()} changes suppressed as noise (proportional /
                            low-frequency).
                        </p>
                    )}
                </>
            )}
        </div>
    )
}

export default function InsightDiff() {
    const [baseline, setBaseline] = useState('')
    const [changed, setChanged] = useState('')
    const [report, setReport] = useState<ChangeReportResponse | null>(null)
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
            setReport(await runInsightDiff({ baseline, changed }))
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

    return (
        <main className="bg-gray-950 min-h-screen pt-28 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold mb-3">
                    <GitCompareArrows className="w-4 h-4" />
                    INSIGHT DIFF
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
                    What changed between two logs — and what's just noise
                </h1>
                <p className="text-gray-400 mt-2 max-w-2xl">
                    Paste two log streams (a baseline run and a changed run). InSight ingests both and
                    reports the structurally significant changes, ranked — suppressing the noise a plain{' '}
                    <code className="text-gray-300">diff</code> drowns you in.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    {([
                        ['Baseline log', baseline, setBaseline],
                        ['Changed log', changed, setChanged],
                    ] as const).map(([label, value, setter]) => (
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
                    <span className="text-xs text-gray-600">Free · metered per day · logs are not stored</span>
                </div>

                {error && (
                    <div className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
                        {error}
                    </div>
                )}

                {report && <ReportView report={report} />}
            </div>
        </main>
    )
}
