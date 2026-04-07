import { useState } from 'react'
import { ChevronDown, Copy, Check } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface ScenarioPanelProps {
    yaml: string
    engineId: string
}

export default function ScenarioPanel({ yaml, engineId }: ScenarioPanelProps) {
    const t = useTranslation()
    const [isExpanded, setIsExpanded] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(yaml)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!yaml) return null

    return (
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-800/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                        }`}
                    />
                    <div className="text-left">
                        <h3 className="font-semibold text-gray-200 text-sm">
                            {t.lab.scenario || 'Loaded Scenario'}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {t.lab.scenarioDesc || 'The YAML configuration for this running engine'}
                        </p>
                    </div>
                </div>
                <span className="text-xs text-gray-500 px-2 py-1 bg-gray-800/50 rounded">
                    {engineId}
                </span>
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="border-t border-gray-700/50">
                    <div className="flex items-center justify-between p-3 bg-gray-950/50 border-b border-gray-700/30">
                        <span className="text-xs text-gray-500">
                            {yaml.split('\n').length} lines
                        </span>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3 h-3" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3 h-3" />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                    <pre className="p-4 overflow-auto max-h-[500px] text-xs font-mono text-gray-400 bg-gray-950/30">
                        {yaml}
                    </pre>
                </div>
            )}
        </div>
    )
}
