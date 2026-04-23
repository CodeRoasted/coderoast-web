import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cookie, CheckCircle2, RotateCcw, Lock } from 'lucide-react'
import { ONBOARDING_COOKIE, deleteCookie } from '@/utils/cookies'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    open: boolean
    onClose: () => void
}

export default function CookiePreferences({ open, onClose }: Props) {
    const t = useTranslation()
    const cp = t.cookiePrefs
    const [resetDone, setResetDone] = useState(false)

    function handleReset() {
        deleteCookie(ONBOARDING_COOKIE)
        setResetDone(true)
    }

    function handleClose() {
        setResetDone(false)
        onClose()
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={handleClose}
                    />

                    {/* Panel */}
                    <motion.div
                        key="panel"
                        initial={{ opacity: 0, y: 24, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.97 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="fixed inset-x-4 bottom-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg z-50"
                        role="dialog"
                        aria-modal
                        aria-labelledby="cookie-pref-title"
                    >
                        <div className="rounded-2xl bg-gray-900 border border-gray-700/60 shadow-2xl shadow-black/50 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-800">
                                <div className="flex items-center gap-2.5">
                                    <Cookie className="w-5 h-5 text-brand-400 shrink-0" />
                                    <h2
                                        id="cookie-pref-title"
                                        className="font-display font-bold text-white text-base"
                                    >
                                        {cp.title}
                                    </h2>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-5 space-y-5">
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {cp.subtitle}
                                </p>

                                {/* Cookie category row */}
                                <div className="rounded-xl border border-gray-700/50 bg-gray-950/60 overflow-hidden">
                                    {/* Category header */}
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/60">
                                        <div className="flex items-center gap-2">
                                            <Lock className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                                                {cp.category}
                                            </span>
                                        </div>
                                        {/* Always-on toggle (locked) */}
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] text-gray-500 uppercase tracking-wide">
                                                {cp.alwaysOn}
                                            </span>
                                            <div className="w-9 h-5 rounded-full bg-emerald-600/70 border border-emerald-500/50 flex items-center justify-end px-0.5">
                                                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="px-4 py-2.5 text-xs text-gray-500 leading-relaxed">
                                        {cp.categoryDesc}
                                    </p>

                                    {/* Single cookie entry */}
                                    <div className="mx-4 mb-4 rounded-lg bg-gray-900 border border-gray-800 p-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-semibold text-gray-200 mb-0.5">
                                                    {cp.onboardingName}
                                                </p>
                                                <p className="text-xs text-gray-500 leading-relaxed">
                                                    {cp.onboardingDesc}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600 font-mono">
                                                    <span>{cp.cookieKey}</span>
                                                    <span>·</span>
                                                    <span>{cp.cookieDuration}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleReset}
                                                disabled={resetDone}
                                                title={cp.resetBtn}
                                                className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <RotateCcw className="w-3 h-3" />
                                                {cp.resetBtn}
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {resetDone && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    className="flex items-center gap-1.5 text-xs text-emerald-400"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                                    {cp.resetDone}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 pb-5">
                                <button
                                    onClick={handleClose}
                                    className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm font-semibold text-gray-200 transition-colors"
                                >
                                    {cp.close}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
