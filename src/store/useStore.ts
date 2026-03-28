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
    theme: 'dark',
    language: 'en',

    toggleTheme: () => { }, // dark-only — light theme removed

    setLanguage: (lang: Language) => set({ language: lang }),
}))
