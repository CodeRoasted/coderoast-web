import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, BadgeCheck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-10">
            <h2 className="text-lg font-display font-bold text-white mb-3">{title}</h2>
            <div className="space-y-3 text-sm text-gray-400 leading-relaxed">{children}</div>
        </div>
    )
}

export default function Trademark() {
    return (
        <div className="bg-gray-950 text-gray-100 min-h-screen">
            <Navbar />
            <main className="pt-24 pb-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors mb-8"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to CodeRoast
                        </Link>

                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-indigo-900/30 border border-indigo-700/30">
                                <BadgeCheck className="w-5 h-5 text-indigo-400" />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                Legal & Security
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
                            Trademark Policy
                        </h1>
                        <p className="text-sm text-gray-500 mb-12">
                            Last updated: April 23, 2026
                        </p>

                        <div className="prose-sm max-w-none">
                            <Section title="1. Our Trademarks">
                                <p>
                                    The following names and marks are trademarks of CodeRoast:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                                    {[
                                        { name: 'CodeRoast', desc: 'Brand name' },
                                        { name: 'LogCraft', desc: 'Log generation engine' },
                                        { name: 'InSight', desc: 'Observability analysis engine' },
                                    ].map(({ name, desc }) => (
                                        <div
                                            key={name}
                                            className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-3"
                                        >
                                            <p className="font-display font-bold text-white text-sm">{name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-3">
                                    The CodeRoast mug logo and any associated wordmarks, icons, and
                                    visual identity elements are also covered by this policy.
                                </p>
                            </Section>

                            <Section title="2. Permitted Uses">
                                <p>
                                    You may use our trademarks <strong className="text-gray-200">without prior written permission</strong>{' '}
                                    for the following purposes:
                                </p>
                                <ul className="list-disc list-inside space-y-2 pl-2">
                                    <li>
                                        <strong className="text-gray-300">Referential / descriptive use</strong> — mentioning
                                        LogCraft or InSight to accurately describe what a product
                                        integrates with (e.g., "this collector supports LogCraft output").
                                    </li>
                                    <li>
                                        <strong className="text-gray-300">Editorial use</strong> — articles,
                                        blog posts, tutorials, conference talks, or academic papers
                                        that discuss CodeRoast products.
                                    </li>
                                    <li>
                                        <strong className="text-gray-300">Open-source integrations</strong> — README
                                        badges or documentation stating compatibility
                                        (e.g., "Works with LogCraft").
                                    </li>
                                    <li>
                                        <strong className="text-gray-300">Community content</strong> — screencasts,
                                        demos, or tutorials made by users of the product.
                                    </li>
                                </ul>
                                <p>
                                    In all permitted uses, the marks must not be altered, combined with
                                    other words in a way that implies endorsement, or used in a manner
                                    that could confuse users about the origin of the product.
                                </p>
                            </Section>

                            <Section title="3. Prohibited Uses">
                                <p>
                                    The following uses require explicit written permission from
                                    CodeRoast:
                                </p>
                                <ul className="list-disc list-inside space-y-2 pl-2">
                                    <li>
                                        Using "LogCraft", "InSight", or "CodeRoast" as part of your
                                        own product name, company name, or domain name.
                                    </li>
                                    <li>
                                        Creating derivative logos or wordmarks that could be confused
                                        with ours.
                                    </li>
                                    <li>
                                        Suggesting or implying an official partnership, sponsorship, or
                                        endorsement by CodeRoast without one.
                                    </li>
                                    <li>
                                        Using our marks in advertising, merchandise, or promotional
                                        materials in a commercial context.
                                    </li>
                                    <li>
                                        Registering or using any mark that is confusingly similar to
                                        ours in any jurisdiction.
                                    </li>
                                </ul>
                            </Section>

                            <Section title="4. OSS & Attribution">
                                <p>
                                    The CodeRoast source code is currently closed. If and when
                                    components are open-sourced under a license, that license governs
                                    code use; this trademark policy separately governs use of the
                                    marks. An open-source license does not implicitly grant trademark
                                    rights.
                                </p>
                            </Section>

                            <Section title="5. Reporting Misuse">
                                <p>
                                    If you believe our trademarks are being misused, please notify us
                                    at{' '}
                                    <a
                                        href="mailto:contact@coderoast.fr"
                                        className="text-brand-400 hover:text-brand-300 transition-colors"
                                    >
                                        contact@coderoast.fr
                                    </a>{' '}
                                    with details and, if possible, a URL or screenshot. We review all
                                    reports and take action where warranted.
                                </p>
                            </Section>

                            <Section title="6. Licensing Inquiries">
                                <p>
                                    To request permission for a use not covered above, contact{' '}
                                    <a
                                        href="mailto:contact@coderoast.fr"
                                        className="text-brand-400 hover:text-brand-300 transition-colors"
                                    >
                                        contact@coderoast.fr
                                    </a>{' '}
                                    with a description of the intended use, the marks involved, and
                                    the context (product, country, medium). We aim to respond within
                                    5 business days.
                                </p>
                            </Section>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
