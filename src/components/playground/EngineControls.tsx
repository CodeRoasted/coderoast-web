import { Play, Square, Trash2, Zap } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import Tooltip from '@/components/Tooltip'

interface Props {
    isRunning: boolean
    hasEngine: boolean
    onStart: () => void
    onStop: () => void
    onDestroy: () => void
    onCascade?: () => void
}

export default function EngineControls({ isRunning, hasEngine, onStart, onStop, onDestroy, onCascade }: Props) {
    const t = useTranslation()

    if (!hasEngine) return null

    return (
        <div className="flex items-center gap-3 flex-wrap">
            {!isRunning ? (
                <button
                    onClick={onStart}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <Play className="w-4 h-4" />
                    {t.lab.start}
                </button>
            ) : (
                <button
                    onClick={onStop}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <Square className="w-4 h-4" />
                    {t.lab.stop}
                </button>
            )}
            {isRunning && onCascade && (
                <Tooltip content={t.lab.cascadeTip}>
                    <button
                        onClick={onCascade}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <Zap className="w-4 h-4" />
                        {t.lab.cascade}
                    </button>
                </Tooltip>
            )}
            <button
                onClick={onDestroy}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white text-sm font-medium rounded-lg transition-colors"
            >
                <Trash2 className="w-4 h-4" />
                {t.lab.destroy}
            </button>
        </div>
    )
}
