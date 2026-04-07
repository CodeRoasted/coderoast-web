import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import { lazy, Suspense } from 'react'

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
    useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])

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
