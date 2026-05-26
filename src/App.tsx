import { useEffect, lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom'
import Home from '@/pages/Home'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useAuthStore } from '@/store/useAuthStore'
import { login, whoami } from '@/services/api'

const LogCraftPage = lazy(() => import('@/pages/LogCraft'))
const Lab = lazy(() => import('@/pages/Playground'))
const InsightDiff = lazy(() => import('@/pages/InsightDiff'))
const TierMatrix = lazy(() => import('@/pages/TierMatrix'))
const UseCases = lazy(() => import('@/pages/UseCases'))
const InsightProductPage = lazy(() => import('@/pages/Insight'))
const SiftPage = lazy(() => import('@/pages/Sift'))
const Terms = lazy(() => import('@/pages/legal/Terms'))
const Privacy = lazy(() => import('@/pages/legal/Privacy'))
const Trademark = lazy(() => import('@/pages/legal/Trademark'))

function SpinnerFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
}

function HashScrollManager() {
    const location = useLocation()

    useEffect(() => {
        if (!location.hash) {
            return
        }

        const targetId = decodeURIComponent(location.hash.slice(1))
        let cancelled = false
        let attempt = 0
        let retryTimer: number | null = null

        const scrollToTarget = () => {
            if (cancelled) {
                return
            }

            const element = document.getElementById(targetId)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                return
            }

            // Home sections are lazy-loaded, so the hash target may not exist
            // on the first paint after navigation.
            if (attempt < 20) {
                attempt += 1
                retryTimer = window.setTimeout(scrollToTarget, 100)
            }
        }

        scrollToTarget()

        return () => {
            cancelled = true
            if (retryTimer !== null) {
                window.clearTimeout(retryTimer)
            }
        }
    }, [location.hash, location.pathname])

    return null
}

function RootLayout() {
    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            <HashScrollManager />
            <ErrorBoundary>
                <Outlet />
            </ErrorBoundary>
        </div>
    )
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { index: true, element: <Home /> },
            {
                path: 'logcraft',
                element: <Suspense fallback={<SpinnerFallback />}><LogCraftPage /></Suspense>,
            },
            {
                path: 'lab',
                element: <Suspense fallback={<SpinnerFallback />}><Lab defaultMode="insight" /></Suspense>,
            },
            {
                path: 'lab/logcraft',
                element: <Suspense fallback={<SpinnerFallback />}><Lab defaultMode="logcraft" /></Suspense>,
            },
            {
                path: 'lab/insight',
                element: <Suspense fallback={<SpinnerFallback />}><Lab defaultMode="insight" /></Suspense>,
            },
            {
                path: 'tiers',
                element: <Suspense fallback={<SpinnerFallback />}><TierMatrix /></Suspense>,
            },
            {
                path: 'diff',
                element: <Suspense fallback={<SpinnerFallback />}><InsightDiff /></Suspense>,
            },
            {
                path: 'sift',
                element: <Suspense fallback={<SpinnerFallback />}><SiftPage /></Suspense>,
            },
            {
                path: 'insight',
                element: <Suspense fallback={<SpinnerFallback />}><InsightProductPage /></Suspense>,
            },
            {
                path: 'use-cases',
                element: <Suspense fallback={<SpinnerFallback />}><UseCases /></Suspense>,
            },
            // Legacy redirect
            {
                path: 'playground',
                element: <Suspense fallback={<SpinnerFallback />}><Lab defaultMode="insight" /></Suspense>,
            },
            {
                path: 'legal/terms',
                element: <Suspense fallback={<SpinnerFallback />}><Terms /></Suspense>,
            },
            {
                path: 'legal/privacy',
                element: <Suspense fallback={<SpinnerFallback />}><Privacy /></Suspense>,
            },
            {
                path: 'legal/trademark',
                element: <Suspense fallback={<SpinnerFallback />}><Trademark /></Suspense>,
            },
        ],
    },
])

export default function App() {
    const setAuth = useAuthStore((state) => state.setAuth)
    const clearAuth = useAuthStore((state) => state.clearAuth)
    const setLoading = useAuthStore((state) => state.setLoading)

    useEffect(() => {
        document.documentElement.classList.add('dark')

        // Session bootstrap — runs exactly once on mount.
        //
        // Reads initial persisted state directly from the store (not reactive)
        // so this effect cannot be re-triggered by user-driven token changes
        // (e.g. switching identities in the visitor auto-login flow).
        //
        // Policy:
        //   • Persisted token → confirm with /whoami; if the backend says it
        //     is no longer valid (server restart, manual revoke), try to
        //     re-login with the persisted user id, or clear auth.
        //   • Persisted selection but no token → re-login as that user.
        //   • Nothing persisted → clear auth (stay anonymous).
        let cancelled = false

        const { token: persistedToken, selectedUserId: persistedUserId } =
            useAuthStore.getState()

        // After a successful login we get the access profile back from /login
        // and /whoami; use it to populate the operations list so controls
        // can gate themselves without an extra round-trip.

        if (persistedToken) {
            whoami()
                .then((info) => {
                    if (cancelled) return
                    if (info.token_valid) {
                        setAuth(persistedToken, info.user, info.access?.operations ?? [])
                    } else {
                        // Token is stale — re-login with the persisted user id
                        // when available, otherwise fall back to the visitor
                        // auto-login so the app stays usable after a Redis
                        // restart without requiring a manual page reload.
                        const reloginAs = persistedUserId ?? 'visitor'
                        return login(reloginAs)
                            .then(({ token: fresh, user, access }) => {
                                if (cancelled) return
                                setAuth(fresh, user, access?.operations ?? [])
                            })
                            .catch(() => {
                                if (!cancelled) clearAuth()
                            })
                    }
                })
                .catch(() => {
                    if (!cancelled) setLoading(false)
                })
            return () => {
                cancelled = true
            }
        }

        if (persistedUserId) {
            login(persistedUserId)
                .then(({ token: fresh, user, access }) => {
                    if (cancelled) return
                    setAuth(fresh, user, access?.operations ?? [])
                })
                .catch(() => {
                    if (!cancelled) clearAuth()
                })
            return () => {
                cancelled = true
            }
        }

        // No persisted state — first visit (e.g. incognito). Auto-login as
        // visitor so the lab is immediately usable without a manual
        // identity selection. Falls back to anonymous if the server rejects it.
        login('visitor')
            .then(({ token: fresh, user, access }) => {
                if (cancelled) return
                setAuth(fresh, user, access?.operations ?? [])
            })
            .catch(() => {
                if (!cancelled) clearAuth()
            })
        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <RouterProvider router={router} />
}
