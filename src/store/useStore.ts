import { create } from 'zustand'

type Theme = 'light' | 'dark'
type Language = 'en' | 'fr'

interface AppState {
    theme: Theme
    language: Language
    toggleTheme: () => void
    setLanguage: (lang: Language) => void
}

export const useStore = create<AppState>((set) => ({
    theme: (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'dark'
        : 'light',
    language: 'en',

    toggleTheme: () =>
        set((state) => {
            const next = state.theme === 'dark' ? 'light' : 'dark'
            document.documentElement.classList.toggle('dark', next === 'dark')
            return { theme: next }
        }),

    setLanguage: (lang: Language) => set({ language: lang }),
}))
