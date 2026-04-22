import { motion } from 'framer-motion'
import { AlertTriangle, Activity, Users } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

const icons = [
    <AlertTriangle key="a" className="w-5 h-5" />,
    <Activity key="b" className="w-5 h-5" />,
    <Users key="c" className="w-5 h-5" />,
]

export default function ProblemSection() {
    const t = useTranslation()
    return (
        <section className="relative py-24 sm:py-28 bg-gray-950 border-y border-gray-800/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-4">
                        {t.problem.title}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                        {t.problem.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {t.problem.points.map((p, i) => (
                        <motion.div
                            key={p.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="relative p-6 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-brand-700/60 transition-colors"
                        >
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-700/30 mb-4">
                                {icons[i]}
                            </div>
                            <h3 className="font-display font-semibold text-white mb-2 leading-snug">
                                {p.title}
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {p.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
