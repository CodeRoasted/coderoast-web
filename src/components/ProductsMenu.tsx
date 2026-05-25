import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { products, type ProductDef } from '@/config/products'
import { useTranslation } from '@/hooks/useTranslation'

// Maturity dot — the slate's live/beta/soon status at a glance.
const TIER_DOT: Record<ProductDef['tier'], string> = {
    live: 'bg-emerald-400',
    beta: 'bg-amber-400',
    soon: 'bg-gray-600',
}

const productName = (t: ReturnType<typeof useTranslation>, product: ProductDef) =>
    (t.portfolio[product.slug] as { name: string }).name

/**
 * Desktop "Products ▾" dropdown — shared by the umbrella Navbar and the
 * per-product ProductNavbar so a visitor can switch products from anywhere.
 * Self-contained: owns its open state, closes on outside-click / Escape /
 * route change.
 */
export default function ProductsMenu() {
    const [open, setOpen] = useState(false)
    const t = useTranslation()
    const location = useLocation()
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => setOpen(false), [location.pathname])
    useEffect(() => {
        if (!open) return
        const onClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
        }
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false)
        }
        document.addEventListener('mousedown', onClick)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('mousedown', onClick)
            document.removeEventListener('keydown', onKey)
        }
    }, [open])

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-haspopup="true"
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-brand-400 transition-colors"
            >
                {t.nav.products}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 mt-3 w-64 rounded-xl border border-gray-800 bg-gray-900/95 backdrop-blur-lg shadow-xl shadow-black/40 p-1.5"
                    >
                        {products.map((product) => {
                            const to = product.page ?? product.tool
                            const Icon = product.Icon
                            const row = (
                                <span className="flex items-center justify-between gap-2 w-full">
                                    <span className="flex items-center gap-2 min-w-0">
                                        <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span className="text-sm text-gray-200 truncate">
                                            {productName(t, product)}
                                        </span>
                                    </span>
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${TIER_DOT[product.tier]}`}
                                        title={product.tier}
                                    />
                                </span>
                            )
                            return to ? (
                                <Link
                                    key={product.slug}
                                    to={to}
                                    className="block px-3 py-2 rounded-lg hover:bg-gray-800/60 transition-colors"
                                >
                                    {row}
                                </Link>
                            ) : (
                                <div
                                    key={product.slug}
                                    className="block px-3 py-2 rounded-lg opacity-60 cursor-default"
                                    title="Coming soon"
                                >
                                    {row}
                                </div>
                            )
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Mobile inline product list (no dropdown) for the hamburger sheets.
export function ProductsMobileLinks({ onNavigate }: { onNavigate?: () => void }) {
    const t = useTranslation()
    return (
        <>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t.nav.products}
            </p>
            {products.map((product) => {
                const to = product.page ?? product.tool
                const Icon = product.Icon
                return to ? (
                    <Link
                        key={product.slug}
                        to={to}
                        onClick={onNavigate}
                        className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-brand-400 transition-colors"
                    >
                        <Icon className="w-4 h-4 shrink-0" />
                        {productName(t, product)}
                        <span className={`w-1.5 h-1.5 rounded-full ${TIER_DOT[product.tier]}`} />
                    </Link>
                ) : (
                    <div key={product.slug} className="flex items-center gap-2 text-sm text-gray-600">
                        <Icon className="w-4 h-4 shrink-0" />
                        {productName(t, product)}
                        <span className="text-[10px] uppercase tracking-wide">soon</span>
                    </div>
                )
            })}
        </>
    )
}
