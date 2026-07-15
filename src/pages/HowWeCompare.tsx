import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Database, GitCompareArrows, Hexagon, Network, Scale } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useTranslation } from '@/hooks/useTranslation'

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
}

// Index-aligned with t.howWeCompare.versus (authored order, not locale-bound):
// Datadog = the accumulate/storage foil; Honeycomb = the respected opposite (hexagons).
const versusIcons = [
    <Database className="w-5 h-5" />,
    <Hexagon className="w-5 h-5" />,
]

export default function HowWeCompare() {
    const t = useTranslation()
    const c = t.howWeCompare

    return (
        <div className="bg-gray-950 text-gray-100 min-h-screen">
            <Navbar />
            <main className="pt-16">
                {/* Hero */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(249,115,22,0.12),transparent)]" />
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-20 text-center">
                        <motion.div {...fadeUp}>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-brand-300 bg-brand-500/10 border border-brand-700/30 mb-8">
                                {c.badge}
                            </span>
                            <h1 className="text-4xl sm:text-6xl font-display font-bold leading-[1.05] text-white">
                                {c.title}
                            </h1>
                            <p className="mt-7 text-base sm:text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto">
                                {c.subtitle}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Lead — warehouse vs machine */}
                <section className="relative pb-4">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.p
                            {...fadeUp}
                            className="text-lg sm:text-xl font-display text-gray-200 leading-relaxed"
                        >
                            {c.intro}
                        </motion.p>
                    </div>
                </section>

                {/* The two comparisons */}
                <section className="relative py-20 sm:py-24">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                        {c.versus.map((block, i) => (
                            <motion.div
                                key={block.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.55, delay: i * 0.08 }}
                                className="p-7 sm:p-8 rounded-2xl bg-gray-900/40 border border-gray-800"
                            >
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-700/30">
                                        {versusIcons[i]}
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-display font-bold text-white leading-snug">
                                        {block.title}
                                    </h2>
                                </div>
                                <div className="space-y-4 sm:pl-14">
                                    {block.body.map((para, p) => (
                                        <p key={p} className="text-base text-gray-400 leading-relaxed">
                                            {para}
                                        </p>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Where we're the wrong tool — honest edges */}
                <section className="relative py-24 sm:py-28 bg-gray-950 border-y border-gray-800/60">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeUp} className="flex items-start gap-4">
                            <div className="inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-gray-800/60 text-gray-400 border border-gray-700">
                                <Scale className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight mb-4">
                                    {c.wrongTool.title}
                                </h2>
                                <p className="text-base text-gray-400 leading-relaxed">
                                    {c.wrongTool.body}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Already on OpenTelemetry? */}
                <section className="relative py-24 sm:py-28 bg-gray-950">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            {...fadeUp}
                            className="flex items-start gap-4 p-6 sm:p-7 rounded-2xl bg-brand-500/[0.06] border border-brand-700/40"
                        >
                            <Network className="w-6 h-6 shrink-0 text-brand-400 mt-0.5" />
                            <div>
                                <h3 className="font-display font-semibold text-white text-lg mb-2 leading-snug">
                                    {c.otel.title}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                                    {c.otel.body}
                                </p>
                                <p className="mt-4 text-sm sm:text-base text-gray-200 leading-relaxed">
                                    {c.otel.depth}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Closing CTA */}
                <section className="relative pb-24 sm:pb-28 bg-gray-950">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div {...fadeUp}>
                            <Link
                                to="/diff"
                                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-gradient-to-r from-brand-600 to-orange-500 text-white text-sm font-semibold shadow-md shadow-brand-700/30 hover:shadow-brand-700/50 hover:scale-[1.02] transition-all"
                            >
                                <GitCompareArrows className="w-4 h-4" />
                                {c.cta}
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
