/**
 * Tiny cookie helpers. No external library needed for the single functional
 * cookie CodeRoast uses (onboarding dismissal state).
 */

/** The only cookie CodeRoast currently sets. */
export const ONBOARDING_COOKIE = 'logcraft_onboarding_dismissed'

/**
 * Returns the decoded value of a cookie, or null if it doesn't exist.
 */
export function getCookie(name: string): string | null {
    const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${name}=`))
    if (!match) return null
    const eqIdx = match.indexOf('=')
    return decodeURIComponent(match.slice(eqIdx + 1))
}

/**
 * Sets a cookie with an expiry of `days` days (default: 365).
 * Scoped to the root path; SameSite=Lax to prevent CSRF on navigations.
 */
export function setCookie(name: string, value: string, days = 365): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

/**
 * Deletes a cookie by expiring it immediately.
 */
export function deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
}
