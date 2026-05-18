import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, FlaskConical, Github, ArrowLeft } from 'lucide-react'
import LanguageToggle from './LanguageToggle'
import Logo from './Logo'
import { useTranslation } from '@/hooks/useTranslation'

/**
 * Navbar variant used on LogCraft / Lab / Use Cases / Tiers — the "product"
 * surface — instead of the personal portfolio Navbar. Drops the portfolio
 * anchor links (#how, #features…) which only resolve on `/`, and surfaces
 * the navigation a LogCraft visitor actually cares about: Product, Use
 * cases, Pricing, plus a back-to-portfolio escape hatch and the Open Lab
 * CTA. Item #7 of the brutal UX audit ("split LogCraft from the personal
 * portfolio nav").
 */
export default function ProductNavbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const t = useTranslation()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const navLinkBase =
        'text-sm font-medium text-gray-300 hover:text-brand-400 transition-colors'
    const navLinkActive = 'text-brand-400'

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
                        <Link to="/logcraft" className="flex items-center gap-2 group hover:opacity-90 transition-opacity">
                            <Logo size="sm" />
                            <span className="font-display font-bold text-xl text-white">
                                <span className="bg-gradient-to-r from-brand-500 to-orange-400 bg-clip-text text-transparent">
                                    Log
                                </span>
                                Craft
                            </span>
                        </Link>
                    </div>

                    {/* Desktop links */}
                    <div className="hidden lg:flex items-center gap-7">
                        <NavLink
                            to="/logcraft"
                            end
                            className={({ isActive }) =>
                                `${navLinkBase} ${isActive ? navLinkActive : ''}`
                            }
                        >
                            {t.nav.product}
                        </NavLink>
                        <NavLink
                            to="/use-cases"
                            className={({ isActive }) =>
                                `${navLinkBase} ${isActive ? navLinkActive : ''}`
                            }
                        >
                            {t.nav.useCases}
                        </NavLink>
                        <a
                            href="mailto:contact@coderoast.fr"
                            className={navLinkBase}
                        >
                            {t.nav.contact}
                        </a>
                        <NavLink
                            to="/tiers"
                            className={({ isActive }) =>
                                `${navLinkBase} ${isActive ? navLinkActive : ''}`
                            }
                        >
                            {t.footer.links.tierMatrix}
                        </NavLink>
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
                            to="/lab/logcraft"
                            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 to-orange-500 text-white text-sm font-semibold shadow-md shadow-brand-700/30 hover:shadow-brand-700/50 hover:scale-[1.02] transition-all"
                        >
                            <FlaskConical className="w-3.5 h-3.5" />
                            {t.nav.logcraftPlayground}
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
                            <NavLink
                                to="/logcraft"
                                end
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block ${navLinkBase} ${isActive ? navLinkActive : ''}`
                                }
                            >
                                {t.nav.product}
                            </NavLink>
                            <NavLink
                                to="/use-cases"
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block ${navLinkBase} ${isActive ? navLinkActive : ''}`
                                }
                            >
                                {t.nav.useCases}
                            </NavLink>
                            <a
                                href="mailto:contact@coderoast.fr"
                                onClick={() => setIsOpen(false)}
                                className={`block ${navLinkBase}`}
                            >
                                {t.nav.contact}
                            </a>
                            <NavLink
                                to="/tiers"
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block ${navLinkBase} ${isActive ? navLinkActive : ''}`
                                }
                            >
                                {t.footer.links.tierMatrix}
                            </NavLink>
                            <Link
                                to="/lab/logcraft"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-1.5 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                            >
                                <FlaskConical className="w-3.5 h-3.5" />
                                {t.nav.logcraftPlayground}
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
