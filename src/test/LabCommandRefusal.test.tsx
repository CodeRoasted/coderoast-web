import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { MotionGlobalConfig } from 'framer-motion'
import Lab from '@/pages/Playground'
import { useEngineStore } from '@/store/useEngineStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useStore } from '@/store/useStore'
import { ONBOARDING_COOKIE, deleteCookie, setCookie } from '@/utils/cookies'
import en from '@/i18n/en'
import fr from '@/i18n/fr'
import type { EngineSnapshot } from '@/types/engine'

/**
 * THE SECOND GRAIN of the silent command drop.
 *
 * `websocket.test.ts` proves the FIRST grain: on a socket that is not open,
 * `EngineWebSocket.sendCommand` puts nothing on the wire and reports the refusal
 * on `onCommandRefused`. That is a statement about the TRANSPORT, and a refusal
 * reported to a callback nobody renders is still a silent drop from where the
 * operator sits — of done / failed / vanished, only the third leaves them with no
 * next move.
 *
 * So this arm asserts the other half, and it is deliberately NOT a second reading
 * of the store: it drives the page an operator actually looks at, clicks the
 * control an operator actually presses, and reads the SENTENCE out of the DOM.
 * A test that asserted `useEngineStore.getState().statusMessage` would be the
 * first grain wearing a different hat — it would stay green if `Lab` stopped
 * rendering `LabStatusToast` altogether.
 *
 * THE THIRD GRAIN, added once the refusal became attributable: the sentence names
 * WHICH control was lost, and names it by that control's own label — never by the
 * wire token, which is a protocol identifier the operator has never seen. So the
 * arms below drive TWO differently-shaped commands (`pause`, which carries no
 * payload, and `set_speed`, which carries a multiplier) and require the two
 * sentences to DIFFER: a fixed sentence, the defect this closes, passes neither.
 *
 * WHY THE WHOLE `Lab` PAGE — the fixture must CONTROL the socket's readyState and
 * the operator's click, and must OWN NONE of the wiring under test. Three links
 * carry the refusal and each can break silently on its own:
 *   1. `useEngineLifecycle.connectToEngine` wiring `onCommandRefused` at all;
 *   2. that handler writing the localized text — with the refused control's own
 *      localized label interpolated into it — to `statusMessage`;
 *   3. `Lab` passing `statusMessage` into `LabStatusToast`.
 * A bespoke harness component would re-implement link 3 and therefore prove it
 * against itself. Mounting `Lab` is the cheapest fixture that holds all three.
 *
 * DETERMINISM: no RNG, no wall clock, no network. Fake timers; every socket
 * transition is driven explicitly by the test, never awaited on a real delay.
 */

const kEngineId = 'eng-refusal-1'
const kScenarioYaml = 'name: refusal-fixture\nduration: 60\n'

/** Every operation key `EngineControls` gates a transport button on. */
const kAllOperations = [
    'engine.start',
    'engine.stop',
    'engine.playback.play',
    'engine.playback.pause',
    'engine.speed.set',
    'engine.advance',
    'engine.cascade.trigger',
]

/** A running, deterministic, PLAYING engine — the state in which `EngineControls` shows Pause. */
const kRunningSnapshot: EngineSnapshot = {
    scenario_name: 'refusal-fixture',
    seed: 1,
    has_seed: true,
    engine_mode: 'deterministic',
    replay_mode: false,
    has_cascade: false,
    clock_mode: 'virtual',
    playback_state: 'playing',
    speed_multiplier: 1,
    duration_seconds: 60,
    elapsed_seconds: 1,
    wall_elapsed_seconds: 1,
    simulation_elapsed_seconds: 1,
    remaining_seconds: 59,
    simulation_now_unix_ns: 1_000_000_000,
    state: 'running',
    queue_backlog: 0,
    throughput_rps: 0,
    error_ratio: 0,
    total_entries: 0,
    agents: [],
    sinks: [],
    incidents: [],
    tail: [],
}

/**
 * A WebSocket stub that models the readyState LIFECYCLE rather than a boolean:
 * a socket is CONNECTING until something opens it. That is what makes the
 * refusal scenario below the real one — a reconnect in flight, not a hand-forced
 * flag — and it is the state the shipped copy tells the operator to wait out.
 */
class MockWebSocket {
    static CONNECTING = 0
    static OPEN = 1
    static CLOSING = 2
    static CLOSED = 3
    static instances: MockWebSocket[] = []

    readonly url: string
    readyState: number = MockWebSocket.CONNECTING
    onopen: (() => void) | null = null
    onmessage: ((event: MessageEvent) => void) | null = null
    onclose: (() => void) | null = null
    onerror: (() => void) | null = null
    sent: string[] = []

    constructor(url: string) {
        this.url = url
        MockWebSocket.instances.push(this)
    }

    send(data: string) {
        this.sent.push(data)
    }

    close() {
        this.readyState = MockWebSocket.CLOSED
        this.onclose?.()
    }

    /** The transport has no `onopen`; opening is observable only through readyState. */
    open() {
        this.readyState = MockWebSocket.OPEN
    }

    receive(payload: unknown) {
        this.onmessage?.({ data: JSON.stringify(payload) } as MessageEvent)
    }

    triggerClose() {
        this.readyState = MockWebSocket.CLOSED
        this.onclose?.()
    }
}

vi.mock('@/services/api', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/services/api')>()
    return {
        ...actual,
        login: vi.fn(async () => ({
            token: 'test-token',
            user: { id: 'visitor', name: 'Visitor' },
            access: { operations: kAllOperations },
        })),
        // The picker is mounted but not used: the scenario is seeded into the store
        // directly, so the launch path under test does not depend on a catalog fetch.
        listScenarios: vi.fn(async () => ({ scenarios: [] })),
        getScenario: vi.fn(async () => ({ yaml: kScenarioYaml })),
        validateScenario: vi.fn(async () => ({ valid: true, errors: [] })),
        createEngine: vi.fn(async () => ({ engine_id: kEngineId, message: 'created' })),
        getEngineScenario: vi.fn(async () => ({ yaml: kScenarioYaml })),
        deleteEngine: vi.fn(async () => ({ message: 'deleted' })),
    }
})

/**
 * The engine's transport control bar, by visible label.
 *
 * Role+name alone is AMBIGUOUS on this page: the live-tail stream toggle is an
 * icon-only button carrying `title="Pause"`, so it shares an accessible name with
 * the engine's Pause. The transport controls are the text-labelled ones, and that
 * is the discriminator used here. The length assertion is deliberate — if a third
 * control ever collides, this reds instead of silently clicking the wrong thing.
 */
function transportButton(label: string): HTMLElement {
    const matches = screen
        .getAllByRole('button', { name: label })
        .filter((b) => b.textContent?.trim() === label)
    expect(
        matches,
        `expected exactly one text-labelled transport button named "${label}", found ${matches.length}`,
    ).toHaveLength(1)
    return matches[0] as HTMLElement
}

/**
 * The face of the speed preset this suite clicks. The button's own text is the VALUE it
 * applies ("2x"); the control it belongs to is named "Speed" / "Vitesse", and that name is
 * what the refusal must show. Clicking it sends `set_speed`, a command that carries a
 * payload — the second shape this suite exercises, next to the payload-less `pause`.
 */
const kSpeedPresetFace = '2x'

/**
 * The refusal exactly as the operator should read it for `control`, assembled from the two
 * bundle entries the producer reads: the sentence and the control's label. It is their
 * WIRING that is under test, not the wording of either — a hard-coded golden of the whole
 * sentence would turn a copy edit into a red without holding anything more.
 */
function expectedRefusal(bundle: typeof en, control: string): string {
    return `✗ ${bundle.lab.commandNotSent.replace('{command}', control)}`
}

function socketCount(): number {
    return MockWebSocket.instances.length
}

function socketAt(index: number): MockWebSocket {
    const sock = MockWebSocket.instances[index]
    if (!sock) {
        throw new Error(
            `expected a socket at index ${index}, only ${socketCount()} were created`,
        )
    }
    return sock
}

/**
 * Mounts the Lab and drives it to "engine attached, socket open, engine running".
 * `useBlocker` needs a data router, hence `createMemoryRouter`.
 * Returns the first socket — the one the launch opened.
 */
async function launchEngine(): Promise<MockWebSocket> {
    const router = createMemoryRouter(
        [{ path: '/lab/logcraft', element: <Lab defaultMode="logcraft" /> }],
        { initialEntries: ['/lab/logcraft'] },
    )
    // Inside act: the page's visitor auto-login resolves on mount, and its state
    // update belongs to the render. `findBy*` is deliberately NOT used anywhere in
    // this file — it polls, and this suite runs on fake timers.
    await act(async () => {
        render(<RouterProvider router={router} />)
    })

    const t = useStore.getState().language === 'fr' ? fr : en
    const launch = screen.getByRole('button', {
        name: t.lab.playgrounds.logcraft.launchAndStart,
    })

    await act(async () => {
        fireEvent.click(launch)
    })

    expect(
        socketCount(),
        `launching must open exactly one socket, opened ${socketCount()}`,
    ).toBe(1)
    const sock = socketAt(0)

    // A real socket opens, and only then does the server announce itself.
    await act(async () => {
        sock.open()
        sock.receive({ type: 'connected', engine_id: kEngineId })
    })

    // The auto-start handshake proves the fixture actually reaches the command
    // path: if this is empty, nothing below is a statement about a refusal.
    expect(
        sock.sent,
        `the connect handshake must reach the wire; wire carried [${sock.sent.join(' | ')}]`,
    ).toEqual(['{"type":"start"}'])

    await act(async () => {
        sock.receive({ type: 'snapshot', data: kRunningSnapshot })
    })

    return sock
}

describe('Lab — a refused command is VISIBLE to the operator', () => {
    let originalWebSocket: typeof WebSocket

    beforeEach(() => {
        // The toast animates in and out under `AnimatePresence`, whose EXIT keeps the
        // outgoing node mounted until the animation finishes — driven by a frame loop
        // jsdom never runs. Left alone, a message that was cleared stays readable in
        // the DOM forever and "the refusal went away" is untestable. This is
        // framer-motion's own test switch: the toast still renders through its real
        // component, only the tween is skipped.
        MotionGlobalConfig.skipAnimations = true
        vi.useFakeTimers()
        MockWebSocket.instances = []
        originalWebSocket = globalThis.WebSocket
        // Cast through unknown — MockWebSocket implements only the surface
        // EngineWebSocket actually touches.
        ; (globalThis as unknown as { WebSocket: unknown }).WebSocket =
            MockWebSocket as unknown
        // Dismiss the first-visit wizard: it would cover the launch button.
        setCookie(ONBOARDING_COOKIE, '1')
        useStore.setState({ language: 'en' })
        useAuthStore.setState({
            token: 'test-token',
            user: null,
            operations: kAllOperations,
            loading: false,
            selectedUserId: 'visitor',
        })
        useEngineStore.getState().reset()
        useEngineStore.setState({
            scenarioYaml: kScenarioYaml,
            selectedScenarioId: 'refusal-fixture',
        })
    })

    afterEach(() => {
        ; (globalThis as unknown as { WebSocket: typeof WebSocket }).WebSocket =
            originalWebSocket
        MotionGlobalConfig.skipAnimations = false
        deleteCookie(ONBOARDING_COOKIE)
        useStore.setState({ language: 'en' })
        vi.useRealTimers()
        vi.clearAllMocks()
    })

    it('puts the refusal sentence on screen when a click cannot reach the engine', async () => {
        const opened = await launchEngine()
        const refusal = expectedRefusal(en, en.lab.pause)

        // ── Control arm ───────────────────────────────────────────────────────
        // Same click, live socket. It must travel AND leave the screen clean of a
        // refusal — without this, a toast that is simply always present would pass
        // the arm below.
        await act(async () => {
            fireEvent.click(transportButton(en.lab.pause))
        })
        expect(
            opened.sent,
            `an open socket must carry the pause; wire carried [${opened.sent.join(' | ')}]`,
        ).toEqual(['{"type":"start"}', '{"type":"pause"}'])
        expect(
            screen.queryByText(refusal),
            'no refusal may be shown for a command that reached the engine',
        ).toBeNull()
        // What the operator sees instead, from the launch itself.
        expect(screen.getByText(en.lab.created)).toBeInTheDocument()

        // ── The refusal arm ───────────────────────────────────────────────────
        // The peer drops the connection and the transport's automatic reconnect
        // opens a socket that has not finished connecting. This is the exact state
        // the shipped sentence describes, reached the way production reaches it.
        await act(async () => {
            opened.triggerClose()
        })
        await act(async () => {
            vi.advanceTimersByTime(1000) // first backoff step -> doConnect()
        })
        expect(
            socketCount(),
            `the reconnect must open a second socket, total was ${socketCount()}`,
        ).toBe(2)
        const reconnecting = socketAt(1)
        expect(
            reconnecting.readyState,
            'the reconnecting socket must still be CONNECTING for this arm to mean anything',
        ).toBe(MockWebSocket.CONNECTING)

        await act(async () => {
            fireEvent.click(transportButton(en.lab.pause))
        })

        // The first grain, still true at page altitude: nothing on any wire.
        expect(
            reconnecting.sent,
            `a half-open socket must carry nothing; wire carried [${reconnecting.sent.join(' | ')}]`,
        ).toHaveLength(0)
        expect(
            opened.sent,
            `the dead socket must not have grown either; wire carried [${opened.sent.join(' | ')}]`,
        ).toHaveLength(2)

        // THE SECOND GRAIN: the operator SEES it, and sees it replace what was there.
        const toastText = screen.getByText(refusal)
        expect(toastText).toBeInTheDocument()
        expect(
            screen.queryByText(en.lab.created),
            'the stale success message must not survive under the refusal',
        ).toBeNull()

        // …and sees it as a FAILURE, not as neutral chatter. The palette is the
        // toast's own contract (`LabStatusToast.test.tsx`); what is asserted here
        // is that the refusal is routed into the failure branch of it.
        const toast = toastText.closest('div')
        expect(
            toast?.className,
            `the refusal must render in the error palette, class was "${toast?.className}"`,
        ).toContain('red')

        // The text must leave the operator with a NEXT MOVE, not just a verdict — the
        // difference between a refusal they can act on and a bare code. Asserted on
        // the rendered text (not on the i18n constant, which would compare the source
        // of the message with itself), and at keyword level rather than literally: a
        // golden of the whole sentence would turn a copy edit into a red without
        // holding anything more.
        const rendered = toastText.textContent ?? ''
        expect(rendered, `the refusal must say WHAT happened, read "${rendered}"`).toMatch(
            /not sent/i,
        )
        expect(rendered, `the refusal must say WHAT TO DO, read "${rendered}"`).toMatch(
            /reconnect/i,
        )
        // …and WHICH press was lost. Without this the operator is told something vanished
        // and left to guess what; attribution is the difference between a refusal they can
        // act on and one they can only worry about.
        expect(
            rendered,
            `the refusal must name the control that was refused ("${en.lab.pause}"), read "${rendered}"`,
        ).toContain(en.lab.pause)
    })

    it('names the control that was refused, by its label and not by its wire token', async () => {
        const opened = await launchEngine()

        await act(async () => {
            opened.triggerClose()
        })
        await act(async () => {
            vi.advanceTimersByTime(1000) // first backoff step -> a CONNECTING socket
        })
        const reconnecting = socketAt(1)
        expect(
            reconnecting.readyState,
            'the reconnecting socket must still be CONNECTING for this arm to mean anything',
        ).toBe(MockWebSocket.CONNECTING)

        // ── A payload-less command: `pause` ───────────────────────────────────
        await act(async () => {
            fireEvent.click(transportButton(en.lab.pause))
        })
        const afterPause = screen.getByText(expectedRefusal(en, en.lab.pause)).textContent ?? ''

        // ── A command carrying a payload: `set_speed`, sent by a preset button ─
        // Same refusal path, a different command SHAPE, so the label lookup is exercised on
        // more than one branch of the vocabulary.
        await act(async () => {
            fireEvent.click(transportButton(kSpeedPresetFace))
        })
        const afterSpeed = screen.getByText(expectedRefusal(en, en.lab.speed)).textContent ?? ''

        expect(
            reconnecting.sent,
            `a half-open socket must carry nothing; wire carried [${reconnecting.sent.join(' | ')}]`,
        ).toHaveLength(0)

        // THE POINT: two presses, two different sentences. A fixed sentence — the defect
        // this closes — would make these two strings equal and pass everything above.
        expect(
            afterSpeed,
            `refusing two different controls must produce two different sentences; both read "${afterPause}"`,
        ).not.toBe(afterPause)

        // Named by the CONTROL's label, never by the protocol token. `set_speed` is the
        // wire's word for a button the page calls Speed; showing the token would name the
        // system's internals to someone who has never seen them, which is worse than the
        // anonymous sentence it replaced. This pair is why the second command is `set_speed`
        // and not another payload-less one: for `pause` the token and the label differ only
        // in case, so neither direction can be told apart.
        expect(
            afterSpeed,
            `the refusal must name the control "${en.lab.speed}", read "${afterSpeed}"`,
        ).toContain(en.lab.speed)
        expect(
            afterSpeed,
            `the refusal must not leak the wire token "set_speed", read "${afterSpeed}"`,
        ).not.toContain('set_speed')
    })

    it('clears the refusal from the screen after 4 s, so it cannot outlive its truth', async () => {
        const opened = await launchEngine()
        const refusal = expectedRefusal(en, en.lab.pause)

        await act(async () => {
            opened.triggerClose()
        })
        await act(async () => {
            vi.advanceTimersByTime(1000)
        })
        await act(async () => {
            fireEvent.click(transportButton(en.lab.pause))
        })
        expect(screen.getByText(refusal)).toBeInTheDocument()

        // Just short of the window: still on screen. A toast that vanished early
        // would be a drop of the drop.
        await act(async () => {
            vi.advanceTimersByTime(3_900)
        })
        expect(
            screen.queryByText(refusal),
            'the refusal must still be readable 3.9 s after the click',
        ).not.toBeNull()

        // Past it: gone. 3 900 + 1 000 crosses the 4 000 ms the producer schedules.
        await act(async () => {
            vi.advanceTimersByTime(1_000)
        })
        expect(
            screen.queryByText(refusal),
            'the refusal must be gone 4.9 s after the click',
        ).toBeNull()
    })

    it('speaks the operator language — a French session reads the French refusal, control name included', async () => {
        useStore.setState({ language: 'fr' })
        const opened = await launchEngine()

        await act(async () => {
            opened.triggerClose()
        })
        await act(async () => {
            vi.advanceTimersByTime(1000)
        })
        await act(async () => {
            fireEvent.click(transportButton(fr.lab.pause))
        })

        expect(screen.getByText(expectedRefusal(fr, fr.lab.pause))).toBeInTheDocument()
        expect(
            screen.queryByText(expectedRefusal(en, en.lab.pause)),
            'a French session must not be shown the English refusal',
        ).toBeNull()
        expect(fr.lab.commandNotSent).not.toBe(en.lab.commandNotSent)

        // The NAME must cross the locale too, not just the sentence around it. Pause is
        // spelled the same in both bundles, so it cannot show that; Speed / Vitesse can, and
        // an untranslated label inside a translated sentence is exactly the half-localized
        // state a shared-sentence-plus-lookup design can fall into.
        await act(async () => {
            fireEvent.click(transportButton(kSpeedPresetFace))
        })
        const rendered =
            screen.getByText(expectedRefusal(fr, fr.lab.speed)).textContent ?? ''
        expect(
            rendered,
            `a French session must be shown the French control name "${fr.lab.speed}", read "${rendered}"`,
        ).toContain(fr.lab.speed)
        expect(
            rendered,
            `a French session must not be shown the English control name "${en.lab.speed}", read "${rendered}"`,
        ).not.toContain(en.lab.speed)
        expect(
            fr.lab.speed,
            'this arm only means something while the two bundles spell Speed differently',
        ).not.toBe(en.lab.speed)
    })
})
