import { Link } from 'react-router-dom'
import { ArrowLeft, Brain, HelpCircle } from 'lucide-react'
import UserSelector from '@/components/UserSelector'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    engineId: string | null
    connected: boolean
    onBackToScenarios: () => void
    onRequestHelp: () => void
}

/**
 * Sticky top navigation. The back button morphs from "back to LogCraft
 * marketing" to "back to scenarios (tear down engine)" once an engine
 * is running, so the operator never has to dig in a menu to leave.
 */
export default function LabTopBar({
    engineId,
    connected,
    onBackToScenarios,
    onRequestHelp,
}: Props) {
    const t = useTranslation()
    return (
        <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-gray-700/50">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    {engineId ? (
                        <button
                            type="button"
                            onClick={onBackToScenarios}
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-400 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">{t.lab.backToScenarios}</span>
                        </button>
                    ) : (
                        <Link
                            to="/#product"
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-400 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">{t.lab.backToLogCraft}</span>
                        </Link>
                    )}
                    <div className="h-5 w-px bg-gray-700 hidden sm:block" />
                    <h1 className="font-display font-bold text-lg flex items-center gap-2 min-w-0">
                        <Brain className="w-4 h-4 text-brand-500 shrink-0" />
                        <span className="text-brand-500">InSight</span>{' '}
                        <span className="text-gray-300">{t.lab.title}</span>
                    </h1>
                    <span
                        className="ml-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/40 hidden sm:inline"
                        title={t.lab.simulatedBadge}
                    >
                        {t.lab.simulatedBadge}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    {connected && (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            {t.lab.live}
                        </span>
                    )}
                    <button
                        onClick={onRequestHelp}
                        className="p-1.5 rounded text-gray-400 hover:text-brand-400 hover:bg-gray-800/60 transition-colors"
                        aria-label="Help"
                        title={t.lab.firstVisitTitle}
                    >
                        <HelpCircle className="w-4 h-4" />
                    </button>
                    <Link
                        to="/tiers"
                        className="text-xs text-gray-400 hover:text-brand-400 transition-colors hidden sm:inline"
                    >
                        {t.auth.tierMatrix}
                    </Link>
                    <UserSelector />
                </div>
            </div>
        </div>
    )
}
