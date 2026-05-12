import type {
    EngineInfo,
    EngineSnapshot,
    InsightReportsResponse,
    InsightStatus,
} from '@/types/engine'
import type { PlaygroundMode } from '@/types/playground'
import { useAuthStore } from '@/store/useAuthStore'

export interface ScenarioMeta {
    id: string
    name: string
    description: string
    category: string
    duration: string
    playground?: PlaygroundMode
}

export interface AuthUser {
    id: string
    name: string
}

export interface LoginResponse {
    token: string
    user: AuthUser
}

export interface TierInfo {
    name: string
    level: number
}

/** A selectable demo user exposed by `GET /users`. */
export interface SelectableUser {
    id: string
    name: string
    role: string
    tier: TierInfo | null
}

export interface RoleInfo {
    name: string
    tier: TierInfo
}

export interface PermissionInfo {
    key: string
    category: string
    required_tier: TierInfo
    description: string
}

export interface FeatureMatrix {
    tiers: TierInfo[]
    roles: RoleInfo[]
    permissions: PermissionInfo[]
}

/**
 * Raised when the backend returns HTTP 403 on a feature-gated endpoint.
 * Carries the rich context (required tier + user tier) emitted by the
 * server's `access_control_middleware` so UI layers can render a
 * "This feature requires the Pro tier" message instead of a generic error.
 */
export class TierRequiredError extends Error {
    readonly permission: string
    readonly userId: string
    readonly userTier: TierInfo | null
    readonly requiredTier: TierInfo | null
    readonly reason: string

    constructor(params: {
        permission: string
        userId: string
        userTier: TierInfo | null
        requiredTier: TierInfo | null
        reason: string
    }) {
        super(params.reason || 'Access denied')
        this.name = 'TierRequiredError'
        this.permission = params.permission
        this.userId = params.userId
        this.userTier = params.userTier
        this.requiredTier = params.requiredTier
        this.reason = params.reason
    }
}

// API base URL — can be overridden via VITE_API_BASE environment variable
// Default: relative path for local dev, production should use api.coderoast.fr subdomain.
// Versioned since V1 so future breaking changes can ship as /api/v2 in parallel.
const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1'

function authHeaders(): Record<string, string> {
    const { token } = useAuthStore.getState()
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    return headers
}

function parseTier(value: unknown): TierInfo | null {
    if (!value || typeof value !== 'object') return null
    const record = value as Record<string, unknown>
    if (typeof record.name !== 'string' || typeof record.level !== 'number') return null
    return { name: record.name, level: record.level }
}

/**
 * Default timeout (ms) applied to every request that does not pass its own
 * AbortSignal. Picked generously — the slowest endpoint in the wild is
 * scenario validation, which has been observed at ~3s under load.
 */
export const DEFAULT_REQUEST_TIMEOUT_MS = 15000

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    // Honour a caller-provided signal when present; otherwise install our
    // own timeout so a hung backend can never freeze the UI indefinitely.
    let timer: ReturnType<typeof setTimeout> | null = null
    let signal = options?.signal ?? null
    if (!signal && typeof AbortController !== 'undefined') {
        const controller = new AbortController()
        timer = setTimeout(() => controller.abort(), DEFAULT_REQUEST_TIMEOUT_MS)
        signal = controller.signal
    }

    let resp: Response
    try {
        resp = await fetch(`${API_BASE}${url}`, {
            headers: authHeaders(),
            ...options,
            signal: signal ?? undefined,
        })
    } catch (err) {
        if (timer !== null) clearTimeout(timer)
        // Re-shape AbortError so callers see a deterministic message
        // instead of the cryptic "The operation was aborted" string.
        if (err instanceof DOMException && err.name === 'AbortError') {
            throw new Error(`Request to ${url} timed out`)
        }
        throw err
    }
    if (timer !== null) clearTimeout(timer)

    if (!resp.ok) {
        const body = await resp.json().catch(() => ({}))
        if (resp.status === 403) {
            throw new TierRequiredError({
                permission: typeof body.permission === 'string' ? body.permission : '',
                userId: typeof body.user === 'string' ? body.user : '',
                userTier: parseTier(body.user_tier),
                requiredTier: parseTier(body.required_tier),
                reason: typeof body.reason === 'string' ? body.reason : 'Access denied',
            })
        }
        throw new Error(body.error || body.reason || `HTTP ${resp.status}`)
    }
    return resp.json()
}

/**
 * Log in as the given user id. Pass `null` (or omit the argument) to obtain
 * an explicit anonymous session — the backend will mint a token mapped to
 * the "anonymous" principal (tier 0).
 */
export async function login(userId: string | null = null): Promise<LoginResponse> {
    const body = userId ? JSON.stringify({ user_id: userId }) : undefined
    return request('/login', { method: 'POST', body })
}

export async function logout(): Promise<void> {
    await request('/logout', { method: 'POST' })
}

export interface WhoAmIResponse {
    authenticated: boolean
    token_presented: boolean
    token_valid: boolean
    user: AuthUser
    tier: TierInfo | null
}

/**
 * Resolve the current bearer token to a session. The endpoint never errors;
 * an unknown/expired token simply returns `token_valid: false` so the
 * caller can clear the persisted credentials.
 */
export async function whoami(): Promise<WhoAmIResponse> {
    return request('/whoami')
}

export async function listUsers(): Promise<{ users: SelectableUser[] }> {
    return request('/users')
}

export async function getFeatureMatrix(): Promise<FeatureMatrix> {
    return request('/tiers')
}

export async function createEngine(yaml: string): Promise<{ engine_id: string; message: string }> {
    return request('/engines', {
        method: 'POST',
        body: JSON.stringify({ yaml }),
    })
}

export async function listEngines(): Promise<EngineInfo[]> {
    return request('/engines')
}

export async function getEngineSnapshot(engineId: string): Promise<EngineSnapshot> {
    return request(`/engines/${encodeURIComponent(engineId)}`)
}

export async function deleteEngine(engineId: string): Promise<{ message: string }> {
    return request(`/engines/${encodeURIComponent(engineId)}`, { method: 'DELETE' })
}

export async function startEngine(engineId: string): Promise<{ success: boolean; message: string }> {
    return request(`/engines/${encodeURIComponent(engineId)}/start`, { method: 'POST' })
}

export async function stopEngine(engineId: string): Promise<{ success: boolean; message: string }> {
    return request(`/engines/${encodeURIComponent(engineId)}/stop`, { method: 'POST' })
}

export async function loadScenario(engineId: string, yaml: string): Promise<{ message: string }> {
    return request(`/engines/${encodeURIComponent(engineId)}/scenario`, {
        method: 'POST',
        body: JSON.stringify({ yaml }),
    })
}

export async function getEngineScenario(engineId: string): Promise<{ yaml: string }> {
    return request(`/engines/${encodeURIComponent(engineId)}/scenario`)
}

export async function getInsightStatus(engineId: string): Promise<InsightStatus> {
    return request(`/engines/${encodeURIComponent(engineId)}/insight/status`)
}

export async function getInsightReports(engineId: string): Promise<InsightReportsResponse> {
    return request(`/engines/${encodeURIComponent(engineId)}/insight/reports`)
}

export async function sendCommand(
    engineId: string,
    command: Record<string, unknown>
): Promise<{ success: boolean; message: string }> {
    return request(`/engines/${encodeURIComponent(engineId)}/command`, {
        method: 'POST',
        body: JSON.stringify(command),
    })
}

export async function listScenarios(
    playground?: PlaygroundMode,
): Promise<{ playground?: PlaygroundMode; scenarios: ScenarioMeta[] }> {
    const query = playground ? `?playground=${encodeURIComponent(playground)}` : ''
    return request(`/scenarios${query}`)
}

export async function getScenario(
    id: string,
    playground?: PlaygroundMode,
): Promise<{ id: string; playground?: PlaygroundMode; yaml: string }> {
    const params = new URLSearchParams({ id })
    if (playground) params.set('playground', playground)
    return request(`/scenarios?${params.toString()}`)
}

export interface ValidationResult {
    valid: boolean
    errors: string[]
    warnings?: string[]
    notices?: string[]
    unavailable_capabilities?: string[]
}

export async function validateScenario(yaml: string): Promise<ValidationResult> {
    return request('/scenarios/validate', {
        method: 'POST',
        body: JSON.stringify({ yaml }),
    })
}

// ── Demo HTTP-sink drain ───────────────────────────────────────────────────
//
// When a scenario declares an `http` output whose URL targets a host
// under *.logcraft.demo, the server rewrites it at load time to point
// at our internal /drain endpoint instead. The DrainPanel polls these
// endpoints to surface what would have been delivered, so users can
// see the payloads even though the demo hostnames don't resolve.

export interface DrainRecord {
    seq: number
    received_ms: number
    content_type: string
    sink_label: string
    sink_target: string
    body: string
    bytes: number
}

export interface DrainSnapshot {
    engine_id: string
    records: DrainRecord[]
    cursor: number
    latest_seq: number
    capacity: number
    size: number
    total_pushed: number
    dropped: number
    targets: string[]
}

export async function getDrainSnapshot(engineId: string, since = 0): Promise<DrainSnapshot> {
    return request(`/engines/${encodeURIComponent(engineId)}/drain?since=${since}`)
}
