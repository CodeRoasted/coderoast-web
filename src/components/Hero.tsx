import { motion } from 'framer-motion'
import { ArrowRight, GitCompareArrows } from 'lucide-react'
import { Link } from 'react-router-dom'
import ParticleBackground from './ParticleBackground'
import { useTranslation } from '@/hooks/useTranslation'

export default function Hero() {
    const t = useTranslation()

    return (
        <section
            id="hero"
            className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-gray-950 to-brand-950/40"
        >
            <ParticleBackground />

            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                }}
            />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-8 rounded-full bg-brand-500/10 border border-brand-700/40"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                        <span className="text-xs font-medium tracking-wide text-brand-300 uppercase">
                            {t.hero.badge}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="font-display font-bold tracking-tight text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-6"
                    >
                        {t.hero.tagline}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.6 }}
                        className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        {t.hero.subtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10"
                    >
                        <Link
                            to="/diff"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-brand-600 to-orange-500 text-white font-semibold shadow-lg shadow-brand-700/30 hover:shadow-brand-700/50 hover:scale-[1.02] transition-all"
                        >
                            <GitCompareArrows className="w-5 h-5" />
                            {t.hero.cta}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <a
                            href="#portfolio"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-gray-700 text-gray-200 font-semibold hover:border-brand-500/60 hover:text-brand-300 transition-all"
                        >
                            {t.hero.ctaSecondary}
                        </a>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="font-mono text-[11px] sm:text-xs text-gray-500 tracking-wider"
                    >
                        {t.hero.trust}
                    </motion.p>
                </motion.div>
            </div>
        </section>
    )
}
