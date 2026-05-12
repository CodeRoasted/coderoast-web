import { Brain, ScrollText } from 'lucide-react'
import type { PlaygroundMode } from '@/types/playground'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    mode: PlaygroundMode
    onModeChange: (mode: PlaygroundMode) => void
}

const modes: PlaygroundMode[] = ['logcraft', 'insight']

export default function PlaygroundModeSwitch({ mode, onModeChange }: Props) {
    const t = useTranslation()
    const copy = t.lab.playgrounds

    return (
        <div className="rounded-xl border border-gray-800 bg-gray-900/55 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2" role="tablist" aria-label={copy.label}>
                {modes.map((candidate) => {
                    const selected = candidate === mode
                    const candidateCopy = copy[candidate]
                    const Icon = candidate === 'logcraft' ? ScrollText : Brain
                    return (
                        <button
                            key={candidate}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            onClick={() => onModeChange(candidate)}
                            className={`min-h-[6.5rem] rounded-lg border px-4 py-3 text-left transition-colors ${selected
                                ? 'border-brand-500/60 bg-brand-500/10 text-gray-100'
                                : 'border-gray-800 bg-gray-950/40 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                                }`}
                        >
                            <span className="flex items-start justify-between gap-3">
                                <span className="min-w-0">
                                    <span className="flex items-center gap-2 text-sm font-semibold">
                                        <Icon className={selected ? 'w-4 h-4 text-brand-400' : 'w-4 h-4 text-gray-500'} />
                                        {candidateCopy.title}
                                    </span>
                                    <span className="mt-2 block text-xs leading-relaxed text-gray-500">
                                        {candidateCopy.short}
                                    </span>
                                </span>
                                <span className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${selected
                                    ? 'border-brand-500/40 bg-brand-500/15 text-brand-300'
                                    : 'border-gray-700 bg-gray-900 text-gray-500'
                                    }`}>
                                    {candidateCopy.badge}
                                </span>
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}