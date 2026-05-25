import ProductNavbar from '@/components/ProductNavbar'
import ProductShowcase from '@/components/home/ProductShowcase'
import Footer from '@/components/Footer'
import { insightChrome } from '@/config/productChrome'
import { useTranslation } from '@/hooks/useTranslation'

// InSight product page — the focused front door for the streaming analysis
// pipeline. The interactive surface is the Lab (/lab/insight).
export default function InsightPage() {
    const t = useTranslation()
    return (
        <>
            <ProductNavbar {...insightChrome(t)} />
            <main className="pt-16">
                <ProductShowcase />
            </main>
            <Footer />
        </>
    )
}
