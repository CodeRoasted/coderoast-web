import { useEffect, useMemo, useState } from 'react'
import { ScrollText, AlertTriangle, Brain, Radio } from 'lucide-react'
import LogTail from './LogTail'
import IncidentTimeline from './IncidentTimeline'
import DrainPanel from './DrainPanel'
import InsightPanel from './InsightPanel'
import { hasDemoHttpSink } from './drainUtils'
import { useTranslation } from '@/hooks/useTranslation'
import type { EngineSnapshot, InsightReport, InsightStatus, LogTailEntry } from '@/types/engine'

interface Props {
    engineId: string | null
    snapshot: EngineSnapshot | null
    liveTail: LogTailEntry[]
    clearLiveTail: () => void
    agentNames: string[]
    insightStatus: InsightStatus | null
    insightReports: InsightReport[]
    insightLoading: boolean
    insightError: string | null
}

type TabKey = 'insight' | 'logs' | 'incidents' | 'drain'

/// Tabbed observation column.
///
/// Rationale: during execution the operator only watches one stream at
/// a time (logs flowing, an incident landing, a payload showing up).
/// Stacking three independent panels in the same column either crams
/// each into 256px of vertical space or forces the user to scroll past
/// quiet ones. Tabs give whichever stream is in focus the full column
/// height while keeping the other two one click away with a badge for
/// new content.
export default function ObservationPanel({
    engineId,
    snapshot,
    liveTail,
    clearLiveTail,
    agentNames,
    insightStatus,
    insightReports,
    insightLoading,
    insightError,
}: Props) {
    const t = useTranslation()
    const sinks = useMemo(() => snapshot?.sinks ?? [], [snapshot?.sinks])
    const showDrain = useMemo(() => hasDemoHttpSink(sinks), [sinks])

    const [active, setActive] = useState<TabKey>('insight')
    const [drainCounts, setDrainCounts] = useState({ total: 0, filtered: 0, dropped: 0 })

    // If the demo sink disappears (engine destroyed / scenario swap),
    // the Drain tab dismounts — bounce focus back to the always-on
    // Logs tab so the user isn't stranded on an empty pane.
    useEffect(() => {
        if (!showDrain && active === 'drain') setActive('logs')
    }, [showDrain, active])

    const incidents = snapshot?.incidents ?? []
    const totalEntries = snapshot?.total_entries ?? 0

    return (
        <div className="bg-gray-900/40 border border-gray-700/50 rounded-xl overflow-hidden flex flex-col h-full min-h-0">
            {/* Tab strip */}
            <div role="tablist" className="flex items-stretch border-b border-gray-700/50 shrink-0">
                <TabButton
                    active={active === 'insight'}
                    onClick={() => setActive('insight')}
                    icon={<Brain className="w-3.5 h-3.5" />}
                    label={t.lab.insight.tab}
                    badge={insightReports.length > 0 ? String(insightReports.length) : undefined}
                    badgeAccent={insightReports.length > 0 ? 'brand' : undefined}
                />
                <TabButton
                    active={active === 'logs'}
                    onClick={() => setActive('logs')}
                    icon={<ScrollText className="w-3.5 h-3.5" />}
                    label={t.lab.logTail}
                    badge={totalEntries > 0 ? formatBadge(totalEntries) : undefined}
                />
                <TabButton
                    active={active === 'incidents'}
                    onClick={() => setActive('incidents')}
                    icon={<AlertTriangle className="w-3.5 h-3.5" />}
                    label={t.lab.incidents}
                    badge={incidents.length > 0 ? String(incidents.length) : undefined}
                    badgeAccent={incidents.length > 0 ? 'red' : undefined}
                />
                {showDrain && (
                    <TabButton
                        active={active === 'drain'}
                        onClick={() => setActive('drain')}
                        icon={<Radio className="w-3.5 h-3.5" />}
                        label={t.lab.drain.title}
                        badge={drainCounts.total > 0 ? formatBadge(drainCounts.total) : undefined}
                        badgeAccent="amber"
                    />
                )}
            </div>

            {/* Tab bodies. We keep the inactive tabs mounted (display:none)
                so their pollers / scroll positions / filter state survive
                a tab switch — that's what operators expect from a
                multi-stream console. */}
            <div className="flex-1 min-h-0 relative">
                <TabPane active={active === 'insight'}>
                    <InsightPanel
                        status={insightStatus}
                        reports={insightReports}
                        loading={insightLoading}
                        error={insightError}
                    />
                </TabPane>
                <TabPane active={active === 'logs'}>
                    <LogTail
                        entries={liveTail}
                        totalEntries={totalEntries}
                        onClear={clearLiveTail}
                        agentNames={agentNames}
                    />
                </TabPane>
                <TabPane active={active === 'incidents'}>
                    <IncidentTimeline incidents={incidents} />
                </TabPane>
                {showDrain && (
                    <TabPane active={active === 'drain'}>
                        <DrainPanel
                            engineId={engineId}
                            sinks={sinks}
                            onCountsChange={setDrainCounts}
                        />
                    </TabPane>
                )}
            </div>
        </div>
    )
}

interface TabButtonProps {
    active: boolean
    onClick: () => void
    icon: React.ReactNode
    label: string
    badge?: string
    badgeAccent?: 'amber' | 'red' | 'brand'
}

function TabButton({ active, onClick, icon, label, badge, badgeAccent }: TabButtonProps) {
    const base =
        'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px'
    const state = active
        ? 'text-gray-100 border-brand-500 bg-gray-900/60'
        : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-gray-800/30'
    const badgeClass =
        badgeAccent === 'red'
            ? 'bg-red-500/20 text-red-300 border-red-500/40'
            : badgeAccent === 'amber'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : badgeAccent === 'brand'
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                    : 'bg-gray-800 text-gray-400 border-gray-700'
    return (
        <button
            type="button"
            role="tab"
            aria-selected={active}
            onClick={onClick}
            className={`${base} ${state}`}
        >
            <span className={active ? 'text-brand-400' : ''}>{icon}</span>
            <span className="truncate">{label}</span>
            {badge && (
                <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${badgeClass}`}
                >
                    {badge}
                </span>
            )}
        </button>
    )
}

function TabPane({ active, children }: { active: boolean; children: React.ReactNode }) {
    // Keep mounted but hidden — preserves polling, scroll, filter state
    // across tab switches without losing realtime data.
    return (
        <div className={`absolute inset-0 ${active ? '' : 'hidden'}`} role="tabpanel">
            {children}
        </div>
    )
}

function formatBadge(n: number): string {
    if (n < 1000) return String(n)
    if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`
    return `${(n / 1_000_000).toFixed(1)}M`
}
