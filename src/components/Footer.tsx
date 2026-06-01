import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Github, Mail, Heart } from 'lucide-react'
import Logo from './Logo'
import { useTranslation } from '@/hooks/useTranslation'
import CookiePreferences from './CookiePreferences'

export default function Footer() {
    const t = useTranslation()
    const year = new Date().getFullYear()
    const [showCookiePrefs, setShowCookiePrefs] = useState(false)

    return (
        <>
            <footer className="bg-gray-950 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                        {/* Brand */}
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-3">
                                <Logo size="sm" />
                                <span className="font-display font-bold text-lg text-white">
                                    <span className="bg-gradient-to-r from-brand-500 to-orange-400 bg-clip-text text-transparent">
                                        Code
                                    </span>
                                    Roast
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                                {t.footer.tagline}
                            </p>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                                {t.footer.sections.product}
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link
                                        to="/logcraft"
                                        className="text-gray-400 hover:text-brand-400 transition-colors"
                                    >
                                        {t.footer.links.logcraft}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/lab/insight"
                                        className="text-gray-400 hover:text-brand-400 transition-colors"
                                    >
                                        {t.footer.links.lab}
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="mailto:contact@coderoast.fr"
                                        className="text-gray-400 hover:text-brand-400 transition-colors"
                                    >
                                        {t.footer.links.contact}
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                                {t.footer.sections.resources}
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link
                                        to="/tiers"
                                        className="text-gray-400 hover:text-brand-400 transition-colors"
                                    >
                                        {t.footer.links.tierMatrix}
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="/#roadmap"
                                        className="text-gray-400 hover:text-brand-400 transition-colors"
                                    >
                                        {t.footer.links.roadmap}
                                    </a>
                                </li>
                                <li>
                                    <Link
                                        to="/how-we-build"
                                        className="text-gray-400 hover:text-brand-400 transition-colors"
                                    >
                                        {t.footer.links.howWeBuild}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/how-we-compare"
                                        className="text-gray-400 hover:text-brand-400 transition-colors"
                                    >
                                        {t.footer.links.howWeCompare}
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/CodeRoasted"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-brand-400 transition-colors"
                                    >
                                        {t.footer.links.github}
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* More */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                                {t.footer.sections.more}
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a
                                        href="mailto:contact@coderoast.fr"
                                        className="text-gray-400 hover:text-brand-400 transition-colors"
                                    >
                                        {t.footer.links.contact}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://buymeacoffee.com/coderoast"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-gray-400 hover:text-brand-400 transition-colors"
                                    >
                                        <Heart className="w-3 h-3" />
                                        {t.footer.links.support}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-gray-800/60">
                        {/* Legal & Security label */}
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-3">
                            {t.footer.sections.legal}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
                            <p className="text-xs text-gray-600 shrink-0">
                                Copyright {year} &copy; CodeRoast. {t.footer.rights}
                            </p>
                            <nav
                                className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500"
                                aria-label="Legal"
                            >
                                <Link
                                    to="/legal/terms"
                                    className="hover:text-gray-300 transition-colors"
                                >
                                    {t.footer.links.terms}
                                </Link>
                                <span className="text-gray-700" aria-hidden="true">·</span>
                                <Link
                                    to="/legal/privacy"
                                    className="hover:text-gray-300 transition-colors"
                                >
                                    {t.footer.links.privacy}
                                </Link>
                                <span className="text-gray-700" aria-hidden="true">·</span>
                                <Link
                                    to="/legal/trademark"
                                    className="hover:text-gray-300 transition-colors"
                                >
                                    {t.footer.links.trademark}
                                </Link>
                                <span className="text-gray-700" aria-hidden="true">·</span>
                                <button
                                    onClick={() => setShowCookiePrefs(true)}
                                    className="hover:text-gray-300 transition-colors"
                                >
                                    {t.footer.links.cookiePrefs}
                                </button>
                                <span className="text-gray-700" aria-hidden="true">·</span>
                                <a
                                    href="https://github.com/CodeRoasted"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    className="p-0.5 hover:text-gray-300 transition-colors"
                                >
                                    <Github className="w-3.5 h-3.5" />
                                </a>
                                <a
                                    href="mailto:contact@coderoast.fr"
                                    aria-label="Email"
                                    className="p-0.5 hover:text-gray-300 transition-colors"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
            </footer>

            <CookiePreferences
                open={showCookiePrefs}
                onClose={() => setShowCookiePrefs(false)}
            />
        </>
    )
}
