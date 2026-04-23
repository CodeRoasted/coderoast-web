/**
 * Front-end mirror of LogCraft's `access_control/permission_keys.hpp` tier
 * gates. Used to lock/grey out UI controls *before* the user clicks them, so
 * tier walls feel intentional instead of "I clicked and got an error toast".
 *
 * Keep in sync with the canonical C++ source. The numeric levels mirror
 * `enum class Tier` (Anonymous=0, Free=1, Pro=2, Enterprise=3).
 */

import type { TierInfo } from '@/services/api'

export const TIER_ANONYMOUS = 0
export const TIER_FREE = 1
export const TIER_PRO = 2
export const TIER_ENTERPRISE = 3

/** Backend permission key → minimum tier level required. */
export const REQUIRED_TIER: Record<string, number> = {
    // Free tier (anyone with a session)
    'command.create_engine': TIER_FREE,
    'command.start_engine': TIER_FREE,
    'command.stop_engine': TIER_FREE,
    'command.destroy_engine': TIER_FREE,
    'command.websocket': TIER_FREE,
    // Pro tier — live agent tweaks
    'command.add_agent': TIER_PRO,
    'command.remove_agent': TIER_PRO,
    'command.set_agent_rate': TIER_PRO,
    'command.set_agent_error_rate': TIER_PRO,
    'command.generate_burst': TIER_PRO,
    // Enterprise tier
    'command.evaluate_cascade': TIER_ENTERPRISE,
}

export function tierLevel(tier: TierInfo | null | undefined): number {
    return tier?.level ?? TIER_ANONYMOUS
}

export function hasPermission(
    tier: TierInfo | null | undefined,
    permissionKey: string,
): boolean {
    const required = REQUIRED_TIER[permissionKey]
    if (required === undefined) return true
    return tierLevel(tier) >= required
}

/** Human-readable name for the tier *required* by a permission. */
export function requiredTierName(permissionKey: string): string {
    const required = REQUIRED_TIER[permissionKey]
    switch (required) {
        case TIER_FREE:
            return 'Free'
        case TIER_PRO:
            return 'Pro'
        case TIER_ENTERPRISE:
            return 'Enterprise'
        default:
            return 'Anonymous'
    }
}
