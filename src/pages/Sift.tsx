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
import { groupThousands } from '@/utils/format'

// Sift product front door (/sift). Copy is surfaced via t.sift and bounded by the Sift study of
// 2026-10-22, § 4.2 (what a committed record backs): the page leads with the red build (RUL-171),
// the green-run reveal is demoted, and every number on it comes from FIGURES below, which links
// each one to its record in the page's records section. The mocks (PR comment, install blocks)
// reproduce real engine / Action output verbatim — language-neutral, so they live here as
// constants rather than in i18n (the engine emits English regardless of the visitor's locale).

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
}

type Translation = ReturnType<typeof useTranslation>

// The record each figure cites, in footnote order. The texts live in t.sift.records.
const RECORDS = ['recall', 'falseAlarm', 'determinism', 'wallTime'] as const
type RecordId = (typeof RECORDS)[number]
const recordAnchor = (id: RecordId) => `sift-record-${id}`

// The page's numbers, each beside the record that measured it (t.sift.records names engine, bank,
// date and record). The Action's floating @v2 runs sift 1.10.6, so the figures are 1.10.6's.
const FIGURES: { id: RecordId; value: string; label: (t: Translation) => string }[] = [
    {
        id: 'recall',
        value: `${groupThousands(233)} / ${groupThousands(239)}`,
        label: (t) => t.sift.figures.recall,
    },
    {
        id: 'falseAlarm',
        value: `${groupThousands(275)} / ${groupThousands(21264)}`,
        label: (t) => t.sift.figures.falseAlarm.replace('{ceiling}', groupThousands(570)),
    },
    {
        id: 'determinism',
        value: `${groupThousands(21264)} / ${groupThousands(21264)}`,
        label: (t) => t.sift.figures.determinism,
    },
    {
        id: 'wallTime',
        value: `${groupThousands(2680)} ms`,
        label: (t) => t.sift.figures.wallTime.replace('{slow}', `${groupThousands(3830)} ms`),
    },
]

// PR comment showcase: the Action's red-build frame (sift-action frame.ts, the run-verdict
// regression headline and its severity section) around the engine's FAILING unit row.
const COMMENT = {
    header: '🔬 Sift — structural diff of your CI logs',
    verdict: '🚨 Run verdict regressed: SUCCESS → FAILURE.',
    section: '🟥 CRITICAL — 1 change',
    row: '1. [regression] Failing: "build" — this unit of work changed outcome',
    footer: 'Deterministic — same inputs, same comment. Runs in your CI; your logs never leave it.',
} as const

// Install blocks. Both reproduce the sift-action README: the Action on its published major
// (`v2`, turnkey `target-job` — Sift pulls the finished job's log off the API) and the
// `install.sh` CLI one-liner.
const ACTION_YAML = `- uses: CodeRoasted/sift-action@v2
  with:
    target-job: build   # Sift pulls that finished job's log off the API`

const CLI_BLOCK = `curl -fsSL https://raw.githubusercontent.com/CodeRoasted/sift-action/main/install.sh | sh
sift baseline.log changed.log`

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

function RecordLink({ id }: { id: RecordId }) {
    const t = useTranslation()
    const number = RECORDS.indexOf(id) + 1
    return (
        <a
            href={`#${recordAnchor(id)}`}
            aria-label={`${t.sift.figures.recordLink} ${number}`}
            className="ml-1 align-super text-[10px] font-semibold text-brand-400 hover:text-brand-300"
        >
            [{number}]
        </a>
    )
}

function FiguresCard() {
    const t = useTranslation()
    return (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/70 shadow-xl shadow-black/30 p-5 sm:p-6">
            <p className="font-display font-semibold text-white">{t.sift.figures.title}</p>
            <p className="mt-1 text-xs text-gray-500 leading-relaxed">{t.sift.figures.lead}</p>
            <ul className="mt-5 space-y-4">
                {FIGURES.map((figure) => (
                    <li key={figure.id} data-figure={figure.id} className="flex flex-col gap-0.5">
                        <span className="font-mono text-xl font-bold text-brand-300 whitespace-nowrap">
                            {figure.value}
                            <RecordLink id={figure.id} />
                        </span>
                        <span className="text-sm text-gray-300 leading-snug">{figure.label(t)}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function PrComment() {
    return (
        <CardChrome label="github.com · pull request #128">
            <div className="p-5 font-mono text-sm leading-relaxed">
                <p className="text-gray-200 font-semibold">{COMMENT.header}</p>
                <p className="mt-4 text-rose-300 font-semibold break-words">{COMMENT.verdict}</p>
                <p className="mt-3 text-gray-300 font-semibold break-words">{COMMENT.section}</p>
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
                            <FiguresCard />
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

                {/* § 3 — On a green build: demoted until graded drift exists (RUL-171, RUL-137) */}
                <section className="relative py-16 sm:py-20 border-b border-gray-800/60">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeUp}>
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800/60 text-gray-400 border border-gray-700/60 mb-4">
                                <Search className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight mb-4">
                                {s.green.title}
                            </h2>
                            <p className="text-base text-gray-400 leading-relaxed">{s.green.body}</p>
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
                <section id="install" className="relative py-24 sm:py-28 scroll-mt-20 border-b border-gray-800/60">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeUp}>
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-700/30 mb-4">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-4">
                                {s.install.title}
                            </h2>
                            <p className="text-sm text-gray-400 mb-10">{s.install.beta}</p>
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

                {/* § 7 — The records every figure on the page cites */}
                <section id="records" className="relative py-16 sm:py-20 scroll-mt-20">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-xl font-display font-semibold text-white mb-2">{s.records.title}</h2>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">{s.records.lead}</p>
                        <ol className="space-y-3">
                            {RECORDS.map((id, index) => (
                                <li
                                    key={id}
                                    id={recordAnchor(id)}
                                    className="flex gap-3 scroll-mt-24 text-sm text-gray-400 leading-relaxed"
                                >
                                    <span className="shrink-0 font-semibold text-brand-400">[{index + 1}]</span>
                                    <span>{s.records[id]}</span>
                                </li>
                            ))}
                        </ol>
                        <p className="mt-6 text-sm text-gray-500 leading-relaxed">{s.records.scope}</p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
