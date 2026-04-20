import type { EngineInfo, EngineSnapshot } from '@/types/engine'
import { useAuthStore } from '@/store/useAuthStore'

export interface ScenarioMeta {
    id: string
    name: string
    description: string
    category: string
    duration: string
}

export interface LoginResponse {
    token: string
    user: {
        id: string
        name: string
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

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const resp = await fetch(`${API_BASE}${url}`, {
        headers: authHeaders(),
        ...options,
    })
    if (!resp.ok) {
        const body = await resp.json().catch(() => ({}))
        throw new Error(body.error || `HTTP ${resp.status}`)
    }
    return resp.json()
}

export async function login(): Promise<LoginResponse> {
    return request('/login', { method: 'POST' })
}

export async function logout(): Promise<void> {
    await request('/logout', { method: 'POST' })
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
}

export async function validateScenario(yaml: string): Promise<ValidationResult> {
    return request('/scenarios/validate', {
        method: 'POST',
        body: JSON.stringify({ yaml }),
    })
}
