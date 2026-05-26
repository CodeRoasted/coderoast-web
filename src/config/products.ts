import type { ComponentType } from 'react'
import { Bird, Eye, GitCompareArrows, Layers, ScrollText } from 'lucide-react'

// Single source of truth for the product portfolio. The home Portfolio grid,
// the navbar Products menu, and (later) the per-product page chrome all read
// from this list — so adding a product is one entry here, and the umbrella
// hero/nav never change as the slate grows. Display copy lives in i18n under
// `t.portfolio[slug]`; this holds only the structural metadata.

export type ProductSlug = 'sift' | 'logcraft' | 'insight' | 'metalogForwarding' | 'canary'

export type ProductTier = 'live' | 'beta' | 'soon'

export interface ProductDef {
    slug: ProductSlug
    tier: ProductTier
    accent: string // literal Tailwind gradient (`from-… to-…`) so JIT emits it
    Icon: ComponentType<{ className?: string }>
    page?: string // dedicated product page route (when one exists)
    tool?: string // interactive surface (Lab / tool) route
}

// Order = portfolio display order (live → beta → soon). Cards link to `page`
// when a dedicated product page exists, else fall back to the `tool` surface;
// a `soon` entry with neither is a non-clickable teaser of the slate to come.
export const products: ProductDef[] = [
    {
        slug: 'sift',
        tier: 'live',
        accent: 'from-brand-500 to-orange-500',
        Icon: GitCompareArrows,
        page: '/sift',
        tool: '/diff',
    },
    {
        slug: 'logcraft',
        tier: 'live',
        accent: 'from-amber-500 to-orange-600',
        Icon: ScrollText,
        page: '/logcraft',
        tool: '/lab/logcraft',
    },
    {
        slug: 'insight',
        tier: 'beta',
        accent: 'from-blue-500 to-cyan-500',
        Icon: Eye,
        page: '/insight',
        tool: '/lab/insight',
    },
    {
        slug: 'metalogForwarding',
        tier: 'soon',
        accent: 'from-emerald-500 to-teal-500',
        Icon: Layers,
    },
    {
        slug: 'canary',
        tier: 'soon',
        accent: 'from-violet-500 to-purple-500',
        Icon: Bird,
    },
]
