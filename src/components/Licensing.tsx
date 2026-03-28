import { motion } from 'framer-motion'
import { Shield, Gem, Building2 } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function Licensing() {
    const t = useTranslation()

    const plans = [
        {
            ...t.licensing.free,
            icon: <Shield className="w-7 h-7" />,
            gradient: 'from-green-500 to-emerald-500',
        },
        {
            ...t.licensing.pro,
            icon: <Gem className="w-7 h-7" />,
            gradient: 'from-brand-500 to-orange-500',
            featured: true,
        },
        {
            ...t.licensing.enterprise,
            icon: <Building2 className="w-7 h-7" />,
            gradient: 'from-indigo-500 to-purple-500',
        },
    ]

    return (
        <section
            id="licensing"
            className="py-24 sm:py-32 bg-white dark:bg-gray-950"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-sm font-semibold mb-4">
                        {t.licensing.badge}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                        {t.licensing.title}
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        {t.licensing.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className={`relative rounded-2xl p-8 border bg-white dark:bg-gray-900 flex flex-col ${'featured' in plan && plan.featured
                                ? 'border-brand-400 dark:border-brand-500 shadow-lg shadow-brand-500/10'
                                : 'border-gray-200 dark:border-gray-700/50'
                                }`}
                        >
                            <div className={`inline-flex flex-row items-center justify-center gap-3 p-3 rounded-xl bg-gradient-to-br ${plan.gradient} text-white mb-6 w-full`}>
                                {plan.icon}
                                <h3 className="text-base font-display font-bold">
                                    {plan.name}
                                </h3>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                                {plan.description}
                            </p>

                            {/* TODO: Insert pricing and payment integration here */}

                            <div className="h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">
                                    {t.licensing.badge}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
