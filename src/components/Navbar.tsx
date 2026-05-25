import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Github, GitCompareArrows, ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import LanguageToggle from './LanguageToggle'
import Logo from './Logo'
import { products, type ProductDef } from '@/config/products'
import { useTranslation } from '@/hooks/useTranslation'

// Maturity dot in the Products menu — the slate's "live → beta → soon" status
// at a glance, without product-specific copy in the umbrella nav.
const TIER_DOT: Record<ProductDef['tier'], string> = {
    live: 'bg-emerald-400',
    beta: 'bg-amber-400',
    soon: 'bg-gray-600',
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false) // mobile sheet
    const [productsOpen, setProductsOpen] = useState(false) // desktop dropdown
    const [scrolled, setScrolled] = useState(false)
    const t = useTranslation()
    const location = useLocation()
    const isHome = location.pathname === '/'
    const productsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Close both menus whenever the route changes.
    useEffect(() => {
        setIsOpen(false)
        setProductsOpen(false)
    }, [location.pathname])

    // Dismiss the desktop dropdown on outside-click or Escape.
    useEffect(() => {
        if (!productsOpen) return
        const onClick = (event: MouseEvent) => {
            if (productsRef.current && !productsRef.current.contains(event.target as Node))
                setProductsOpen(false)
        }
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setProductsOpen(false)
        }
        document.addEventListener('mousedown', onClick)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('mousedown', onClick)
            document.removeEventListener('keydown', onKey)
        }
    }, [productsOpen])

    const productName = (product: ProductDef) =>
        (t.portfolio[product.slug] as { name: string }).name
    const navLink = 'text-sm font-medium text-gray-300 hover:text-brand-400 transition-colors'

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 110, damping: 22 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled
                ? 'bg-gray-950/85 backdrop-blur-lg border-b border-gray-800/60'
                : 'bg-transparent border-b border-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a
                        href={isHome ? '#hero' : '/#hero'}
                        className="flex items-center gap-2 group hover:opacity-90 transition-opacity"
                    >
                        <Logo size="sm" />
                        <span className="font-display font-bold text-xl text-white">
                            <span className="bg-gradient-to-r from-brand-500 to-orange-400 bg-clip-text text-transparent">
                                Code
                            </span>
                            Roast
                        </span>
                    </a>

                    {/* Desktop links — umbrella only: Products ▾ + Pricing */}
                    <div className="hidden lg:flex items-center gap-7">
                        <div className="relative" ref={productsRef}>
                            <button
                                type="button"
                                onClick={() => setProductsOpen((open) => !open)}
                                aria-expanded={productsOpen}
                                aria-haspopup="true"
                                className={`inline-flex items-center gap-1 ${navLink}`}
                            >
                                {t.nav.products}
                                <ChevronDown
                                    className={`w-3.5 h-3.5 transition-transform ${productsOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            <AnimatePresence>
                                {productsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute left-0 mt-3 w-64 rounded-xl border border-gray-800 bg-gray-900/95 backdrop-blur-lg shadow-xl shadow-black/40 p-1.5"
                                    >
                                        {products.map((product) => {
                                            const to = product.page ?? product.tool
                                            const Icon = product.Icon
                                            const row = (
                                                <span className="flex items-center justify-between gap-2 w-full">
                                                    <span className="flex items-center gap-2 min-w-0">
                                                        <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                                                        <span className="text-sm text-gray-200 truncate">
                                                            {productName(product)}
                                                        </span>
                                                    </span>
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${TIER_DOT[product.tier]}`}
                                                        title={product.tier}
                                                    />
                                                </span>
                                            )
                                            return to ? (
                                                <Link
                                                    key={product.slug}
                                                    to={to}
                                                    className="block px-3 py-2 rounded-lg hover:bg-gray-800/60 transition-colors"
                                                >
                                                    {row}
                                                </Link>
                                            ) : (
                                                <div
                                                    key={product.slug}
                                                    className="block px-3 py-2 rounded-lg opacity-60 cursor-default"
                                                    title="Coming soon"
                                                >
                                                    {row}
                                                </div>
                                            )
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <Link to="/tiers" className={navLink}>
                            {t.nav.pricing}
                        </Link>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        <a
                            href="https://github.com/CodeRoasted"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="hidden sm:inline-flex p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 transition-colors"
                        >
                            <Github className="w-4 h-4" />
                        </a>
                        <LanguageToggle />
                        <Link
                            to="/diff"
                            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 to-orange-500 text-white text-sm font-semibold shadow-md shadow-brand-700/30 hover:shadow-brand-700/50 hover:scale-[1.02] transition-all"
                        >
                            <GitCompareArrows className="w-3.5 h-3.5" />
                            {t.hero.cta}
                        </Link>
                        <button
                            className="lg:hidden p-2 text-gray-300"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-gray-950/95 border-b border-gray-800"
                    >
                        <div className="px-4 py-4 space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                {t.nav.products}
                            </p>
                            {products.map((product) => {
                                const to = product.page ?? product.tool
                                const Icon = product.Icon
                                return to ? (
                                    <Link
                                        key={product.slug}
                                        to={to}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-brand-400 transition-colors"
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        {productName(product)}
                                        <span className={`w-1.5 h-1.5 rounded-full ${TIER_DOT[product.tier]}`} />
                                    </Link>
                                ) : (
                                    <div
                                        key={product.slug}
                                        className="flex items-center gap-2 text-sm text-gray-600"
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        {productName(product)}
                                        <span className="text-[10px] uppercase tracking-wide">soon</span>
                                    </div>
                                )
                            })}
                            <Link
                                to="/tiers"
                                onClick={() => setIsOpen(false)}
                                className="block text-sm font-medium text-gray-300 hover:text-brand-400 transition-colors pt-3 border-t border-gray-800/60"
                            >
                                {t.nav.pricing}
                            </Link>
                            <Link
                                to="/diff"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-1.5 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                            >
                                <GitCompareArrows className="w-3.5 h-3.5" />
                                {t.hero.cta}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
