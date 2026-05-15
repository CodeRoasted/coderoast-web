import { useEffect, useState } from 'react'
import { UserCircle2, Loader2 } from 'lucide-react'
import { login, listUsers } from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'
import { useTranslation } from '@/hooks/useTranslation'

const ANON_VALUE = '__anonymous__'

/**
 * Demo-user dropdown. Lists the accounts exposed by `GET /users` and lets
 * the operator switch identity on the fly.
 *
 * The user list is fetched once per page load and stored in the global auth
 * store (`demoUsers`). Navigating away and back does NOT re-fetch — the
 * component immediately reads the cached list from the store.
 */
export default function UserSelector() {
    const t = useTranslation()
    const user = useAuthStore((s) => s.user)
    const selectedUserId = useAuthStore((s) => s.selectedUserId)
    const setAuth = useAuthStore((s) => s.setAuth)
    const clearAuth = useAuthStore((s) => s.clearAuth)
    const setSelectedUserId = useAuthStore((s) => s.setSelectedUserId)
    const setDemoUsers = useAuthStore((s) => s.setDemoUsers)

    const storeLoading = useAuthStore((s) => s.loading)
    const token = useAuthStore((s) => s.token)
    // Read the cached list directly from the store so remounts are instant.
    const demoUsers = useAuthStore((s) => s.demoUsers)

    const [loading, setLoading] = useState(false)
    const [switching, setSwitching] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Wait for App-level auth bootstrap to complete and for a session token
        // to be present. Also skip if we already have a cached list in the store
        // (survives navigation without re-fetching).
        if (storeLoading || !token || demoUsers !== null) return

        setLoading(true)
        listUsers()
            .then(({ users: list }) => {
                // Filter out the "anonymous" seed user — we expose it as a
                // dedicated top-level option so it doesn't appear twice.
                // Sort demo users first (identity_kind === 'demo'), then by name.
                const filtered = list.filter((u) => u.id !== 'anonymous')
                const sorted = [...filtered].sort((a, b) => {
                    const aDemo = a.is_demo ? 0 : 1
                    const bDemo = b.is_demo ? 0 : 1
                    if (aDemo !== bDemo) return aDemo - bDemo
                    return a.name.localeCompare(b.name)
                })
                setDemoUsers(sorted)
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : String(err))
            })
            .finally(() => setLoading(false))
    }, [storeLoading, token, demoUsers, setDemoUsers])

    const current = selectedUserId ?? user?.id ?? ANON_VALUE

    const handleChange = async (value: string) => {
        setError(null)
        setSwitching(true)
        try {
            if (value === ANON_VALUE) {
                clearAuth()
                setSelectedUserId(null)
            } else {
                const { token, user: principal, access } = await login(value)
                const picked = demoUsers?.find((u) => u.id === value)
                const ops = access?.operations ?? picked?.access?.operations ?? []
                setAuth(token, principal, ops)
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

    if (!demoUsers || demoUsers.length === 0) return null

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
                {demoUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                        {u.name}
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
