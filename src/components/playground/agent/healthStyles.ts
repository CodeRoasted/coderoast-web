import type { HealthState } from '@/types/engine'

/**
 * Per-health visual style. Kept here so both AgentCard and any future
 * health-aware widget (sparklines, list rows…) reach for the same palette.
 */
export const HEALTH_STYLES: Record<
    HealthState,
    { bg: string; text: string; border: string }
> = {
    Healthy: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    Degraded: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    Failing: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
    Recovering: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
}

export function healthStyle(health: HealthState) {
    return HEALTH_STYLES[health] ?? HEALTH_STYLES.Healthy
}
