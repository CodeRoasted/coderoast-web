import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
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

export default function Privacy() {
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
                            <div className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-700/30">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                Legal & Security
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
                            Privacy Policy
                        </h1>
                        <p className="text-sm text-gray-500 mb-4">
                            Last updated: April 23, 2026 · Effective immediately
                        </p>

                        {/* TL;DR card */}
                        <div className="mb-12 rounded-xl bg-emerald-950/30 border border-emerald-800/40 p-5">
                            <p className="text-sm font-semibold text-emerald-300 mb-2">TL;DR</p>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                CodeRoast sets <strong className="text-gray-200">one cookie</strong> to
                                remember whether you have seen the Lab onboarding tutorial. That is it.
                                No analytics. No ad trackers. No third-party scripts. No personal data
                                sold — ever.
                            </p>
                        </div>

                        <div className="prose-sm max-w-none">
                            <Section title="1. Who We Are">
                                <p>
                                    CodeRoast is an independent software project operated by a sole
                                    developer based in France. For any data-related inquiry, contact:{' '}
                                    <a
                                        href="mailto:contact@coderoast.fr"
                                        className="text-brand-400 hover:text-brand-300 transition-colors"
                                    >
                                        contact@coderoast.fr
                                    </a>
                                </p>
                            </Section>

                            <Section title="2. What Data We Collect">
                                <p>
                                    We collect <strong className="text-gray-200">as little as possible</strong>.
                                    Here is the complete list:
                                </p>
                                <div className="rounded-xl border border-gray-800 overflow-hidden mt-2">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-gray-800 bg-gray-900/60">
                                                <th className="px-4 py-2.5 text-left font-semibold text-gray-300">What</th>
                                                <th className="px-4 py-2.5 text-left font-semibold text-gray-300">Why</th>
                                                <th className="px-4 py-2.5 text-left font-semibold text-gray-300">How long</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-gray-800/50">
                                                <td className="px-4 py-3 font-mono text-gray-400">
                                                    logcraft_onboarding_dismissed
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    Remembers you've seen the Lab onboarding wizard
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">1 year</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-gray-400">Email address</td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    Only if you email us — to reply to you
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    Until you ask for deletion
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Section>

                            <Section title="3. What We Do NOT Collect">
                                <ul className="list-disc list-inside space-y-1 pl-2">
                                    <li>No analytics (no Google Analytics, no Plausible, no Mixpanel)</li>
                                    <li>No crash reporting services with personal data</li>
                                    <li>No advertising identifiers</li>
                                    <li>No fingerprinting</li>
                                    <li>No social login data</li>
                                    <li>
                                        No content of your YAML scenarios (processed client-side or
                                        transiently server-side; never stored permanently)
                                    </li>
                                </ul>
                            </Section>

                            <Section title="4. Cookies">
                                <p>
                                    We use a single <strong className="text-gray-200">functional cookie</strong>{' '}
                                    (<code className="text-brand-400 font-mono text-xs">logcraft_onboarding_dismissed</code>)
                                    that stores whether you have completed the LogCraft Lab onboarding
                                    tutorial. This cookie is strictly necessary for the product to
                                    function as intended — without it, the onboarding reappears on
                                    every visit.
                                </p>
                                <p>
                                    You can reset or delete this cookie at any time via the{' '}
                                    <strong className="text-gray-200">Your cookie preferences</strong>{' '}
                                    link in the footer, or by clearing cookies in your browser. Using
                                    private / incognito mode gives you a fresh session automatically.
                                </p>
                                <p>
                                    We do not set marketing, analytics, or targeting cookies. Because
                                    we use only strictly necessary cookies, no consent banner is legally
                                    required under the ePrivacy Directive — but we provide the
                                    preferences panel anyway for full transparency.
                                </p>
                            </Section>

                            <Section title="5. Log Data & Engine Sessions">
                                <p>
                                    When you run a scenario in the Lab, the engine runs server-side.
                                    Standard server access logs (IP address, timestamp, request path)
                                    may be retained for up to 30 days for security and abuse prevention.
                                    These logs are not used for profiling or sold to any party.
                                </p>
                                <p>
                                    The synthetic log output produced by your scenario sessions is
                                    ephemeral — it is never written to a persistent store and is
                                    discarded when your engine session ends.
                                </p>
                                <p>
                                    <strong>No AI or inference provider is involved.</strong> InSight
                                    can optionally narrate a finished report through a language model,
                                    and that option is <strong>not enabled on this Lab</strong>: the
                                    engine names no destination for it, the control is disabled in the
                                    panel, and the software refuses to start in a narration mode with
                                    no destination named. The analysis itself is deterministic and
                                    never involves a model. If you run InSight on your own
                                    infrastructure and choose to point narration at a provider, that
                                    is a destination you name in your own deployment — your
                                    relationship with that provider, not ours.
                                </p>
                            </Section>

                            <Section title="6. Hosting & Infrastructure">
                                <p>
                                    The CodeRoast website is hosted on Netlify (CDN). The LogCraft API
                                    server runs on a VPS operated directly by CodeRoast, without
                                    third-party managed analytics services attached. Netlify's own
                                    privacy policy applies to CDN-level access logs.
                                </p>
                            </Section>

                            <Section title="7. Your Rights (GDPR)">
                                <p>
                                    If you are located in the EU / EEA, you have the right to:
                                </p>
                                <ul className="list-disc list-inside space-y-1 pl-2">
                                    <li>Access the personal data we hold about you</li>
                                    <li>Rectification of inaccurate data</li>
                                    <li>Erasure ("right to be forgotten")</li>
                                    <li>Restriction of processing</li>
                                    <li>Data portability</li>
                                    <li>Object to processing</li>
                                </ul>
                                <p>
                                    Given the minimal data we collect, exercising most of these rights
                                    is trivially satisfied by clearing your browser cookies and not
                                    emailing us. For any formal request:{' '}
                                    <a
                                        href="mailto:contact@coderoast.fr"
                                        className="text-brand-400 hover:text-brand-300 transition-colors"
                                    >
                                        contact@coderoast.fr
                                    </a>
                                </p>
                            </Section>

                            <Section title="8. Changes to This Policy">
                                <p>
                                    If we ever add analytics, tracking, or new data collection, we will
                                    update this policy and announce the change prominently before it
                                    takes effect.
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
