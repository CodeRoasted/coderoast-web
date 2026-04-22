import { motion } from 'framer-motion'
import { Telescope, GitBranch, Plug } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

const icons = [
    <Telescope className="w-6 h-6" key="t" />,
    <GitBranch className="w-6 h-6" key="g" />,
    <Plug className="w-6 h-6" key="p" />,
]

const gradients = [
    'from-indigo-500 to-blue-500',
    'from-emerald-500 to-teal-500',
    'from-rose-500 to-pink-500',
]

export default function ComingSoon() {
    const t = useTranslation()

    return (
        <section id="roadmap" className="py-24 sm:py-28 bg-gray-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mb-10"
                >
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
                        {t.roadmap.badge}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-3">
                        {t.roadmap.title}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                        {t.roadmap.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {t.roadmap.items.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.08 }}
                            className="p-6 rounded-2xl border border-dashed border-gray-700 bg-gray-900/40 hover:border-brand-600/50 transition-colors"
                        >
                            <div
                                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradients[i]} text-white mb-4 shadow-lg shadow-black/30`}
                            >
                                {icons[i]}
                            </div>
                            <h3 className="text-lg font-display font-semibold text-white mb-2">
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
    )
}
