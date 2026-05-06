import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Activity, AlertTriangle, Brain, CheckCircle, FileText, Layers, Play, Search } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

// Static, hand-tuned YAML kept short for the visual; not parsed at runtime.
const YAML_LINES: { text: string; cls: string }[] = [
    { text: 'scenario:', cls: 'text-purple-300' },
    { text: '  name: shop-checkout', cls: 'text-gray-300' },
    { text: '  seed: 42', cls: 'text-gray-300' },
    { text: '', cls: '' },
    { text: 'agents:', cls: 'text-purple-300' },
    { text: '  - name: nginx', cls: 'text-amber-300' },
    { text: '    type: web_server', cls: 'text-gray-300' },
    { text: '    rate: 1200/s', cls: 'text-gray-300' },
    { text: '    p99: 220ms', cls: 'text-gray-300' },
    { text: '  - name: checkout', cls: 'text-amber-300' },
    { text: '    type: api', cls: 'text-gray-300' },
    { text: '    depends_on: [postgres]', cls: 'text-gray-300' },
    { text: '  - name: postgres', cls: 'text-amber-300' },
    { text: '    type: database', cls: 'text-gray-300' },
    { text: '', cls: '' },
    { text: 'incidents:', cls: 'text-purple-300' },
    { text: '  - at: 5m', cls: 'text-gray-300' },
    { text: '    target: postgres', cls: 'text-gray-300' },
    { text: '    error_rate: 0.20', cls: 'text-rose-300' },
    { text: '    latency_x: 8', cls: 'text-rose-300' },
    { text: '    auto_cascade: true', cls: 'text-rose-300' },
]

type FakeLog = { ts: string; agent: string; level: 'INFO' | 'WARN' | 'ERROR'; msg: string }

const LOG_POOL: FakeLog[] = [
    { ts: '12:04:21.118', agent: 'nginx', level: 'INFO', msg: 'GET /checkout 200 12ms' },
    { ts: '12:04:21.119', agent: 'checkout', level: 'INFO', msg: 'cart=u_84291 items=3 total=42.10' },
    { ts: '12:04:21.121', agent: 'postgres', level: 'INFO', msg: 'SELECT carts.* WHERE id=$1 (3 rows)' },
    { ts: '12:04:21.142', agent: 'nginx', level: 'INFO', msg: 'POST /pay 200 88ms' },
    { ts: '12:04:21.143', agent: 'checkout', level: 'INFO', msg: 'authorize ok provider=stripe' },
    { ts: '12:05:00.004', agent: 'postgres', level: 'WARN', msg: 'slow query 412ms (incident scheduled)' },
    { ts: '12:05:00.220', agent: 'postgres', level: 'ERROR', msg: 'connection reset by peer' },
    { ts: '12:05:00.221', agent: 'checkout', level: 'WARN', msg: 'db retry 1/3 — backoff 25ms' },
    { ts: '12:05:00.260', agent: 'checkout', level: 'ERROR', msg: 'cart_persist_failed cause=db' },
    { ts: '12:05:00.262', agent: 'nginx', level: 'WARN', msg: 'upstream 502 /pay (cascade depth=1)' },
    { ts: '12:05:00.301', agent: 'postgres', level: 'ERROR', msg: 'tx aborted query=insert orders' },
    { ts: '12:05:00.305', agent: 'nginx', level: 'ERROR', msg: 'GET /checkout 503 110ms' },
]

const LEVEL_COLORS: Record<FakeLog['level'], string> = {
    INFO: 'text-blue-400',
    WARN: 'text-amber-400',
    ERROR: 'text-rose-400',
}

const PIPELINE = [
    { label: 'Ingest', icon: <Activity className="w-3.5 h-3.5" /> },
    { label: 'Templates', icon: <Search className="w-3.5 h-3.5" /> },
    { label: 'MetaLog', icon: <Layers className="w-3.5 h-3.5" /> },
    { label: 'Detect', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { label: 'Explain', icon: <Brain className="w-3.5 h-3.5" /> },
]

const EVIDENCE = ['T17 postgres slow query', 'T42 checkout db retry', 'T51 nginx upstream 5xx']

export default function ProductShowcase() {
    const t = useTranslation()
    const [feed, setFeed] = useState<FakeLog[]>([])
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom on every new log line
    useEffect(() => {
        const el = scrollRef.current
        if (el) {
            el.scrollTop = el.scrollHeight
        }
    }, [feed])

    useEffect(() => {
        let index = 0
        let cancelled = false
        const tick = () => {
            if (cancelled) return
            const sample = LOG_POOL[index % LOG_POOL.length]
            if (sample) {
                setFeed((prev) => [...prev, sample].slice(-16))
            }
            index += 1
            const delay = index > 3 && index < 11 ? 300 : 650
            window.setTimeout(tick, delay)
        }
        const handle = window.setTimeout(tick, 400)
        return () => {
            cancelled = true
            window.clearTimeout(handle)
        }
    }, [])

    return (
        <section id="product" className="relative py-24 sm:py-28 bg-gray-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mb-10"
                >
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-4">
                        {t.showcase.title}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                        {t.showcase.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="rounded-2xl bg-gray-900/80 border border-gray-800 overflow-hidden shadow-2xl shadow-black/40"
                    >
                        <PanelHeader label={t.showcase.yamlLabel} />
                        <pre className="px-4 py-4 font-mono text-[12px] leading-[1.55] text-gray-300 overflow-x-auto min-h-[430px]">
                            {YAML_LINES.map((line, i) => (
                                <div key={i} className={line.cls}>
                                    {line.text || '\u00A0'}
                                </div>
                            ))}
                        </pre>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="space-y-4"
                    >
                        <div className="rounded-2xl bg-gray-900/80 border border-gray-800 overflow-hidden shadow-2xl shadow-black/40">
                            <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-gray-800 bg-gray-900/60">
                                <div className="flex items-center gap-2 min-w-0">
                                    <Brain className="w-4 h-4 text-brand-400 shrink-0" />
                                    <span className="font-mono text-[11px] text-gray-500 truncate">
                                        insight_explain.json
                                    </span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                                    LIVE API
                                </span>
                            </div>

                            <div className="p-4 space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {PIPELINE.map((stage) => (
                                        <span
                                            key={stage.label}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-[11px] font-semibold text-brand-200"
                                        >
                                            {stage.icon}
                                            {stage.label}
                                        </span>
                                    ))}
                                </div>

                                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-200">
                                                <AlertTriangle className="w-3 h-3" />
                                                High severity
                                            </span>
                                            <h3 className="mt-3 text-lg font-display font-semibold leading-tight text-white">
                                                Checkout failures are cascading from postgres latency.
                                            </h3>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <div className="font-mono text-2xl font-bold text-white">91%</div>
                                            <div className="text-[10px] uppercase tracking-wide text-gray-500">
                                                confidence
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm leading-relaxed text-gray-300">
                                        InSight matched a new postgres slow-query template, then saw checkout retries and nginx 5xx responses mature in the same MetaLog window.
                                    </p>
                                    <div className="mt-4 rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3">
                                        <div className="text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                                            Action hint
                                        </div>
                                        <p className="mt-1 text-xs leading-relaxed text-emerald-100">
                                            Isolate the postgres write path and throttle checkout retry pressure before the web tier amplifies the failure.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <EvidenceBlock title="Affected templates" values={EVIDENCE} />
                                    <EvidenceBlock
                                        title="Explain packet"
                                        values={['MetaLog window: 5m', 'detectors: ADWIN + CUSUM', 'lines ingested: 4.2k']}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-gray-900/80 border border-gray-800 overflow-hidden shadow-2xl shadow-black/40">
                            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-gray-900/60">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                                    <span className="font-mono text-[11px] text-gray-500 truncate">
                                        {t.showcase.logsLabel}
                                    </span>
                                </div>
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div
                                ref={scrollRef}
                                className="px-3 py-3 font-mono text-[11.5px] leading-[1.7] h-[190px] overflow-y-auto scroll-smooth flex flex-col"
                                style={{ scrollbarWidth: 'none' }}
                            >
                                {feed.map((line, i) => (
                                    <motion.div
                                        key={`${i}-${line.ts}`}
                                        initial={{ opacity: 0, x: 8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.18 }}
                                        className="flex gap-3 px-1 py-0.5 min-w-0"
                                    >
                                        <span className="text-gray-600 shrink-0">{line.ts}</span>
                                        <span className="text-purple-400 shrink-0 w-16 truncate">
                                            {line.agent}
                                        </span>
                                        <span className={`shrink-0 w-10 ${LEVEL_COLORS[line.level]}`}>
                                            {line.level}
                                        </span>
                                        <span className="text-gray-300 truncate">{line.msg}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-8 text-center">
                    <Link
                        to="/lab"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transition-all"
                    >
                        <Play className="w-4 h-4" />
                        {t.showcase.cta}
                    </Link>
                </div>
            </div>
        </section>
    )
}

function PanelHeader({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-800 bg-gray-900/60">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="font-mono text-[11px] text-gray-500">{label}</span>
        </div>
    )
}

function EvidenceBlock({ title, values }: { title: string; values: string[] }) {
    return (
        <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-3">
            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                {title}
            </div>
            <div className="mt-2 space-y-1.5">
                {values.map((value) => (
                    <div
                        key={value}
                        className="rounded border border-gray-800 bg-gray-900/70 px-2 py-1 font-mono text-[11px] text-gray-300 truncate"
                    >
                        {value}
                    </div>
                ))}
            </div>
        </div>
    )
}
