import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    ArrowRight,
    BadgeCheck,
    ChevronDown,
    GitBranch,
    GitCompareArrows,
    Github,
    Search,
    ShieldCheck,
    Zap,
} from 'lucide-react'
import ProductNavbar from '@/components/ProductNavbar'
import Footer from '@/components/Footer'
import { siftChrome } from '@/config/productChrome'
import { useTranslation } from '@/hooks/useTranslation'

// Sift product front door (/sift). Six-section page; copy is governed by
// technical_docs/product/web_copy.md § "Page: Sift" and surfaced via t.sift.
// The mocks below (hero sample report, PR comment, install blocks) reproduce
// real engine / CLI / Action output verbatim — language-neutral, so they live
// here as constants rather than in i18n (the engine emits English regardless of
// the visitor's locale, same convention as the prior showcase).

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
}

// Hero sample — the locked silent-regression-on-green mock (web_copy § 1). Rows
// mirror the engine's real `summary` strings (cache-died scenario).
const HERO = {
    command: 'sift  green-base.log  green-pr.log',
    stat: '851 changes, 3 structurally significant · stability 0.62 · 12,040 → 12,058 lines',
    rows: [
        {
            severity: 'high',
            badge: 'HIGH',
            text: 'Disappeared: "Cache restored from key <*>" — every prior run logged it; this one didn\'t.',
        },
        {
            severity: 'high',
            badge: 'HIGH',
            text: 'Frequency shift: "Downloading <*> (<*> MB)" 4% → 38% — fetching from source, not cache.',
        },
        {
            severity: 'medium',
            badge: 'MEDIUM',
            text: 'Frequency shift: "Restore dependencies completed in <*>s" — 6.2× slower.',
        },
    ],
    suppressed: '848 changes suppressed as noise (proportional / low-frequency).',
} as const

// PR comment showcase (web_copy § 2). Frame + the one engine-rendered row.
const COMMENT = {
    header: '🔬 Sift — structural diff of your CI logs',
    verdict: '🚨 Green tests. Real regression. It slipped through:',
    row: '1. [HIGH · regression] New error: "Connection refused to <*> after <*> retries" — 0 → 214 occurrences.',
    footer: 'Deterministic — same inputs, same comment. Runs in your CI; your logs never leave it.',
} as const

// Install blocks (web_copy § 6). Both reproduce the sift-action README verbatim:
// the four-line Action (turnkey `target-job` — Sift pulls the finished job's log
// off the API) and the live `install.sh` CLI one-liner (shipped; the earlier
// "open installer decision" is resolved).
const ACTION_YAML = `- uses: CodeRoasted/sift-action@v1
  with:
    target-job: build   # Sift pulls that finished job's log off the API`

const CLI_BLOCK = `curl -fsSL https://raw.githubusercontent.com/CodeRoasted/sift-action/main/install.sh | sh
sift baseline.log changed.log`

const BADGE_STYLE: Record<string, string> = {
    high: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
    medium: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40',
    low: 'bg-gray-500/15 text-gray-300 border-gray-500/40',
}

// macOS-style report card chrome, shared by the hero sample and the PR comment.
function CardChrome({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/70 shadow-xl shadow-black/30 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-800 bg-gray-900">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 font-mono text-xs text-gray-500 truncate">{label}</span>
            </div>
            {children}
        </div>
    )
}

function HeroSample() {
    const t = useTranslation()
    return (
        <CardChrome label={HERO.command}>
            <div className="p-5">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-3 rounded-full bg-green-500/10 border border-green-500/30 text-green-300 text-[11px] font-semibold">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    {t.sift.hero.samplePassed}
                </div>
                <p className="font-mono text-xs text-gray-500">{HERO.stat}</p>
                <ul className="mt-4 space-y-3">
                    {HERO.rows.map((row) => (
                        <li key={row.text} className="flex gap-2.5">
                            <span
                                className={`mt-0.5 px-1.5 py-0.5 h-fit rounded text-[10px] font-semibold border ${BADGE_STYLE[row.severity]}`}
                            >
                                {row.badge}
                            </span>
                            <p className="min-w-0 text-sm text-gray-100 leading-snug break-words font-mono">
                                {row.text}
                            </p>
                        </li>
                    ))}
                </ul>
                <p className="mt-4 pt-3 border-t border-gray-800 text-xs text-gray-600 italic">
                    {HERO.suppressed}
                </p>
            </div>
        </CardChrome>
    )
}

function PrComment() {
    return (
        <CardChrome label="github.com · pull request #128">
            <div className="p-5 font-mono text-sm leading-relaxed">
                <p className="text-gray-200 font-semibold">{COMMENT.header}</p>
                <p className="mt-4 text-orange-300 font-semibold break-words">{COMMENT.verdict}</p>
                <p className="mt-2 text-gray-100 break-words">{COMMENT.row}</p>
                <p className="mt-4 pt-3 border-t border-gray-800 text-xs text-gray-500 not-italic break-words">
                    {COMMENT.footer}
                </p>
            </div>
        </CardChrome>
    )
}

function CodeBlock({ code }: { code: string }) {
    return (
        <pre className="rounded-xl border border-gray-800 bg-gray-950/80 p-4 overflow-x-auto">
            <code className="font-mono text-sm text-gray-200 whitespace-pre">{code}</code>
        </pre>
    )
}

export default function SiftPage() {
    const t = useTranslation()
    const s = t.sift

    return (
        <div className="bg-gray-950 text-gray-100 min-h-screen">
            <ProductNavbar {...siftChrome(t)} />
            <main className="pt-16">
                {/* § 1 — Hero */}
                <section className="relative overflow-hidden border-b border-gray-800/60">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(249,115,22,0.12),transparent)]" />
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                        <motion.div {...fadeUp}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-brand-500/10 border border-brand-700/40 text-brand-300 text-xs font-semibold">
                                <GitCompareArrows className="w-3.5 h-3.5" />
                                {s.eyebrow}
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white leading-[1.08] mb-5">
                                {s.hero.title}
                            </h1>
                            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-7">
                                {s.hero.subtitle}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                                <a
                                    href="#install"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-600 to-orange-500 text-white font-semibold shadow-lg shadow-brand-700/30 hover:shadow-brand-700/50 hover:scale-[1.02] transition-all"
                                >
                                    <Github className="w-4 h-4" />
                                    {s.hero.ctaPrimary}
                                    <ChevronDown className="w-4 h-4" />
                                </a>
                                <Link
                                    to="/diff"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-gray-700 text-gray-200 font-semibold hover:border-brand-700/60 hover:text-white transition-colors"
                                >
                                    {s.hero.ctaSecondary}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <p className="mt-5 text-xs text-gray-500">{s.hero.trust}</p>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
                            <HeroSample />
                            <p className="mt-4 text-sm text-gray-400 italic leading-relaxed">
                                {s.hero.kicker}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* § 2 — The PR comment, in context */}
                <section className="relative py-24 sm:py-28 border-b border-gray-800/60">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                        <motion.div {...fadeUp} className="order-2 lg:order-1">
                            <PrComment />
                        </motion.div>
                        <motion.div {...fadeUp} className="order-1 lg:order-2">
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-700/30 mb-4">
                                <GitBranch className="w-5 h-5" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-4">
                                {s.comment.title}
                            </h2>
                            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                                {s.comment.body}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* § 3 — What it catches that nothing else does */}
                <section className="relative py-24 sm:py-28 border-b border-gray-800/60">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeUp} className="mb-10">
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-700/30 mb-4">
                                <Search className="w-5 h-5" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight max-w-2xl">
                                {s.catches.title}
                            </h2>
                        </motion.div>
                        <motion.div {...fadeUp} className="overflow-x-auto rounded-2xl border border-gray-800">
                            <table className="w-full text-left border-collapse min-w-[640px]">
                                <thead>
                                    <tr className="bg-gray-900/70 text-xs uppercase tracking-wide text-gray-500">
                                        <th className="px-4 py-3 font-semibold">{s.catches.colChange}</th>
                                        <th className="px-4 py-3 font-semibold">{s.catches.colTextDiff}</th>
                                        <th className="px-4 py-3 font-semibold">{s.catches.colPassFail}</th>
                                        <th className="px-4 py-3 font-semibold text-brand-300">{s.catches.colSift}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {s.catches.rows.map((row, i) => (
                                        <tr
                                            key={row.change}
                                            className={i % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-900/10'}
                                        >
                                            <td className="px-4 py-4 text-sm text-gray-100 align-top leading-snug">
                                                {row.change}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600 align-top">
                                                {row.textDiff}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600 align-top">
                                                {row.passFail}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-brand-200 align-top leading-snug">
                                                {row.sift}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    </div>
                </section>

                {/* § 4 — Free, forever */}
                <section className="relative py-24 sm:py-28 border-b border-gray-800/60">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeUp}>
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-700/30 mb-4">
                                <BadgeCheck className="w-5 h-5" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-5">
                                {s.free.title}
                            </h2>
                            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-7">
                                {s.free.body}
                            </p>
                            <Link
                                to="/tiers"
                                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-gradient-to-r from-brand-600 to-orange-500 text-white text-sm font-semibold shadow-md shadow-brand-700/30 hover:shadow-brand-700/50 hover:scale-[1.02] transition-all"
                            >
                                {s.free.cta}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* § 5 — Deterministic · on-prem */}
                <section className="relative py-24 sm:py-28 border-b border-gray-800/60">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeUp}>
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-700/30 mb-4">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-5">
                                {s.trust.title}
                            </h2>
                            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-7">
                                {s.trust.body}
                            </p>
                            <Link
                                to="/how-we-build"
                                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full border border-gray-700 text-gray-200 text-sm font-semibold hover:border-brand-700/60 hover:text-white transition-colors"
                            >
                                {s.trust.cta}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* § 6 — Install */}
                <section id="install" className="relative py-24 sm:py-28 scroll-mt-20">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeUp}>
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-700/30 mb-4">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-10">
                                {s.install.title}
                            </h2>
                        </motion.div>

                        <motion.div {...fadeUp} className="space-y-8">
                            <div>
                                <div className="flex items-baseline gap-2 mb-3">
                                    <span className="font-display font-semibold text-white">
                                        {s.install.actionLabel}
                                    </span>
                                </div>
                                <CodeBlock code={ACTION_YAML} />
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2 mb-3">
                                    <span className="font-display font-semibold text-white">
                                        {s.install.cliLabel}
                                    </span>
                                    <span className="text-xs text-gray-500 italic">
                                        {s.install.cliLead}
                                    </span>
                                </div>
                                <CodeBlock code={CLI_BLOCK} />
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
