import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Beaker, PresentationIcon, GraduationCap, ArrowRight, Check } from 'lucide-react'
import ProductNavbar from '@/components/ProductNavbar'
import Footer from '@/components/Footer'
import { useTranslation } from '@/hooks/useTranslation'

/**
 * Dedicated /use-cases page. Item #8 of the brutal UX audit:
 * give the three audiences (engineering / sales / on-call enablement)
 * their own narratives instead of burying them as a 3-card row on
 * /logcraft. Each narrative gets a one-line outcome, a YAML snippet
 * that proves it, three concrete bullets, and a CTA back into the Lab.
 */
export default function UseCasesPage() {
    const t = useTranslation()

    const narratives = [
        {
            id: 'test',
            icon: <Beaker className="w-5 h-5" />,
            gradient: 'from-emerald-500 to-teal-500',
            data: t.useCases.narratives.test,
        },
        {
            id: 'demo',
            icon: <PresentationIcon className="w-5 h-5" />,
            gradient: 'from-brand-500 to-orange-500',
            data: t.useCases.narratives.demo,
        },
        {
            id: 'train',
            icon: <GraduationCap className="w-5 h-5" />,
            gradient: 'from-indigo-500 to-purple-500',
            data: t.useCases.narratives.train,
        },
    ]

    return (
        <>
            <ProductNavbar />
            <main className="bg-gray-950 min-h-screen">
                {/* Hero */}
                <section className="relative pt-32 pb-12 overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-600/10 rounded-full blur-3xl" />
                    </div>
                    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/40 border border-brand-700/50 text-brand-400 text-xs font-semibold mb-5">
                                {t.useCases.badge}
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-5 leading-tight">
                                {t.useCases.title}
                            </h1>
                            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
                                {t.useCases.subtitle}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Narratives */}
                <section className="py-12 sm:py-16">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                        {narratives.map((n, idx) => (
                            <motion.article
                                key={n.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.45 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800/60"
                            >
                                <div>
                                    <div
                                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r ${n.gradient} text-white text-xs font-bold mb-4`}
                                    >
                                        {n.icon}
                                        {n.data.tag}
                                    </div>
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3 leading-snug">
                                        {n.data.title}
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-5">
                                        {n.data.outcome}
                                    </p>
                                    <ul className="space-y-2 mb-6">
                                        {n.data.bullets.map((b, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                                <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                                                <span>{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        to="/lab"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors"
                                    >
                                        {t.useCases.tryIt}
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                                <div className="rounded-xl bg-gray-950/80 border border-gray-800/80 overflow-hidden">
                                    <div className="px-4 py-2 border-b border-gray-800/60 flex items-center justify-between">
                                        <span className="text-[11px] font-mono text-gray-500">
                                            scenario.yaml
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                                            #{idx + 1}
                                        </span>
                                    </div>
                                    <pre className="p-4 text-xs leading-relaxed text-gray-300 font-mono overflow-x-auto">
                                        <code>{n.data.yamlSnippet}</code>
                                    </pre>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
