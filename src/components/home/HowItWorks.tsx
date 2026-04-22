import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'

export default function HowItWorks() {
    const t = useTranslation()
    return (
        <section id="how" className="relative py-24 sm:py-28 bg-gray-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-4">
                        {t.howItWorks.title}
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Connecting line on md+ */}
                    <div className="hidden md:block absolute top-7 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-brand-700/0 via-brand-700/40 to-brand-700/0" />

                    {t.howItWorks.steps.map((step, i) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="relative"
                        >
                            <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-brand-600 to-orange-500 text-white font-display font-bold text-xl mb-5 shadow-lg shadow-brand-900/30">
                                {i + 1}
                            </div>
                            <h3 className="font-display font-semibold text-white text-xl mb-2">
                                {step.title}
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
