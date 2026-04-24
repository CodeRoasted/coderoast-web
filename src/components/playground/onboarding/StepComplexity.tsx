import { AlertCircle, ArrowRight, Check, Loader2 } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import type { Complexity } from './scenarioPicker'

interface ComplexityOption {
    id: Complexity
    title: string
    desc: string
}

interface Props {
    titleId: string
    selected: Complexity | null
    error: string | null
    loading: boolean
    onSelect: (complexity: Complexity) => void
    onBack: () => void
    onConfirm: () => void
}

export default function StepComplexity({
    titleId,
    selected,
    error,
    loading,
    onSelect,
    onBack,
    onConfirm,
}: Props) {
    const t = useTranslation()
    const options: ComplexityOption[] = [
        {
            id: 'simple',
            title: t.lab.onboarding.complexity.simple.title,
            desc: t.lab.onboarding.complexity.simple.desc,
        },
        {
            id: 'realistic',
            title: t.lab.onboarding.complexity.realistic.title,
            desc: t.lab.onboarding.complexity.realistic.desc,
        },
        {
            id: 'chaos',
            title: t.lab.onboarding.complexity.chaos.title,
            desc: t.lab.onboarding.complexity.chaos.desc,
        },
    ]

    return (
        <div>
            <h2 id={titleId} className="font-display text-2xl font-bold text-white mb-1">
                {t.lab.onboarding.step2Title}
            </h2>
            <p className="text-sm text-gray-400 mb-6">{t.lab.onboarding.step2Subtitle}</p>
            <div className="space-y-2">
                {options.map((opt) => {
                    const isSelected = selected === opt.id
                    return (
                        <button
                            key={opt.id}
                            onClick={() => onSelect(opt.id)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${
                                isSelected
                                    ? 'border-brand-500 bg-brand-500/10'
                                    : 'border-gray-700/60 bg-gray-800/40 hover:border-gray-600 hover:bg-gray-800/70'
                            }`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="font-semibold text-white text-sm mb-0.5">
                                        {opt.title}
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        {opt.desc}
                                    </p>
                                </div>
                                {isSelected && (
                                    <Check className="w-4 h-4 text-brand-400 shrink-0" />
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>
            {error && (
                <div
                    role="alert"
                    className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-red-900/20 border border-red-700/50 text-xs text-red-400"
                >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}
            <div className="mt-6 flex justify-between gap-2">
                <button
                    onClick={onBack}
                    className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200"
                >
                    {t.lab.onboarding.back}
                </button>
                <button
                    onClick={onConfirm}
                    disabled={!selected || loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                >
                    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {t.lab.onboarding.pickScenario}
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    )
}
