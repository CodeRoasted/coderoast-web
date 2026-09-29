import { execFileSync } from 'node:child_process'
import { realpathSync } from 'node:fs'
import { isAbsolute, relative, sep } from 'node:path'

/**
 * The commit a build was made from, carried by the built index.html as
 * `<meta name="coderoast-web-build" content="<40-hex commit>[-dirty]">`, so a deployed release is
 * identifiable from outside even when it changes no copy. Measured 2026-09-29: web bd8fb92
 * (self-hosted fonts) changed no string, and a copy comparison could not tell whether it was live.
 *
 * Why index.html and not a bundle or a JSON file. The index is the one response that names the
 * content-hashed bundles, so the identity and the bundle it describes arrive in the same bytes
 * and no deploy can flip between two reads. A commit written into a JS asset would change that
 * asset's hash on every commit and defeat the immutable caching of unchanged code (netlify.toml,
 * `/assets/*`). The index is revalidated on every visit, so it is also the current one.
 *
 * DIRTY means the bytes are not the commit's: a tracked file differs from HEAD, or a file the
 * build READ is not tracked. The second half is derived from the bundle itself (every module a
 * chunk holds, every emitted asset's source file, every public/ file), never from a list of
 * directories, so an untracked file lying beside the build does not mark it and an imported one
 * does. Its bound: a file inlined as a data URI is read without being emitted, and is not seen.
 */

export const IDENTITY_META = 'coderoast-web-build'
export const IDENTITY_VALUE = /^[0-9a-f]{40}(?:-dirty)?$/
const DIRTY_SUFFIX = '-dirty'

export interface BuildIdentity {
    commit: string
    /** Tracked paths whose working-tree bytes differ from HEAD. */
    trackedChanges: string[]
    /** Paths the build read that git does not track. */
    untrackedInputs: string[]
    /** The meta's content: the commit, suffixed `-dirty` when either list is non-empty. */
    value: string
}

// No optional lock: a build in the shared worktree must never write .git/index.
const GIT_ENV = { ...process.env, GIT_OPTIONAL_LOCKS: '0' }

function git(root: string, args: readonly string[]): string {
    try {
        return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', env: GIT_ENV, stdio: ['ignore', 'pipe', 'pipe'] })
    } catch (error) {
        const failed = error as { stderr?: string; message: string }
        throw new Error(
            `git ${args.join(' ')} failed in ${root}: ${(failed.stderr ?? '').trim() || failed.message} — ` +
                'the build names the commit it was built from, and cannot without this repository',
        )
    }
}

function nulList(output: string): string[] {
    return output.split('\0').filter((entry) => entry !== '')
}

/** `id` as a path relative to `root`, or undefined when it is virtual, outside it, or a dependency. */
function repoPath(root: string, id: string): string | undefined {
    if (id.startsWith('\0')) return undefined
    const file = id.replace(/[?#].*$/, '')
    if (!isAbsolute(file)) return undefined
    const path = relative(root, file)
    if (path === '' || path.startsWith('..') || isAbsolute(path)) return undefined
    const parts = path.split(sep)
    return parts.includes('node_modules') ? undefined : parts.join('/')
}

/** `inputs` are absolute paths of the files the build read; anything else in them is ignored. */
export function buildIdentity(root: string, inputs: Iterable<string>): BuildIdentity {
    const top = git(root, ['rev-parse', '--show-toplevel']).trim()
    if (realpathSync(top) !== realpathSync(root)) {
        throw new Error(`${root} is not the top level of its git repository (${top}): the commit it would name is another repository's`)
    }
    const commit = git(root, ['rev-parse', '--verify', 'HEAD^{commit}']).trim()
    const trackedChanges = nulList(git(root, ['status', '--porcelain=v1', '-z', '--untracked-files=no', '--no-renames']))
        .map((entry) => entry.slice(3))
        .sort()
    const tracked = new Set(nulList(git(root, ['ls-files', '-z'])))
    const read = new Set<string>()
    for (const id of inputs) {
        const path = repoPath(root, id)
        if (path !== undefined) read.add(path)
    }
    const untrackedInputs = [...read].filter((path) => !tracked.has(path)).sort()
    const dirty = trackedChanges.length > 0 || untrackedInputs.length > 0
    return { commit, trackedChanges, untrackedInputs, value: dirty ? `${commit}${DIRTY_SUFFIX}` : commit }
}

export function describeIdentity(identity: BuildIdentity): string {
    if (identity.value === identity.commit) return `${IDENTITY_META}: ${identity.value} (clean: the bytes are this commit's)`
    const reasons = [
        ...identity.trackedChanges.map((path) => `tracked, differs from HEAD: ${path}`),
        ...identity.untrackedInputs.map((path) => `read by the build, untracked: ${path}`),
    ]
    return `${IDENTITY_META}: ${identity.value} — ${reasons.length} path(s) make these bytes no commit's:\n  ${reasons.join('\n  ')}`
}
