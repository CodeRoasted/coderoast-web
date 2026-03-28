import { motion } from 'framer-motion'
import { useStore } from '@/store/useStore'

export default function LanguageToggle() {
    const { language, setLanguage } = useStore()

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="px-3 py-1.5 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-semibold text-gray-700 dark:text-gray-200"
            aria-label={language === 'en' ? 'Passer en français' : 'Switch to English'}
        >
            {language === 'en' ? 'FR' : 'EN'}
        </motion.button>
    )
}
