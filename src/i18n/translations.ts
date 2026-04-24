// Aggregates per-language translation modules. Consumers import from here
// (or via `useTranslation()`) — the per-language files exist only to keep
// each language under ~660 lines for editor sanity.
import en from './en'
import fr from './fr'

const translations = { en, fr } as const

/**
 * Type of the canonical translation tree. The English bundle is the
 * source of truth — all other languages are typed `typeof en` so the
 * compiler refuses any drift.
 */
export type TranslationKey = typeof translations.en

export default translations
