import { FlaskConical } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import type { ScenarioMeta } from '@/services/api'

interface Props {
    titleId: string
    picked: ScenarioMeta
    onBack: () => void
    onLaunch: () => void
}

export default function StepConfirm({ titleId, picked, onBack, onLaunch }: Props) {
    const t = useTranslation()
    return (
        <div>
            <h2 id={titleId} className="font-display text-2xl font-bold text-white mb-1">
                {t.lab.onboarding.step3Title}
            </h2>
            <p className="text-sm text-gray-400 mb-6">{t.lab.onboarding.step3Subtitle}</p>
            <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/60 mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                        {picked.category}
                    </span>
                </div>
                <div className="font-semibold text-white text-base mb-1">
                    {picked.name || picked.id}
                </div>
                {picked.description && (
                    <p className="text-xs text-gray-400 leading-relaxed">{picked.description}</p>
                )}
            </div>
            <div className="flex justify-between gap-2">
                <button
                    onClick={onBack}
                    className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200"
                >
                    {t.lab.onboarding.back}
                </button>
                <button
                    onClick={onLaunch}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-brand-600 to-orange-500 text-white text-sm font-semibold shadow-lg shadow-brand-600/30 hover:shadow-brand-500/40 transition-all"
                >
                    <FlaskConical className="w-3.5 h-3.5" />
                    {t.lab.onboarding.launch}
                </button>
            </div>
        </div>
    )
}
