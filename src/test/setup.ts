import '@testing-library/jest-dom'

// jsdom (used by Vitest) does not implement IntersectionObserver, but
// framer-motion's `whileInView` calls it the moment a motion component
// mounts. Provide a no-op stub so component tests that touch motion
// surfaces don't crash. The mock never reports intersections — that's
// fine because tests assert on the rendered DOM, not on viewport
// triggers.
class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null
    readonly rootMargin = ''
    readonly thresholds: ReadonlyArray<number> = []
    observe(): void { }
    unobserve(): void { }
    disconnect(): void { }
    takeRecords(): IntersectionObserverEntry[] {
        return []
    }
}

globalThis.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver

