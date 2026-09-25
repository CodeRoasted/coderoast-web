import { useState } from 'react'
import type { InsightExplainMode, InsightReconfigureRequest } from '@/types/engine'
import { reconfigureInsight } from '@/services/api'
import type { InsightCopy } from './insightFormat'

// Live hot-reconfigure controls for the Config tab. Kept apart from the rest of
// the panel because it is the ONLY part that WRITES: everything else in
// InsightPanel renders server state, this posts a change back.

export interface ReconfigurePanelProps {
    engineId: string | null
    currentExplainMode: InsightExplainMode | null
    /** The narration destination the deployment declares, empty when it declares none. */
    currentLlmHost: string
    copy: InsightCopy
}

export function ReconfigurePanel({ engineId, currentExplainMode, currentLlmHost, copy }: ReconfigurePanelProps) {
    // Narration goes where the DEPLOYMENT says (CODEROAST_LLM_ENDPOINT on the server): no request
    // names an endpoint or a model, so a mode switch on a deployment without one can only ever be
    // refused (422). A control that can only refuse is worse than no control: it reads as a capability.
    const narrationAvailable = currentLlmHost.length > 0
    // The window length is not offered: it is the scenario's shm_window_seal_interval_seconds, fixed
    // when the engine is built, and the server answers 422 to a reconfigure naming it.
    const [minConfidence, setMinConfidence] = useState<string>('')
    const [maxInsights, setMaxInsights] = useState<string>('')
    // The explain mode is the one narration choice a caller keeps; the model is the deployment's.
    const [explainMode, setExplainMode] = useState<InsightExplainMode>(currentExplainMode ?? 'rules')
    const [status, setStatus] = useState<'idle' | 'applying' | 'applied' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    async function handleApply() {
        if (!engineId) return
        const params: InsightReconfigureRequest = {}
        const conf = parseFloat(minConfidence)
        if (minConfidence.trim() && !isNaN(conf)) params.min_confidence = conf
        const maxI = parseInt(maxInsights, 10)
        if (maxInsights.trim() && !isNaN(maxI) && maxI > 0) params.max_insights = maxI
        params.explain_mode = explainMode
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
                <div className="col-span-2 space-y-1">
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
                    <label className={labelCls}>{copy.configNarrationLabel}</label>
                    <select
                        value={explainMode}
                        onChange={(e) => setExplainMode(e.target.value as InsightExplainMode)}
                        disabled={!narrationAvailable}
                        title={narrationAvailable ? undefined : copy.configLlmUnavailableWhy}
                        className={`${fieldCls} disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                        <option value="rules">{copy.configNarrationRules}</option>
                        <option value="llm_augmented">{copy.configNarrationAugmented}</option>
                        <option value="llm_full">{copy.configNarrationFull}</option>
                    </select>
                </div>
                {!narrationAvailable && (
                    <p className="col-span-2 text-[10px] leading-snug text-gray-500">
                        {copy.configLlmUnavailableWhy}
                    </p>
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
