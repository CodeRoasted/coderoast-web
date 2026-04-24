import { type ReactNode } from 'react'
import { ArrowRight, Beaker, Compass, GraduationCap, PresentationIcon } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import type { Intent } from './scenarioPicker'

interface IntentOption {
    id: Intent
    icon: ReactNode
    title: string
    desc: string
}

interface Props {
    titleId: string
    selected: Intent | null
    onSelect: (intent: Intent) => void
    onSkip: () => void
    onNext: () => void
}

export default function StepIntent({ titleId, selected, onSelect, onSkip, onNext }: Props) {
    const t = useTranslation()
    const options: IntentOption[] = [
        {
            id: 'explore',
            icon: <Compass className="w-5 h-5" />,
            title: t.lab.onboarding.intents.explore.title,
            desc: t.lab.onboarding.intents.explore.desc,
        },
        {
            id: 'test',
            icon: <Beaker className="w-5 h-5" />,
            title: t.lab.onboarding.intents.test.title,
            desc: t.lab.onboarding.intents.test.desc,
        },
        {
            id: 'demo',
            icon: <PresentationIcon className="w-5 h-5" />,
            title: t.lab.onboarding.intents.demo.title,
            desc: t.lab.onboarding.intents.demo.desc,
        },
        {
            id: 'train',
            icon: <GraduationCap className="w-5 h-5" />,
            title: t.lab.onboarding.intents.train.title,
            desc: t.lab.onboarding.intents.train.desc,
        },
    ]

    return (
        <div>
            <h2 id={titleId} className="font-display text-2xl font-bold text-white mb-1">
                {t.lab.onboarding.step1Title}
            </h2>
            <p className="text-sm text-gray-400 mb-6">{t.lab.onboarding.step1Subtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.map((opt) => {
                    const isSelected = selected === opt.id
                    return (
                        <button
                            key={opt.id}
                            onClick={() => onSelect(opt.id)}
                            className={`text-left p-4 rounded-xl border transition-all ${
                                isSelected
                                    ? 'border-brand-500 bg-brand-500/10'
                                    : 'border-gray-700/60 bg-gray-800/40 hover:border-gray-600 hover:bg-gray-800/70'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={`inline-flex p-2 rounded-lg ${
                                        isSelected
                                            ? 'bg-brand-600 text-white'
                                            : 'bg-gray-800 text-brand-400'
                                    }`}
                                >
                                    {opt.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-white text-sm mb-0.5">
                                        {opt.title}
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        {opt.desc}
                                    </p>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
            <div className="mt-6 flex justify-between gap-2">
                <button
                    onClick={onSkip}
                    className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200"
                >
                    {t.lab.onboarding.skip}
                </button>
                <button
                    onClick={onNext}
                    disabled={!selected}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                >
                    {t.lab.onboarding.next}
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    )
}
