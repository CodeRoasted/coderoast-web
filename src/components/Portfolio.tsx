import { motion } from 'framer-motion'
import AppCard from './AppCard'
import { products } from '@/config/products'
import { useTranslation } from '@/hooks/useTranslation'

// Display copy for one product card. Soon-tier entries omit highlights.
interface PortfolioCopy {
    name: string
    description: string
    status: string
    highlights?: string[]
}

// The evolutive product index: cards are driven entirely by the product
// registry (src/config/products.ts), so the slate grows by editing one list.
export default function Portfolio() {
    const t = useTranslation()

    return (
        <section
            id="portfolio"
            className="relative py-24 sm:py-28 bg-gray-900/40 border-y border-gray-800/60"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-3">
                        {t.portfolio.title}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                        {t.portfolio.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, index) => {
                        const copy = t.portfolio[product.slug] as PortfolioCopy
                        const Icon = product.Icon
                        return (
                            <AppCard
                                key={product.slug}
                                name={copy.name}
                                description={copy.description}
                                status={copy.status}
                                icon={<Icon className="w-6 h-6" />}
                                gradient={product.accent}
                                index={index}
                                highlights={copy.highlights}
                                link={product.page ?? product.tool}
                            />
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
