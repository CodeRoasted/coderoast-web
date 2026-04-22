import '@testing-library/jest-dom'

// jsdom (used by Vitest) does not implement IntersectionObserver, but
// framer-motion's `whileInView` calls it the moment a motion component
// mounts. Provide a no-op stub so component tests that touch motion
// surfaces don't crash. The mock never reports intersections — that's
// fine because tests assert on the rendered DOM, not on viewport
// triggers.
class MockIntersectionObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
    takeRecords(): IntersectionObserverEntry[] {
        return []
    }
    root = null
    rootMargin = ''
    thresholds: ReadonlyArray<number> = []
}
; (globalThis as unknown as { IntersectionObserver: typeof MockIntersectionObserver }).IntersectionObserver =
    MockIntersectionObserver

