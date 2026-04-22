import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Play, Circle } from 'lucide-react'
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

export default function ProductShowcase() {
    const t = useTranslation()
    const [feed, setFeed] = useState<FakeLog[]>([])

    useEffect(() => {
        let i = 0
        let cancelled = false
        const tick = () => {
            if (cancelled) return
            const sample = LOG_POOL[i % LOG_POOL.length]
            if (sample) {
                setFeed((prev) => {
                    const next = [...prev, sample]
                    if (next.length > 11) next.shift()
                    return next
                })
            }
            i++
            // Speed up around the cascade for visual drama.
            const delay = i > 5 && i < 14 ? 320 : 700
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* YAML pane */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="rounded-2xl bg-gray-900/80 border border-gray-800 overflow-hidden shadow-2xl shadow-black/40"
                    >
                        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-800 bg-gray-900/60">
                            <Circle className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                            <Circle className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            <Circle className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
                            <span className="ml-3 font-mono text-[11px] text-gray-500">
                                {t.showcase.yamlLabel}
                            </span>
                        </div>
                        <pre className="px-4 py-4 font-mono text-[12px] leading-[1.55] text-gray-300 overflow-x-auto min-h-[420px]">
                            {YAML_LINES.map((line, i) => (
                                <div key={i} className={line.cls}>
                                    {line.text || '\u00A0'}
                                </div>
                            ))}
                        </pre>
                    </motion.div>

                    {/* Live tail pane */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="rounded-2xl bg-gray-900/80 border border-gray-800 overflow-hidden shadow-2xl shadow-black/40"
                    >
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-gray-900/60">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="font-mono text-[11px] text-gray-500">
                                    {t.showcase.logsLabel}
                                </span>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/40">
                                SIMULATED
                            </span>
                        </div>
                        <div className="px-3 py-3 font-mono text-[11.5px] leading-[1.7] min-h-[420px] flex flex-col justify-end">
                            {feed.map((l, i) => (
                                <motion.div
                                    key={`${i}-${l.ts}`}
                                    initial={{ opacity: 0, x: 8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.18 }}
                                    className="flex gap-3 px-1 py-0.5"
                                >
                                    <span className="text-gray-600 shrink-0">{l.ts}</span>
                                    <span className="text-purple-400 shrink-0 w-16 truncate">
                                        {l.agent}
                                    </span>
                                    <span className={`shrink-0 w-10 ${LEVEL_COLORS[l.level]}`}>
                                        {l.level}
                                    </span>
                                    <span className="text-gray-300 truncate">{l.msg}</span>
                                </motion.div>
                            ))}
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
