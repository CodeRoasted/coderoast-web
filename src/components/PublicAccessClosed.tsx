import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { reopenPublicAccess } from '@/services/api'
import { useTranslation } from '@/hooks/useTranslation'

/**
 * The closed state: the server refused a visitor because its `anonymous_access_enabled` flag is off
 * (RUL-259, DN-94.D12). Nothing signs in on its own while it shows; the one way out is the visitor's
 * own click, which sends one request and cannot send a second until the first has answered.
 *
 * `inPlaceOfPage`: the closed state stands where a server-made page would have been, so it offers
 * the way back to the pages that still read.
 */
export default function PublicAccessClosed({ inPlaceOfPage }: { inPlaceOfPage: boolean }) {
    const t = useTranslation()
    const [checking, setChecking] = useState(false)
    const [stillClosed, setStillClosed] = useState(false)

    const retry = () => {
        setChecking(true)
        setStillClosed(false)
        reopenPublicAccess()
            .catch(() => setStillClosed(true))
            .finally(() => setChecking(false))
    }

    return (
        <section
            role="alert"
            aria-labelledby="public-access-closed-title"
            className="mx-auto mt-24 max-w-xl px-4 sm:px-6"
        >
            <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6 text-center shadow-lg">
                <Lock className="mx-auto mb-3 h-6 w-6 text-brand-400" aria-hidden="true" />
                <h2 id="public-access-closed-title" className="text-lg font-semibold text-gray-100">
                    {t.auth.publicAccessClosedTitle}
                </h2>
                <p className="mt-2 text-sm text-gray-300">{t.auth.publicAccessClosedBody}</p>
                <button
                    type="button"
                    onClick={retry}
                    disabled={checking}
                    className="mt-5 rounded-full border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-brand-500 hover:text-brand-300 disabled:cursor-wait disabled:opacity-60"
                >
                    {checking ? t.auth.publicAccessRetrying : t.auth.publicAccessRetry}
                </button>
                {stillClosed && <p className="mt-3 text-xs text-gray-400">{t.auth.publicAccessStillClosed}</p>}
                {inPlaceOfPage && (
                    <Link to="/" className="mt-4 block text-sm text-brand-400 hover:text-brand-300">
                        {t.nav.home}
                    </Link>
                )}
            </div>
        </section>
    )
}
