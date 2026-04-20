import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import { useAuthStore } from '@/store/useAuthStore'
import { login } from '@/services/api'

const LogCraftPage = lazy(() => import('@/pages/LogCraft'))
const Lab = lazy(() => import('@/pages/Playground'))

function SpinnerFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
}

export default function App() {
    const setAuth = useAuthStore((s) => s.setAuth)
    const clearAuth = useAuthStore((s) => s.clearAuth)

    useEffect(() => {
        document.documentElement.classList.add('dark')

        login()
            .then(({ token, user }) => setAuth(token, user))
            .catch(() => clearAuth())
    }, [setAuth, clearAuth])

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
