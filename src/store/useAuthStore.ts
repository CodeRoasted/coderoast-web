import { create } from 'zustand'

interface AuthUser {
    id: string
    name: string
}

interface AuthState {
    token: string | null
    user: AuthUser | null
    loading: boolean

    setAuth: (token: string, user: AuthUser) => void
    clearAuth: () => void
    setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    loading: true,

    setAuth: (token, user) => set({ token, user, loading: false }),
    clearAuth: () => set({ token: null, user: null, loading: false }),
    setLoading: (loading) => set({ loading }),
}))
