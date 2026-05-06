import { create } from 'zustand'
import type { EngineSnapshot, InsightReport, InsightStatus, LogTailEntry } from '@/types/engine'

/**
 * Hard cap on the accumulated live log feed. Each snapshot ships the
 * last ~20 records; over a long run the buffer would grow without
 * bound, so we clip it to the most recent N entries. 1000 is comfy on
 * the DOM even without virtualisation.
 */
const kLiveTailCapacity = 1000
const kInsightReportCapacity = 200

/**
 * Deterministic fingerprint used to suppress the duplicates that
 * naturally occur when the server resends the same tail across two
 * consecutive snapshots.
 */
function tailKey(entry: LogTailEntry): string {
    return `${entry.timestamp}|${entry.agent}|${entry.level}|${entry.message}`
}

function insightKey(report: InsightReport): string {
    return [
        report.severity,
        report.headline,
        report.body,
        report.action_hint,
        report.affected_templates.join(','),
    ].join('|')
}

interface EngineState {
    engineId: string | null
    snapshot: EngineSnapshot | null
    /**
     * Rolling buffer of every log record the engine has streamed since
     * the dashboard mounted. Built by appending new snapshot tails while
     * deduping against what we already have — gives the playground a
     * true output feed instead of just the latest ~20 records.
     */
    liveTail: LogTailEntry[]
    liveTailKeys: Set<string>
    insightStatus: InsightStatus | null
    insightReports: InsightReport[]
    insightReportKeys: Set<string>
    insightLoading: boolean
    insightError: string | null
    insightLastLinesIngested: number
    connected: boolean
    selectedScenarioId: string | null
    scenarioYaml: string
    statusMessage: string | null

    setEngineId: (id: string | null) => void
    setSnapshot: (snapshot: EngineSnapshot | null) => void
    appendToLiveTail: (entries: LogTailEntry[]) => void
    clearLiveTail: () => void
    setInsightStatus: (status: InsightStatus | null) => void
    appendInsightReports: (reports: InsightReport[], linesIngested: number) => void
    setInsightLoading: (loading: boolean) => void
    setInsightError: (error: string | null) => void
    clearInsightData: () => void
    setConnected: (connected: boolean) => void
    setSelectedScenarioId: (id: string | null) => void
    setScenarioYaml: (yaml: string) => void
    setStatusMessage: (msg: string | null) => void
    reset: () => void
}

export const useEngineStore = create<EngineState>((set) => ({
    engineId: null,
    snapshot: null,
    liveTail: [],
    liveTailKeys: new Set<string>(),
    insightStatus: null,
    insightReports: [],
    insightReportKeys: new Set<string>(),
    insightLoading: false,
    insightError: null,
    insightLastLinesIngested: 0,
    connected: false,
    selectedScenarioId: null,
    scenarioYaml: '',
    statusMessage: null,

    setEngineId: (id) => set({ engineId: id }),
    setSnapshot: (snapshot) => set({ snapshot }),
    appendToLiveTail: (entries) =>
        set((state) => {
            if (entries.length === 0) return {}
            // Append only records we haven't seen — dedupe on the
            // (timestamp, agent, level, message) tuple so re-sent tails
            // don't pollute the feed.
            const nextKeys = new Set(state.liveTailKeys)
            const appended: LogTailEntry[] = []
            for (const entry of entries) {
                const key = tailKey(entry)
                if (nextKeys.has(key)) continue
                nextKeys.add(key)
                appended.push(entry)
            }
            if (appended.length === 0) return {}
            const needsTrim =
                state.liveTail.length + appended.length > kLiveTailCapacity
            const combined = needsTrim
                ? [...state.liveTail, ...appended].slice(-kLiveTailCapacity)
                : [...state.liveTail, ...appended]
            // Only rebuild the key set when entries were evicted from the
            // buffer — those evicted entries may legitimately reappear and
            // should be re-shown. When no trim occurred, keep the full
            // nextKeys so pre-clear suppressions survive across snapshots.
            const finalKeys = needsTrim ? new Set(combined.map(tailKey)) : nextKeys
            return { liveTail: combined, liveTailKeys: finalKeys }
        }),
    clearLiveTail: () =>
        set((state) => ({
            liveTail: [],
            // Keep the seen-keys set intact so entries already displayed
            // are not re-admitted when the next snapshot arrives with the
            // same tail slice. Only genuinely new entries will appear.
            liveTailKeys: state.liveTailKeys,
        })),
    setInsightStatus: (status) => set({ insightStatus: status }),
    appendInsightReports: (reports, linesIngested) =>
        set((state) => {
            if (reports.length === 0) {
                return { insightLastLinesIngested: linesIngested }
            }
            const nextReports = [...state.insightReports]
            const nextKeys = new Set(state.insightReportKeys)
            for (const report of reports) {
                const key = insightKey(report)
                if (nextKeys.has(key)) continue
                nextKeys.add(key)
                nextReports.push(report)
            }
            const trimmed = nextReports.slice(-kInsightReportCapacity)
            return {
                insightReports: trimmed,
                insightReportKeys: new Set(trimmed.map(insightKey)),
                insightError: null,
                insightLastLinesIngested: linesIngested,
            }
        }),
    setInsightLoading: (loading) => set({ insightLoading: loading }),
    setInsightError: (error) => set({ insightError: error }),
    clearInsightData: () =>
        set({
            insightStatus: null,
            insightReports: [],
            insightReportKeys: new Set<string>(),
            insightLoading: false,
            insightError: null,
            insightLastLinesIngested: 0,
        }),
    setConnected: (connected) => set({ connected }),
    setSelectedScenarioId: (id) => set({ selectedScenarioId: id }),
    setScenarioYaml: (yaml) => set({ scenarioYaml: yaml }),
    setStatusMessage: (msg) => set({ statusMessage: msg }),
    reset: () =>
        set({
            engineId: null,
            snapshot: null,
            liveTail: [],
            liveTailKeys: new Set<string>(),
            insightStatus: null,
            insightReports: [],
            insightReportKeys: new Set<string>(),
            insightLoading: false,
            insightError: null,
            insightLastLinesIngested: 0,
            connected: false,
            statusMessage: null,
        }),
}))

