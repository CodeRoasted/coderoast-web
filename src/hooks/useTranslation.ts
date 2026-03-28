import { useStore } from '@/store/useStore'
import translations from '@/i18n/translations'
import type { TranslationKey } from '@/i18n/translations'

export function useTranslation(): TranslationKey {
    const language = useStore((s) => s.language)
    return translations[language]
}
