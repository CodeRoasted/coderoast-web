import { motion } from 'framer-motion'
import { Coffee, Heart } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function Donation() {
    const t = useTranslation()

    return (
        <section
            id="donation"
            className="py-24 sm:py-32 bg-gradient-to-br from-brand-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950"
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Animated coffee icon */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-500/10 dark:bg-brand-500/20 mb-8"
                    >
                        <Coffee className="w-10 h-10 text-brand-600 dark:text-brand-400" />
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                        {t.donation.title}
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-10">
                        {t.donation.subtitle}
                    </p>

                    <motion.a
                        href="https://buymeacoffee.com/coderoast"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FFDD00] text-gray-900 font-bold text-lg shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-shadow"
                    >
                        <Coffee className="w-6 h-6" />
                        {t.donation.cta}
                        <Heart className="w-5 h-5 text-red-500" />
                    </motion.a>
                </motion.div>
            </div>
        </section>
    )
}
