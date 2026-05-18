import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Brain, Github } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import LanguageToggle from './LanguageToggle'
import Logo from './Logo'
import { useTranslation } from '@/hooks/useTranslation'

// Anchor links only valid on home; on sub-pages we send them to /#hash so
// the browser scrolls into view after navigation.
const anchorLinks = [
    { key: 'product' as const, hash: '#product' },
    { key: 'how' as const, hash: '#how' },
    { key: 'features' as const, hash: '#features' },
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const t = useTranslation()
    const location = useLocation()
    const isHome = location.pathname === '/'

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const resolveHref = (hash: string) => (isHome ? hash : `/${hash}`)

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
                        href={resolveHref('#hero')}
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

                    {/* Desktop links */}
                    <div className="hidden lg:flex items-center gap-7">
                        {anchorLinks.map(({ key, hash }) => (
                            <a
                                key={key}
                                href={resolveHref(hash)}
                                className="text-sm font-medium text-gray-300 hover:text-brand-400 transition-colors"
                            >
                                {t.nav[key]}
                            </a>
                        ))}
                        <Link
                            to="/logcraft"
                            className="text-sm font-medium text-gray-300 hover:text-brand-400 transition-colors"
                        >
                            {t.nav.logcraft}
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
                            to="/lab/insight"
                            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 to-orange-500 text-white text-sm font-semibold shadow-md shadow-brand-700/30 hover:shadow-brand-700/50 hover:scale-[1.02] transition-all"
                        >
                            <Brain className="w-3.5 h-3.5" />
                            {t.nav.lab}
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
                            {anchorLinks.map(({ key, hash }) => (
                                <a
                                    key={key}
                                    href={resolveHref(hash)}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-sm font-medium text-gray-300 hover:text-brand-400 transition-colors"
                                >
                                    {t.nav[key]}
                                </a>
                            ))}
                            <Link
                                to="/logcraft"
                                onClick={() => setIsOpen(false)}
                                className="block text-sm font-medium text-gray-300 hover:text-brand-400 transition-colors"
                            >
                                {t.nav.logcraft}
                            </Link>
                            <Link
                                to="/lab/insight"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-1.5 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                            >
                                <Brain className="w-3.5 h-3.5" />
                                {t.nav.lab}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
