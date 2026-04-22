import { motion } from 'framer-motion'
import { Beaker, PresentationIcon, GraduationCap } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

const ICONS = [Beaker, PresentationIcon, GraduationCap]
const ACCENTS = [
    'from-emerald-600/30 to-emerald-700/10 border-emerald-700/30 text-emerald-400',
    'from-sky-600/30 to-sky-700/10 border-sky-700/30 text-sky-400',
    'from-purple-600/30 to-purple-700/10 border-purple-700/30 text-purple-400',
]

export default function UseCasesHome() {
    const t = useTranslation()
    return (
        <section className="relative py-24 sm:py-28 bg-gray-900/40 border-y border-gray-800/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-3">
                        {t.useCasesHome.title}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                        {t.useCasesHome.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {t.useCasesHome.items.map((item, i) => {
                        const Icon = ICONS[i] ?? Beaker
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: i * 0.08 }}
                                className={`p-6 rounded-2xl bg-gradient-to-br ${ACCENTS[i]} border backdrop-blur-sm`}
                            >
                                <Icon className="w-7 h-7 mb-4" />
                                <h3 className="font-display font-semibold text-white text-lg mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-300/90 leading-relaxed">
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
