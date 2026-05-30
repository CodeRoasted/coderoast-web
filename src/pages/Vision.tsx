import type { ComponentType } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    ArrowRight,
    Bird,
    Bot,
    Check,
    CloudOff,
    FilterX,
    Fingerprint,
    GitCompareArrows,
    History,
    Layers,
    Network,
    Radar,
    Scissors,
    Sparkles,
    X,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useTranslation } from '@/hooks/useTranslation'

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
}

// Index-aligned with t.vision.pain.points (order is authored, not locale-bound).
const painIcons = [
    <Scissors className="w-5 h-5" />,
    <FilterX className="w-5 h-5" />,
    <CloudOff className="w-5 h-5" />,
    <Sparkles className="w-5 h-5" />,
]

// Index-aligned with t.vision.hub.lenses.
type LensMeta = { Icon: ComponentType<{ className?: string }>; tone: 'live' | 'beta' | 'soon' }
const lensMeta: LensMeta[] = [
    { Icon: GitCompareArrows, tone: 'live' },
    { Icon: Radar, tone: 'beta' },
    { Icon: Layers, tone: 'soon' },
    { Icon: Bird, tone: 'soon' },
    { Icon: History, tone: 'soon' },
    { Icon: Bot, tone: 'soon' },
]

const statusTone: Record<LensMeta['tone'], string> = {
    live: 'bg-emerald-500/10 text-emerald-400 border-emerald-700/30',
    beta: 'bg-blue-500/10 text-blue-400 border-blue-700/30',
    soon: 'bg-gray-700/30 text-gray-400 border-gray-700/50',
}

export default function Vision() {
    const t = useTranslation()
    const v = t.vision

    return (
        <div className="bg-gray-950 text-gray-100 min-h-screen">
            <Navbar />
            <main className="pt-16">
                {/* Hero */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(249,115,22,0.12),transparent)]" />
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-28 text-center">
                        <motion.div {...fadeUp}>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-brand-300 bg-brand-500/10 border border-brand-700/30 mb-8">
                                {v.badge}
                            </span>
                            <h1 className="text-4xl sm:text-6xl font-display font-bold leading-[1.05] text-white">
                                {v.titleLead}{' '}
                                <span className="bg-gradient-to-r from-brand-500 to-orange-400 bg-clip-text text-transparent">
                                    {v.titleAccent}
                                </span>
                            </h1>
                            <p className="mt-7 text-base sm:text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto">
                                {v.subtitle}
                            </p>
                            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                                <Link
                                    to="/diff"
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-600 to-orange-500 text-white text-sm font-semibold shadow-md shadow-brand-700/30 hover:shadow-brand-700/50 hover:scale-[1.02] transition-all"
                                >
                                    <GitCompareArrows className="w-4 h-4" />
                                    {v.ctaPrimary}
                                </Link>
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-gray-700 text-gray-200 text-sm font-semibold hover:border-brand-700/60 hover:text-white transition-colors"
                                >
                                    {v.ctaSecondary}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* The pain */}
                <section className="relative py-24 sm:py-28 bg-gray-950 border-y border-gray-800/60">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeUp} className="max-w-3xl mb-12">
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-4">
                                {v.pain.title}
                            </h2>
                            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                                {v.pain.subtitle}
                            </p>
                        </motion.div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {v.pain.points.map((p, i) => (
                                <motion.div
                                    key={p.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.08 }}
                                    className="relative p-6 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-brand-700/60 transition-colors"
                                >
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-700/30 mb-4">
                                        {painIcons[i]}
                                    </div>
                                    <h3 className="font-display font-semibold text-white mb-2 leading-snug">
                                        {p.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">{p.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Meet the MetaLog — the artifact + demo sequence */}
                <section className="relative py-24 sm:py-28 bg-gray-950">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeUp} className="max-w-3xl mb-12">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-orange-500/10 text-brand-400 border border-brand-700/30 mb-5">
                                <Fingerprint className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-4">
                                {v.artifact.title}
                            </h2>
                            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                                {v.artifact.subtitle}
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {v.artifact.steps.map((s, i) => (
                                <motion.div
                                    key={s.step}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.08 }}
                                    className="relative p-6 rounded-2xl bg-gray-900/60 border border-gray-800"
                                >
                                    <span className="font-mono text-xs text-brand-500/80">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <h3 className="font-display font-semibold text-white mt-2 mb-2 leading-snug">
                                        {s.step}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">{s.description}</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            {...fadeUp}
                            className="mt-8 flex flex-wrap gap-2.5"
                        >
                            {v.artifact.badges.map((b) => (
                                <span
                                    key={b}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-300 bg-gray-900/80 border border-gray-800"
                                >
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    {b}
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* The two punches */}
                <section className="relative py-24 sm:py-28 bg-gray-950 border-y border-gray-800/60">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
                        {v.punches.map((punch) => (
                            <motion.div key={punch.title} {...fadeUp}>
                                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight mb-7 max-w-3xl">
                                    {punch.title}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-6 rounded-2xl bg-gray-900/40 border border-gray-800">
                                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
                                            <X className="w-3.5 h-3.5" />
                                            {v.punchThem}
                                        </div>
                                        <p className="text-sm text-gray-400 leading-relaxed">{punch.them}</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-brand-500/[0.06] border border-brand-700/40">
                                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-400 mb-3">
                                            <Check className="w-3.5 h-3.5" />
                                            {v.punchUs}
                                        </div>
                                        <p className="text-sm text-gray-200 leading-relaxed">{punch.us}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <motion.blockquote
                            {...fadeUp}
                            className="border-l-2 border-brand-600 pl-5 sm:pl-6 text-lg sm:text-xl font-display text-gray-200 leading-relaxed max-w-4xl"
                        >
                            {v.tie}
                        </motion.blockquote>
                    </div>
                </section>

                {/* What the MetaLog is NOT — the contrast table */}
                <section className="relative py-24 sm:py-28 bg-gray-950">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeUp} className="max-w-3xl mb-12">
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-4">
                                {v.contrast.title}
                            </h2>
                            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                                {v.contrast.subtitle}
                            </p>
                        </motion.div>

                        <div className="hidden md:grid grid-cols-2 gap-4 mb-3">
                            <div className="px-5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                {v.contrast.columnOld}
                            </div>
                            <div className="px-5 text-xs font-semibold uppercase tracking-wide text-brand-400">
                                {v.contrast.columnNew}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {v.contrast.rows.map((row, i) => (
                                <motion.div
                                    key={row.new}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.45, delay: i * 0.05 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <div className="flex gap-3 p-5 rounded-2xl bg-gray-900/40 border border-gray-800">
                                        <X className="w-5 h-5 shrink-0 text-gray-600 mt-0.5" />
                                        <p className="text-sm text-gray-400 leading-relaxed">{row.old}</p>
                                    </div>
                                    <div className="flex gap-3 p-5 rounded-2xl bg-brand-500/[0.06] border border-brand-700/40">
                                        <Check className="w-5 h-5 shrink-0 text-brand-400 mt-0.5" />
                                        <p className="text-sm text-gray-200 leading-relaxed">{row.new}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            {...fadeUp}
                            className="mt-6 flex items-start gap-3 p-5 rounded-2xl bg-brand-500/[0.06] border border-brand-700/40"
                        >
                            <Network className="w-5 h-5 shrink-0 text-brand-400 mt-0.5" />
                            <p className="text-sm text-gray-200 leading-relaxed">
                                {v.contrast.otelNote}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Everything is a lens on it */}
                <section className="relative py-24 sm:py-28 bg-gray-950 border-y border-gray-800/60">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeUp} className="max-w-3xl mb-12">
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-4">
                                {v.hub.title}
                            </h2>
                            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                                {v.hub.subtitle}
                            </p>
                        </motion.div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {v.hub.lenses.map((lens, i) => {
                                const meta = lensMeta[i] ?? { Icon: Layers, tone: 'soon' as const }
                                const Icon = meta.Icon
                                return (
                                    <motion.div
                                        key={lens.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.06 }}
                                        className="relative p-6 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-brand-700/60 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-700/30">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusTone[meta.tone]}`}
                                            >
                                                {lens.status}
                                            </span>
                                        </div>
                                        <h3 className="font-display font-semibold text-white mb-2 leading-snug">
                                            {lens.name}
                                        </h3>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            {lens.description}
                                        </p>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Closing — the way in */}
                <section className="relative py-24 sm:py-28 bg-gray-950">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div {...fadeUp}>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-4">
                                {v.closing.title}
                            </h2>
                            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-8">
                                {v.closing.subtitle}
                            </p>
                            <Link
                                to="/diff"
                                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-gradient-to-r from-brand-600 to-orange-500 text-white text-sm font-semibold shadow-md shadow-brand-700/30 hover:shadow-brand-700/50 hover:scale-[1.02] transition-all"
                            >
                                <GitCompareArrows className="w-4 h-4" />
                                {v.closing.cta}
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
