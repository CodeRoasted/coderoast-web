import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import en from '@/i18n/en'

/**
 * i18n key hygiene — a GATE, not a script.
 *
 * This lives in the vitest suite (already a blocking CI step) rather than as a
 * hand-run sweep, because a sweep documented in a README is not a gate: this
 * workspace has twice paid for believing one ran.
 *
 * SCOPE — what this does NOT check, and why:
 *   en/fr KEY PARITY is already enforced more strongly than a test could, at
 *   COMPILE time: `src/i18n/fr.ts` declares `const fr: typeof en`, so a key in
 *   one file and not the other fails `tsc` in both directions (missing-property
 *   and excess-property). Verified by mutation, both ways. Re-asserting parity
 *   here would add a weaker, skippable duplicate of a structural guarantee —
 *   and worse, would offer someone a way to "fix" a tsc error by loosening the
 *   type until this test still passed. If that annotation is ever removed, THIS
 *   comment is the record that parity lost its gate.
 *
 * So the one thing left uncovered is orphans: keys no source file can reach.
 */

// vitest runs from the repo root, so cwd is the stable anchor here.
const SRC = join(process.cwd(), 'src')

function sourceFiles(dir: string, out: string[] = []): string[] {
    for (const entry of readdirSync(dir)) {
        const path = join(dir, entry)
        if (statSync(path).isDirectory()) {
            // i18n/ holds the definitions themselves; test/ references keys only incidentally.
            if (entry !== 'i18n') sourceFiles(path, out)
        } else if (/\.(ts|tsx)$/.test(path)) {
            out.push(path)
        }
    }
    return out
}

/** Every dotted path to a leaf (non-object) value in the translation tree. */
function leafPaths(node: unknown, prefix: string[] = [], out: string[] = []): string[] {
    if (node !== null && typeof node === 'object' && !Array.isArray(node)) {
        for (const [key, value] of Object.entries(node)) leafPaths(value, [...prefix, key], out)
    } else {
        out.push(prefix.join('.'))
    }
    return out
}

describe('i18n keys', () => {
    it('has no orphan keys — every translation leaf is reachable from source', () => {
        const leaves = leafPaths(en)
        expect(leaves.length).toBeGreaterThan(0)

        const blob = sourceFiles(SRC)
            .map((file) => readFileSync(file, 'utf8'))
            .join('\n')

        // Translations are consumed as property access (`const t = useTranslation()` then
        // `t.section.key`), never as string lookups — so reachability is a chain scan.
        // Record EVERY PREFIX of each chain, not just the whole match. A key is very often
        // read with something appended — `t.problem.points.map(...)`, `t.hero.title.length` —
        // and matching only the full chain would file the real key `problem.points` as an
        // orphan while `problem.points.map` sat in the set. That bug reported 71 orphans on a
        // tree whose true count is far lower.
        const referenced = new Set<string>()
        for (const match of blob.matchAll(/\bt((?:\.[A-Za-z_$][\w$]*)+)/g)) {
            const parts = (match[1] ?? '').slice(1).split('.')
            for (let depth = 1; depth <= parts.length; depth++) {
                referenced.add(parts.slice(0, depth).join('.'))
            }
        }

        // CONSERVATIVE BY DESIGN: a reference to any ANCESTOR marks the whole subtree
        // reachable, because a section object can be handed to a child as one prop
        // (`<Hero copy={t.hero} />`) and its leaves then read off that alias. This
        // under-reports orphans rather than over-reporting them — the safe direction,
        // since a gate that cries wolf is a gate someone deletes.
        const orphans = leaves.filter((path) => {
            const parts = path.split('.')
            for (let depth = 1; depth <= parts.length; depth++) {
                if (referenced.has(parts.slice(0, depth).join('.'))) return false
            }
            return true
        })

        expect(orphans, `${orphans.length} translation key(s) no source file can reach.\n` +
            `Delete them from BOTH src/i18n/en.ts and src/i18n/fr.ts (the compiler enforces parity).\n` +
            orphans.map((key) => `  - ${key}`).join('\n')).toEqual([])
    })
})
