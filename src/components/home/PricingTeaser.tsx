import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function PricingTeaser() {
    const t = useTranslation()
    const tiers = [t.pricingTeaser.free, t.pricingTeaser.pro, t.pricingTeaser.enterprise]
    return (
        <section id="pricing" className="relative py-24 sm:py-28 bg-gray-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-3">
                        {t.pricingTeaser.title}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                        {t.pricingTeaser.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    {tiers.map((tier, i) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.08 }}
                            className={`p-6 rounded-2xl border ${
                                i === 1
                                    ? 'border-brand-600/60 bg-gradient-to-br from-brand-900/30 to-orange-900/10 shadow-xl shadow-brand-900/20'
                                    : 'border-gray-800 bg-gray-900/50'
                            }`}
                        >
                            <div className="flex items-baseline justify-between mb-2">
                                <h3 className="font-display font-bold text-white text-xl">
                                    {tier.name}
                                </h3>
                                <span className="font-mono text-2xl font-bold text-brand-400">
                                    {tier.price}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 mb-4">{tier.tagline}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Check className="w-3.5 h-3.5 text-brand-500" />
                                <span>
                                    {i === 0 && 'Lab access · starter scenarios'}
                                    {i === 1 && 'All sinks · cascades · replay'}
                                    {i === 2 && 'Topology · on-prem · SLA'}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        to="/logcraft#pricing"
                        className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 font-semibold transition-colors group"
                    >
                        {t.pricingTeaser.seePlans}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
