import { describe, it, expect } from 'vitest'
import {
    REQUIRED_TIER,
    TIER_ANONYMOUS,
    TIER_FREE,
    TIER_PRO,
    TIER_ENTERPRISE,
    hasPermission,
    requiredTierName,
    tierLevel,
} from '@/utils/permissions'

describe('utils/permissions', () => {
    describe('tierLevel', () => {
        it('returns 0 for null/undefined tier', () => {
            expect(tierLevel(null)).toBe(TIER_ANONYMOUS)
            expect(tierLevel(undefined)).toBe(TIER_ANONYMOUS)
        })

        it('returns the tier level from a real TierInfo object', () => {
            expect(tierLevel({ name: 'pro', level: TIER_PRO })).toBe(2)
        })
    })

    describe('hasPermission', () => {
        it('grants permissions known to the front-end mirror to qualifying tiers', () => {
            const proTier = { name: 'pro', level: TIER_PRO }
            expect(hasPermission(proTier, 'command.set_agent_rate')).toBe(true)
            expect(hasPermission(proTier, 'command.create_engine')).toBe(true)
        })

        it('denies pro-only permissions to free tier users', () => {
            const freeTier = { name: 'free', level: TIER_FREE }
            expect(hasPermission(freeTier, 'command.generate_burst')).toBe(false)
            expect(hasPermission(freeTier, 'command.evaluate_cascade')).toBe(false)
        })

        it('reserves enterprise permissions for enterprise tier only', () => {
            const proTier = { name: 'pro', level: TIER_PRO }
            const entTier = { name: 'enterprise', level: TIER_ENTERPRISE }
            expect(hasPermission(proTier, 'command.evaluate_cascade')).toBe(false)
            expect(hasPermission(entTier, 'command.evaluate_cascade')).toBe(true)
        })

        it('returns true for permissions not in the mirror (no client-side gate)', () => {
            // Unknown keys must default to "allowed" — the server is the
            // source of truth, the front-end only tries to be helpful.
            expect(hasPermission(null, 'command.future_unknown_thing')).toBe(true)
        })

        it('treats null tier as anonymous (level 0)', () => {
            expect(hasPermission(null, 'command.create_engine')).toBe(false)
        })
    })

    describe('requiredTierName', () => {
        it('maps each known permission to its tier name', () => {
            expect(requiredTierName('command.create_engine')).toBe('Free')
            expect(requiredTierName('command.set_agent_rate')).toBe('Pro')
            expect(requiredTierName('command.evaluate_cascade')).toBe('Enterprise')
        })

        it('falls back to Anonymous for unknown permissions', () => {
            expect(requiredTierName('command.future_unknown')).toBe('Anonymous')
        })
    })

    it('keeps the tier constants stable (any change must update the C++ mirror)', () => {
        // Guards against an accidental renumbering that would silently
        // shift the entire access-control matrix.
        expect(TIER_ANONYMOUS).toBe(0)
        expect(TIER_FREE).toBe(1)
        expect(TIER_PRO).toBe(2)
        expect(TIER_ENTERPRISE).toBe(3)
    })

    it('every documented gate maps to a real tier level', () => {
        for (const [key, level] of Object.entries(REQUIRED_TIER)) {
            expect([TIER_FREE, TIER_PRO, TIER_ENTERPRISE]).toContain(level)
            expect(typeof key).toBe('string')
        }
    })
})
