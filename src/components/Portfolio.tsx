import { motion } from 'framer-motion'
import { Eye, ScrollText, FlaskConical } from 'lucide-react'
import AppCard from './AppCard'
import { useTranslation } from '@/hooks/useTranslation'

export default function Portfolio() {
    const t = useTranslation()

    const apps = [
        {
            ...t.portfolio.insight,
            icon: <Eye className="w-6 h-6" />,
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            ...t.portfolio.logcraft,
            icon: <ScrollText className="w-6 h-6" />,
            gradient: 'from-brand-500 to-orange-500',
        },
        {
            ...t.portfolio.playground,
            icon: <FlaskConical className="w-6 h-6" />,
            gradient: 'from-purple-500 to-pink-500',
        },
    ]

    return (
        <section
            id="portfolio"
            className="relative py-24 sm:py-32 bg-gray-50 dark:bg-gray-900/50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                        {t.portfolio.title}
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        {t.portfolio.subtitle}
                    </p>
                </motion.div>

                {/* App grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {apps.map((app, i) => (
                        <AppCard
                            key={app.name}
                            name={app.name}
                            description={app.description}
                            status={app.status}
                            icon={app.icon}
                            gradient={app.gradient}
                            index={i}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
