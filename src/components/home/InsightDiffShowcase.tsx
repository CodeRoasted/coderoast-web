import { motion } from 'framer-motion'
import { ArrowRight, GitCompareArrows } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'

// Illustrative sample of a /diff result — a failing CI run vs the last green
// one. Hardcoded product mock (not live), kept in the visitor's language: CI
// runs, pytest, endpoints. No observability / on-call / determinism jargon here.
const SAMPLE_ROWS = [
    {
        severity: 'high',
        badge: 'HIGH',
        text: 'New error: connection refused to db host 10.0.0.x:5432',
        sub: 'appears 31× on the failing run, absent on green',
    },
    {
        severity: 'medium',
        badge: 'MED',
        text: 'New: tests/test_orders.py::test_checkout FAILED',
        sub: '7× — a whole test file went red',
    },
    {
        severity: 'low',
        badge: 'LOW',
        text: 'Frequency shift: "GET /health 200" 31% → 18%',
        sub: 'pass-rate dilution from the new failures',
    },
] as const

const BADGE_STYLE: Record<string, string> = {
    high: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
    medium: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40',
    low: 'bg-gray-500/15 text-gray-300 border-gray-500/40',
}

function SampleReport() {
    return (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/70 shadow-xl shadow-black/30 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-800 bg-gray-900">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 font-mono text-xs text-gray-500">
                    insight-diff green.log fail.log
                </span>
            </div>
            <div className="p-5">
                <p className="text-lg font-bold text-white">
                    847 changes, <span className="text-brand-400">3</span> structurally significant
                </p>
                <p className="text-xs text-gray-500 mt-0.5">stability 0.71 · 12,040 → 13,118 lines</p>
                <ul className="mt-4 space-y-3">
                    {SAMPLE_ROWS.map((row) => (
                        <li key={row.text} className="flex gap-2.5">
                            <span
                                className={`mt-0.5 px-1.5 py-0.5 h-fit rounded text-[10px] font-semibold border ${BADGE_STYLE[row.severity]}`}
                            >
                                {row.badge}
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm text-gray-100 leading-snug break-words">{row.text}</p>
                                <p className="text-xs text-gray-500 font-mono break-words">{row.sub}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <p className="mt-4 pt-3 border-t border-gray-800 text-xs text-gray-600 italic">
                    844 changes suppressed as noise (proportional / low-frequency)
                </p>
            </div>
        </div>
    )
}

export default function InsightDiffShowcase() {
    const t = useTranslation()
    return (
        <section
            id="insight-diff"
            className="relative py-24 sm:py-28 bg-gray-950 border-b border-gray-800/60"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-brand-500/10 border border-brand-700/40 text-brand-300 text-xs font-semibold">
                        <GitCompareArrows className="w-3.5 h-3.5" />
                        {t.diffShowcase.eyebrow}
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-4">
                        {t.diffShowcase.title}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-7">
                        {t.diffShowcase.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                        <Link
                            to="/diff"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-600 to-orange-500 text-white font-semibold shadow-lg shadow-brand-700/30 hover:shadow-brand-700/50 hover:scale-[1.02] transition-all"
                        >
                            <GitCompareArrows className="w-4 h-4" />
                            {t.diffShowcase.cta}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <span className="text-xs text-gray-500">{t.diffShowcase.note}</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <SampleReport />
                </motion.div>
            </div>
        </section>
    )
}
