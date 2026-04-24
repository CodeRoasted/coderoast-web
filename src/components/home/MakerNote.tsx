import { motion } from 'framer-motion'
import { Github, Mail, Heart } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function MakerNote() {
    const t = useTranslation()
    return (
        <section className="relative py-20 sm:py-24 bg-gray-900/40 border-t border-gray-800/60">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="p-8 sm:p-10 rounded-2xl bg-gray-950/60 border border-gray-800"
                >
                    <h2 className="font-display font-bold text-white text-2xl sm:text-3xl mb-4 leading-tight">
                        {t.maker.title}
                    </h2>
                    <p className="text-base text-gray-300 leading-relaxed mb-6">
                        {t.maker.body}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href="https://github.com/coderoast-dev/logcraft-scenario-library"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-semibold transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            {t.maker.ctaCode}
                        </a>
                        <a
                            href="mailto:contact@coderoast.fr"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-semibold transition-colors"
                        >
                            <Mail className="w-4 h-4" />
                            {t.maker.ctaContact}
                        </a>
                        <a
                            href="https://buymeacoffee.com/coderoast"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-700/50 text-brand-300 hover:text-brand-200 hover:border-brand-600 hover:bg-brand-900/20 text-sm font-semibold transition-colors"
                        >
                            <Heart className="w-4 h-4" />
                            {t.maker.ctaSupport}
                        </a>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">{t.maker.supportNote}</p>
                </motion.div>
            </div>
        </section>
    )
}
