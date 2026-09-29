import { existsSync, rmSync } from 'node:fs'
import { isAbsolute, join, relative, resolve } from 'node:path'
import { performance } from 'node:perf_hooks'
import type { Plugin, ResolvedConfig, Rollup } from 'vite'
import { filesUnder } from './assetLoads'
import { type BuildIdentity, IDENTITY_META, buildIdentity, describeIdentity } from './buildIdentity'
import { ARM_NAMES, describeFaults, judgeBuiltSite } from './builtSite'

/**
 * The deploy's own gate. Netlify runs `npm run build` and never `npm test`, so a property the
 * suite alone asserts is a property no deploy checks. This plugin puts the built-site verdict
 * (builtSite.ts) inside the build: once every file is written it judges the output directory, and
 * a fault in any arm fails the build, so a deploy that runs the build publishes nothing. It also
 * writes the build's identity into index.html (buildIdentity.ts), which the identity arm reads back.
 *
 * A refused build also REMOVES its output directory. A failed command stops Netlify's own deploy,
 * but a directory left on disk can still be uploaded by hand, and the faults name every file and
 * URL a reader needs, so nothing is lost by removing it.
 */

export const GATE_NAME = 'coderoast-site-gate'

// The output directory is removed only when it is neither the root nor an ancestor of it.
function removable(root: string, dist: string): boolean {
    const fromDist = relative(dist, root)
    return fromDist.startsWith('..') || isAbsolute(fromDist)
}

// Every file the build read, as absolute paths: each module a chunk holds, each emitted asset's
// source (Vite records it relative to the root), and each public/ file the build copies whole.
function buildInputs(config: ResolvedConfig, bundle: Rollup.OutputBundle): string[] {
    const inputs: string[] = []
    for (const output of Object.values(bundle)) {
        if (output.type === 'chunk') inputs.push(...output.moduleIds)
        else inputs.push(...output.originalFileNames.map((name) => resolve(config.root, name)))
    }
    if (config.publicDir !== '' && existsSync(config.publicDir)) {
        inputs.push(...filesUnder(config.publicDir).map((path) => join(config.publicDir, path)))
    }
    return inputs
}

export function siteGate(): Plugin {
    let config: ResolvedConfig | undefined
    let identity: BuildIdentity | undefined
    return {
        name: GATE_NAME,
        apply: 'build',
        configResolved(resolved) {
            config = resolved
        },
        transformIndexHtml: {
            order: 'post',
            handler(_html, context) {
                if (config === undefined || context.bundle === undefined) return undefined
                identity = buildIdentity(config.root, buildInputs(config, context.bundle))
                config.logger.info(describeIdentity(identity))
                return [{ tag: 'meta', attrs: { name: IDENTITY_META, content: identity.value }, injectTo: 'head' }]
            },
        },
        writeBundle(output) {
            if (config === undefined) this.error('the resolved config never reached the gate')
            const started = performance.now()
            const dist = resolve(config.root, output.dir ?? config.build.outDir)
            const verdict = judgeBuiltSite(config.root, dist, { identity: identity?.value })
            const failing = ARM_NAMES.filter((arm) => verdict.faults[arm].length > 0)
            const elapsed = Math.round(performance.now() - started)
            if (failing.length > 0) {
                const removed = removable(config.root, dist)
                if (removed) rmSync(dist, { recursive: true, force: true })
                this.error(
                    `the built site fails ${failing.length} of ${ARM_NAMES.length} arms, so the build fails and a deploy that runs it ` +
                        `publishes nothing (${verdict.emitted.length} files read in ${dist}, ${elapsed} ms; ` +
                        `${removed ? 'that directory was removed, so no upload can publish it' : 'that directory is the root or holds it, so it was left in place'}):\n` +
                        describeFaults(verdict),
                )
            }
            config.logger.info(
                `${GATE_NAME}: ${ARM_NAMES.length}/${ARM_NAMES.length} arms clean — ${verdict.emitted.length} emitted files, ` +
                    `${verdict.loads.length} loads read, ${verdict.showcaseMatched.length} showcase log(s) digest-matched, ` +
                    `identity ${identity?.value ?? 'none'} (${elapsed} ms)`,
            )
        },
    }
}
