import { useEffect, useState } from 'react'
import { UserCircle2, Loader2 } from 'lucide-react'
import { login, listUsers, type SelectableUser } from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'
import { useTranslation } from '@/hooks/useTranslation'

const ANON_VALUE = '__anonymous__'

/**
 * Demo-user dropdown. Lists the hardcoded accounts exposed by `GET /users`
 * and lets the operator switch identity on the fly, including an
 * "Anonymous" option that drops the bearer token.
 *
 * Intentionally small and self-contained so it can live in the lab navbar
 * without entangling other components.
 */
export default function UserSelector() {
    const t = useTranslation()
    const user = useAuthStore((s) => s.user)
    const selectedUserId = useAuthStore((s) => s.selectedUserId)
    const setAuth = useAuthStore((s) => s.setAuth)
    const clearAuth = useAuthStore((s) => s.clearAuth)
    const setSelectedUserId = useAuthStore((s) => s.setSelectedUserId)

    const [users, setUsers] = useState<SelectableUser[]>([])
    const [loading, setLoading] = useState(true)
    const [switching, setSwitching] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        listUsers()
            .then(({ users: list }) => {
                // Filter out the "anonymous" seed user — we expose it as a
                // dedicated top-level option so it doesn't appear twice.
                // Then sort by tier level ascending so the dropdown reads
                // free → pro → enterprise (mirrors the pricing page order)
                // and the cheapest demo identity is always the first pick.
                const filtered = list.filter((u) => u.id !== 'anonymous')
                const sorted = [...filtered].sort((a, b) => {
                    const al = a.tier?.level ?? Number.POSITIVE_INFINITY
                    const bl = b.tier?.level ?? Number.POSITIVE_INFINITY
                    if (al !== bl) return al - bl
                    return a.name.localeCompare(b.name)
                })
                setUsers(sorted)

                // Auto-pick the lowest-tier demo user on first visit so the
                // operator can hit "Run" immediately without a login dance.
                // We only do it when nothing was previously selected and no
                // bearer token is in flight — returning visitors keep their
                // explicit choice (including "Anonymous").
                const { selectedUserId: persisted, token } = useAuthStore.getState()
                if (persisted === null && !token && sorted.length > 0) {
                    const free = sorted[0]
                    if (free) {
                        login(free.id)
                            .then(({ token: t2, user: principal }) => {
                                setAuth(t2, principal)
                                setSelectedUserId(free.id)
                            })
                            .catch(() => {
                                // Non-fatal: user can still pick manually.
                            })
                    }
                }
            })
            .catch((err) => setError(err instanceof Error ? err.message : String(err)))
            .finally(() => setLoading(false))
        // setAuth/setSelectedUserId are stable Zustand setters; intentional
        // empty deps to run the bootstrap exactly once on mount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const current = selectedUserId ?? user?.id ?? ANON_VALUE

    const handleChange = async (value: string) => {
        setError(null)
        setSwitching(true)
        try {
            if (value === ANON_VALUE) {
                clearAuth()
                setSelectedUserId(null)
            } else {
                const { token, user: principal } = await login(value)
                setAuth(token, principal)
                setSelectedUserId(value)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        } finally {
            setSwitching(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t.auth.loadingUsers}</span>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <UserCircle2 className="w-4 h-4 text-gray-400" />
            <select
                value={current}
                onChange={(ev) => handleChange(ev.target.value)}
                disabled={switching}
                title={t.auth.signedInAs}
                className="bg-gray-900 border border-gray-700 text-gray-200 text-xs rounded-md px-2 py-1 focus:outline-none focus:border-brand-500 disabled:opacity-50"
            >
                <option value={ANON_VALUE}>
                    {t.auth.anonymous}
                    {current === ANON_VALUE ? '' : ''}
                </option>
                {users.map((u) => (
                    <option key={u.id} value={u.id}>
                        {u.name} ({u.tier?.name ?? u.role})
                    </option>
                ))}
            </select>
            {switching && <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-500" />}
            {error && (
                <span className="text-xs text-red-400 truncate max-w-[12rem]" title={error}>
                    {error}
                </span>
            )}
        </div>
    )
}
