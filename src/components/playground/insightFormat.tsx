import { AlertTriangle, Brain } from 'lucide-react'
import type { InsightReport } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'

// Pure helpers behind the InSight panel: value formatting and the severity /
// signal style lookups. No component state, no JSX beyond the two severity
// icons — so every function here is directly testable without rendering.

/** The `lab.insight` translation subtree, spelled once instead of at each call site. */
export type InsightCopy = ReturnType<typeof useTranslation>['lab']['insight']

export function severityStyle(severity: string) {
    const normalized = severity.toLowerCase()
    if (normalized.includes('critical') || normalized.includes('fatal') || normalized.includes('high')) {
        return {
            card: 'border-red-500/35 bg-red-500/10',
            badge: 'border-red-500/45 bg-red-500/20 text-red-200',
            text: 'text-red-300',
            icon: <AlertTriangle className="w-3 h-3" />,
        }
    }
    if (normalized.includes('warn') || normalized.includes('medium')) {
        return {
            card: 'border-amber-500/35 bg-amber-500/10',
            badge: 'border-amber-500/45 bg-amber-500/20 text-amber-200',
            text: 'text-amber-300',
            icon: <AlertTriangle className="w-3 h-3" />,
        }
    }
    return {
        card: 'border-blue-500/30 bg-blue-500/10',
        badge: 'border-blue-500/40 bg-blue-500/20 text-blue-200',
        text: 'text-blue-300',
        icon: <Brain className="w-3 h-3" />,
    }
}

export function detectionSignalStyle(score: number) {
    if (score >= 0.9) {
        return {
            card: 'border-red-500/35 bg-red-500/8',
            badge: 'border-red-500/40 bg-red-500/15 text-red-300',
        }
    }
    if (score >= 0.6) {
        return {
            card: 'border-amber-500/35 bg-amber-500/8',
            badge: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
        }
    }
    return {
        card: 'border-blue-500/30 bg-blue-500/8',
        badge: 'border-blue-500/35 bg-blue-500/15 text-blue-300',
    }
}

export function explainModeLabel(
    mode: string,
    copy: ReturnType<typeof useTranslation>['lab']['insight'],
): string {
    if (mode === 'llm_augmented') return copy.sourceAugmented
    if (mode === 'llm_full') return copy.sourceFull
    if (mode === 'rules') return copy.sourceRules
    return copy.sourceUnknown
}

export function unique(values: string[]): string[] {
    return [...new Set(values.filter(Boolean))]
}

export function formatCompact(value: number): string {
    if (value < 1000) return String(value)
    if (value < 1_000_000) return `${(value / 1000).toFixed(value < 10_000 ? 1 : 0)}k`
    return `${(value / 1_000_000).toFixed(1)}M`
}

export function formatPercent(value: number): string {
    const normalized = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0
    return `${Math.round(normalized * 100)}%`
}

export function insightCardKey(report: InsightReport): string {
    return `${report.severity}|${report.headline}|${report.body}`
}

export function formatSimTime(iso: string | undefined): string {
    if (!iso) return '?'
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso.slice(11, 19) || iso
    return d.toISOString().slice(11, 19) // HH:MM:SS UTC
}

/** Format seconds as a compact duration string: e.g. 90s → "1m 30s", 3700s → "1h 1m" */

export function formatDuration(seconds: number): string {
    const s = Math.round(seconds)
    if (s < 60) return `${s}s`
    const m = Math.floor(s / 60)
    const rem = s % 60
    if (m < 60) return rem > 0 ? `${m}m ${rem}s` : `${m}m`
    const h = Math.floor(m / 60)
    const mRem = m % 60
    return mRem > 0 ? `${h}h ${mRem}m` : `${h}h`
}

/** Small stamp showing Window #N and/or HH:MM:SS → HH:MM:SS, shown top-right of tab headers. */
