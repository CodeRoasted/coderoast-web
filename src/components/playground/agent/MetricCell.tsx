interface Props {
    label: string
    value: string
    unit: string
    warn?: boolean
}

export default function MetricCell({ label, value, unit, warn }: Props) {
    return (
        <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</div>
            <div className={`text-sm font-mono ${warn ? 'text-amber-400' : 'text-gray-200'}`}>
                {value}
                <span className="text-gray-500 text-[10px] ml-0.5">{unit}</span>
            </div>
        </div>
    )
}
