import { useEffect, useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { listScenarios, getScenario, PolicyDenialError, type ScenarioMeta } from '@/services/api'
import { useEngineStore } from '@/store/useEngineStore'
import type { PlaygroundMode } from '@/types/playground'
import OnboardingShell from './onboarding/OnboardingShell'
import StepIntent from './onboarding/StepIntent'
import StepComplexity from './onboarding/StepComplexity'
import StepConfirm from './onboarding/StepConfirm'
import { pickScenario, type Complexity, type Intent } from './onboarding/scenarioPicker'

interface Props {
    open: boolean
    mode: PlaygroundMode
    onClose: () => void
    /** Called once a scenario is loaded into the store. */
    onReady: () => void
    /** Called when the user explicitly asks to launch from the wizard. */
    onLaunch: () => void
}

const TITLE_ID = 'onboarding-title'

/**
 * 3-step onboarding wizard. Goal: get a non-expert from "what is this thing?"
 * to "engine running" in three clicks.
 *
 * Step 1: Intent (Explore / Test / Demo / Train)
 * Step 2: Complexity (Simple / Realistic / Chaos)  → loads the matching scenario
 * Step 3: Confirm + Launch
 *
 * The (intent, complexity) → scenario mapping lives in `./onboarding/scenarioPicker`.
 */
export default function OnboardingModal({ open, mode, onClose, onReady, onLaunch }: Props) {
    const t = useTranslation()
    const setSelectedScenarioId = useEngineStore((s) => s.setSelectedScenarioId)
    const setScenarioYaml = useEngineStore((s) => s.setScenarioYaml)

    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [intent, setIntent] = useState<Intent | null>(null)
    const [complexity, setComplexity] = useState<Complexity | null>(null)
    const [scenarios, setScenarios] = useState<ScenarioMeta[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [picked, setPicked] = useState<ScenarioMeta | null>(null)

    // Reset to step 1 each time the modal is opened.
    useEffect(() => {
        if (open) {
            setStep(1)
            setIntent(null)
            setComplexity(null)
            setPicked(null)
            setScenarios([])
            setError(null)
        }
    }, [mode, open])

    // Lazy-load the scenario catalog the first time we render the modal so
    // we can map intent + complexity to an actual scenario id.
    useEffect(() => {
        if (!open || scenarios.length > 0) return
        let cancelled = false
        listScenarios(mode)
            .then(({ scenarios: list }) => {
                if (!cancelled) setScenarios(list)
            })
            .catch((e) => {
                if (!cancelled) setError(e instanceof Error ? e.message : String(e))
            })
        return () => {
            cancelled = true
        }
    }, [mode, open, scenarios.length])

    async function handleConfirm() {
        if (!intent || !complexity) return
        const pick = pickScenario(scenarios, intent, complexity)
        if (!pick) {
            setError(t.lab.onboarding.noScenarioFound)
            return
        }
        setPicked(pick)
        setLoading(true)
        setError(null)
        try {
            const { yaml } = await getScenario(pick.id, mode)
            setSelectedScenarioId(pick.id)
            setScenarioYaml(yaml)
            setStep(3)
            onReady()
        } catch (e) {
            if (e instanceof PolicyDenialError) {
                setError(t.lab.onboarding.tierLocked)
            } else {
                setError(e instanceof Error ? e.message : String(e))
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <OnboardingShell
            open={open}
            onClose={onClose}
            step={step}
            totalSteps={3}
            closeLabel={t.lab.onboarding.skip}
            titleId={TITLE_ID}
        >
            {step === 1 && (
                <StepIntent
                    titleId={TITLE_ID}
                    selected={intent}
                    onSelect={setIntent}
                    onSkip={onClose}
                    onNext={() => intent && setStep(2)}
                />
            )}
            {step === 2 && (
                <StepComplexity
                    titleId={TITLE_ID}
                    selected={complexity}
                    error={error}
                    loading={loading}
                    onSelect={setComplexity}
                    onBack={() => setStep(1)}
                    onConfirm={handleConfirm}
                />
            )}
            {step === 3 && picked && (
                <StepConfirm
                    titleId={TITLE_ID}
                    picked={picked}
                    onBack={() => setStep(2)}
                    onLaunch={() => {
                        onLaunch()
                        onClose()
                    }}
                />
            )}
        </OnboardingShell>
    )
}
