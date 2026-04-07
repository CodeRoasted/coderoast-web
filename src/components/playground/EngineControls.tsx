import { Play, Square, Trash2 } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    isRunning: boolean
    hasEngine: boolean
    onStart: () => void
    onStop: () => void
    onDestroy: () => void
}

export default function EngineControls({ isRunning, hasEngine, onStart, onStop, onDestroy }: Props) {
    const t = useTranslation()

    if (!hasEngine) return null

    return (
        <div className="flex items-center gap-3">
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
