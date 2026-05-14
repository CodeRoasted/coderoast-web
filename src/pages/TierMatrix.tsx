import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, X, Loader2, AlertCircle, Shield, HelpCircle } from 'lucide-react'
import { getCapabilityMatrix, type CapabilityMatrix, type OperationInfo } from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'
import { useTranslation } from '@/hooks/useTranslation'
import Tooltip from '@/components/Tooltip'

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
            items: items.slice().sort((a, b) => a.key.localeCompare(b.key)),
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
 * Capability matrix — renders the live access-control configuration
 * exposed by GET /tiers. Everything is server-driven; nothing is hard-coded.
 */
export default function TierMatrix() {
    const t = useTranslation()
    const operations = useAuthStore((s) => s.operations)
    const [matrix, setMatrix] = useState<CapabilityMatrix | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getCapabilityMatrix()
            .then(setMatrix)
            .catch((err) => setError(err instanceof Error ? err.message : String(err)))
            .finally(() => setLoading(false))
    }, [])

    const groups: GroupedOps = useMemo(
        () => (matrix ? groupOperations(matrix.operations) : []),
        [matrix],
    )

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            <div className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-lg border-b border-gray-700/50">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/lab/logcraft"
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-400 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t.lab.title}
                        </Link>
                        <div className="h-5 w-px bg-gray-700" />
                        <h1 className="font-display font-bold text-lg flex items-center gap-2">
                            <Shield className="w-4 h-4 text-brand-500" />
                            <span className="text-gray-300">{t.tiers.title}</span>
                        </h1>
                    </div>
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
                                                        <span
                                                            className={`text-xs font-mono px-1.5 py-0.5 rounded border ${entitlementAccent(op.required_entitlement)}`}
                                                        >
                                                            {op.required_entitlement}
                                                        </span>
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
                )}
            </div>
        </div>
    )
}
