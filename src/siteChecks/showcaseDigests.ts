import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { basename, extname, join, posix } from 'node:path'
import { dispositionOf } from './assetLoads'

/**
 * The Sift showcase logs the site serves are the bytes a judging run cleared, and the digest is
 * the anchor between the two. `MANIFEST.json` is vendored from coderoast-hub's showcase/sift/,
 * written by the run that judged those logs, and its `sha256_published` is the digest of what
 * that run judged. The deploy's build re-derives the same digest over what it EMITS, in the run
 * that publishes, and refuses on any other bytes (ADR-33.D8, discharge 2). diffPresets.test.ts
 * reads the same manifest to hold the vendored sources and the preset pins to it.
 */

export const SHOWCASE_DIR = posix.join('src', 'assets', 'sift-showcase')
export const SHOWCASE_MANIFEST = 'MANIFEST.json'

export interface ShowcaseSample {
    file: string
    sha256_published: string
    lines_published: number
}

export interface ShowcasePair {
    name: string
    baseline: string
    changed: string
    significant_changes: number
    plain_text_diff_lines: number
    declared: { significant_changes_on_the_raw_pair: number }
}

export interface ShowcaseManifest {
    samples: ShowcaseSample[]
    pairs: ShowcasePair[]
}

export function readShowcaseManifest(dir: string): ShowcaseManifest {
    return JSON.parse(readFileSync(join(dir, SHOWCASE_MANIFEST), 'utf8')) as ShowcaseManifest
}

export function sha256Hex(bytes: Uint8Array): string {
    return createHash('sha256').update(bytes).digest('hex')
}

/** The manifest sample whose published file has this basename. */
export function manifestSample(manifest: ShowcaseManifest, file: string): ShowcaseSample | undefined {
    return manifest.samples.find((sample) => basename(sample.file) === file)
}

// Vite's asset name, `[name]-[hash][extname]` with an 8-character base64url hash: the emitted
// name is read back to the source it was emitted from, so two logs swapping bytes is not a match.
const ASSET_HASH = /^-[A-Za-z0-9_-]{8}$/

function emittedFrom(emittedName: string, sourceName: string): boolean {
    const extension = extname(sourceName)
    const stem = sourceName.slice(0, sourceName.length - extension.length)
    if (!emittedName.startsWith(stem) || !emittedName.endsWith(extension)) return false
    return ASSET_HASH.test(emittedName.slice(stem.length, emittedName.length - extension.length))
}

export interface ShowcaseVerdict {
    /** Emitted data files whose bytes and name are a manifest sample's. */
    matched: string[]
    faults: string[]
}

/**
 * Every data file the build emitted is a manifest sample, byte for byte and under its own name.
 * A data file is fetched as bytes and never interpreted (assetLoads.ts DISPOSITIONS), so the only
 * verdict it can carry is the one its digest travels with; a build that emits none judged nothing.
 */
export function judgeEmittedShowcase(dist: string, emitted: readonly string[], manifest: ShowcaseManifest): ShowcaseVerdict {
    const bySha = new Map(manifest.samples.map((sample) => [sample.sha256_published, sample]))
    const matched: string[] = []
    const faults: string[] = []
    const data = emitted.filter((path) => dispositionOf(path) === 'data')
    for (const path of data) {
        const actual = sha256Hex(readFileSync(join(dist, path)))
        const sample = bySha.get(actual)
        if (sample === undefined) {
            faults.push(`dist/${path}: sha256 ${actual} is no ${SHOWCASE_MANIFEST} sample's sha256_published — these bytes were never judged`)
        } else if (!emittedFrom(posix.basename(path), basename(sample.file))) {
            faults.push(`dist/${path}: carries the bytes of ${basename(sample.file)} (sha256 ${actual}) under another name`)
        } else {
            matched.push(`dist/${path}`)
        }
    }
    if (data.length === 0) {
        faults.push(`no data file emitted: the showcase logs ${SHOWCASE_DIR}/ vendors are not in the build, so this arm judged nothing`)
    }
    return { matched, faults }
}
