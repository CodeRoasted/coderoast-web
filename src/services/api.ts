import type { EngineInfo, EngineSnapshot } from '@/types/engine'
import { useAuthStore } from '@/store/useAuthStore'

export interface ScenarioMeta {
    id: string
    name: string
    description: string
    category: string
    duration: string
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
// Default: relative path for local dev, production should use api.coderoast.fr subdomain
const API_BASE = import.meta.env.VITE_API_BASE || '/api'

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

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const resp = await fetch(`${API_BASE}${url}`, {
        headers: authHeaders(),
        ...options,
    })
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

export async function sendCommand(
    engineId: string,
    command: Record<string, unknown>
): Promise<{ success: boolean; message: string }> {
    return request(`/engines/${encodeURIComponent(engineId)}/command`, {
        method: 'POST',
        body: JSON.stringify(command),
    })
}

export async function listScenarios(): Promise<{ scenarios: ScenarioMeta[] }> {
    return request('/scenarios')
}

export async function getScenario(id: string): Promise<{ id: string; yaml: string }> {
    return request(`/scenarios?id=${encodeURIComponent(id)}`)
}

export interface ValidationResult {
    valid: boolean
    errors: string[]
    warnings?: string[]
    notices?: string[]
}

export async function validateScenario(yaml: string): Promise<ValidationResult> {
    return request('/scenarios/validate', {
        method: 'POST',
        body: JSON.stringify({ yaml }),
    })
}
