import { Github, Twitter, Mail } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function Footer() {
    const t = useTranslation()
    const year = new Date().getFullYear()

    return (
        <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                                <span className="text-white font-bold text-sm font-display">CR</span>
                            </div>
                            <span className="font-display font-bold text-lg text-gray-900 dark:text-white">
                                CodeRoast
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t.footer.tagline}
                        </p>
                    </div>

                    {/* Social links */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/coderoast"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                            aria-label="GitHub"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <a
                            href="https://twitter.com/coderoast"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Twitter"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a
                            href="mailto:hello@coderoast.dev"
                            className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Email"
                        >
                            <Mail className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        © {year} CodeRoast. {t.footer.rights}
                    </p>
                </div>
            </div>
        </footer>
    )
}
