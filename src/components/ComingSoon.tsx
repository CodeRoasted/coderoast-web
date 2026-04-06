import { motion } from 'framer-motion'
import { Globe, Play, Plug } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

const icons = [
    <Globe className="w-6 h-6" key="globe" />,
    <Play className="w-6 h-6" key="play" />,
    <Plug className="w-6 h-6" key="plug" />,
]

const gradients = [
    'from-indigo-500 to-blue-500',
    'from-emerald-500 to-teal-500',
    'from-rose-500 to-pink-500',
]

export default function ComingSoon() {
    const t = useTranslation()

    return (
        <section className="py-24 sm:py-32 bg-white dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-semibold mb-4">
                        {t.comingSoon.badge}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                        {t.comingSoon.title}
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        {t.comingSoon.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {t.comingSoon.items.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="flex flex-col items-center p-8 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 transition-colors"
                        >
                            <div className={`p-4 rounded-xl bg-gradient-to-br ${gradients[i]} text-white mb-4`}>
                                {icons[i]}
                            </div>
                            <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">
                                {item.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
