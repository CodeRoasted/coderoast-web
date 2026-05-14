import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, X, ArrowRight, AlertCircle, UserCheck } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { login, listUsers } from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'
import type { PolicyDenialError } from '@/services/api'

interface Props {
    error: PolicyDenialError | null
    onClose: () => void
}

/**
 * Friendly modal shown when the backend rejects an action with 403.
 *
 * Two modes:
 * - **entitlement-locked**: the user lacks the required entitlement — shows
 *   the operation key and entitlement name with a switch-user upgrade path.
 * - **quota**: a quota limit was hit — shows the quota key and limit.
 */
export default function TierLockModal({ error, onClose }: Props) {
    const t = useTranslation()
    const setAuth = useAuthStore((s) => s.setAuth)
    const setSelectedUserId = useAuthStore((s) => s.setSelectedUserId)
    const [switching, setSwitching] = useState(false)
    const [switchError, setSwitchError] = useState<string | null>(null)
    const isQuotaError = Boolean(error?.quotaKey)
    const operation = error?.operation ?? "—"
    const requiredEntitlement = error?.requiredEntitlement ?? "—"
    const quotaDetail = error?.quotaKey
        ? `${error.quotaKey} (limit: ${error.quotaLimit ?? "?"})`
        : ""

    const canUpgrade = Boolean(!isQuotaError && error?.identityKind !== 'account')

    const upgradeUserId =
        !error?.role || error.role === 'anonymous' || error.identityKind === 'anonymous'
            ? 'logcraft_demo'
            : 'insight_demo'

    const handleSwitchUser = async () => {
        setSwitching(true)
        setSwitchError(null)
        try {
            const [{ users }, { token, user, access }] = await Promise.all([
                listUsers(),
                login(upgradeUserId),
            ])
            const found = users.find((u) => u.id === upgradeUserId)
            const ops = access?.operations ?? found?.access?.operations ?? []
            setAuth(token, user, ops)
            setSelectedUserId(upgradeUserId)
            onClose()
        } catch (err) {
            setSwitchError(err instanceof Error ? err.message : String(err))
        } finally {
            setSwitching(false)
        }
    }

    return (
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 8 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 8 }}
                        className="relative w-full max-w-md rounded-2xl bg-gray-900 border border-brand-700/50 shadow-2xl shadow-brand-600/10 p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-1 rounded text-gray-500 hover:text-gray-200 hover:bg-gray-800/60 transition-colors"
                            aria-label={t.auth.tierLockClose}
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div
                            className={`inline-flex p-2.5 rounded-xl text-white mb-4 ${
                                isQuotaError
                                    ? "bg-amber-600/80"
                                    : "bg-gradient-to-br from-brand-600 to-orange-500"
                            }`}
                        >
                            {isQuotaError ? (
                                <AlertCircle className="w-5 h-5" />
                            ) : (
                                <Lock className="w-5 h-5" />
                            )}
                        </div>

                        <h2 className="font-display text-xl font-bold text-white mb-2">
                            {isQuotaError ? t.auth.tierDisabledTitle : t.auth.tierLockTitle}
                        </h2>
                        <p className="text-sm text-gray-400 leading-relaxed mb-1">
                            {isQuotaError
                                ? t.auth.tierDisabledBody.replace("{permission}", operation)
                                : t.auth.tierLockBody
                                      .replace("{permission}", operation)
                                      .replace("{tier}", requiredEntitlement)
                                      .replace("{current}", error?.role ?? "anonymous")}
                        </p>
                        {isQuotaError && quotaDetail && (
                            <p className="text-xs text-amber-400/80 mb-4">{quotaDetail}</p>
                        )}
                        {canUpgrade && (
                            <p className="text-xs text-gray-600 mb-4 font-mono">
                                {operation} · {requiredEntitlement}
                            </p>
                        )}

                        {switchError && (
                            <p
                                role="alert"
                                className="text-xs text-red-400 bg-red-950/40 border border-red-800/40 rounded-md px-2 py-1.5 mb-3"
                            >
                                {switchError}
                            </p>
                        )}
                        <div className="flex flex-col sm:flex-row gap-2">
                            {canUpgrade && (
                                <button
                                    onClick={handleSwitchUser}
                                    disabled={switching}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                                >
                                    <UserCheck className="w-3.5 h-3.5" />
                                    {t.auth.tierLockSwitch}
                                </button>
                            )}
                            {canUpgrade && (
                                <Link
                                    to="/tiers"
                                    onClick={onClose}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold transition-colors"
                                >
                                    {t.auth.tierLockSeePlans}
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            )}
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors"
                            >
                                {t.auth.tierLockClose}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
