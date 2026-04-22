import { lazy, Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'

const ProblemSection = lazy(() => import('@/components/home/ProblemSection'))
const ProductShowcase = lazy(() => import('@/components/home/ProductShowcase'))
const HowItWorks = lazy(() => import('@/components/home/HowItWorks'))
const FeatureGrid = lazy(() => import('@/components/home/FeatureGrid'))
const UseCasesHome = lazy(() => import('@/components/home/UseCasesHome'))
const PricingTeaser = lazy(() => import('@/components/home/PricingTeaser'))
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
                    <ProblemSection />
                </Suspense>
                <Suspense fallback={<LoadingFallback />}>
                    <ProductShowcase />
                </Suspense>
                <Suspense fallback={<LoadingFallback />}>
                    <HowItWorks />
                </Suspense>
                <Suspense fallback={<LoadingFallback />}>
                    <FeatureGrid />
                </Suspense>
                <Suspense fallback={<LoadingFallback />}>
                    <UseCasesHome />
                </Suspense>
                <Suspense fallback={<LoadingFallback />}>
                    <PricingTeaser />
                </Suspense>
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
