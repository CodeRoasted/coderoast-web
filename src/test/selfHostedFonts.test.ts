import { afterEach, describe, expect, it } from 'vitest'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, posix } from 'node:path'
import { fileURLToPath } from 'node:url'
import { classify, cssLoads, filesUnder } from './assetLoads'

/**
 * The self-hosted fonts are complete: every file `fonts.css` names exists, and every file beside
 * it is named by it. The build does not check either direction. Vite's answer to a url() naming a
 * missing file is a warning and exit 0 — measured 2026-09-29 with inter-latin.woff2 deleted: the
 * build shipped `url(./inter/inter-latin.woff2)` unresolved in its stylesheet — and it emits an
 * unnamed file nowhere, so nobody sees it. firstPartyAssets.test.ts also reds on the missing file,
 * from the build's side; the unnamed direction is this file's alone (measured by mutation).
 */

const FONTS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'fonts')
const INDEX = 'fonts.css'
// Beside the fonts but not a font: the index itself and each family's SIL OFL 1.1 text.
const NOT_A_FONT = (path: string): boolean => path === INDEX || posix.basename(path) === 'OFL.txt'

interface Inventory {
    named: string[]
    onDisk: string[]
    /** Named by fonts.css, absent on disk. */
    missing: string[]
    /** On disk, named by no url() in fonts.css. */
    unnamed: string[]
    /** A url() in fonts.css that is not a path to a file under the fonts directory. */
    notSelfHosted: string[]
}

function inventory(dir: string): Inventory {
    const named = new Set<string>()
    const notSelfHosted = new Set<string>()
    for (const load of cssLoads(INDEX, readFileSync(join(dir, INDEX), 'utf8'))) {
        const path = posix.normalize(load.url.replace(/[?#].*$/, ''))
        const local = classify(load.url) === 'own-origin' && !load.url.startsWith('/') && !path.startsWith('../')
        if (local) named.add(path)
        else notSelfHosted.add(load.url)
    }
    const onDisk = filesUnder(dir).filter((path) => !NOT_A_FONT(path)).sort()
    const namedList = [...named].sort()
    return {
        named: namedList,
        onDisk,
        missing: namedList.filter((path) => !onDisk.includes(path)),
        unnamed: onDisk.filter((path) => !named.has(path)),
        notSelfHosted: [...notSelfHosted].sort(),
    }
}

function verdict(fonts: Inventory): Omit<Inventory, 'named' | 'onDisk'> {
    return { missing: fonts.missing, unnamed: fonts.unnamed, notSelfHosted: fonts.notSelfHosted }
}

const CLEAN = { missing: [], unnamed: [], notSelfHosted: [] }

describe('the self-hosted fonts', () => {
    it('are complete in both directions: every file fonts.css names exists, every font file is named', () => {
        const fonts = inventory(FONTS_DIR)
        expect(fonts.named.length, `fonts.css yielded no url() at all — the reader is blind, not the tree clean`).toBeGreaterThan(0)
        expect(verdict(fonts), `named by fonts.css: ${fonts.named.join(', ')}\non disk: ${fonts.onDisk.join(', ')}`).toEqual(CLEAN)
    })
})

describe('the font inventory can fail (a synthetic fonts directory, one planted fault each)', () => {
    // Synthetic rather than a copy of src/assets/fonts, so a fault in the real tree reds the arm
    // above alone. It keeps the real file's grammar: quoted url()s, one directory per family, an
    // OFL.txt beside the fonts, and a url() inside a comment.
    const GSTATIC = 'https://fonts.gstatic.com/s/family/v1/b.woff2'
    const face = (file: string): string =>
        `@font-face {\n    font-family: 'Family';\n    src: url('${file}') format('woff2');\n}\n`
    let scratch: string | undefined
    const fixture = (faces: string[]): string => {
        scratch = mkdtempSync(join(tmpdir(), 'coderoast-web-fonts-'))
        mkdirSync(join(scratch, 'family'))
        for (const file of ['family/a.woff2', 'family/b.woff2', 'family/OFL.txt']) writeFileSync(join(scratch, file), file)
        writeFileSync(join(scratch, INDEX), `/* only each url() is local; src: url('./family/gone.woff2') */\n${faces.map(face).join('')}`)
        return scratch
    }
    afterEach(() => {
        if (scratch !== undefined) rmSync(scratch, { recursive: true, force: true })
        scratch = undefined
    })

    it('is clean when every face names a file beside it', () => {
        expect(verdict(inventory(fixture(['./family/a.woff2', './family/b.woff2'])))).toEqual(CLEAN)
    })

    it('reds a deleted font file by the name fonts.css still gives it', () => {
        const dir = fixture(['./family/a.woff2', './family/b.woff2'])
        unlinkSync(join(dir, 'family/b.woff2'))
        expect(verdict(inventory(dir))).toEqual({ ...CLEAN, missing: ['family/b.woff2'] })
    })

    it('reds a font file no url() names', () => {
        const dir = fixture(['./family/a.woff2', './family/b.woff2'])
        writeFileSync(join(dir, 'family/c.woff2'), 'family/c.woff2')
        expect(verdict(inventory(dir))).toEqual({ ...CLEAN, unnamed: ['family/c.woff2'] })
    })

    it('reds a face pointed back at Google, and the file it orphans', () => {
        const dir = fixture(['./family/a.woff2', GSTATIC])
        expect(verdict(inventory(dir))).toEqual({ missing: [], unnamed: ['family/b.woff2'], notSelfHosted: [GSTATIC] })
    })
})
