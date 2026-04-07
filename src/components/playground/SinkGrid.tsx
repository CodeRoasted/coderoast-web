import type { SinkSnapshot } from '@/types/engine'
import SinkCard from './SinkCard'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
    sinks: SinkSnapshot[]
}

export default function SinkGrid({ sinks }: Props) {
    const t = useTranslation()

    if (sinks.length === 0) return null

    return (
        <div>
            <div className="mb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t.lab.sinks}
                </h3>
                <p className="text-xs text-gray-600 mt-1">{t.lab.sinksDesc}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sinks.map((sink) => (
                    <SinkCard key={sink.name} sink={sink} />
                ))}
            </div>
        </div>
    )
}
