import { lazy, Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'

const Portfolio = lazy(() => import('@/components/Portfolio'))
const ComingSoon = lazy(() => import('@/components/ComingSoon'))
const Donation = lazy(() => import('@/components/Donation'))
const Licensing = lazy(() => import('@/components/Licensing'))

function LoadingFallback() {
    return (
        <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
}

export default function Home() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <Suspense fallback={<LoadingFallback />}>
                    <Portfolio />
                </Suspense>
                <Suspense fallback={<LoadingFallback />}>
                    <ComingSoon />
                </Suspense>
                <Suspense fallback={<LoadingFallback />}>
                    <Donation />
                </Suspense>
                <Suspense fallback={<LoadingFallback />}>
                    <Licensing />
                </Suspense>
            </main>
            <Footer />
        </>
    )
}
