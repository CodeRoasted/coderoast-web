import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ReconfigurePanel } from '@/components/playground/ReconfigurePanel'
import { reconfigureInsight } from '@/services/api'
import en from '@/i18n/en'

vi.mock('@/services/api', () => ({
    reconfigureInsight: vi.fn().mockResolvedValue({ engine_id: 'eng-1', applied: {} }),
}))

/**
 * The narration destination — endpoint AND model — is the deployment's (the server reads
 * CODEROAST_LLM_* at startup and answers 422 to a reconfigure naming `llm_model`). So the panel
 * offers the one narration choice a caller keeps, the explain mode, and a request it sends never
 * carries a model. The model list the panel used to offer named paid models, which is exactly the
 * choice a caller may not make.
 */
describe('ReconfigurePanel', () => {
    const copy = en.lab.insight

    beforeEach(() => {
        vi.mocked(reconfigureInsight).mockClear()
    })

    it('sends the chosen explain mode and never a model', async () => {
        render(
            <ReconfigurePanel
                engineId="eng-1"
                currentWindowDuration={25}
                currentExplainMode="rules"
                currentLlmHost="models.example.test"
                copy={copy}
            />,
        )

        fireEvent.change(screen.getByDisplayValue(copy.configNarrationRules), { target: { value: 'llm_full' } })
        fireEvent.click(screen.getByRole('button', { name: copy.configReconfigureApply }))

        await waitFor(() => expect(reconfigureInsight).toHaveBeenCalledTimes(1))
        expect(reconfigureInsight).toHaveBeenCalledWith('eng-1', expect.objectContaining({ explain_mode: 'llm_full' }))
        expect(vi.mocked(reconfigureInsight).mock.calls[0]?.[1]).not.toHaveProperty('llm_model')
    })

    it('offers no model to choose and disables narration on a deployment declaring no destination', () => {
        render(
            <ReconfigurePanel
                engineId="eng-1"
                currentWindowDuration={25}
                currentExplainMode="rules"
                currentLlmHost=""
                copy={copy}
            />,
        )

        expect(screen.queryByRole('option', { name: 'gpt-4.1' })).toBeNull()
        expect(screen.getByDisplayValue(copy.configNarrationRules)).toBeDisabled()
    })
})
