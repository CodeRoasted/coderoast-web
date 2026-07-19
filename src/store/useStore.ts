import { create } from 'zustand'

type Language = 'en' | 'fr'

interface AppState {
    language: Language
    setLanguage: (lang: Language) => void
}

export const useStore = create<AppState>((set) => ({
    language: 'en',

    setLanguage: (lang: Language) => set({ language: lang }),
}))
