import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FlaskConical,
    ArrowRight,
    ChevronDown,
    FileCode2,
    Cpu,
    Workflow,
    Server,
    Terminal,
    GitBranch,
    Layers,
    Fingerprint,
    Gauge,
    Beaker,
    PresentationIcon,
    GraduationCap,
    Plus,
    Minus,
    Clock,
    Tag,
    Network,
    History,
    BookOpen,
} from 'lucide-react'
import ProductNavbar from '@/components/ProductNavbar'
import Footer from '@/components/Footer'
import { useTranslation } from '@/hooks/useTranslation'

export default function LogCraftPage() {
    const t = useTranslation()
    const [openConcept, setOpenConcept] = useState<string | null>('agents')
    const [showAdvanced, setShowAdvanced] = useState(false)

    // The first five entries are the "five concepts and you\'re fluent"
    // baseline shown by default. The remaining five are unlocked behind a
    // toggle so that newcomers see a curated minimal set, but power users
    // can expand to the full concept reference without leaving the page.
    // Item #9 of the brutal UX audit.
    const basicConcepts = [
        { key: 'agents' as const, icon: <Terminal className="w-5 h-5" />, gradient: 'from-brand-500 to-orange-500' },
        { key: 'outputs' as const, icon: <Layers className="w-5 h-5" />, gradient: 'from-indigo-500 to-purple-500' },
        { key: 'incidents' as const, icon: <GitBranch className="w-5 h-5" />, gradient: 'from-rose-500 to-pink-500' },
        { key: 'determinism' as const, icon: <Fingerprint className="w-5 h-5" />, gradient: 'from-emerald-500 to-teal-500' },
        { key: 'rateModulation' as const, icon: <Gauge className="w-5 h-5" />, gradient: 'from-cyan-500 to-blue-500' },
    ]
    const advancedConcepts = [
        { key: 'phases' as const, icon: <Clock className="w-5 h-5" />, gradient: 'from-amber-500 to-orange-600' },
        { key: 'fields' as const, icon: <Tag className="w-5 h-5" />, gradient: 'from-fuchsia-500 to-pink-600' },
        { key: 'cascades' as const, icon: <Network className="w-5 h-5" />, gradient: 'from-red-500 to-rose-600' },
        { key: 'replay' as const, icon: <History className="w-5 h-5" />, gradient: 'from-sky-500 to-cyan-600' },
        { key: 'registry' as const, icon: <BookOpen className="w-5 h-5" />, gradient: 'from-violet-500 to-indigo-600' },
    ]
    const conceptOrder = showAdvanced
        ? [...basicConcepts, ...advancedConcepts]
        : basicConcepts

    const useCaseIcons = [
        <Beaker key="ci" className="w-5 h-5" />,
        <PresentationIcon key="demo" className="w-5 h-5" />,
        <GraduationCap key="train" className="w-5 h-5" />,
    ]
    const useCaseGradients = [
        'from-emerald-500 to-teal-500',
        'from-brand-500 to-orange-500',
        'from-indigo-500 to-purple-500',
    ]

    return (
        <>
            <ProductNavbar />
            <main>
                {/* ── Hero ─────────────────────────────────────────────── */}
                <section className="relative min-h-[70vh] flex items-center pt-20 pb-16 overflow-hidden bg-gray-950">
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

                            <p className="text-xl sm:text-2xl text-gray-200 font-medium mb-4 max-w-3xl mx-auto">
                                {t.logcraft.heroTagline}
                            </p>
                            <p className="text-base text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                                {t.logcraft.heroSubtitle}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/lab/logcraft"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-600/25 hover:shadow-brand-500/30 text-base"
                                >
                                    <FlaskConical className="w-5 h-5" />
                                    {t.logcraft.launchLab}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <a
                                    href="https://github.com/CodeRoasted/logcraft-playground"
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

                {/* ── How LogCraft fits in your stack ─────────────────── */}
                <section className="py-24 bg-gray-900/40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                                {t.logcraft.deepDiveTitle}
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                {t.logcraft.deepDiveSubtitle}
                            </p>
                        </motion.div>

                        {/*
                          Horizontal pipeline: 4 nodes connected by arrows.
                          - Mobile: vertical stack with down-arrows.
                          - Tablet+: single horizontal flow with right-arrows.
                          The two trailing nodes (Sinks, Downstream) are
                          grouped under "Outputs" so the flow stays linear
                          and readable instead of branching mid-diagram.
                        */}
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-2">
                            <FitNode
                                icon={<FileCode2 className="w-5 h-5" />}
                                title={t.logcraft.fitDiagram.yaml}
                                desc={t.logcraft.fitDiagram.yamlDesc}
                                gradient="from-gray-700 to-gray-600"
                            />
                            <FitArrow />
                            <FitNode
                                icon={<Cpu className="w-5 h-5" />}
                                title={t.logcraft.fitDiagram.engine}
                                desc={t.logcraft.fitDiagram.engineDesc}
                                gradient="from-brand-600 to-orange-500"
                                highlight
                            />
                            <FitArrow />
                            <FitNode
                                icon={<Workflow className="w-5 h-5" />}
                                title={t.logcraft.fitDiagram.sinks}
                                desc={t.logcraft.fitDiagram.sinksDesc}
                                gradient="from-indigo-600 to-purple-600"
                            />
                            <FitArrow />
                            <FitNode
                                icon={<Server className="w-5 h-5" />}
                                title={t.logcraft.fitDiagram.downstream}
                                desc={t.logcraft.fitDiagram.downstreamDesc}
                                gradient="from-emerald-600 to-teal-600"
                            />
                        </div>
                    </div>
                </section>

                {/* ── Use cases ───────────────────────────────────────── */}
                <section className="py-24 bg-gray-950">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                                {t.logcraft.useCases.title}
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                {t.logcraft.useCases.subtitle}
                            </p>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {t.logcraft.useCases.items.map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="p-6 rounded-2xl bg-gray-900 border border-gray-700/50"
                                >
                                    <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${useCaseGradients[i]} text-white mb-4`}>
                                        {useCaseIcons[i]}
                                    </div>
                                    <h3 className="font-display font-bold text-white mb-2 text-lg">{item.title}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Five concepts ───────────────────────────────────── */}
                <section className="py-24 bg-gray-900/40">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                                {t.logcraft.conceptsTitle}
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                {t.logcraft.conceptsSubtitle}
                            </p>
                        </motion.div>
                        <div className="space-y-3">
                            {conceptOrder.map((c, i) => {
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
                        {/* Toggle to expose the advanced concept set. */}
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => setShowAdvanced((v) => !v)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700/60 bg-gray-900/60 hover:bg-gray-800/60 text-sm text-gray-300 hover:text-white transition-colors"
                                aria-expanded={showAdvanced}
                            >
                                {showAdvanced ? (
                                    <Minus className="w-3.5 h-3.5" />
                                ) : (
                                    <Plus className="w-3.5 h-3.5" />
                                )}
                                {showAdvanced
                                    ? t.logcraft.conceptsHideAdvanced
                                    : t.logcraft.conceptsShowAdvanced}
                                <span className="text-xs text-gray-500">
                                    (+{advancedConcepts.length})
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* ── CTA → Lab ───────────────────────────────────────── */}
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
                                to="/lab/logcraft"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-600/25"
                            >
                                <FlaskConical className="w-5 h-5" />
                                {t.logcraft.launchLab}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* ── Contact ──────────────────────────────────────────── */}
                <section className="py-12 bg-gray-950">
                    <div className="max-w-3xl mx-auto px-4 text-center">
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-gray-500 text-sm"
                        >
                            Questions or enterprise inquiries?{' '}
                            <a
                                href="mailto:contact@coderoast.fr"
                                className="text-brand-400 hover:text-brand-300 transition-colors font-medium"
                            >
                                contact@coderoast.fr
                            </a>
                        </motion.p>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

function FitNode({
    icon,
    title,
    desc,
    gradient,
    highlight,
}: {
    icon: React.ReactNode
    title: string
    desc: string
    gradient: string
    highlight?: boolean
}) {
    return (
        <div
            className={`flex-1 min-w-0 p-5 rounded-2xl bg-gray-900 border ${highlight ? 'border-brand-600/60 shadow-lg shadow-brand-600/10' : 'border-gray-700/50'
                } flex flex-col`}
        >
            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${gradient} text-white mb-3 self-start`}>
                {icon}
            </div>
            <h3 className="font-display font-bold text-white text-sm mb-1">{title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
        </div>
    )
}

function FitArrow() {
    return (
        <>
            {/* Down-arrow on mobile, right-arrow from lg up. Centered, with
                a subtle dashed connector to suggest a pipeline edge. */}
            <div className="flex lg:hidden items-center justify-center py-1">
                <ArrowRight className="w-5 h-5 text-brand-500/70 rotate-90" />
            </div>
            <div className="hidden lg:flex items-center justify-center shrink-0 px-1">
                <ArrowRight className="w-6 h-6 text-brand-500/70" />
            </div>
        </>
    )
}
