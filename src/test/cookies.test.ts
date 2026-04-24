import { describe, it, expect, beforeEach } from 'vitest'
import {
    ONBOARDING_COOKIE,
    deleteCookie,
    getCookie,
    setCookie,
} from '@/utils/cookies'

function clearAllCookies() {
    for (const cookie of document.cookie.split('; ')) {
        const eqIdx = cookie.indexOf('=')
        if (eqIdx === -1) continue
        const name = cookie.slice(0, eqIdx)
        deleteCookie(name)
    }
}

describe('utils/cookies', () => {
    beforeEach(() => {
        clearAllCookies()
    })

    it('exposes the well-known onboarding cookie name', () => {
        expect(ONBOARDING_COOKIE).toBe('logcraft_onboarding_dismissed')
    })

    it('round-trips a simple value through setCookie/getCookie', () => {
        setCookie('test_key', 'hello')
        expect(getCookie('test_key')).toBe('hello')
    })

    it('returns null for a missing cookie', () => {
        expect(getCookie('definitely_not_set')).toBeNull()
    })

    it('encodes/decodes special characters in the value', () => {
        // The helpers only promise to encode the *value*; cookie names
        // are assumed to be the simple ASCII identifiers the app uses.
        setCookie('special_value', 'value;with;semis and spaces')
        expect(getCookie('special_value')).toBe('value;with;semis and spaces')
    })

    it('deleteCookie removes the value', () => {
        setCookie('temp', '1')
        expect(getCookie('temp')).toBe('1')
        deleteCookie('temp')
        expect(getCookie('temp')).toBeNull()
    })

    it('does not match a longer cookie name with the same prefix', () => {
        setCookie('foo_long', 'long-value')
        expect(getCookie('foo')).toBeNull()
    })
})
