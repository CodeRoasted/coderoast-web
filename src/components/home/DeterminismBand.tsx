import { motion } from 'framer-motion'
import { ArrowRight, Fingerprint } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'

// Funnel-top determinism one-liner (the "tightest" variant from product/web_copy.md
// § "Snippet: the determinism one-liner"). Reinforces the locked hero tagline; it does
// not replace it. Depth lives on /how-we-build, linked here.
export default function DeterminismBand() {
    const t = useTranslation()
    return (
        <section className="relative py-16 sm:py-20 bg-gray-950 border-y border-gray-800/60">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_50%,rgba(249,115,22,0.07),transparent)]" />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-700/30 mb-6">
                        <Fingerprint className="w-5 h-5" />
                    </span>
                    <p className="text-xl sm:text-2xl font-display font-semibold text-white leading-snug text-balance">
                        {t.determinismLine.line}
                    </p>
                    <Link
                        to="/how-we-build"
                        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 hover:text-brand-200 transition-colors"
                    >
                        {t.determinismLine.cta}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
