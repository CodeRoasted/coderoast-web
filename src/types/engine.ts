export type HealthState = 'Healthy' | 'Degraded' | 'Failing' | 'Recovering'
export type LogLevelName = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL'

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
    replay_mode: boolean
    elapsed_seconds: number
    remaining_seconds: number
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
