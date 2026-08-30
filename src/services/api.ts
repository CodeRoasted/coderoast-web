import type {
    InsightReconfigureRequest,
    InsightReconfigureResponse,
    InsightReportsResponse,
    InsightStatus,
} from '@/types/engine'
import type { PlaygroundMode } from '@/types/playground'
import type { ChangeReportResponse, DiffRequest } from '@/types/diff'
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

/** Quota value from a CapabilityProfile. */
export interface QuotaInfo {
    key: string
    limit: number
    unit: string
    description: string
}

/** Current consumption for a single quota key. */
export interface QuotaUsage {
    key: string
    /** null when usage is not tracked for this principal/key. */
    used: number | null
}

/**
 * Subject's current capability profile as returned by login / whoami / /access/profile.
 *
 * The TYPE is `Capability*` (the collapsed internal vocabulary); the FIELD names
 * (`access`, `current_access`) and the `/access/profile` route are NOT — those are
 * the server's wire contract (coderoast-server auth_facade / system_facade emit
 * exactly those keys), so renaming them here would break deserialization.
 */
export interface CapabilityProfile {
    tenant_id: string
    user_id: string
    subject_id: string
    name: string
    role: string
    identity_kind: string
    deployment_context: string
    entitlements: string[]
    /** Permitted operation keys for this subject (same as capabilities). */
    operations: string[]
    quotas: QuotaInfo[]
    /** Current consumption per quota key. Present in /access/profile responses. */
    quota_usage?: QuotaUsage[]
}

export interface LoginResponse {
    token: string
    user: AuthUser
    access: CapabilityProfile | null
}

export interface EntitlementInfo {
    key: string
    label: string
    description: string
}

export interface RoleInfo {
    name: string
    display_name: string
    identity_kind: string
    entitlements: string[]
}

export interface OperationInfo {
    key: string
    required_entitlement: string
    category: string
    description: string
}

export interface ScenarioCapabilityInfo {
    key: string
    required_entitlement: string
    description: string
}

export interface CapabilityMatrix {
    entitlements: EntitlementInfo[]
    roles: RoleInfo[]
    operations: OperationInfo[]
    scenario_capabilities: ScenarioCapabilityInfo[]
    current_access?: CapabilityProfile
}

/**
 * Raised when the backend returns HTTP 403 on a policy-gated endpoint.
 * Carries the rich context emitted by the server's access-control middleware
 * so UI layers can show a meaningful "requires X entitlement" message.
 */
export class PolicyDenialError extends Error {
    readonly operation: string
    readonly requiredEntitlement: string
    readonly quotaKey: string
    readonly quotaLimit: number | null
    readonly userId: string
    readonly subject: string
    readonly role: string
    readonly identityKind: string
    readonly deploymentContext: string
    readonly reason: string

    constructor(params: {
        operation: string
        requiredEntitlement: string
        quotaKey: string
        quotaLimit: number | null
        userId: string
        subject: string
        role: string
        identityKind: string
        deploymentContext: string
        reason: string
    }) {
        super(params.reason || 'Access denied')
        this.name = 'PolicyDenialError'
        this.operation = params.operation
        this.requiredEntitlement = params.requiredEntitlement
        this.quotaKey = params.quotaKey
        this.quotaLimit = params.quotaLimit
        this.userId = params.userId
        this.subject = params.subject
        this.role = params.role
        this.identityKind = params.identityKind
        this.deploymentContext = params.deploymentContext
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

/**
 * Default timeout (ms) applied to every request that does not pass its own
 * AbortSignal. Picked generously — the slowest endpoint in the wild is
 * scenario validation, which has been observed at ~3s under load.
 */
export const DEFAULT_REQUEST_TIMEOUT_MS = 15000
/**
 * Shorter deadline used for the *first* attempt of a retried GET request.
 * If the tunnel/network hiccups, this timeout fires sooner so the retry
 * kicks in faster rather than making the user wait the full 15 s.
 */
export const GET_FIRST_ATTEMPT_TIMEOUT_MS = 5_000

/**
 * Single-attempt HTTP request. Called by `request()` which adds retry logic
 * for read-only endpoints on transient network failures (e.g. SSH tunnel
 * hiccups in dev mode).
 */
async function requestOnce<T>(url: string, options?: RequestInit, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS): Promise<T> {
    // Always install an internal timeout. If the caller also passed a signal
    // (e.g. component-unmount cleanup), forward its abort to our controller so
    // whichever fires first wins — preventing both stale-response state updates
    // and hung requests after navigation / mode switches.
    let timer: ReturnType<typeof setTimeout> | null = null
    let signal: AbortSignal | null = null
    if (typeof AbortController !== 'undefined') {
        const controller = new AbortController()
        timer = setTimeout(() => controller.abort(), timeoutMs)
        const callerSignal = options?.signal ?? null
        if (callerSignal) {
            if (callerSignal.aborted) {
                controller.abort()
            } else {
                callerSignal.addEventListener('abort', () => controller.abort(), { once: true })
            }
        }
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
            throw new PolicyDenialError({
                operation: typeof body.operation === 'string' ? body.operation : '',
                requiredEntitlement: typeof body.required_entitlement === 'string' ? body.required_entitlement : '',
                quotaKey: body.quota && typeof body.quota.key === 'string' ? body.quota.key : '',
                quotaLimit: body.quota && typeof body.quota.limit === 'number' ? body.quota.limit : null,
                userId: typeof body.user === 'string' ? body.user : '',
                subject: typeof body.subject === 'string' ? body.subject : '',
                role: typeof body.role === 'string' ? body.role : '',
                identityKind: typeof body.identity_kind === 'string' ? body.identity_kind : '',
                deploymentContext: typeof body.deployment_context === 'string' ? body.deployment_context : '',
                reason: typeof body.reason === 'string' ? body.reason : 'Access denied',
            })
        }
        throw new Error(body.error || body.reason || `HTTP ${resp.status}`)
    }
    return resp.json()
}

/**
 * HTTP request with one automatic retry for GET endpoints on timeout errors.
 * Non-GET requests (POST/PUT/DELETE) are never retried — they are not
 * idempotent. The retry is suppressed if the caller's AbortSignal has already
 * fired (mode switch, component unmount).
 */
async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const isReadOnly = !options?.method || options.method === 'GET'
    if (!isReadOnly) return requestOnce<T>(url, options)

    try {
        return await requestOnce<T>(url, options, GET_FIRST_ATTEMPT_TIMEOUT_MS)
    } catch (firstErr) {
        const isTimeout =
            firstErr instanceof Error && firstErr.message.endsWith('timed out')
        if (!isTimeout || options?.signal?.aborted) throw firstErr

        // Short pause so a recovering tunnel has a moment to re-establish
        await new Promise<void>((r) => setTimeout(r, 400))
        if (options?.signal?.aborted) throw firstErr

        return requestOnce<T>(url, options) // full DEFAULT_REQUEST_TIMEOUT_MS
    }
}

/**
 * Log in as the given user id — a passwordless visitor login for the built-in
 * demo accounts.
 *
 * Omitting the id does NOT mint an anonymous session: the backend resolves the
 * empty id against the credential store, finds nothing, and answers 401. Being
 * anonymous is the absence of a session, not a session you can ask for — a cold
 * request with no bearer token resolves to the `anonymous` role on its own, and
 * the endpoints in the `public.*` family serve it.
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
    access: CapabilityProfile | null
}

/**
 * Resolve the current bearer token to a session. The endpoint never errors;
 * an unknown/expired token simply returns `token_valid: false` so the
 * caller can clear the persisted credentials.
 */
export async function whoami(): Promise<WhoAmIResponse> {
    return request('/whoami')
}

export async function getCapabilityMatrix(): Promise<CapabilityMatrix> {
    return request('/access/profile')
}

export async function createEngine(yaml: string): Promise<{ engine_id: string; message: string }> {
    return request('/engines', {
        method: 'POST',
        body: JSON.stringify({ yaml }),
    })
}

export async function deleteEngine(engineId: string): Promise<{ message: string }> {
    return request(`/engines/${encodeURIComponent(engineId)}`, { method: 'DELETE' })
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

/**
 * insight_diff hosted demo: compare two log blobs into a ranked, noise-suppressed
 * change report. Session-less by design — a shared /diff link must work for a
 * reader who never bootstrapped, so this call must not be gated on auth state.
 * Bounded per client IP instead: a 403 PolicyDenialError carrying quotaKey
 * `insight.diff.compare.daily` means that IP's daily allowance is spent, which is
 * a different message from a 403 carrying requiredEntitlement.
 */
export async function runInsightDiff(payload: DiffRequest): Promise<ChangeReportResponse> {
    return request('/insight/diff', {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}

export async function reconfigureInsight(
    engineId: string,
    params: InsightReconfigureRequest
): Promise<InsightReconfigureResponse> {
    return request(`/engines/${encodeURIComponent(engineId)}/insight/reconfigure`, {
        method: 'POST',
        body: JSON.stringify(params),
    })
}

export async function listScenarios(
    playground?: PlaygroundMode,
    signal?: AbortSignal,
): Promise<{ playground?: PlaygroundMode; scenarios: ScenarioMeta[] }> {
    const query = playground ? `?playground=${encodeURIComponent(playground)}` : ''
    return request(`/scenarios${query}`, signal ? { signal } : undefined)
}

export async function getScenario(
    id: string,
    playground?: PlaygroundMode,
    signal?: AbortSignal,
): Promise<{ id: string; playground?: PlaygroundMode; yaml: string }> {
    const params = new URLSearchParams({ id })
    if (playground) params.set('playground', playground)
    return request(`/scenarios?${params.toString()}`, signal ? { signal } : undefined)
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
