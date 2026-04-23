import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, X, ArrowRight, AlertCircle } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import type { TierRequiredError } from '@/services/api'

interface Props {
    error: TierRequiredError | null
    onClose: () => void
}

/**
 * Friendly modal shown when the backend rejects an action with 403.
 *
 * Two modes:
 * - **tier-locked**: the feature exists but the user's current tier is too
 *   low — shows an upsell with a "See plans" link.
 * - **disabled**: the feature is intentionally disabled in this deployment
 *   (required_tier === "disabled") — shows a "not available" notice with no
 *   upgrade path.
 */
export default function TierLockModal({ error, onClose }: Props) {
    const t = useTranslation()
    const isDisabled = error?.requiredTier?.name === 'disabled'
    const required = error?.requiredTier?.name ?? '—'
    const current = error?.userTier?.name ?? error?.userId ?? 'anonymous'
    const permission = error?.permission ?? '—'

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

                        <div className={`inline-flex p-2.5 rounded-xl text-white mb-4 ${isDisabled ? 'bg-amber-600/80' : 'bg-gradient-to-br from-brand-600 to-orange-500'}`}>
                            {isDisabled ? <AlertCircle className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                        </div>

                        <h2 className="font-display text-xl font-bold text-white mb-2">
                            {isDisabled ? t.auth.tierDisabledTitle : t.auth.tierLockTitle}
                        </h2>
                        <p className="text-sm text-gray-400 leading-relaxed mb-5">
                            {isDisabled
                                ? t.auth.tierDisabledBody.replace('{permission}', permission)
                                : t.auth.tierLockBody
                                    .replace('{permission}', permission)
                                    .replace('{tier}', required)
                                    .replace('{current}', current)}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2">
                            {!isDisabled && (
                                <Link
                                    to="/tiers"
                                    onClick={onClose}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors"
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
