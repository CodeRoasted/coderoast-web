import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    ArrowRight,
    Check,
    FlaskConical,
    Beaker,
    PresentationIcon,
    GraduationCap,
    Compass,
    Loader2,
    AlertCircle,
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { listScenarios, getScenario, TierRequiredError, type ScenarioMeta } from '@/services/api'
import { useEngineStore } from '@/store/useEngineStore'

interface Props {
    open: boolean
    onClose: () => void
    /** Called once a scenario is loaded into the store. */
    onReady: () => void
    /** Called when the user explicitly asks to launch from the wizard. */
    onLaunch: () => void
}

type Intent = 'test' | 'demo' | 'train' | 'explore'
type Complexity = 'simple' | 'realistic' | 'chaos'

interface IntentOption {
    id: Intent
    icon: JSX.Element
    title: string
    desc: string
}

interface ComplexityOption {
    id: Complexity
    title: string
    desc: string
}

/**
 * 3-step onboarding wizard. Goal: get a non-expert from "what is this thing?"
 * to "engine running" in three clicks. We never enumerate scenarios in the
 * modal — instead we map (intent, complexity) to a keyword pattern and pick
 * the first matching scenario from the backend's catalog. Falls back to the
 * pre-loaded "hello_world" scenario if nothing matches, so the wizard never
 * dead-ends the user.
 */
export default function OnboardingModal({ open, onClose, onReady, onLaunch }: Props) {
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
            setError(null)
        }
    }, [open])

    // Lazy-load the scenario catalog the first time we render the modal so
    // we can map intent + complexity to an actual scenario id.
    useEffect(() => {
        if (!open || scenarios.length > 0) return
        let cancelled = false
        listScenarios()
            .then(({ scenarios: list }) => {
                if (!cancelled) setScenarios(list)
            })
            .catch((e) => {
                if (!cancelled) setError(e instanceof Error ? e.message : String(e))
            })
        return () => {
            cancelled = true
        }
    }, [open, scenarios.length])

    const intentOptions: IntentOption[] = useMemo(
        () => [
            {
                id: 'explore',
                icon: <Compass className="w-5 h-5" />,
                title: t.lab.onboarding.intents.explore.title,
                desc: t.lab.onboarding.intents.explore.desc,
            },
            {
                id: 'test',
                icon: <Beaker className="w-5 h-5" />,
                title: t.lab.onboarding.intents.test.title,
                desc: t.lab.onboarding.intents.test.desc,
            },
            {
                id: 'demo',
                icon: <PresentationIcon className="w-5 h-5" />,
                title: t.lab.onboarding.intents.demo.title,
                desc: t.lab.onboarding.intents.demo.desc,
            },
            {
                id: 'train',
                icon: <GraduationCap className="w-5 h-5" />,
                title: t.lab.onboarding.intents.train.title,
                desc: t.lab.onboarding.intents.train.desc,
            },
        ],
        [t],
    )

    const complexityOptions: ComplexityOption[] = useMemo(
        () => [
            {
                id: 'simple',
                title: t.lab.onboarding.complexity.simple.title,
                desc: t.lab.onboarding.complexity.simple.desc,
            },
            {
                id: 'realistic',
                title: t.lab.onboarding.complexity.realistic.title,
                desc: t.lab.onboarding.complexity.realistic.desc,
            },
            {
                id: 'chaos',
                title: t.lab.onboarding.complexity.chaos.title,
                desc: t.lab.onboarding.complexity.chaos.desc,
            },
        ],
        [t],
    )

    /**
     * Pick the best scenario for an (intent, complexity) pair.
     * Uses keyword matching against scenario id/category — pragmatic over
     * elegant. Falls back through a sensible chain: targeted match → any
     * scenario in the matching category → "hello world" → first scenario.
     */
    function selectScenario(i: Intent, c: Complexity): ScenarioMeta | null {
        if (scenarios.length === 0) return null
        const lc = (s: ScenarioMeta) => `${s.id} ${s.category} ${s.name}`.toLowerCase()

        // Categories returned by the server are the directory names: 01_starter, 02_daily, 03_real_life
        const categoryFor: Record<Complexity, string> = {
            simple: '01_starter',
            realistic: '02_daily',
            chaos: '03_real_life',
        }
        // Keywords matched against `{id} {category} {name}` (all lowercased)
        const intentKeywords: Record<Intent, string[]> = {
            explore: ['hello', 'starter', 'simple'],
            test: ['two_agents', 'phases', 'custom_fields', 'outputs', 'http_sinks'],
            demo: ['ecommerce', 'microservices', 'kafka', 'reallife', 'production'],
            train: ['incident', 'failure', 'outage', 'cascade', 'training'],
        }

        const wantedCategory = categoryFor[c]
        const keywords = intentKeywords[i]
        const inCategory = scenarios.filter((s) =>
            (s.category || '').toLowerCase().includes(wantedCategory),
        )
        const targeted = inCategory.find((s) =>
            keywords.some((k) => lc(s).includes(k)),
        )
        if (targeted) return targeted

        if (inCategory.length > 0) return inCategory[0] ?? null

        const hello = scenarios.find((s) => lc(s).includes('hello'))
        if (hello) return hello

        return scenarios[0] ?? null
    }

    async function handleConfirm() {
        if (!intent || !complexity) return
        const pick = selectScenario(intent, complexity)
        if (!pick) {
            setError(t.lab.onboarding.noScenarioFound)
            return
        }
        setPicked(pick)
        setLoading(true)
        setError(null)
        try {
            const { yaml } = await getScenario(pick.id)
            setSelectedScenarioId(pick.id)
            setScenarioYaml(yaml)
            setStep(3)
            onReady()
        } catch (e) {
            if (e instanceof TierRequiredError) {
                setError(t.lab.onboarding.tierLocked)
            } else {
                setError(e instanceof Error ? e.message : String(e))
            }
        } finally {
            setLoading(false)
        }
    }

    function handleLaunch() {
        onLaunch()
        onClose()
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={onClose}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="onboarding-title"
                >
                    <motion.div
                        initial={{ scale: 0.96, y: 12 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.96, y: 12 }}
                        className="relative w-full max-w-2xl rounded-2xl bg-gray-900 border border-gray-700/60 shadow-2xl shadow-brand-600/10 p-6 sm:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-1.5 rounded text-gray-500 hover:text-gray-200 hover:bg-gray-800/60 transition-colors"
                            aria-label={t.lab.onboarding.skip}
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Step indicator */}
                        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-gray-500">
                            {[1, 2, 3].map((n) => (
                                <span
                                    key={n}
                                    className={`h-1.5 flex-1 rounded-full transition-colors ${step >= n ? 'bg-brand-500' : 'bg-gray-800'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Step 1 — intent */}
                        {step === 1 && (
                            <div>
                                <h2
                                    id="onboarding-title"
                                    className="font-display text-2xl font-bold text-white mb-1"
                                >
                                    {t.lab.onboarding.step1Title}
                                </h2>
                                <p className="text-sm text-gray-400 mb-6">
                                    {t.lab.onboarding.step1Subtitle}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {intentOptions.map((opt) => {
                                        const selected = intent === opt.id
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={() => setIntent(opt.id)}
                                                className={`text-left p-4 rounded-xl border transition-all ${selected
                                                        ? 'border-brand-500 bg-brand-500/10'
                                                        : 'border-gray-700/60 bg-gray-800/40 hover:border-gray-600 hover:bg-gray-800/70'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className={`inline-flex p-2 rounded-lg ${selected
                                                                ? 'bg-brand-600 text-white'
                                                                : 'bg-gray-800 text-brand-400'
                                                            }`}
                                                    >
                                                        {opt.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold text-white text-sm mb-0.5">
                                                            {opt.title}
                                                        </div>
                                                        <p className="text-xs text-gray-400 leading-relaxed">
                                                            {opt.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                                <div className="mt-6 flex justify-between gap-2">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200"
                                    >
                                        {t.lab.onboarding.skip}
                                    </button>
                                    <button
                                        onClick={() => intent && setStep(2)}
                                        disabled={!intent}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                                    >
                                        {t.lab.onboarding.next}
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2 — complexity */}
                        {step === 2 && (
                            <div>
                                <h2
                                    id="onboarding-title"
                                    className="font-display text-2xl font-bold text-white mb-1"
                                >
                                    {t.lab.onboarding.step2Title}
                                </h2>
                                <p className="text-sm text-gray-400 mb-6">
                                    {t.lab.onboarding.step2Subtitle}
                                </p>
                                <div className="space-y-2">
                                    {complexityOptions.map((opt) => {
                                        const selected = complexity === opt.id
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={() => setComplexity(opt.id)}
                                                className={`w-full text-left p-4 rounded-xl border transition-all ${selected
                                                        ? 'border-brand-500 bg-brand-500/10'
                                                        : 'border-gray-700/60 bg-gray-800/40 hover:border-gray-600 hover:bg-gray-800/70'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-white text-sm mb-0.5">
                                                            {opt.title}
                                                        </div>
                                                        <p className="text-xs text-gray-400 leading-relaxed">
                                                            {opt.desc}
                                                        </p>
                                                    </div>
                                                    {selected && (
                                                        <Check className="w-4 h-4 text-brand-400 shrink-0" />
                                                    )}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                                {error && (
                                    <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-red-900/20 border border-red-700/50 text-xs text-red-400">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>{error}</span>
                                    </div>
                                )}
                                <div className="mt-6 flex justify-between gap-2">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200"
                                    >
                                        {t.lab.onboarding.back}
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={!complexity || loading}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                                    >
                                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                        {t.lab.onboarding.pickScenario}
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3 — confirm + launch */}
                        {step === 3 && picked && (
                            <div>
                                <h2
                                    id="onboarding-title"
                                    className="font-display text-2xl font-bold text-white mb-1"
                                >
                                    {t.lab.onboarding.step3Title}
                                </h2>
                                <p className="text-sm text-gray-400 mb-6">
                                    {t.lab.onboarding.step3Subtitle}
                                </p>
                                <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/60 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                                            {picked.category}
                                        </span>
                                    </div>
                                    <div className="font-semibold text-white text-base mb-1">
                                        {picked.name || picked.id}
                                    </div>
                                    {picked.description && (
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            {picked.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-between gap-2">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200"
                                    >
                                        {t.lab.onboarding.back}
                                    </button>
                                    <button
                                        onClick={handleLaunch}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-brand-600 to-orange-500 text-white text-sm font-semibold shadow-lg shadow-brand-600/30 hover:shadow-brand-500/40 transition-all"
                                    >
                                        <FlaskConical className="w-3.5 h-3.5" />
                                        {t.lab.onboarding.launch}
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
