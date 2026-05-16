import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    open: boolean
    /** The human-readable action string inserted into the warning body. */
    actionLabel: string
    onConfirm: () => void
    onCancel: () => void
}

/**
 * Styled confirmation modal for seed-determinism warnings.
 *
 * Replaces the raw `window.confirm()` so the warning matches the visual
 * language of the rest of the lab.
 * Amber-themed rather than brand-purple to signal "caution, not blocked".
 */
export default function SeedConfirmModal({ open, actionLabel, onConfirm, onCancel }: Props) {
    const t = useTranslation()

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={onCancel}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 8 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 8 }}
                        className="relative w-full max-w-md rounded-2xl bg-gray-900 border border-amber-700/50 shadow-2xl shadow-amber-600/10 p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onCancel}
                            className="absolute top-3 right-3 p-1 rounded text-gray-500 hover:text-gray-200 hover:bg-gray-800/60 transition-colors"
                            aria-label={t.lab.seedConfirmCancel}
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="inline-flex p-2.5 rounded-xl bg-gradient-to-br from-amber-600 to-orange-500 text-white mb-4">
                            <AlertTriangle className="w-5 h-5" />
                        </div>

                        <h2 className="font-display text-xl font-bold text-white mb-2">
                            {t.lab.seedConfirmTitle}
                        </h2>
                        <p className="text-sm text-gray-400 leading-relaxed mb-5">
                            {t.lab.seedDeterminismWarning.replace('{action}', actionLabel)}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                onClick={onConfirm}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors"
                            >
                                {t.lab.seedConfirmProceed}
                            </button>
                            <button
                                onClick={onCancel}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors"
                            >
                                {t.lab.seedConfirmCancel}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body,
    )
}
