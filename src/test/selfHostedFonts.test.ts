import { afterEach, describe, expect, it } from 'vitest'
import { mkdirSync, mkdtempSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FONT_INDEX, fontFaults, fontInventory } from '../siteChecks/fontInventory'

/**
 * The self-hosted fonts are complete (src/siteChecks/fontInventory.ts, which the deploy's build
 * also runs). firstPartyAssets.test.ts also reds on a missing file, from the build's side; the
 * unnamed direction is the inventory's alone (measured by mutation).
 */

const FONTS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'fonts')
const CLEAN = { missing: [], unnamed: [], notSelfHosted: [] }

describe('the self-hosted fonts', () => {
    it('are complete in both directions: every file fonts.css names exists, every font file is named', () => {
        const fonts = fontInventory(FONTS_DIR)
        expect(fonts.named.length, `fonts.css yielded no url() at all — the reader is blind, not the tree clean`).toBeGreaterThan(0)
        expect(fontFaults(fonts), `named by fonts.css: ${fonts.named.join(', ')}\non disk: ${fonts.onDisk.join(', ')}`).toEqual(CLEAN)
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
        writeFileSync(join(scratch, FONT_INDEX), `/* only each url() is local; src: url('./family/gone.woff2') */\n${faces.map(face).join('')}`)
        return scratch
    }
    afterEach(() => {
        if (scratch !== undefined) rmSync(scratch, { recursive: true, force: true })
        scratch = undefined
    })

    it('is clean when every face names a file beside it', () => {
        expect(fontFaults(fontInventory(fixture(['./family/a.woff2', './family/b.woff2'])))).toEqual(CLEAN)
    })

    it('reds a deleted font file by the name fonts.css still gives it', () => {
        const dir = fixture(['./family/a.woff2', './family/b.woff2'])
        unlinkSync(join(dir, 'family/b.woff2'))
        expect(fontFaults(fontInventory(dir))).toEqual({ ...CLEAN, missing: ['family/b.woff2'] })
    })

    it('reds a font file no url() names', () => {
        const dir = fixture(['./family/a.woff2', './family/b.woff2'])
        writeFileSync(join(dir, 'family/c.woff2'), 'family/c.woff2')
        expect(fontFaults(fontInventory(dir))).toEqual({ ...CLEAN, unnamed: ['family/c.woff2'] })
    })

    it('reds a face pointed back at Google, and the file it orphans', () => {
        const dir = fixture(['./family/a.woff2', GSTATIC])
        expect(fontFaults(fontInventory(dir))).toEqual({ missing: [], unnamed: ['family/b.woff2'], notSelfHosted: [GSTATIC] })
    })
})
