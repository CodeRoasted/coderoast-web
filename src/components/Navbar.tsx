import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import LanguageToggle from './LanguageToggle'
import Logo from './Logo'
import { useTranslation } from '@/hooks/useTranslation'

const navLinks = [
    { key: 'home' as const, href: '#hero' },
    { key: 'portfolio' as const, href: '#portfolio' },
    { key: 'donate' as const, href: '#donation' },
    { key: 'licensing' as const, href: '#licensing' },
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const t = useTranslation()

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="#hero" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
                        <Logo size="sm" />
                        <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
                            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent">
                                Code
                            </span>
                            Roast
                        </span>
                    </a>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map(({ key, href }) => (
                            <a
                                key={key}
                                href={href}
                                className="text-sm font-medium text-gray-600 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-400 transition-colors"
                            >
                                {t.nav[key]}
                            </a>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                        <LanguageToggle />
                        <button
                            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
                    >
                        <div className="px-4 py-4 space-y-3">
                            {navLinks.map(({ key, href }) => (
                                <a
                                    key={key}
                                    href={href}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-sm font-medium text-gray-600 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-400 transition-colors"
                                >
                                    {t.nav[key]}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
