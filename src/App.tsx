import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from '@/pages/Home'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useAuthStore } from '@/store/useAuthStore'
import { login, whoami } from '@/services/api'

const LogCraftPage = lazy(() => import('@/pages/LogCraft'))
const Lab = lazy(() => import('@/pages/Playground'))
const TierMatrix = lazy(() => import('@/pages/TierMatrix'))
const UseCases = lazy(() => import('@/pages/UseCases'))
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
        // (e.g. switching identities in the UserSelector dropdown).
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

        // After a successful login we don't get a tier back from /login;
        // a follow-up /whoami fetches it so the UI can disable buttons the
        // freshly authenticated user is not allowed to use.
        const refreshTier = () =>
            whoami()
                .then((info) => {
                    if (cancelled) return
                    useAuthStore.getState().setTier(info.tier)
                })
                .catch(() => {
                    /* tier stays at last known value */
                })

        if (persistedToken) {
            whoami()
                .then((info) => {
                    if (cancelled) return
                    if (info.token_valid) {
                        setAuth(persistedToken, info.user, info.tier)
                    } else if (persistedUserId) {
                        return login(persistedUserId)
                            .then(({ token: fresh, user }) => {
                                if (cancelled) return
                                setAuth(fresh, user)
                                void refreshTier()
                            })
                            .catch(() => {
                                if (!cancelled) clearAuth()
                            })
                    } else {
                        clearAuth()
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
                .then(({ token: fresh, user }) => {
                    if (cancelled) return
                    setAuth(fresh, user)
                    void refreshTier()
                })
                .catch(() => {
                    if (!cancelled) clearAuth()
                })
            return () => {
                cancelled = true
            }
        }

        clearAuth()
        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-950 text-gray-100">
                <HashScrollManager />
                <ErrorBoundary>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/logcraft"
                        element={
                            <Suspense fallback={<SpinnerFallback />}>
                                <LogCraftPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/lab"
                        element={
                            <Suspense fallback={<SpinnerFallback />}>
                                <Lab />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/tiers"
                        element={
                            <Suspense fallback={<SpinnerFallback />}>
                                <TierMatrix />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/use-cases"
                        element={
                            <Suspense fallback={<SpinnerFallback />}>
                                <UseCases />
                            </Suspense>
                        }
                    />
                    {/* Legacy redirect */}
                    <Route
                        path="/playground"
                        element={
                            <Suspense fallback={<SpinnerFallback />}>
                                <Lab />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/legal/terms"
                        element={
                            <Suspense fallback={<SpinnerFallback />}>
                                <Terms />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/legal/privacy"
                        element={
                            <Suspense fallback={<SpinnerFallback />}>
                                <Privacy />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/legal/trademark"
                        element={
                            <Suspense fallback={<SpinnerFallback />}>
                                <Trademark />
                            </Suspense>
                        }
                    />
                </Routes>
                </ErrorBoundary>
            </div>
        </BrowserRouter>
    )
}
