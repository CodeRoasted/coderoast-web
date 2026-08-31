export type HealthState = 'Healthy' | 'Degraded' | 'Failing' | 'Recovering'
export type LogLevelName = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL'
export type EngineMode = 'real' | 'deterministic' | (string & {})
export type ClockMode = 'real' | 'virtual' | (string & {})
export type PlaybackState = 'playing' | 'paused' | 'stopped' | (string & {})

export interface AgentSnapshot {
    name: string
    type: string
    rate_rps: number
    error_ratio: number
    p50_latency: number
    p95_latency: number
    p99_latency: number
    health: HealthState
    phase: string
    incident_active: boolean
    cascade_active: boolean
    dependencies: string[]
}

export interface SinkSnapshot {
    name: string
    type: string
    target: string
    format: string
    write_rps: number
    total_written: number
    backlog: number
    error_count: number
    last_http_status: number
    last_error: string
    response_codes: [number, number][]
}

export interface IncidentSnapshot {
    offset_seconds: number
    name: string
    event: string
    details: string
}

export interface LogTailEntry {
    timestamp: string
    agent: string
    level: LogLevelName
    message: string
}

export interface EngineSnapshot {
    scenario_name: string
    seed: number
    has_seed: boolean
    engine_mode: EngineMode
    replay_mode: boolean
    has_cascade: boolean
    clock_mode: ClockMode
    playback_state: PlaybackState
    speed_multiplier: number
    duration_seconds: number
    elapsed_seconds: number
    wall_elapsed_seconds: number
    simulation_elapsed_seconds: number
    remaining_seconds: number
    simulation_now_unix_ns: number
    state: string
    queue_backlog: number
    throughput_rps: number
    error_ratio: number
    total_entries: number
    agents: AgentSnapshot[]
    sinks: SinkSnapshot[]
    incidents: IncidentSnapshot[]
    tail: LogTailEntry[]
}

export type InsightSeverity =
    | 'Info'
    | 'Low'
    | 'Medium'
    | 'Warning'
    | 'High'
    | 'Critical'
    | (string & {})

export type InsightExplainMode = 'rules' | 'llm_augmented' | 'llm_full' | (string & {})

export interface InsightReport {
    headline: string
    body: string
    severity: InsightSeverity
    confidence: number
    action_hint: string
    affected_templates: string[]
    supporting_evidence: string[]
    /**
     * Cross-window incident identity: every alert about one incident carries the same id, in any
     * window. This is the key a consumer folds on.
     *
     * An EMPTY string is a declared state, not a missing field — a window-level incident has no
     * cross-window subject and therefore no identity, so never group on the empty value.
     */
    dedup_id: string
    explain_mode?: InsightExplainMode
    llm_enabled?: boolean
    /** Narration destination, HOST only — absent when nothing is sent. */
    llm_host?: string
    llm_model?: string
    window_count?: number
    configured_window_duration_seconds?: number
    lines_ingested?: number
    insight_revision?: number
    updated_unix_ms?: number
}

export interface InsightReconfigureRequest {
    explain_mode?: InsightExplainMode
    min_confidence?: number
    max_insights?: number
    llm_model?: string
    window_duration_seconds?: number
}

export interface InsightReconfigureResponse {
    engine_id: string
    applied: Partial<InsightReconfigureRequest & { pyramid_reset: boolean }>
}

export interface InsightStatus {
    engine_id: string
    running: boolean
    lines_ingested: number
    insight_revision?: number
    llm_running?: boolean
    explain_mode?: InsightExplainMode
    llm_enabled?: boolean
    /** Narration destination, HOST only — absent when nothing is sent. */
    llm_host?: string
    llm_model?: string
    configured_window_duration_seconds?: number
    window_count?: number
    pyramid_maturity?: string
    windows_seen?: number
    updated_unix_ms?: number
    pyramid_warmup_windows?: number
}

export interface InsightReportsResponse {
    engine_id: string
    lines_ingested: number
    insights: InsightReport[]
    latest_insights?: InsightReport[]
    insight_revision?: number
    window_count?: number
    history_depth?: number
    history_limit?: number
    llm_running?: boolean
    explain_mode?: InsightExplainMode
    llm_enabled?: boolean
    /** Narration destination, HOST only — absent when nothing is sent. */
    llm_host?: string
    llm_model?: string
    latest_metalog?: MetaLogSummary | null
    latest_acute_diff?: AcuteDiffSummary | null
    latest_detection_reports?: DetectionReport[]
    latest_context_packets?: ContextPacket[]
    pyramid_maturity?: string
    windows_seen?: number
    pyramid_warmup_windows?: number
}

export interface DetectionReport {
    type: string
    template_id: string
    template: string
    observed_count: number
    score: number
    confidence: number
    scale: number
    evidence: string[]
}

export interface MetaLogWindowInfo {
    start: string
    end: string
    duration_seconds: number
    lines_observed: number
}

export interface MetaLogTopKEntry {
    template_id: string
    template: string
    count: number
    frequency: number
}

export interface MetaLogStats {
    unique_templates: number
    tail_count: number
    tail_unique: number
    entropy_bits?: number
    top_k: MetaLogTopKEntry[]
}

export interface MetaLogStability {
    js_divergence: number
    kl_divergence: number
    new_templates: number
    vanished_templates: number
    stability_score: number
}

export interface MetaLogSummary {
    version: string
    window: MetaLogWindowInfo
    stats: MetaLogStats
    stability?: MetaLogStability
}

export interface AcuteDiffSummary {
    version: string
    new_templates_count: number
    vanished_templates_count: number
    template_delta_count: number
    branching_delta_count: number
    field_histogram_delta_count: number
    js_divergence?: number
    kl_divergence?: number
    stability_score?: number
}

export interface ContextPacketAnnotation {
    pattern: string
    service_hint: string
    action_hint: string
    severity_override?: string
}

export interface ContextPacketTemplate {
    id: string
    template: string
    current_frequency: number
    previous_frequency: number
    current_count: number
    count_delta: number
    branching_entropy_delta_bits?: number
    annotation?: ContextPacketAnnotation
}

export interface ContextPacketWindow {
    lines_observed: number
    new_ngrams: string[]
    vanished_ngrams: string[]
    js_divergence?: number
    stability_score?: number
    new_templates?: number
    vanished_templates?: number
}

export interface ContextPacketIncident {
    class: string
    primary_template_id: string
    affected_templates: string[]
    confidence: number
    reports: DetectionReport[]
}

export interface ContextPacket {
    incident: ContextPacketIncident
    templates: ContextPacketTemplate[]
    window: ContextPacketWindow
}

export interface InsightLatestWindow {
    metalog: MetaLogSummary | null
    acuteDiff: AcuteDiffSummary | null
    detectionReports: DetectionReport[]
    contextPackets: ContextPacket[]
}
