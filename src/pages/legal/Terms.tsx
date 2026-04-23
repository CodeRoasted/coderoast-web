import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText } from 'lucide-react'
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

export default function Terms() {
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
                            <div className="p-2 rounded-lg bg-brand-900/40 border border-brand-700/30">
                                <FileText className="w-5 h-5 text-brand-400" />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                Legal & Security
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
                            Terms of Service
                        </h1>
                        <p className="text-sm text-gray-500 mb-12">
                            Last updated: April 23, 2026 · Effective immediately
                        </p>

                        <div className="prose-sm max-w-none">
                            <Section title="1. Acceptance of Terms">
                                <p>
                                    By accessing or using CodeRoast products — including LogCraft, the
                                    LogCraft Lab, InSight, and any associated APIs or tools — you agree
                                    to be bound by these Terms of Service. If you do not agree, please
                                    do not use the service.
                                </p>
                                <p>
                                    CodeRoast is operated by an independent developer based in France.
                                    Contact:{' '}
                                    <a
                                        href="mailto:contact@coderoast.fr"
                                        className="text-brand-400 hover:text-brand-300 transition-colors"
                                    >
                                        contact@coderoast.fr
                                    </a>
                                </p>
                            </Section>

                            <Section title="2. Description of Service">
                                <p>
                                    LogCraft is a <strong className="text-gray-200">synthetic log generation engine</strong>.
                                    All output produced by LogCraft — log records, metrics, traces,
                                    incident timelines — is <strong className="text-gray-200">entirely simulated and deterministic</strong>.
                                    No real system data, real user data, or real production traffic is
                                    ever ingested, stored, or forwarded.
                                </p>
                                <p>
                                    The LogCraft Lab is a browser-based sandbox. Scenarios run in your
                                    browser session and communicate with a hosted API. Data produced
                                    within a session exists only for the duration of that session.
                                </p>
                                <p>
                                    InSight is an early-stage observability analysis engine currently
                                    under development. Features described as "coming soon" or "in R&amp;D"
                                    are not yet available and carry no implied delivery commitment.
                                </p>
                            </Section>

                            <Section title="3. Free and Paid Tiers">
                                <p>
                                    A free tier is available and will remain free. Access to advanced
                                    features (cascading failures, chaos scenarios, extended output
                                    formats) may require a paid tier once commercial plans are launched.
                                </p>
                                <p>
                                    Paid tier pricing, billing cycles, and refund policies will be
                                    published at the time of commercial launch. No payment information
                                    is currently collected.
                                </p>
                            </Section>

                            <Section title="4. Prohibited Uses">
                                <p>You agree not to:</p>
                                <ul className="list-disc list-inside space-y-1 text-gray-400 pl-2">
                                    <li>
                                        Use the service to generate output that could be mistaken for
                                        real production logs of systems you do not own.
                                    </li>
                                    <li>
                                        Attempt to reverse-engineer, decompile, or extract the
                                        proprietary scenario execution logic or DSL.
                                    </li>
                                    <li>
                                        Abuse the hosted API (automated flooding, credential stuffing,
                                        scraping for competitive intelligence).
                                    </li>
                                    <li>
                                        Resell, sublicense, or redistribute the service without a
                                        written agreement.
                                    </li>
                                </ul>
                            </Section>

                            <Section title="5. Intellectual Property">
                                <p>
                                    The CodeRoast codebase, scenario DSL, deterministic execution
                                    engine, and all associated tooling are proprietary. Nothing in
                                    these Terms grants you any right to the source code, underlying
                                    algorithms, or scenario library beyond the rights explicitly stated.
                                </p>
                                <p>
                                    YAML scenarios you author yourself remain your own property. Output
                                    generated by the engine from your scenarios is yours to use freely.
                                </p>
                            </Section>

                            <Section title="6. Disclaimer of Warranties">
                                <p>
                                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                                    WARRANTY OF ANY KIND. CODEROAST EXPRESSLY DISCLAIMS ALL WARRANTIES,
                                    WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING ANY
                                    IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                                    PURPOSE, AND NON-INFRINGEMENT.
                                </p>
                            </Section>

                            <Section title="7. Limitation of Liability">
                                <p>
                                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CODEROAST SHALL
                                    NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                                    OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE
                                    OF THE SERVICE.
                                </p>
                            </Section>

                            <Section title="8. Changes to Terms">
                                <p>
                                    These Terms may be updated from time to time. Material changes will
                                    be communicated via the website. Continued use of the service after
                                    changes take effect constitutes acceptance of the revised Terms.
                                </p>
                            </Section>

                            <Section title="9. Governing Law">
                                <p>
                                    These Terms are governed by the laws of France. Any disputes shall
                                    be submitted to the courts of competent jurisdiction in France.
                                </p>
                            </Section>

                            <Section title="10. Contact">
                                <p>
                                    Questions about these Terms?{' '}
                                    <a
                                        href="mailto:contact@coderoast.fr"
                                        className="text-brand-400 hover:text-brand-300 transition-colors"
                                    >
                                        contact@coderoast.fr
                                    </a>
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
