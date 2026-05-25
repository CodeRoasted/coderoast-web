import { FlaskConical, GitCompareArrows } from 'lucide-react'
import type { ProductNavbarConfig } from '@/components/ProductNavbar'
import { useTranslation } from '@/hooks/useTranslation'

// Per-product navbar chrome (wordmark, sub-nav, CTA), in one place so the
// product page AND its sub-pages (e.g. /use-cases under LogCraft) share one
// definition. Pair with the structural registry in ./products.ts.
type Translation = ReturnType<typeof useTranslation>

// First segment gradient-tinted, matching the "CodeRoast" logo treatment.
const wordmark = (lead: string, rest: string) => (
    <span className="font-display font-bold text-xl text-white">
        <span className="bg-gradient-to-r from-brand-500 to-orange-400 bg-clip-text text-transparent">
            {lead}
        </span>
        {rest}
    </span>
)

const contact = (t: Translation) => ({
    label: t.nav.contact,
    href: 'mailto:contact@coderoast.fr',
})
// Pricing isn't set yet — show it greyed everywhere rather than linking to the
// access/capability matrix (which is not a price list).
const pricing = (t: Translation) => ({ label: t.nav.pricing, disabled: true })

export function logcraftChrome(t: Translation): ProductNavbarConfig {
    return {
        brand: wordmark('Log', 'Craft'),
        homeTo: '/logcraft',
        links: [
            { label: t.nav.product, to: '/logcraft', end: true },
            { label: t.nav.useCases, to: '/use-cases' },
            contact(t),
            pricing(t),
        ],
        cta: { label: t.nav.logcraftPlayground, to: '/lab/logcraft', Icon: FlaskConical },
    }
}

export function insightChrome(t: Translation): ProductNavbarConfig {
    return {
        brand: wordmark('In', 'Sight'),
        homeTo: '/insight',
        links: [{ label: t.nav.product, to: '/insight', end: true }, contact(t), pricing(t)],
        cta: { label: t.nav.lab, to: '/lab/insight', Icon: FlaskConical },
    }
}

export function insightDiffChrome(t: Translation): ProductNavbarConfig {
    return {
        brand: (
            <span className="font-mono font-bold text-lg text-white">
                <span className="bg-gradient-to-r from-brand-500 to-orange-400 bg-clip-text text-transparent">
                    insight
                </span>
                _diff
            </span>
        ),
        homeTo: '/insight-diff',
        links: [{ label: t.nav.product, to: '/insight-diff', end: true }, contact(t), pricing(t)],
        cta: { label: t.hero.cta, to: '/diff', Icon: GitCompareArrows },
    }
}
