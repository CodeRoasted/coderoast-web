import { useEffect, useState } from 'react'
import type { ComponentType, ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Github, ArrowLeft } from 'lucide-react'
import LanguageToggle from './LanguageToggle'
import Logo from './Logo'
import ProductsMenu, { ProductsMobileLinks } from './ProductsMenu'
import { useTranslation } from '@/hooks/useTranslation'

export interface ProductNavLink {
    label: string
    to?: string // internal route
    href?: string // external (mailto, …)
    end?: boolean
    disabled?: boolean // greyed-out placeholder (e.g. pricing — not live yet)
}

export interface ProductNavbarConfig {
    // Styled wordmark shown beside the back-to-CodeRoast escape hatch.
    brand: ReactNode
    // Where the wordmark links (the product's own page).
    homeTo: string
    links: ProductNavLink[]
    cta: { label: string; to: string; Icon: ComponentType<{ className?: string }> }
}

/**
 * Per-product navbar — the focused "product surface" chrome (back-to-CodeRoast
 * escape hatch, product wordmark, product sub-nav, product CTA), driven
 * entirely by props so every product page shares one implementation. Replaces
 * the version that was hardcoded to LogCraft.
 */
export default function ProductNavbar({ brand, homeTo, links, cta }: ProductNavbarConfig) {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const t = useTranslation()
    const CtaIcon = cta.Icon

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const base = 'text-sm font-medium text-gray-300 hover:text-brand-400 transition-colors'
    const active = 'text-brand-400'
    const renderLink = (link: ProductNavLink, onClick?: () => void, block = false) => {
        const cls = `${block ? 'block ' : ''}${base}`
        if (link.disabled)
            return (
                <span
                    key={link.label}
                    className={`${block ? 'block ' : ''}text-sm font-medium text-gray-600 cursor-not-allowed`}
                    title="Coming soon"
                >
                    {link.label}
                </span>
            )
        if (link.href)
            return (
                <a key={link.label} href={link.href} onClick={onClick} className={cls}>
                    {link.label}
                </a>
            )
        return (
            <NavLink
                key={link.label}
                to={link.to as string}
                end={link.end}
                onClick={onClick}
                className={({ isActive }) => `${cls} ${isActive ? active : ''}`}
            >
                {link.label}
            </NavLink>
        )
    }

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
                    {/* Brand + back-to-portfolio */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                            title={t.nav.home}
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            CodeRoast
                        </Link>
                        <span className="hidden sm:inline-block w-px h-5 bg-gray-800" />
                        <Link
                            to={homeTo}
                            className="flex items-center gap-2 group hover:opacity-90 transition-opacity"
                        >
                            <Logo size="sm" />
                            {brand}
                        </Link>
                    </div>

                    {/* Desktop links — cross-product switcher + this product's nav */}
                    <div className="hidden lg:flex items-center gap-7">
                        <ProductsMenu />
                        {links.map((link) => renderLink(link))}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        <span
                            className="hidden sm:inline-flex text-sm font-medium text-gray-600 cursor-not-allowed"
                            title="Accounts coming soon"
                        >
                            {t.nav.signIn}
                        </span>
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
                            to={cta.to}
                            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 to-orange-500 text-white text-sm font-semibold shadow-md shadow-brand-700/30 hover:shadow-brand-700/50 hover:scale-[1.02] transition-all"
                        >
                            <CtaIcon className="w-3.5 h-3.5" />
                            {cta.label}
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
                            <ProductsMobileLinks onNavigate={() => setIsOpen(false)} />
                            {links.map((link) => renderLink(link, () => setIsOpen(false), true))}
                            <Link
                                to={cta.to}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-1.5 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                            >
                                <CtaIcon className="w-3.5 h-3.5" />
                                {cta.label}
                            </Link>
                            <Link
                                to="/"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors pt-2 border-t border-gray-800/60"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                {t.nav.home} CodeRoast
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
