import { type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface Props {
    open: boolean
    onClose: () => void
    /** 1-based step index used to drive the progress bar. */
    step: number
    /** Total number of steps shown in the progress bar. */
    totalSteps: number
    closeLabel: string
    titleId: string
    children: ReactNode
}

/**
 * Generic modal shell shared by the wizard steps. Owns the backdrop,
 * close affordance, and step indicator so each step component can focus
 * on its own copy + form fields.
 */
export default function OnboardingShell({
    open,
    onClose,
    step,
    totalSteps,
    closeLabel,
    titleId,
    children,
}: Props) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={onClose}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                >
                    <motion.div
                        initial={{ scale: 0.96, y: 12 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.96, y: 12 }}
                        className="relative w-full max-w-2xl rounded-2xl bg-gray-900 border border-gray-700/60 shadow-2xl shadow-brand-600/10 p-6 sm:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-1.5 rounded text-gray-500 hover:text-gray-200 hover:bg-gray-800/60 transition-colors"
                            aria-label={closeLabel}
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-gray-500">
                            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
                                <span
                                    key={n}
                                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                                        step >= n ? 'bg-brand-500' : 'bg-gray-800'
                                    }`}
                                />
                            ))}
                        </div>

                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
