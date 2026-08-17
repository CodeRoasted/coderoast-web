import { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, X, Loader2, AlertCircle, Shield, HelpCircle, Gauge, RefreshCw } from 'lucide-react'
import { getCapabilityMatrix, type CapabilityMatrix, type OperationInfo, type QuotaInfo, type QuotaUsage } from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'
import { useTranslation } from '@/hooks/useTranslation'
import Tooltip from '@/components/Tooltip'
import { groupThousands } from '@/utils/format'

type GroupedOps = Array<{ category: string; items: OperationInfo[] }>

function groupOperations(ops: OperationInfo[]): GroupedOps {
    const map = new Map<string, OperationInfo[]>()
    for (const op of ops) {
        const bucket = map.get(op.category) ?? []
        bucket.push(op)
        map.set(op.category, bucket)
    }
    return [...map.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, items]) => ({
            category,
            items: items.slice().sort((a, b) => {
                const ea = a.required_entitlement ?? ''
                const eb = b.required_entitlement ?? ''
                return ea.localeCompare(eb) || a.key.localeCompare(b.key)
            }),
        }))
}

function entitlementAccent(entitlement: string): string {
    if (entitlement.startsWith('public.')) return 'text-gray-400 border-gray-700'
    if (entitlement.startsWith('system.')) return 'text-amber-400 border-amber-800'
    if (entitlement.startsWith('logcraft.')) return 'text-emerald-400 border-emerald-800'
    if (entitlement.startsWith('insight.')) return 'text-blue-400 border-blue-800'
    if (entitlement.startsWith('tenant.')) return 'text-purple-400 border-purple-800'
    return 'text-gray-300 border-gray-600'
}

/**
 * Format a numeric quota value with its unit embedded.
 * Returns the display label and a Tailwind colour class.
 *
 * @param zeroLabel  String to show when value === 0.  Pass `null` to render
 *                   zero as a real number (e.g. usage column where 0 = "nothing
 *                   consumed yet", not "access denied").
 */
function formatQuotaValue(
    value: number,
    unit: string,
    unlimited: string,
    noAccess: string | null,
): { label: string; className: string } {
    if (value < 0) return { label: unlimited, className: 'text-emerald-400' }
    if (value === 0 && noAccess !== null) return { label: noAccess, className: 'text-gray-500' }
    if (unit === 'bytes') {
        const label =
            value >= 1_000_000_000
                ? `${(value / 1_000_000_000).toFixed(1)} GB`
                : value >= 1_000_000
                  ? `${(value / 1_000_000).toFixed(0)} MB`
                  : `${groupThousands(value)} B`
        return { label, className: 'text-gray-200' }
    }
    // Non-bytes: append abbreviated unit
    const abbrev: Record<string, string> = {
        engines: value === 1 ? 'engine' : 'engines',
        seconds: 's',
        calls: value === 1 ? 'call' : 'calls',
        requests: value === 1 ? 'req' : 'req',
        'calls/day': value === 1 ? 'call/day' : 'calls/day',
        'req/min': 'req/min',
    }
    const suffix = abbrev[unit] ?? unit
    return { label: `${groupThousands(value)} ${suffix}`, className: 'text-gray-200' }
}

export default function TierMatrix() {
    const t = useTranslation()
    const navigate = useNavigate()
    const operations = useAuthStore((s) => s.operations)
    const authToken = useAuthStore((s) => s.token)
    const authLoading = useAuthStore((s) => s.loading)
    const [matrix, setMatrix] = useState<CapabilityMatrix | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const refresh = useCallback(() => {
        setLoading(true)
        setError(null)
        getCapabilityMatrix()
            .then(setMatrix)
            .catch((err) => setError(err instanceof Error ? err.message : String(err)))
            .finally(() => setLoading(false))
    }, [])

    // Re-fetch the capability matrix whenever the auth token changes (e.g. after the
    // bootstrap re-logs in as visitor following a stale-token invalidation). Without
    // this, the first fetch races the bootstrap and may return the anonymous profile
    // (all-zero quotas) because the old token was not yet recognised by the server.
    // We also wait until the auth bootstrap has finished (authLoading === false) so
    // the first fetch always runs with a settled session.
    useEffect(() => {
        if (!authLoading) {
            refresh()
        }
    }, [authLoading, authToken, refresh])

    const groups: GroupedOps = useMemo(
        () => (matrix ? groupOperations(matrix.operations) : []),
        [matrix],
    )

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            <div className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-lg border-b border-gray-700/50">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-400 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t.nav.back}
                        </button>
                        <div className="h-5 w-px bg-gray-700" />
                        <h1 className="font-display font-bold text-lg flex items-center gap-2">
                            <Shield className="w-4 h-4 text-brand-500" />
                            <span className="text-gray-300">{t.tiers.title}</span>
                        </h1>
                    </div>
                    <button
                        onClick={refresh}
                        disabled={loading}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 disabled:opacity-40 transition-colors"
                        title="Refresh usage data"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <p className="text-sm text-gray-400 max-w-3xl">{t.tiers.description}</p>

                {loading && (
                    <div className="flex items-center gap-2 text-gray-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t.tiers.loading}</span>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-900/20 border border-red-700/50 text-sm text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {matrix && !loading && !error && (
                    <>
                        {/* ── Quotas ─────────────────────────────────────────────── */}
                        <div className="space-y-3">
                            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                <Gauge className="w-4 h-4 text-brand-400" />
                                {t.tiers.yourLimits}
                            </h2>
                            {matrix.current_access?.quotas?.length ? (
                                <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/60">
                                    <table className="min-w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-800 bg-gray-900">
                                                <th className="text-left font-semibold text-gray-300 px-4 py-3">
                                                    {t.tiers.quota}
                                                </th>
                                                <th className="text-left font-semibold text-gray-300 px-4 py-3 border-l border-gray-800">
                                                    {t.tiers.usage}
                                                </th>
                                                <th className="text-left font-semibold text-gray-300 px-4 py-3 border-l border-gray-800">
                                                    {t.tiers.limit}
                                                </th>
                                                <th className="text-left font-semibold text-gray-300 px-4 py-3 border-l border-gray-800 hidden sm:table-cell">
                                                    Description
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {matrix.current_access.quotas.map((q: QuotaInfo) => {
                                                const { label: limitLabel, className: limitClass } = formatQuotaValue(q.limit, q.unit, t.tiers.unlimited, t.tiers.noAccess)
                                                const usageEntry: QuotaUsage | undefined =
                                                    matrix.current_access?.quota_usage?.find(
                                                        (u) => u.key === q.key,
                                                    )
                                                const usedValue = usageEntry?.used ?? null
                                                const { label: usageLabel, className: usageClass } =
                                                    usedValue !== null
                                                        ? formatQuotaValue(usedValue, q.unit, t.tiers.unlimited, null)
                                                        : { label: '—', className: 'text-gray-600' }
                                                return (
                                                    <tr
                                                        key={q.key}
                                                        className="border-t border-gray-800/70 hover:bg-gray-900/80"
                                                    >
                                                        <td className="px-4 py-2 font-mono text-xs text-gray-300">
                                                            {q.key}
                                                        </td>
                                                        <td className={`px-4 py-2 font-mono text-xs border-l border-gray-800 ${usageClass}`}>
                                                            {usageLabel}
                                                        </td>
                                                        <td className={`px-4 py-2 font-mono text-xs font-semibold border-l border-gray-800 ${limitClass}`}>
                                                            {limitLabel}
                                                        </td>
                                                        <td className="px-4 py-2 text-xs text-gray-500 border-l border-gray-800 hidden sm:table-cell">
                                                            {q.description}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">{t.tiers.noQuotas}</p>
                            )}
                        </div>

                        {/* ── Operations ─────────────────────────────────────────── */}
                        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/60">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-800 bg-gray-900">
                                        <th className="text-left font-semibold text-gray-300 px-4 py-3">
                                            {t.tiers.feature}
                                        </th>
                                        <th className="text-left font-semibold text-gray-300 px-4 py-3 border-l border-gray-800">
                                            Required entitlement
                                        </th>
                                        <th className="text-center font-semibold text-gray-300 px-4 py-3 border-l border-gray-800">
                                            You
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groups.map((group) => (
                                        <>
                                            <tr key={`group-${group.category}`} className="bg-gray-950/70">
                                                <td
                                                    colSpan={3}
                                                    className="px-4 py-2 text-[11px] uppercase tracking-widest text-gray-500 font-semibold"
                                                >
                                                    {group.category}
                                                </td>
                                            </tr>
                                            {group.items.map((op) => {
                                                const hasIt = operations.includes(op.key)
                                                return (
                                                    <tr
                                                        key={op.key}
                                                        className="border-t border-gray-800/70 hover:bg-gray-900/80"
                                                    >
                                                        <td className="px-4 py-2 font-mono text-xs text-gray-200">
                                                            <span className="inline-flex items-center gap-1.5">
                                                                <span>{op.key}</span>
                                                                {op.description && (
                                                                    <Tooltip
                                                                        content={
                                                                            <span className="block max-w-xs text-xs leading-snug">
                                                                                {op.description}
                                                                            </span>
                                                                        }
                                                                    >
                                                                        <HelpCircle
                                                                            className="w-3.5 h-3.5 text-gray-500 hover:text-brand-400 transition-colors cursor-help"
                                                                            aria-label={op.description}
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 border-l border-gray-800">
                                                            {op.required_entitlement ? (
                                                                <span
                                                                    className={`text-xs font-mono px-1.5 py-0.5 rounded border ${entitlementAccent(op.required_entitlement)}`}
                                                                >
                                                                    {op.required_entitlement}
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-gray-600 italic">
                                                                    none
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2 text-center border-l border-gray-800">
                                                            {hasIt ? (
                                                                <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                                                            ) : (
                                                                <X className="w-4 h-4 text-gray-600 mx-auto" />
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
