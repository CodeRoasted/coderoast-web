import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Bot, CloudOff, GitCompareArrows, ShieldCheck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useTranslation } from '@/hooks/useTranslation'

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
}

// Index-aligned with t.howWeBuild.commit.items (authored order, not locale-bound):
// determinism-as-gate · model-free guarantee path · logs stay on your infra.
const commitIcons = [
    <ShieldCheck className="w-5 h-5" />,
    <Bot className="w-5 h-5" />,
    <CloudOff className="w-5 h-5" />,
]

export default function HowWeBuild() {
    const t = useTranslation()
    const h = t.howWeBuild

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
                                {h.badge}
                            </span>
                            <h1 className="text-4xl sm:text-6xl font-display font-bold leading-[1.05] text-white">
                                {h.title}
                            </h1>
                            <p className="mt-7 text-base sm:text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto">
                                {h.subtitle}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Lead — the one guarantee */}
                <section className="relative pb-4">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.p
                            {...fadeUp}
                            className="text-lg sm:text-xl font-display text-gray-200 leading-relaxed"
                        >
                            {h.intro}
                        </motion.p>
                    </div>
                </section>

                {/* Narrative — generation is not decision; the product inherits the line */}
                <section className="relative py-20 sm:py-24">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
                        {h.sections.map((s) => (
                            <motion.div key={s.title} {...fadeUp}>
                                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight mb-4">
                                    {s.title}
                                </h2>
                                <p className="text-base text-gray-400 leading-relaxed">{s.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* What we commit to */}
                <section className="relative py-24 sm:py-28 bg-gray-950 border-y border-gray-800/60">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.h2
                            {...fadeUp}
                            className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-12 max-w-3xl"
                        >
                            {h.commit.title}
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {h.commit.items.map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.08 }}
                                    className="relative p-6 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-brand-700/60 transition-colors"
                                >
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-700/30 mb-4">
                                        {commitIcons[i]}
                                    </div>
                                    <h3 className="font-display font-semibold text-white mb-2 leading-snug">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        {item.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Closing — discipline held internally */}
                <section className="relative py-24 sm:py-28 bg-gray-950">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.blockquote
                            {...fadeUp}
                            className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight"
                        >
                            {h.closing}
                        </motion.blockquote>
                        <motion.div {...fadeUp} className="mt-9">
                            <Link
                                to="/diff"
                                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-gradient-to-r from-brand-600 to-orange-500 text-white text-sm font-semibold shadow-md shadow-brand-700/30 hover:shadow-brand-700/50 hover:scale-[1.02] transition-all"
                            >
                                <GitCompareArrows className="w-4 h-4" />
                                {h.cta}
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
