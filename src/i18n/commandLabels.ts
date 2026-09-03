import type { TranslationKey } from '@/i18n/translations'
import type { EngineCommandType } from '@/types/engine'

type LabCopy = TranslationKey['lab']

/**
 * The keys of the `lab` bundle whose value is a plain string. Nested groups (`insight`,
 * `drain`, `playgrounds`, …) are excluded by construction, so a label key can only ever
 * name something renderable.
 */
type LabLabelKey = {
    [K in keyof LabCopy]: LabCopy[K] extends string ? K : never
}[keyof LabCopy]

/**
 * Wire token → the label of the control that sends it.
 *
 * WHY THIS IS NOT THE WIRE TOKEN. `set_error_rate` is a protocol identifier; the operator
 * is looking at a slider that says "Error rate". Showing them the token would name the
 * system's internals to someone who never saw them, which is worse than the anonymous
 * refusal it replaced — a wrong name costs more than a missing one.
 *
 * WHICH label, when a control has two. Uniformly the control's NAME (its tooltip /
 * aria-label), never the transient value on its face: the time-advance buttons read "+1s"
 * and "+10s" but are the Advance control, the speed presets read "0.5x…5x" but are the
 * Speed control, and the seek button reads "Replay" while its aria-label — the name the
 * page itself gives it — is "Play to target". One rule, applied to all eleven.
 *
 * TOTAL BY CONSTRUCTION. `Record<EngineCommandType, …>` means an arm added to
 * `EngineCommand` without a row here does not compile. That is the whole reason the
 * command vocabulary was closed into a union: with the old `Record<string, unknown>` the
 * only way to write this map was with a `?? 'a command'` fallback, which would have
 * reappeared silently on the next command type and put the anonymous refusal back on
 * screen for exactly the command nobody had thought about.
 */
const kCommandLabelKeys: Record<EngineCommandType, LabLabelKey> = {
    start: 'start',
    stop: 'stop',
    play: 'play',
    pause: 'pause',
    set_speed: 'speed',
    advance: 'advance',
    play_to_target: 'playToTarget',
    set_rate: 'rate',
    set_error_rate: 'errorRate',
    burst: 'burst',
    cascade: 'cascade',
}

/** The localized name of the control that sends `type`, in the caller's active locale. */
export function commandLabel(lab: LabCopy, type: EngineCommandType): string {
    return lab[kCommandLabelKeys[type]]
}
