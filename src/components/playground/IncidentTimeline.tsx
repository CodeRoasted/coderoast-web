import { AlertCircle, CheckCircle, Clock } from 'lucide-react'
import type { IncidentSnapshot } from '@/types/engine'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    incidents: IncidentSnapshot[]
}

const eventIcons: Record<string, { icon: React.ReactNode; color: string }> = {
    triggered: { icon: <AlertCircle className="w-3.5 h-3.5" />, color: 'text-red-400' },
    recovered: { icon: <CheckCircle className="w-3.5 h-3.5" />, color: 'text-emerald-400' },
}

const defaultIcon = { icon: <Clock className="w-3.5 h-3.5" />, color: 'text-gray-400' }

export default function IncidentTimeline({ incidents }: Props) {
    const t = useTranslation()

    return (
        <div className="bg-gray-900 border border-gray-700/50 rounded-xl overflow-hidden flex flex-col h-full min-h-0">
            <div className="px-4 py-3 border-b border-gray-700/50 flex items-center justify-between shrink-0">
                <span className="text-sm font-medium text-gray-300">{t.lab.incidents}</span>
                <span className="text-xs text-gray-500">
                    {incidents.length} {t.lab.events}
                </span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-4">
                {incidents.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-600 text-sm">
                        {t.lab.noIncidents}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {incidents.map((inc, i) => {
                            const { icon, color } = eventIcons[inc.event] ?? defaultIcon
                            return (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`mt-0.5 ${color}`}>{icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-200">
                                                {inc.name}
                                            </span>
                                            <span className={`text-xs ${color}`}>{inc.event}</span>
                                            <span className="text-xs text-gray-600">
                                                +{inc.offset_seconds.toFixed(1)}s
                                            </span>
                                        </div>
                                        {inc.details && (
                                            <p className="text-xs text-gray-500 mt-0.5 truncate">
                                                {inc.details}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
