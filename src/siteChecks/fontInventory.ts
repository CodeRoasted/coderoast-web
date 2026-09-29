import { readFileSync } from 'node:fs'
import { join, posix } from 'node:path'
import { classify, cssLoads, filesUnder } from './assetLoads'

/**
 * The self-hosted fonts are complete: every file `fonts.css` names exists, and every file beside
 * it is named by it. The build does not check either direction on its own. Vite's answer to a
 * url() naming a missing file is a warning and exit 0 — measured 2026-09-29 with inter-latin.woff2
 * deleted: the build shipped `url(./inter/inter-latin.woff2)` unresolved in its stylesheet — and
 * it emits an unnamed file nowhere, so nobody sees it. Read by selfHostedFonts.test.ts and by the
 * deploy's own build (`judgeBuiltSite`).
 */

export const FONT_INDEX = 'fonts.css'

// Beside the fonts but not a font: the index itself and each family's SIL OFL 1.1 text.
const NOT_A_FONT = (path: string): boolean => path === FONT_INDEX || posix.basename(path) === 'OFL.txt'

export interface FontInventory {
    named: string[]
    onDisk: string[]
    /** Named by fonts.css, absent on disk. */
    missing: string[]
    /** On disk, named by no url() in fonts.css. */
    unnamed: string[]
    /** A url() in fonts.css that is not a path to a file under the fonts directory. */
    notSelfHosted: string[]
}

export type FontFaults = Pick<FontInventory, 'missing' | 'unnamed' | 'notSelfHosted'>

export function fontInventory(dir: string): FontInventory {
    const named = new Set<string>()
    const notSelfHosted = new Set<string>()
    for (const load of cssLoads(FONT_INDEX, readFileSync(join(dir, FONT_INDEX), 'utf8'))) {
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

export function fontFaults(fonts: FontInventory): FontFaults {
    return { missing: fonts.missing, unnamed: fonts.unnamed, notSelfHosted: fonts.notSelfHosted }
}
