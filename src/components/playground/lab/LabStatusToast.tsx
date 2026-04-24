import { AnimatePresence, motion } from 'framer-motion'

interface Props {
    message: string | null
}

/**
 * Bottom-right floating toast. Color tint comes from a leading marker:
 *   ✓ — success (emerald)
 *   ✗ — failure (red)
 *   anything else — neutral (slate)
 *
 * Auto-dismissal is owned by the producer (see useEngineLifecycle), this
 * component just animates in/out when the message changes.
 */
export default function LabStatusToast({ message }: Props) {
    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    key={message}
                    initial={{ opacity: 0, y: 16, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium border backdrop-blur-md max-w-sm ${
                        message.startsWith('✓')
                            ? 'bg-emerald-900/90 border-emerald-500/40 text-emerald-200'
                            : message.startsWith('✗')
                                ? 'bg-red-900/90 border-red-500/40 text-red-200'
                                : 'bg-gray-800/95 border-gray-600/50 text-gray-200'
                    }`}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
