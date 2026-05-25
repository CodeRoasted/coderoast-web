// Types for the insight_diff hosted demo (POST /api/v1/insight/diff).
// Mirrors insight::diff::to_json (the ChangeReport schema) + the markdown field.

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

export interface DiffRankedChange {
    kind: string
    severity: DiffSeverity
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
    unique_templates: number
    window_start_iso: string
    window_end_iso: string
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
