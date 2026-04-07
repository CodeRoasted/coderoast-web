import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface AppCardProps {
    name: string
    description: string
    status: string
    icon: ReactNode
    gradient: string
    index: number
    highlights?: string[]
    link?: string
    badge?: string
}

export default function AppCard({ name, description, status, icon, gradient, index, highlights, link, badge }: AppCardProps) {
    const isActive = status === 'Active' || status === 'Actif'
    const isComingSoon = status.toLowerCase().includes('coming') || status.toLowerCase().includes('bientôt')
    const isBeta = status.toLowerCase().includes('beta') || status.toLowerCase().includes('bêta')

    const inner = (
        <>
            {/* Gradient top strip */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />

            <div className="p-6 sm:p-8">
                {/* Icon + Status */}
                <div className="flex items-start justify-between mb-5">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                        {icon}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${isActive
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                    : isBeta
                                        ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                                        : isComingSoon
                                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                }`}
                        >
                            {status}
                        </span>
                        {badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-900/40 text-brand-400 border border-brand-700/40">
                                {badge}
                            </span>
                        )}
                    </div>
                </div>

                {/* Name */}
                <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {name}
                </h3>

                {/* Description */}
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                    {description}
                </p>

                {/* Highlights */}
                {highlights && highlights.length > 0 && (
                    <ul className="mt-4 space-y-2">
                        {highlights.map((h) => (
                            <li key={h} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                {h}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Hover arrow */}
                <div className="mt-6 flex items-center text-brand-600 dark:text-brand-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span>{link ? 'Explore LogCraft →' : isComingSoon ? '✨' : 'Learn more →'}</span>
                </div>
            </div>
        </>
    )

    return (
        <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-500/10 transition-shadow duration-300"
        >
            {link ? (
                <Link to={link} className="block">{inner}</Link>
            ) : (
                inner
            )}
        </motion.article>
    )
}
