// productTiers.test.ts — a product's registry tier states the maturity its own copy states.
//
// The tier in `src/config/products.ts` drives the products menu's maturity dot; the portfolio card
// carries a status line in each bundle, and a product page may carry its own badge. A visitor reads
// all of them, so they must say the same thing: a registry tier no copy line states is a claim of
// maturity that no page backs (LogCraft was registered `live` while its card and its page said beta).

import { describe, expect, it } from 'vitest'
import en from '@/i18n/en'
import fr from '@/i18n/fr'
import { products, type ProductTier } from '@/config/products'

// A tier added to ProductTier without a stated word here fails to compile.
const TIER_WORDS: Record<ProductTier, { en: string; fr: string }> = {
    beta: { en: 'beta', fr: 'bêta' },
    soon: { en: 'soon', fr: 'bientôt' },
}

describe('product registry — every tier is the maturity its copy states', () => {
    it.each(products.map((product) => [product.slug, product.tier] as const))(
        '%s: the registry tier (%s) is named by the portfolio card in both bundles',
        (slug, tier) => {
            const words = TIER_WORDS[tier]
            const enStatus = (en.portfolio[slug as keyof typeof en.portfolio] as { status: string }).status
            const frStatus = (fr.portfolio[slug as keyof typeof fr.portfolio] as { status: string }).status
            expect(enStatus.toLowerCase(), `en portfolio.${slug}.status vs tier ${tier}`).toContain(words.en)
            expect(frStatus.toLowerCase(), `fr portfolio.${slug}.status vs tier ${tier}`).toContain(words.fr)
        }
    )

    it('LogCraft is a beta: the registry tier, and the /logcraft page badge in both bundles', () => {
        expect(products.find((product) => product.slug === 'logcraft')?.tier).toBe('beta')
        expect(en.logcraft.betaBadge.toLowerCase()).toContain('beta')
        expect(fr.logcraft.betaBadge.toLowerCase()).toContain('bêta')
    })
})
