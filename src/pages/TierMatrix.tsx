import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, X, Loader2, AlertCircle, Shield, HelpCircle } from 'lucide-react'
import { getFeatureMatrix, type FeatureMatrix, type PermissionInfo, type TierInfo } from '@/services/api'
import { useTranslation } from '@/hooks/useTranslation'
import Tooltip from '@/components/Tooltip'

type GroupedPermissions = Array<{ category: string; items: PermissionInfo[] }>

function groupPermissions(perms: PermissionInfo[]): GroupedPermissions {
    const map = new Map<string, PermissionInfo[]>()
    for (const perm of perms) {
        const bucket = map.get(perm.category) ?? []
        bucket.push(perm)
        map.set(perm.category, bucket)
    }
    return [...map.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, items]) => ({
            category,
            items: items.slice().sort((a, b) => a.key.localeCompare(b.key)),
        }))
}

function tierAccent(level: number): string {
    switch (level) {
        case 0:
            return 'text-gray-400 border-gray-700'
        case 1:
            return 'text-emerald-400 border-emerald-800'
        case 2:
            return 'text-blue-400 border-blue-800'
        case 3:
            return 'text-purple-400 border-purple-800'
        default:
            return 'text-red-400 border-red-900'
    }
}

/**
 * Tier / Feature matrix — renders the live access-control configuration
 * exposed by `GET /tiers`. Reading this page guarantees the reference
 * stays in sync with the backend; nothing is hard-coded on the client.
 */
export default function TierMatrix() {
    const t = useTranslation()
    const [matrix, setMatrix] = useState<FeatureMatrix | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getFeatureMatrix()
            .then(setMatrix)
            .catch((err) => setError(err instanceof Error ? err.message : String(err)))
            .finally(() => setLoading(false))
    }, [])

    const displayTiers: TierInfo[] = useMemo(() => {
        if (!matrix) return []
        // Drop the "Disabled" sentinel tier from the column header row —
        // it's a marker meaning "never available", not a purchasable level.
        return matrix.tiers.filter((tier) => tier.name !== 'disabled')
    }, [matrix])

    const groups: GroupedPermissions = useMemo(
        () => (matrix ? groupPermissions(matrix.permissions) : []),
        [matrix],
    )

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            <div className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-lg border-b border-gray-700/50">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/lab"
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
                                    {displayTiers.map((tier) => (
                                        <th
                                            key={tier.name}
                                            className={`text-center font-semibold px-4 py-3 uppercase tracking-wider text-xs border-l border-gray-800 ${tierAccent(tier.level)}`}
                                        >
                                            {tier.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {groups.map((group) => (
                                    <>
                                        <tr key={`group-${group.category}`} className="bg-gray-950/70">
                                            <td
                                                colSpan={displayTiers.length + 1}
                                                className="px-4 py-2 text-[11px] uppercase tracking-widest text-gray-500 font-semibold"
                                            >
                                                {group.category}
                                            </td>
                                        </tr>
                                        {group.items.map((perm) => (
                                            <tr
                                                key={perm.key}
                                                className="border-t border-gray-800/70 hover:bg-gray-900/80"
                                            >
                                                <td className="px-4 py-2 font-mono text-xs text-gray-200">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <span>{perm.key}</span>
                                                        {perm.description && (
                                                            <Tooltip
                                                                content={
                                                                    <span className="block max-w-xs text-xs leading-snug">
                                                                        {perm.description}
                                                                    </span>
                                                                }
                                                            >
                                                                <HelpCircle
                                                                    className="w-3.5 h-3.5 text-gray-500 hover:text-brand-400 transition-colors cursor-help"
                                                                    aria-label={perm.description}
                                                                />
                                                            </Tooltip>
                                                        )}
                                                        {perm.required_tier.name === 'disabled' && (
                                                            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-red-900/30 text-red-400 border border-red-800">
                                                                {t.tiers.disabled}
                                                            </span>
                                                        )}
                                                    </span>
                                                </td>
                                                {displayTiers.map((tier) => {
                                                    const allowed =
                                                        perm.required_tier.name !== 'disabled' &&
                                                        tier.level >= perm.required_tier.level
                                                    return (
                                                        <td
                                                            key={tier.name}
                                                            className="px-4 py-2 text-center border-l border-gray-800/70"
                                                        >
                                                            {allowed ? (
                                                                <Check className="w-4 h-4 text-emerald-400 inline" />
                                                            ) : (
                                                                <X className="w-4 h-4 text-gray-700 inline" />
                                                            )}
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        ))}
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
