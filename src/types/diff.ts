// Types for the insight_diff hosted demo (POST /api/v1/insight/diff).
// Mirrors insight::sift::to_json_with_markdown: the ChangeReport schema plus the markdown field,
// produced by the same aligned entry the sift CLI runs (ADR-14.D7).

export interface DiffRequest {
    baseline: string
    changed: string
}

export interface DiffSummary {
    total_changes: number
    significant_changes: number
    js_divergence?: number
    stability_score?: number
}

export type DiffSeverity = 'low' | 'medium' | 'high' | 'critical'
export type DiffPolarity = 'regression' | 'recovery' | 'neutral'

export interface DiffRankedChange {
    kind: string
    severity: DiffSeverity
    // Direction of the change: 'recovery' (an error cleared — rendered green),
    // 'regression' (a new error — severity heat), or 'neutral'. Absent ⇒ neutral.
    polarity?: DiffPolarity
    significance: number
    template_id?: string
    summary: string
    evidence?: string[]
    // 0-based source-line indices this change occupies in each pane (over the
    // lines as split for ingest). new_template → changed only; vanished → baseline.
    baseline_line_refs?: number[]
    changed_line_refs?: number[]
}

export interface DiffInputProvenance {
    label: string
    lines_observed: number
    // Omitted when the producing path did not measure it — the aligned entry never does
    // (ADR-14.D3's omission rule) — so no consumer may treat it as present.
    unique_templates?: number
}

export interface ChangeReportResponse {
    report_version: string
    summary: DiffSummary
    ranked_changes: DiffRankedChange[]
    raw: unknown
    inputs: {
        baseline: DiffInputProvenance
        changed: DiffInputProvenance
    }
    markdown: string
}
