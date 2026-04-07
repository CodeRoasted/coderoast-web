import { describe, it, expect } from 'vitest'
import translations from '@/i18n/translations'

describe('translations', () => {
    const langs = Object.keys(translations) as Array<keyof typeof translations>

    it('has at least EN and FR', () => {
        expect(langs).toContain('en')
        expect(langs).toContain('fr')
    })

    describe('lab section', () => {
        for (const lang of langs) {
            it(`${lang} has all required lab keys`, () => {
                const lab = translations[lang].lab
                expect(lab).toBeDefined()
                expect(lab.title).toBeTruthy()
                expect(lab.selectScenario).toBeTruthy()
                expect(lab.launchEngine).toBeTruthy()
                expect(lab.noScenarioSelected).toBeTruthy()
                expect(lab.yamlPlaceholder).toBeTruthy()
                expect(lab.loadingScenarios).toBeTruthy()
                expect(lab.scenarioLoadError).toBeTruthy()
            })
        }

        it('EN and FR have identical lab keys', () => {
            const enKeys = Object.keys(translations.en.lab).sort()
            const frKeys = Object.keys(translations.fr.lab).sort()
            expect(enKeys).toEqual(frKeys)
        })
    })

    describe('nav section', () => {
        for (const lang of langs) {
            it(`${lang} has all required nav keys`, () => {
                const nav = translations[lang].nav
                expect(nav.home).toBeTruthy()
                expect(nav.portfolio).toBeTruthy()
                expect(nav.logcraft).toBeTruthy()
                expect(nav.lab).toBeTruthy()
            })
        }

        it('EN and FR have identical nav keys', () => {
            const enKeys = Object.keys(translations.en.nav).sort()
            const frKeys = Object.keys(translations.fr.nav).sort()
            expect(enKeys).toEqual(frKeys)
        })
    })
})
