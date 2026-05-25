import { lazy, Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'

// The home is the umbrella lobby: what CodeRoast is (Hero) → the product
// portfolio → roadmap → maker note. Product deep-dives live on their own pages
// (/logcraft, /insight, /insight-diff), not here.
const Portfolio = lazy(() => import('@/components/Portfolio'))
const ComingSoon = lazy(() => import('@/components/ComingSoon'))
const MakerNote = lazy(() => import('@/components/home/MakerNote'))

function LoadingFallback() {
    return (
        <div className="flex items-center justify-center py-32">
            <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
}

export default function Home() {
    return (
        <div className="bg-gray-950 text-gray-100 min-h-screen">
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
                    <MakerNote />
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}
