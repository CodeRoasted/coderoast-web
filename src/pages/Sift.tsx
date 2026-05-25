import ProductNavbar from '@/components/ProductNavbar'
import InsightDiffShowcase from '@/components/home/InsightDiffShowcase'
import Footer from '@/components/Footer'
import { siftChrome } from '@/config/productChrome'
import { useTranslation } from '@/hooks/useTranslation'

// Sift product page — the CI/CD wedge front door. The interactive surface is
// the diff tool itself (/diff), which the showcase CTA points at.
export default function SiftPage() {
    const t = useTranslation()
    return (
        <>
            <ProductNavbar {...siftChrome(t)} />
            <main className="pt-16">
                <InsightDiffShowcase />
            </main>
            <Footer />
        </>
    )
}
