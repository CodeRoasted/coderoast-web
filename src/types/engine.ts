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

export interface EngineInfo {
    id: string
    running: boolean
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
    explain_mode?: InsightExplainMode
    llm_enabled?: boolean
    llm_model?: string
    window_count?: number
    lines_ingested?: number
    insight_revision?: number
    updated_unix_ms?: number
}

export interface InsightStatus {
    engine_id: string
    running: boolean
    lines_ingested: number
    insight_revision?: number
    llm_running?: boolean
    explain_mode?: InsightExplainMode
    llm_enabled?: boolean
    llm_model?: string
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
    llm_model?: string
}
