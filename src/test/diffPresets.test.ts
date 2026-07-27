// diffPresets.test.ts — the /diff demo presets, and the two things about them
// that are not allowed to drift silently.
//
// 1. PROVENANCE IS BINDING (technical_docs/product/web_copy.md, § "/diff demo
//    presets — the provenance rule"). Every preset declares whether it is a real
//    CI run or a generated fixture, and both labels exist in both languages. An
//    unlabelled fixture beside a labelled real log lets a visitor assume the
//    fixture is real too, which would mean the generated ones borrowing the real
//    pair's credibility.
//
// 2. THE BYTES ARE THE ONES WE QUOTE NUMBERS FOR. The real samples are vendored
//    copies of coderoast-hub's showcase/sift/ artifacts. Their sha256 is recorded
//    three times — in MANIFEST.json, in diffPresets.ts, and implicitly in the
//    files themselves — and this suite makes all three agree. Without that, a
//    re-vendoring (or a git filter rewriting a line ending, or a BOM being eaten
//    in transit) would ship different bytes than the ones whose published change
//    counts the page headlines, and nothing would say so.
//
// It also gates the ONE number that must never reach this surface: the raw pair's
// higher significant-change count. Ten of those findings were Sift reading its own
// report out of our dogfooded CI log — circular. The published pair removes that
// step as a declared transformation; the manifest keeps the raw count on the
// record under `significant_changes_on_the_raw_pair`, and the website does not.

import { describe, expect, it, vi, afterEach } from 'vitest'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { diffPresets, type RealCiPreset } from '@/data/diffPresets'
import en from '@/i18n/en'
import fr from '@/i18n/fr'

// vitest runs from the repo root, so cwd is the stable anchor here.
const VENDORED = join(process.cwd(), 'src/assets/sift-showcase')

interface ManifestSample {
    file: string
    sha256_published: string
    lines_published: number
}
interface ManifestPair {
    name: string
    baseline: string
    changed: string
    significant_changes: number
    plain_text_diff_lines: number
    declared: { significant_changes_on_the_raw_pair: number }
}
interface Manifest {
    samples: ManifestSample[]
    pairs: ManifestPair[]
}

const manifest: Manifest = JSON.parse(readFileSync(join(VENDORED, 'MANIFEST.json'), 'utf8'))

const realPresets = diffPresets.filter(
    (preset): preset is RealCiPreset => preset.provenance === 'real-ci'
)

/** The manifest pair whose two logs are exactly this preset's two logs. */
function manifestPairFor(preset: RealCiPreset): ManifestPair {
    const pair = manifest.pairs.find(
        (candidate) =>
            basename(candidate.baseline) === preset.samples.baseline.file &&
            basename(candidate.changed) === preset.samples.changed.file
    )
    expect(
        pair,
        `no MANIFEST.json pair uses ${preset.samples.baseline.file} → ${preset.samples.changed.file}, ` +
            `so preset '${preset.id}' cites figures nothing published backs.\n` +
            `manifest pairs: ${manifest.pairs
                .map((p) => `${p.name} (${basename(p.baseline)} → ${basename(p.changed)})`)
                .join(', ')}`
    ).toBeDefined()
    return pair as ManifestPair
}

/** Everything a preset says in one language, as one blob to scan. */
function copyBlob(id: string, tree: typeof en): string {
    const meta = (tree.diff.presets as Record<string, { label: string; description: string; story?: string[] }>)[id]
    if (!meta) return ''
    return [meta.label, meta.description, ...(meta.story ?? [])].join('\n')
}

/** A figure as the copy may legitimately spell it: 5571, 5 571, 5 571, 5,571. */
function figurePattern(value: number): RegExp {
    const grouped = String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '[\\s  ,]?')
    return new RegExp(`(?<!\\d)${grouped}(?!\\d)`)
}

describe('diff presets — provenance', () => {
    it('the picker copy and the preset list are the same set — no orphan, no unlabelled id', () => {
        // `t.diff.presets` is only ever read through an ancestor reference, so
        // i18nKeys.test.ts's orphan sweep cannot see a stale entry in here.
        const ids = new Set(diffPresets.map((preset) => preset.id))
        expect(ids.size, 'a preset id is duplicated').toBe(diffPresets.length)
        for (const [lang, tree] of Object.entries({ en, fr })) {
            const keys = Object.keys(tree.diff.presets)
            const orphans = keys.filter((key) => !ids.has(key))
            expect(
                orphans,
                `${lang}.diff.presets has ${orphans.length} entr(ies) no preset uses: ${orphans.join(', ')}`
            ).toEqual([])
            expect(
                keys.length,
                `${lang}.diff.presets covers ${keys.length} of ${ids.size} presets`
            ).toBe(ids.size)
        }
    })

    it('both provenance labels carry text in EN and FR', () => {
        for (const [lang, tree] of Object.entries({ en, fr })) {
            expect(tree.diff.provenance.realCi.trim(), `${lang}.diff.provenance.realCi`).not.toBe('')
            expect(tree.diff.provenance.generated.trim(), `${lang}.diff.provenance.generated`).not.toBe('')
            expect(tree.diff.provenanceNote.realCi.trim(), `${lang}.diff.provenanceNote.realCi`).not.toBe('')
            expect(tree.diff.provenanceNote.generated.trim(), `${lang}.diff.provenanceNote.generated`).not.toBe('')
        }
        // The EN wording is the one web_copy.md fixes verbatim.
        expect(en.diff.provenance.realCi).toBe('Real CI run · anonymized')
        expect(en.diff.provenance.generated).toBe('Generated fixture')
    })

    it('every preset id has picker copy in EN and FR', () => {
        for (const [lang, tree] of Object.entries({ en, fr })) {
            const missing = diffPresets
                .map((preset) => preset.id)
                .filter((id) => copyBlob(id, tree).trim() === '')
            expect(
                missing,
                `${missing.length} preset(s) would render with a raw id and no tooltip in ${lang}: ` +
                    missing.join(', ')
            ).toEqual([])
        }
    })

    it('the real CI pairs lead the picker — they are what carries the credibility', () => {
        const kinds = diffPresets.map((preset) => preset.provenance)
        const firstGenerated = kinds.indexOf('generated')
        const lastReal = kinds.lastIndexOf('real-ci')
        expect(lastReal, `preset order: ${diffPresets.map((p) => `${p.id}:${p.provenance}`).join(', ')}`)
            .toBeLessThan(firstGenerated)
        expect(realPresets.length).toBe(2)
    })
})

describe('diff presets — the real samples are the published bytes', () => {
    it('each vendored log hashes to the sha256 the preset pins AND the manifest publishes', () => {
        for (const preset of realPresets) {
            for (const [side, sample] of Object.entries(preset.samples)) {
                const bytes = readFileSync(join(VENDORED, sample.file))
                const actual = createHash('sha256').update(bytes).digest('hex')
                const declared = manifest.samples.find((entry) => basename(entry.file) === sample.file)

                expect(
                    declared,
                    `${preset.id}.${side}: ${sample.file} is not a sample MANIFEST.json describes`
                ).toBeDefined()
                expect(
                    actual,
                    `${preset.id}.${side}: the vendored ${sample.file} is NOT the bytes diffPresets.ts pins.\n` +
                        `  on disk : ${actual}\n  pinned  : ${sample.sha256}\n` +
                        `Re-vendor from coderoast-hub/showcase/sift/logs/ or update the pin — but the ` +
                        `published change counts belong to the pinned bytes, not to whatever is on disk.`
                ).toBe(sample.sha256)
                expect(
                    actual,
                    `${preset.id}.${side}: ${sample.file} does not match MANIFEST.json's sha256_published.\n` +
                        `  on disk  : ${actual}\n  manifest : ${declared?.sha256_published}`
                ).toBe(declared?.sha256_published)
            }
        }
    })

    it('the UTF-8 BOM the runner emitted is still there — the artifact is byte-faithful', () => {
        for (const preset of realPresets) {
            for (const [side, sample] of Object.entries(preset.samples)) {
                const head = readFileSync(join(VENDORED, sample.file)).subarray(0, 3)
                expect(
                    [...head],
                    `${preset.id}.${side}: ${sample.file} lost its BOM — something normalised the bytes`
                ).toEqual([0xef, 0xbb, 0xbf])
            }
        }
    })

    it('each real preset headlines MANIFEST.json\'s own figures, not re-derived ones', () => {
        for (const preset of realPresets) {
            const pair = manifestPairFor(preset)
            expect(
                preset.figures.plainTextDiffLines,
                `${preset.id}: plain-diff figure disagrees with MANIFEST.json pair '${pair.name}'`
            ).toBe(pair.plain_text_diff_lines)
            expect(
                preset.figures.significantChanges,
                `${preset.id}: significant-change figure disagrees with MANIFEST.json pair '${pair.name}'`
            ).toBe(pair.significant_changes)
        }
    })
})

describe('diff presets — the copy may not drift from the artifact', () => {
    it('states the published plain-diff figure, in EN and FR', () => {
        for (const preset of realPresets) {
            const pair = manifestPairFor(preset)
            const pattern = figurePattern(pair.plain_text_diff_lines)
            for (const [lang, tree] of Object.entries({ en, fr })) {
                const blob = copyBlob(preset.id, tree)
                expect(
                    pattern.test(blob),
                    `${lang} copy for '${preset.id}' does not state ${pair.plain_text_diff_lines} ` +
                        `(MANIFEST.json pair '${pair.name}'.plain_text_diff_lines). The figure moved in ` +
                        `the artifact and the sentence beside it did not.\ncopy:\n${blob}`
                ).toBe(true)
            }
        }
    })

    it('never surfaces the RAW pair\'s significant-change count', () => {
        for (const preset of realPresets) {
            const pair = manifestPairFor(preset)
            const raw = pair.declared.significant_changes_on_the_raw_pair
            if (raw === pair.significant_changes) continue // nothing was removed; nothing to hide
            const pattern = figurePattern(raw)
            for (const [lang, tree] of Object.entries({ en, fr })) {
                const blob = copyBlob(preset.id, tree)
                expect(
                    pattern.test(blob),
                    `${lang} copy for '${preset.id}' contains ${raw} — the count on the RAW pair, ` +
                        `which includes findings that are only our own CI's Sift step reporting on ` +
                        `itself. That is circular and a skeptic catches it. The published count is ` +
                        `${pair.significant_changes}.\ncopy:\n${blob}`
                ).toBe(false)
            }
        }
    })
})

describe('diff presets — loading', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('generated fixtures resolve without any network, and identically every time', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('a generated fixture must not fetch'))))
        for (const preset of diffPresets.filter((entry) => entry.provenance === 'generated')) {
            const first = await preset.load()
            const second = await preset.load()
            expect(first.baseline.length, `${preset.id}: empty baseline`).toBeGreaterThan(0)
            expect(first.changed.length, `${preset.id}: empty changed`).toBeGreaterThan(0)
            expect(second, `${preset.id}: two loads produced different text`).toEqual(first)
        }
    })

    // ORDER MATTERS in this describe: the failure case must run before anything
    // has successfully cached a sample, otherwise there is nothing left to fetch.
    it('a failed fetch surfaces as a rejection and does NOT poison the cache', async () => {
        const failing = vi.fn(async () => ({ ok: false, status: 503, statusText: 'Service Unavailable' }))
        vi.stubGlobal('fetch', failing)
        await expect(realPresets[0]?.load()).rejects.toThrow(/503/)
        expect(failing, 'both logs of the pair should have been attempted').toHaveBeenCalled()
    })

    it('fetches the published bytes, keeps the BOM, and serves a second visit from cache', async () => {
        const served = new Map<string, Buffer>()
        for (const preset of realPresets) {
            for (const sample of Object.values(preset.samples)) {
                served.set(sample.url, readFileSync(join(VENDORED, sample.file)))
            }
        }
        const fetcher = vi.fn(async (url: string) => {
            const bytes = served.get(url)
            if (!bytes) throw new Error(`test served no bytes for ${url}`)
            return {
                ok: true,
                status: 200,
                statusText: 'OK',
                arrayBuffer: async () =>
                    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
            }
        })
        vi.stubGlobal('fetch', fetcher)

        const noise = realPresets[0] as RealCiPreset
        const pair = await noise.load()
        expect(fetcher).toHaveBeenCalledTimes(2)
        // Response.text() would have eaten this; the decoder is asked not to.
        expect(pair.baseline.charCodeAt(0), 'the leading U+FEFF did not survive decoding').toBe(0xfeff)
        expect(pair.baseline.split('\n').length).toBeGreaterThan(3000)

        // The second real pair shares its baseline with the first — one new fetch only.
        const triage = realPresets[1] as RealCiPreset
        expect(triage.samples.baseline.file).toBe(noise.samples.baseline.file)
        await triage.load()
        expect(fetcher, 'the shared baseline was fetched twice — the cache is not keying on URL')
            .toHaveBeenCalledTimes(3)

        await noise.load()
        expect(fetcher, 'a repeat visit re-fetched instead of serving from cache').toHaveBeenCalledTimes(3)
    })
})
