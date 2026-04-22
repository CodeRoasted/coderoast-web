import { motion } from 'framer-motion'
import { Dices, Layers, Zap, Activity, FlaskConical, Cpu } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

const ICONS = [Dices, Layers, Zap, Activity, FlaskConical, Cpu]

export default function FeatureGrid() {
    const t = useTranslation()
    return (
        <section id="features" className="relative py-24 sm:py-28 bg-gray-900/40 border-y border-gray-800/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-4">
                        {t.features.title}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                        {t.features.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {t.features.items.map((item, i) => {
                        const Icon = ICONS[i] ?? Dices
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
                                className="group relative p-6 rounded-2xl bg-gray-950/60 border border-gray-800 hover:border-brand-700/50 hover:bg-gray-900/60 transition-all"
                            >
                                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-orange-500 text-white shadow-lg shadow-brand-900/30 mb-4">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="font-display font-semibold text-white text-lg mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
