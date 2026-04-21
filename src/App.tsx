import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import { useAuthStore } from '@/store/useAuthStore'
import { login, whoami } from '@/services/api'

const LogCraftPage = lazy(() => import('@/pages/LogCraft'))
const Lab = lazy(() => import('@/pages/Playground'))
const TierMatrix = lazy(() => import('@/pages/TierMatrix'))

function SpinnerFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
}

export default function App() {
    const token = useAuthStore((s) => s.token)
    const selectedUserId = useAuthStore((s) => s.selectedUserId)
    const setAuth = useAuthStore((s) => s.setAuth)
    const clearAuth = useAuthStore((s) => s.clearAuth)
    const setLoading = useAuthStore((s) => s.setLoading)

    useEffect(() => {
        document.documentElement.classList.add('dark')

        // Session bootstrap policy:
        //   • Persisted token → confirm it with /whoami; if the backend says
        //     it is no longer valid (server restart, manual revoke), drop
        //     it silently so the user lands as anonymous instead of getting
        //     403s on every API call.
        //   • Persisted selection but no token → re-login as that user.
        //   • Nothing persisted → stay anonymous; the backend treats the
        //     absence of an Authorization header as the anonymous principal.
        if (token) {
            whoami()
                .then((info) => {
                    if (info.token_valid) {
                        setAuth(token, info.user)
                    } else {
                        clearAuth()
                    }
                })
                .catch(() => setLoading(false))
            return
        }

        if (selectedUserId) {
            login(selectedUserId)
                .then(({ token: fresh, user }) => setAuth(fresh, user))
                .catch(() => clearAuth())
            return
        }

        clearAuth()
    }, [token, selectedUserId, setAuth, clearAuth, setLoading])

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-950 text-gray-100">
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
                    {/* Legacy redirect */}
                    <Route
                        path="/playground"
                        element={
                            <Suspense fallback={<SpinnerFallback />}>
                                <Lab />
                            </Suspense>
                        }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    )
}
