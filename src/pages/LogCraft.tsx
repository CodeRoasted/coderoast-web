import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FlaskConical,
    Zap,
    GitBranch,
    Layers,
    ArrowRight,
    Terminal,
    Activity,
    Siren,
    ChevronDown,
    Fingerprint,
    HeartPulse,
    Radio,
    Clock,
    Gauge,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useTranslation } from '@/hooks/useTranslation'

const Pricing = lazy(() => import('@/components/Licensing'))

function LoadingFallback() {
    return (
        <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
}

const features = [
    {
        icon: <Terminal className="w-5 h-5" />,
        title: 'Pure YAML, Zero Code',
        description: 'Define agents, failure scenarios, and network topology in declarative YAML. No code changes required.',
        gradient: 'from-brand-500 to-orange-500',
    },
    {
        icon: <Activity className="w-5 h-5" />,
        title: 'Deterministic Replay',
        description: 'Set a seed and reproduce any simulation exactly. Perfect for regression testing and debugging.',
        gradient: 'from-emerald-500 to-teal-500',
    },
    {
        icon: <GitBranch className="w-5 h-5" />,
        title: 'Error Cascading',
        description: 'Model real-world failure propagation across services with configurable cascade rules.',
        gradient: 'from-rose-500 to-pink-500',
    },
    {
        icon: <Layers className="w-5 h-5" />,
        title: 'Multi-Format Output',
        description: 'Stream logs to console, file, Elasticsearch (ECS), OpenTelemetry, Prometheus, or StatsD simultaneously.',
        gradient: 'from-indigo-500 to-purple-500',
    },
    {
        icon: <Zap className="w-5 h-5" />,
        title: 'Chaos Incidents',
        description: 'Inject latency spikes, error bursts, and health state transitions on a timeline.',
        gradient: 'from-amber-500 to-yellow-500',
    },
    {
        icon: <Siren className="w-5 h-5" />,
        title: 'Real-Time Telemetry',
        description: 'Live p50/p95/p99 latency distributions, error ratios, and throughput — agent by agent.',
        gradient: 'from-cyan-500 to-blue-500',
    },
]

export default function LogCraftPage() {
    const t = useTranslation()
    const [openConcept, setOpenConcept] = useState<string | null>(null)

    const concepts = [
        { key: 'determinism' as const, icon: <Fingerprint className="w-5 h-5" />, gradient: 'from-emerald-500 to-teal-500' },
        { key: 'cascading' as const, icon: <GitBranch className="w-5 h-5" />, gradient: 'from-rose-500 to-pink-500' },
        { key: 'incidents' as const, icon: <Zap className="w-5 h-5" />, gradient: 'from-amber-500 to-yellow-500' },
        { key: 'healthStates' as const, icon: <HeartPulse className="w-5 h-5" />, gradient: 'from-red-500 to-orange-500' },
        { key: 'noise' as const, icon: <Radio className="w-5 h-5" />, gradient: 'from-violet-500 to-purple-500' },
        { key: 'phases' as const, icon: <Clock className="w-5 h-5" />, gradient: 'from-sky-500 to-blue-500' },
        { key: 'outputs' as const, icon: <Layers className="w-5 h-5" />, gradient: 'from-indigo-500 to-purple-500' },
        { key: 'rateModulation' as const, icon: <Gauge className="w-5 h-5" />, gradient: 'from-cyan-500 to-teal-500' },
    ]

    return (
        <>
            <Navbar />
            <main>
                {/* ── Hero ─────────────────────────────────────────────── */}
                <section className="relative min-h-[70vh] flex items-center pt-20 pb-16 overflow-hidden bg-gray-950">
                    {/* Background glow */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-600/10 rounded-full blur-3xl" />
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-900/40 border border-brand-700/50 text-brand-400 text-sm font-semibold mb-6">
                                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                                {t.logcraft.betaBadge}
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
                                <span className="bg-gradient-to-r from-brand-500 via-orange-400 to-brand-600 bg-clip-text text-transparent">
                                    LogCraft
                                </span>
                            </h1>

                            <p className="text-xl sm:text-2xl text-gray-300 font-medium mb-4 max-w-3xl mx-auto">
                                {t.logcraft.heroTagline}
                            </p>
                            <p className="text-base text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                                {t.logcraft.heroSubtitle}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/lab"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-600/25 hover:shadow-brand-500/30 text-base"
                                >
                                    <FlaskConical className="w-5 h-5" />
                                    {t.logcraft.launchLab}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <a
                                    href="https://github.com/coderoast-dev/logcraft-scenario-library"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-xl transition-colors text-base border border-gray-700"
                                >
                                    {t.logcraft.viewGitHub}
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ── Features ─────────────────────────────────────────── */}
                <section className="py-24 bg-gray-900/40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                                {t.logcraft.featuresTitle}
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                {t.logcraft.featuresSubtitle}
                            </p>
                        </motion.div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((f, i) => (
                                <motion.div
                                    key={f.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.08 }}
                                    className="p-6 rounded-2xl bg-gray-900 border border-gray-700/50"
                                >
                                    <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${f.gradient} text-white mb-4`}>
                                        {f.icon}
                                    </div>
                                    <h3 className="font-display font-bold text-white mb-2">{f.title}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Deep Dive ────────────────────────────────────────── */}
                <section className="py-24 bg-gray-950">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                                {t.logcraft.deepDiveTitle}
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                {t.logcraft.deepDiveSubtitle}
                            </p>
                        </motion.div>
                        <div className="space-y-3">
                            {concepts.map((c, i) => {
                                const concept = t.logcraft.concepts[c.key]
                                const isOpen = openConcept === c.key
                                return (
                                    <motion.div
                                        key={c.key}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.05 }}
                                    >
                                        <button
                                            onClick={() => setOpenConcept(isOpen ? null : c.key)}
                                            className="w-full flex items-center gap-4 p-5 rounded-xl bg-gray-900 border border-gray-700/50 hover:border-gray-600/50 transition-colors text-left"
                                        >
                                            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${c.gradient} text-white shrink-0`}>
                                                {c.icon}
                                            </div>
                                            <span className="font-display font-bold text-white flex-1">
                                                {concept.title}
                                            </span>
                                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="px-5 pt-2 pb-5 text-sm text-gray-400 leading-relaxed">
                                                        {concept.body}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* ── CTA → Lab ────────────────────────────────────────── */}
                <section className="py-20 bg-gray-950">
                    <div className="max-w-3xl mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="rounded-2xl bg-gradient-to-br from-brand-900/40 to-orange-900/20 border border-brand-700/30 p-12"
                        >
                            <h3 className="text-3xl font-display font-bold text-white mb-4">
                                {t.logcraft.ctaTitle}
                            </h3>
                            <p className="text-gray-400 mb-8">{t.logcraft.ctaSubtitle}</p>
                            <Link
                                to="/lab"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-600/25"
                            >
                                <FlaskConical className="w-5 h-5" />
                                {t.logcraft.launchLab}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* ── Pricing ──────────────────────────────────────────── */}
                <Suspense fallback={<LoadingFallback />}>
                    <Pricing />
                </Suspense>
            </main>
            <Footer />
        </>
    )
}
