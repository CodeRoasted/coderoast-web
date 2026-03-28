import { motion } from 'framer-motion'
import { ArrowDown, Coffee } from 'lucide-react'
import ParticleBackground from './ParticleBackground'
import { useTranslation } from '@/hooks/useTranslation'

export default function Hero() {
    const t = useTranslation()

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-brand-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
        >
            <ParticleBackground />

            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-brand-100/80 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800"
                    >
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                        <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
                            C++20 · Real-Time · High-Performance
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                        <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent">
                            Code
                        </span>
                        Roast
                    </h1>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-xl sm:text-2xl font-display font-medium text-gray-700 dark:text-gray-300 mb-4"
                    >
                        {t.hero.tagline}
                    </motion.p>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10"
                    >
                        {t.hero.subtitle}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <a
                            href="#portfolio"
                            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-105 transition-all duration-200"
                        >
                            {t.hero.cta}
                        </a>
                        <a
                            href="#donation"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold hover:border-brand-500 dark:hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200"
                        >
                            <Coffee className="w-5 h-5" />
                            {t.hero.ctaSecondary}
                        </a>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    >
                        <ArrowDown className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
