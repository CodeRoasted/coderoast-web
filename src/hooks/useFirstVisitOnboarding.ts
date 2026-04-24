import { useCallback, useEffect, useState } from 'react'
import { ONBOARDING_COOKIE, getCookie, setCookie } from '@/utils/cookies'
import { getScenario, listScenarios } from '@/services/api'
import { useEngineStore } from '@/store/useEngineStore'

const HELLO_WORLD_HINTS = ['hello_world', 'hello-world', 'hello']

/**
 * First-visit experience for the Lab:
 *   – `showFirstVisit` flips on when the onboarding cookie is missing.
 *   – `dismissFirstVisit` writes the cookie so we don't re-prompt.
 *   – `requestFirstVisit` lets the help button re-open the wizard.
 *   – On a truly empty Lab (no engine, no yaml, no scenario picked), we
 *     pre-load the "Hello World" starter so the user lands on a runnable
 *     YAML, not an empty textarea.
 */
export function useFirstVisitOnboarding() {
    const engineId = useEngineStore((s) => s.engineId)
    const scenarioYaml = useEngineStore((s) => s.scenarioYaml)
    const selectedScenarioId = useEngineStore((s) => s.selectedScenarioId)
    const setSelectedScenarioId = useEngineStore((s) => s.setSelectedScenarioId)
    const setScenarioYaml = useEngineStore((s) => s.setScenarioYaml)

    const [showFirstVisit, setShowFirstVisit] = useState(false)
    const [helloWorldLoading, setHelloWorldLoading] = useState(false)

    // Show the wizard unless the cookie is present.
    useEffect(() => {
        if (!getCookie(ONBOARDING_COOKIE)) setShowFirstVisit(true)
    }, [])

    const dismissFirstVisit = useCallback(() => {
        setShowFirstVisit(false)
        setCookie(ONBOARDING_COOKIE, '1')
    }, [])

    const requestFirstVisit = useCallback(() => setShowFirstVisit(true), [])

    // Pre-load Hello World on an empty Lab so the picker has something
    // runnable already populated.
    useEffect(() => {
        if (engineId || scenarioYaml || selectedScenarioId || helloWorldLoading) return
        let cancelled = false
        setHelloWorldLoading(true)
        listScenarios()
            .then(({ scenarios }) => {
                if (cancelled) return
                const hello = scenarios.find((s) =>
                    HELLO_WORLD_HINTS.some((h) => s.id.toLowerCase().includes(h)),
                )
                if (!hello) return
                return getScenario(hello.id).then(({ yaml }) => {
                    if (cancelled) return
                    setSelectedScenarioId(hello.id)
                    setScenarioYaml(yaml)
                })
            })
            .catch(() => undefined)
            .finally(() => {
                if (!cancelled) setHelloWorldLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [
        engineId,
        scenarioYaml,
        selectedScenarioId,
        helloWorldLoading,
        setScenarioYaml,
        setSelectedScenarioId,
    ])

    return { showFirstVisit, dismissFirstVisit, requestFirstVisit } as const
}
