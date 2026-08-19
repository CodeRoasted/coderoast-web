import { useState } from 'react'
import type { InsightExplainMode, InsightReconfigureRequest } from '@/types/engine'
import { reconfigureInsight } from '@/services/api'
import type { InsightCopy } from './insightFormat'

// Live hot-reconfigure controls for the Config tab. Kept apart from the rest of
// the panel because it is the ONLY part that WRITES: everything else in
// InsightPanel renders server state, this posts a change back.

export interface ReconfigurePanelProps {
    engineId: string | null
    currentWindowDuration: number | null
    currentExplainMode: InsightExplainMode | null
    currentLlmModel: string | null
    /** The narration destination this engine names, empty when it names none. */
    currentLlmHost: string
    copy: InsightCopy
}

export function ReconfigurePanel({ engineId, currentWindowDuration, currentExplainMode, currentLlmModel, currentLlmHost, copy }: ReconfigurePanelProps) {
    // Narration needs a destination a human named in the deployment; there is no reconfigure key
    // for the endpoint, so a mode switch on an engine without one can only ever be refused (422).
    // A control that can only refuse is worse than no control: it reads as a capability.
    const narrationAvailable = currentLlmHost.length > 0
    const kDefaultWindowDuration = 25
    const [windowDuration, setWindowDuration] = useState<string>(
        String(currentWindowDuration ?? kDefaultWindowDuration)
    )
    const [minConfidence, setMinConfidence] = useState<string>('')
    const [maxInsights, setMaxInsights] = useState<string>('')
    // LLM model: empty string = 'None' (no LLM / rules mode)
    const [llmModel, setLlmModel] = useState<string>(currentLlmModel ?? '')
    // LLM full: true = llm_full, false = llm_augmented (only relevant when model != '')
    const [llmFull, setLlmFull] = useState<boolean>(currentExplainMode === 'llm_full')
    const [status, setStatus] = useState<'idle' | 'applying' | 'applied' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    // When model changes, if switching from None to a model, keep llmFull as-is.
    // If switching to None, clear llmFull.
    function handleModelChange(model: string) {
        setLlmModel(model)
        if (!model) setLlmFull(false)
    }

    async function handleApply() {
        if (!engineId) return
        const params: InsightReconfigureRequest = {}
        const dur = parseInt(windowDuration, 10)
        if (windowDuration.trim() && !isNaN(dur) && dur > 0) params.window_duration_seconds = dur
        const conf = parseFloat(minConfidence)
        if (minConfidence.trim() && !isNaN(conf)) params.min_confidence = conf
        const maxI = parseInt(maxInsights, 10)
        if (maxInsights.trim() && !isNaN(maxI) && maxI > 0) params.max_insights = maxI
        if (llmModel) {
            // A model is selected — derive explain_mode from the full checkbox
            params.llm_model = llmModel
            params.explain_mode = llmFull ? 'llm_full' : 'llm_augmented'
        } else {
            // None selected — switch to rules mode
            params.explain_mode = 'rules'
        }
        if (Object.keys(params).length === 0) return
        setStatus('applying')
        setErrorMsg(null)
        try {
            await reconfigureInsight(engineId, params)
            setStatus('applied')
            setTimeout(() => setStatus('idle'), 3000)
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
            setStatus('error')
        }
    }

    const fieldCls = 'w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 text-[11px] text-gray-200 font-mono focus:border-brand-500 focus:outline-none placeholder:text-gray-700'
    const labelCls = 'text-[10px] text-gray-500'

    return (
        <div className="rounded-lg border border-gray-700/60 bg-gray-950/40 p-3 space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{copy.configReconfigureTitle}</p>
                {status === 'applied' && (
                    <span className="text-[10px] text-emerald-400">{copy.configReconfigureApplied}</span>
                )}
                {status === 'error' && (
                    <span className="text-[10px] text-red-400">{copy.configReconfigureError}{errorMsg ? `: ${errorMsg}` : ''}</span>
                )}
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <label className={labelCls}>{copy.configWindowDuration}</label>
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            min={1}
                            placeholder={String(currentWindowDuration ?? kDefaultWindowDuration)}
                            value={windowDuration}
                            onChange={(e) => setWindowDuration(e.target.value)}
                            className={fieldCls}
                        />
                        <span className="text-[10px] text-gray-600 shrink-0">s</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <label className={labelCls}>{copy.configMinConfidence}</label>
                    <input
                        type="number"
                        min={0} max={1} step={0.05}
                        placeholder="0.65"
                        value={minConfidence}
                        onChange={(e) => setMinConfidence(e.target.value)}
                        className={fieldCls}
                    />
                </div>
                <div className="col-span-2 space-y-1">
                    <label className={labelCls}>{copy.configMaxInsights}</label>
                    <input
                        type="number"
                        min={1}
                        placeholder="10"
                        value={maxInsights}
                        onChange={(e) => setMaxInsights(e.target.value)}
                        className={fieldCls}
                    />
                </div>
                <div className="col-span-2 space-y-1">
                    <label className={labelCls}>{copy.configLlmModelLabel}</label>
                    <select
                        value={llmModel}
                        onChange={(e) => handleModelChange(e.target.value)}
                        disabled={!narrationAvailable}
                        title={narrationAvailable ? undefined : copy.configLlmUnavailableWhy}
                        className={`${fieldCls} disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                        <option value="">{copy.configLlmModelNone}</option>
                        <option value="gpt-4o-mini">gpt-4o-mini</option>
                        <option value="gpt-4.1">gpt-4.1</option>
                        <option value="gpt-5-mini">gpt-5-mini</option>
                        <option value="raptor-mini">raptor-mini</option>
                    </select>
                </div>
                {!narrationAvailable && (
                    <p className="col-span-2 text-[10px] leading-snug text-gray-500">
                        {copy.configLlmUnavailableWhy}
                    </p>
                )}
                {llmModel && (
                    <div className="col-span-2 flex items-center gap-2">
                        <input
                            id="llm-full-checkbox"
                            type="checkbox"
                            checked={llmFull}
                            onChange={(e) => setLlmFull(e.target.checked)}
                            className="h-3 w-3 rounded border-gray-600 bg-gray-900 accent-brand-500"
                        />
                        <label htmlFor="llm-full-checkbox" className="text-[11px] text-gray-400 cursor-pointer select-none">
                            {copy.configLlmFull}
                        </label>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] text-gray-700 italic">{copy.configReconfigureHint}</p>
                <button
                    onClick={handleApply}
                    disabled={status === 'applying' || !engineId}
                    className="rounded bg-brand-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                    {status === 'applying' ? copy.configReconfigureApplying : copy.configReconfigureApply}
                </button>
            </div>
        </div>
    )
}
