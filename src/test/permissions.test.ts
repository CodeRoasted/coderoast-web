import { describe, it, expect } from 'vitest'
import { hasOperation, getQuotaFromList } from '@/utils/permissions'

describe('utils/permissions', () => {
    describe('hasOperation', () => {
        it('returns true when operation is in the list', () => {
            const ops = ['engine.start', 'engine.stop', 'engine.agent.rate.set']
            expect(hasOperation(ops, 'engine.start')).toBe(true)
            expect(hasOperation(ops, 'engine.agent.rate.set')).toBe(true)
        })

        it('returns false when operation is not in the list', () => {
            const ops = ['engine.start', 'engine.stop']
            expect(hasOperation(ops, 'engine.cascade.trigger')).toBe(false)
            expect(hasOperation(ops, 'engine.advance')).toBe(false)
        })

        it('returns false for empty list', () => {
            expect(hasOperation([], 'engine.start')).toBe(false)
        })

        it('is case-sensitive', () => {
            expect(hasOperation(['engine.start'], 'Engine.Start')).toBe(false)
        })
    })

    describe('getQuotaFromList', () => {
        it('returns limit for a known quota key', () => {
            const quotas = [
                { key: 'engines.concurrent', limit: 1 },
                { key: 'upload.bytes', limit: 10_000_000 },
            ]
            expect(getQuotaFromList(quotas, 'engines.concurrent')).toBe(1)
            expect(getQuotaFromList(quotas, 'upload.bytes')).toBe(10_000_000)
        })

        it('returns null for unknown quota key', () => {
            expect(getQuotaFromList([], 'engines.concurrent')).toBeNull()
            expect(getQuotaFromList([{ key: 'engines.concurrent', limit: 1 }], 'upload.bytes')).toBeNull()
        })
    })
})
