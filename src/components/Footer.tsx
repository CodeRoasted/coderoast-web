import { Link } from 'react-router-dom'
import { Github, Mail, Heart } from 'lucide-react'
import Logo from './Logo'
import { useTranslation } from '@/hooks/useTranslation'

export default function Footer() {
    const t = useTranslation()
    const year = new Date().getFullYear()

    return (
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
                                    to="/lab"
                                    className="text-gray-400 hover:text-brand-400 transition-colors"
                                >
                                    {t.footer.links.lab}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/logcraft#pricing"
                                    className="text-gray-400 hover:text-brand-400 transition-colors"
                                >
                                    {t.footer.links.pricing}
                                </Link>
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
                                <a
                                    href="https://github.com/Manu-CodeRoast"
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

                <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-600">
                        © {year} CodeRoast. {t.footer.rights}
                    </p>
                    <div className="flex items-center gap-3">
                        <a
                            href="https://github.com/Manu-CodeRoast"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="p-1.5 rounded text-gray-500 hover:text-gray-300 transition-colors"
                        >
                            <Github className="w-4 h-4" />
                        </a>
                        <a
                            href="mailto:contact@coderoast.fr"
                            aria-label="Email"
                            className="p-1.5 rounded text-gray-500 hover:text-gray-300 transition-colors"
                        >
                            <Mail className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
