// commandVocabulary.test.ts — W4/D4: the web client's command tokens are checked against
// the server's catalog. Design record: technical_docs/history/architecture-v1/server_command_vocabulary.md.
//
// WHY A TEST AND NOT AN IMPORT (D4). The catalog is C++ in coderoast-server; there is no way
// for this client to bind to it at compile time, and D2 rejected minting a shared cross-repo
// artifact for the C++ consumers. So this boundary gets the strongest binding available
// across a language gap: a test that fails when the client spells a token the server does not
// declare. It is deliberately WEAKER than the C++ sites' compile-time binding — and it is the
// one boundary that matters most in practice, because drift here reaches a user as a DEAD
// BUTTON rather than a compiler error (§4.2).
//
// WHY IT READS THE HEADER AND NOT A GENERATED COPY. A checked-in JSON mirror of the catalog
// would be one more copy to keep in sync — the exact defect W4 exists to remove — and it
// would rot silently the first time someone edited the catalog without regenerating. Parsing
// the single source directly means there is nothing to regenerate and nothing to forget.
//
// THE SCAN IS SCOPED TO OUTBOUND COMMANDS IN PRODUCTION SOURCE, and both halves of that
// scoping are load-bearing:
//   · `sendCommand({ type: '…' })` only — a bare `type:` scan also catches INBOUND frame
//     types (`connected`, `snapshot`, `result`, `error`) and unrelated literals (`spring`,
//     `http`), none of which are engine commands. A gate that reds on those would be one
//     nobody can keep green.
//   · `src/test/` is excluded — websocket.test.ts sends a synthetic `resume` to exercise the
//     transport, which is legitimately not a command. Excluding the test tree cannot hide a
//     real drift, because production code does not live there.
import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

// The catalog lives in the sibling server checkout. Resolution mirrors the convention the
// intent-library codegen already established for a cross-repo tool path: an explicit env var
// wins, otherwise the sibling default. It FAILS rather than skips when absent — a
// conformance test that silently skips is the vacuous gate this one exists to avoid.
const CATALOG_PATH =
    process.env.CODEROAST_COMMAND_CATALOG ??
    resolve(__dirname, '../../../coderoast-server/server-catalogs/include/core/command_catalog.hpp')

/** Every `token` field declared by a catalog row. */
function catalogTokens(): string[] {
    const source = readFileSync(CATALOG_PATH, 'utf8')
    const body = source.slice(source.indexOf('kCommandCatalog'))
    const rows = body.slice(0, body.indexOf('}};'))
    // Each row opens `{"token", "permission", …}` — the first string literal is the token.
    // Group 1 is not optional in the pattern, but `noUncheckedIndexedAccess` types the
    // indexed read as possibly-undefined, so narrow rather than assert.
    const tokens: string[] = []
    for (const [, token] of rows.matchAll(/\{\s*"([a-z_]+)"\s*,/g)) {
        if (token !== undefined) tokens.push(token)
    }
    return [...new Set(tokens)]
}

/** Production .ts/.tsx files, excluding the test tree (see the scoping note above). */
function productionSources(dir: string): string[] {
    const out: string[] = []
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry)
        if (statSync(full).isDirectory()) {
            if (entry === 'test' || entry === 'node_modules') continue
            out.push(...productionSources(full))
        } else if (/\.tsx?$/.test(entry)) {
            out.push(full)
        }
    }
    return out
}

/** Tokens the client actually sends: `sendCommand({ type: '…' })`. */
function sentTokens(): Map<string, string> {
    const found = new Map<string, string>()
    for (const file of productionSources(resolve(__dirname, '..'))) {
        const text = readFileSync(file, 'utf8')
        for (const [, token] of text.matchAll(/sendCommand\(\{\s*type:\s*'([a-z_]+)'/g)) {
            if (token !== undefined && !found.has(token)) found.set(token, file)
        }
    }
    return found
}

describe('W4/D4 — the web command vocabulary conforms to the server catalog', () => {
    it('reads a catalog with the expected shape (the parse itself must not silently yield nothing)', () => {
        const tokens = catalogTokens()
        // Guard against the parse breaking open: if the header is reshaped and the regex stops
        // matching, every conformance assertion below would pass VACUOUSLY over an empty set.
        expect(tokens.length).toBe(13)
        expect(tokens).toContain('play_to_target')
        expect(tokens).toContain('start')
    })

    it('sends only tokens the catalog declares (a non-row is a dead button)', () => {
        const catalog = new Set(catalogTokens())
        const sent = sentTokens()

        // Same guard on the other side: an empty scan would make this pass while proving nothing.
        expect(sent.size).toBeGreaterThan(0)

        const strays = [...sent.entries()].filter(([token]) => !catalog.has(token))
        expect(
            strays,
            `these tokens are sent by the client but name NO row in the server's command ` +
                `catalog, so the server answers "Unknown command" and the user sees a dead ` +
                `button:\n` +
                strays.map(([token, file]) => `  '${token}'  (${file})`).join('\n') +
                `\ncatalog declares: ${[...catalog].join(', ')}`,
        ).toEqual([])
    })

    it('exposes the curated 11 — no agent authoring from the UI', () => {
        // The design's measured table: the web UI omits add_agent/remove_agent because there is
        // no UI to author an agent YAML fragment. Omission is legal (D5) — this asserts the
        // CURATION is what it is documented to be, so a silent widening is visible.
        const sent = new Set(sentTokens().keys())
        expect(sent.has('add_agent')).toBe(false)
        expect(sent.has('remove_agent')).toBe(false)
        expect(sent.size).toBe(11)
    })
})
