// English translations. Source of truth for the TranslationKey type.
// Per-language modules are aggregated in `./translations.ts`.
const en = {
    nav: {
        home: 'Home',
        products: 'Products',
        product: 'Product',
        pricing: 'Pricing',
        logcraft: 'LogCraft',
        lab: 'InSight Playground',
        diff: 'Diff logs',
        logcraftPlayground: 'LogCraft Playground',
        useCases: 'Use cases',
        contact: 'Contact',
        signIn: 'Sign in',
        back: 'Back',
        vision: 'Vision',
    },
    hero: {
        badge: 'CodeRoast · log noise → signal',
        tagline: 'Turn log noise into signal.',
        subtitle:
            'CodeRoast compresses your log noise into deterministic, relevance-ranked structure — precision, not gigabytes of unusable logs.',
        cta: 'Diff two logs',
        ctaSecondary: 'See all products',
        trust: 'deterministic · precision-first · runs on your infra · logs never stored',
    },
    determinismLine: {
        line: 'Same logs in, same answer out — byte for byte, across three compilers and two operating systems. Re-proven on every release.',
        cta: 'How we build',
    },
    vision: {
        badge: 'CodeRoast · the MetaLog thesis',
        titleLead: 'Not stored. Not sampled. Not shipped.',
        titleAccent: 'Distilled.',
        subtitle:
            'CodeRoast distils any log stream into a MetaLog — a small, deterministic fingerprint of what your system actually did. Bit-identical across runs, citable, re-derivable to the exact source line, and it never leaves your box. Sift, anomaly detection, AI triage: every product is just a lens on that one artifact. Reading 4 KB instead of storing gigabytes is the side effect — not the pitch.',
        ctaPrimary: 'Diff two logs',
        ctaSecondary: 'See the products',
        compareCta: 'See how we compare',
        pain: {
            title: 'The model everyone settled for is quietly broken.',
            subtitle: 'Four compromises you’ve been told are normal.',
            points: [
                {
                    title: 'You ration your own logging.',
                    description:
                        'To survive the per-GB bill, teams delete log lines by hand — blinding the system on purpose to shrink an invoice.',
                },
                {
                    title: 'You sample away the one that mattered.',
                    description:
                        'At scale the vendor drops events. The rare fatal — the one you needed — is the first to vanish.',
                },
                {
                    title: 'Your data lives on someone else’s servers.',
                    description:
                        'Logs leave your perimeter to be searched, and the AI reads them raw. Compliance hates it; so should you.',
                },
                {
                    title: 'The AI hands you a story you can’t reproduce.',
                    description:
                        'A plausible “why it failed”, regenerated differently every time. Nothing you can gate a release on.',
                },
            ],
        },
        artifact: {
            title: 'Meet the MetaLog.',
            subtitle:
                'One bounded, deterministic fingerprint per window of your stream. This is the whole product — everything else just reads it.',
            steps: [
                {
                    step: 'Gigabytes in',
                    description:
                        'Point it at a raw, uninstrumented stream — CI output, a service, a whole fleet.',
                },
                {
                    // NO RATIO, and none is coming back without a study behind it. Three places on
                    // this page carried "~150:1" and this step label implied ~250,000:1 against
                    // "Gigabytes in" — two public numbers three orders of magnitude apart, neither
                    // naming its population, neither measured: `technical_docs/studies/` holds 14
                    // studies and not one measures a compression ratio. Boundedness is an
                    // architectural property of MetaLog and is claimable; a ratio is a measurement
                    // and is not ours to state until the benchmark methodology
                    // `product/002-open-source-strategy.md` calls the single most important
                    // marketing artefact exists. (Audit 2026-08-18, §5.3 item 11.)
                    step: 'A bounded fingerprint out',
                    description:
                        'It distils to a bounded structural fingerprint, and it never leaves your box.',
                },
                {
                    step: 'Catches the regression',
                    description:
                        'Salience surfaces the lone fatal on its own — no baseline, no query, no threshold tuned.',
                },
                {
                    step: 'Diff it, instantly',
                    description:
                        'Two fingerprints in, a ranked “what changed” out — and every finding re-derives to the exact source line.',
                },
            ],
            badges: [
                'no instrumentation',
                'no query language',
                'nothing leaves your box',
                'bit-identical every run',
            ],
        },
        punchThem: 'The old model',
        punchUs: 'The MetaLog',
        punches: [
            {
                title: 'They make you delete your logs. We tell you to send more.',
                them:
                    'The dirty secret of per-GB pricing: teams don’t just pay — they ration. Engineers burn real sprint time ripping out log lines to shrink a cloud invoice, blinding the system on purpose. That’s lossiness too — decided by hand, upfront, before anyone knows what will matter, and paid for in engineering hours. The worst kind there is.',
                us:
                    'Send everything. Log more, not less. Cost stops being the gate — the fingerprint is bounded and your raw logs never leave your box. No engineer triages signal from noise to fit a budget, ever again. The distillation is automatic and salience-directed: the rare fatal survives because it matters, not because someone guessed right last quarter.',
            },
            {
                title: 'Your AI bill is the next one going vertical.',
                them:
                    'Everything has an LLM bolted on now — and raw logs are the single most expensive thing you can feed one. You pay per token for gigabytes of noise, and the model drowns in it exactly like a human would.',
                us:
                    'Don’t paste your logs — paste what matters. A MetaLog is a bounded, pre-structured brief: a fraction of the tokens, a fraction of the cost. And an LLM reads a MetaLog better than almost any human reads the raw — the structure is already done. Cheaper and sharper.',
            },
        ],
        tie:
            'Everyone is lossy at scale. The only question is how you lose. They lose blind and upfront — a human deleting logs, a vendor sampling them away. We lose informed and recoverable: salience decides what to keep, and every insight re-derives to the exact source line.',
        contrast: {
            title: 'What the MetaLog is not.',
            subtitle: 'Two models for the same pain. One accumulates. One distils.',
            columnOld: 'Accumulate · Datadog · Splunk · Honeycomb',
            columnNew: 'Distil · MetaLog',
            rows: [
                {
                    old: 'Samples events away to cap cost — the rare event is the first to go.',
                    new: 'Keeps the salient, drops the boring. The lone fatal survives because it scored, not because it was frequent.',
                },
                {
                    old: 'Instrumentation is the price of admission — rewrite your code into wide events before you see any value.',
                    new: 'Reads the unstructured logs you already have. Instrumentation optional, never required.',
                },
                {
                    old: 'Your logs live on their servers; their AI reads them raw.',
                    new: 'On-prem and sovereign — keep your logs. The LLM only ever sees a bounded, sanitized brief.',
                },
                {
                    old: 'A probabilistic “why it failed” you can’t reproduce.',
                    new: 'A deterministic structural fact — bit-identical, citable, re-derivable to the source line. The only kind you can put behind a hard CI gate.',
                },
                {
                    old: 'Pay to store gigabytes forever — and read under 5% of them.',
                    new: 'A bounded fingerprint. The small footprint is a side effect of distilling, not the point.',
                },
            ],
            otelNote:
                'Already on OTel? We distil that too — the structure is free signal. You still get a sovereign MetaLog, not another span store to be locked into.',
        },
        hub: {
            title: 'One stream in. One MetaLog out. Everything else is a lens.',
            subtitle:
                'The slate grows; the artifact underneath stays the same. Each product is a different lens on the same fingerprint.',
            lenses: [
                {
                    name: 'Sift',
                    status: 'Live',
                    description: 'Structural CI diff. Two runs in, a ranked “what changed” out.',
                },
                {
                    name: 'Streaming detection',
                    status: 'Beta',
                    description:
                        'Continuous, precision-first anomaly detection — one alert, one real incident.',
                },
                {
                    name: 'MetaLog forwarding',
                    status: 'Soon',
                    description:
                        'Forward fingerprints, not raw gigabytes. Your observability bill follows what you send.',
                },
                {
                    name: 'Canary validation',
                    status: 'Soon',
                    description:
                        'diff(baseline, canary) as a structural kill-signal before the metrics move.',
                },
                {
                    name: 'Incident postmortem',
                    status: 'Soon',
                    description: 'Replay how the structure evolved, from stored fingerprints.',
                },
                {
                    name: 'AI debugger',
                    status: 'Soon',
                    description:
                        'Feed an LLM a bounded brief in the same context as your code — never raw logs.',
                },
            ],
        },
        closing: {
            title: 'The vision is the MetaLog. The way in is Sift.',
            subtitle:
                'Diff two CI runs in about 90 seconds — no agent, no setup, logs never stored. The same artifact powers everything above.',
            cta: 'Diff two logs',
        },
    },
    // Sift product front door (/sift). Copy governed by
    // PRD-6 § "Page: Sift" — final, not paraphrased.
    // Engine-output mocks (the sample report rows, PR comment, install blocks)
    // are language-neutral CLI/comment output and live in the page component, not
    // here — only translatable prose is keyed.
    sift: {
        eyebrow: 'Sift',
        hero: {
            title: 'Your tests pass. Your logs say otherwise.',
            subtitle:
                'Pass/fail is one bit; grep needs to know what to look for. Sift reads the structure of two runs and ranks what actually changed — a success line that silently vanished, an error you fixed, a pattern that took over the run — then mutes the hundreds of diffs that don\'t matter. Two log files in, a ranked report out. No agent, no account, ~90 seconds.',
            ctaPrimary: 'Add the Action',
            ctaSecondary: 'Try it in your browser',
            trust: 'Free, forever · runs in your CI · your logs never leave it.',
            samplePassed: 'both runs passed',
            kicker:
                'Both runs are green. Pass/fail sees nothing. Grep sees nothing — there\'s no error to search for. Sift sees your cache silently stopped working.',
        },
        comment: {
            title: 'It lives where you already work.',
            body:
                'Wire Sift in once and every PR gets a structural diff as a comment — advisory by default, a hard gate when you want one. One sticky comment, updated in place, deterministic. The loudest thing it ever says is the thing no green checkmark will:',
        },
        catches: {
            title: 'Built for the changes that don\'t look like changes.',
            colChange: 'What changed',
            colTextDiff: 'Text diff',
            colPassFail: 'Pass/fail',
            colSift: 'Sift',
            rows: [
                {
                    change: 'A success line silently vanished (cache, retry, a code path)',
                    textDiff: 'buried',
                    passFail: 'invisible',
                    sift: 'Disappeared: "…" — one ranked line',
                },
                {
                    change: 'A pattern\'s share of the run moved (4% → 38%)',
                    textDiff: 'invisible',
                    passFail: 'invisible',
                    sift: 'Frequency shift',
                },
                {
                    change: 'An error you fixed actually cleared',
                    textDiff: 'invisible',
                    passFail: 'invisible',
                    sift: 'Recovery — green: "your fix worked"',
                },
                {
                    change: 'Same errors as before, but a real change underneath (decoy)',
                    textDiff: 'drowned',
                    passFail: 'invisible',
                    sift: 'the noise muted, the real change surfaced',
                },
                {
                    change: 'A brand-new error pattern',
                    textDiff: 'buried in noise',
                    passFail: 'invisible if tests pass',
                    sift: 'one line, ranked by severity',
                },
            ],
            ghaStructure: {
                title: 'It reads your run by structure — not just line by line.',
                body:
                    'Point Sift at a GitHub Actions run and it reads the job ▸ step skeleton: a step that silently vanished, a new step, a coverage regression where a whole check stopped running — surfaced at the structure grain, not drowned in a line diff. One cause, one ranked line, not fifty symptoms.',
            },
            jenkinsStructure: {
                title: 'Now reading Jenkins by structure.',
                body:
                    'Point Sift at a Jenkins Declarative Pipeline and it reads your stage ▸ step skeleton the way it already reads GitHub Actions jobs — the same structural Disappeared / New / Replaced at the stage ▸ step grain, the same coverage-regression catch, the same mega-log-by-structure collapse. Freestyle and classic matrix jobs still get the universal template-level diff above; structure depth is Declarative-Pipeline-scoped, and we say so.',
            },
            jenkinsOutcome: {
                title: 'And it knows what "done" means.',
                body:
                    'Jenkins emits four verdicts, not two — Sift classifies all of them (SUCCESS / FAILURE / UNSTABLE / ABORTED) on any Jenkins job. An UNSTABLE build (tests ran, some failed) is not a green build; an ABORTED run is not a failure. Gate on it: --fail-on outcome fails the build when the verdict itself regresses — SUCCESS → UNSTABLE — even when every log line still looks fine.',
            },
        },
        free: {
            title: 'The whole stateless product is free. We mean it.',
            body:
                'The CLI, the GitHub Action, the PR comment, the hard-fail gate — on any repo, public or private. We don\'t meter it and we never will. The gate is not a paywall: a team that trusts the comment just adds exit 1 itself — charging for an if statement would be insulting. What\'s paid is scale and memory — spanning an org (multi-repo, seats, SSO) and a deterministic history of your CI over time. A one-off diff is substitutable; a structural record of how your builds drift is not.',
            cta: 'See the tiers',
        },
        trust: {
            title: 'A fact you can gate on.',
            body:
                'Same inputs, same diff — bit for bit, across compilers and operating systems (we build with gcc, clang, and MSVC, on Linux and Windows, and gate on identical output every release — the toolchain is public, so you can reproduce it). That\'s what lets you put Sift behind a hard CI gate; a flaky gate gets disabled within a day, and "our AI thinks this looks concerning" is not a gate. Nothing is uploaded, no account, no agent — it runs in your CI and your logs stay on your infrastructure. The narration layer is opt-in and it never decides: you turn it on, and you name the destination yourself — only the bounded fingerprint travels there, never raw logs, never the verdict, never anything in the path that decides.',
            cta: 'How we build',
        },
        install: {
            title: 'Two log files in. A ranked report out.',
            actionLabel: 'The Action',
            cliLabel: 'The CLI',
            cliLead: 'one static binary, no runtime —',
        },
    },
    // The /diff (in-browser Sift) page chrome (InsightDiff.tsx). Only translatable
    // UI strings live here. NOT keyed (language-neutral by design, engine emits
    // English regardless of locale): the diffPresets.ts log fixtures, the engine
    // report rows (change.summary/evidence), and the result stat line ("N changes,
    // M structurally significant · stability · lines"). severity/kind are the UI's
    // display labels for the engine enums (chrome); presets carry the picker labels
    // + tooltips moved out of diffPresets.ts (now fixtures-only).
    diff: {
        eyebrow: 'SIFT',
        title: 'What changed between two logs — and what\'s just noise',
        subtitle:
            'Paste two log streams (a baseline run and a changed run). InSight ingests both and ranks the structurally significant changes — hover or pin a change to see exactly which lines it touched.',
        loadSample: 'No logs handy? Load a sample:',
        loadingSample: 'Loading…', // the real pairs are fetched on demand
        baselineLog: 'Baseline log',
        changedLog: 'Changed log',
        placeholder: 'paste log lines…',
        lines: 'lines', // "{n} lines" — the input + pane line counters
        line: 'line', // singular, for the "· {n} line(s)" ref counter on a change row
        flagged: 'flagged', // "{n} flagged" — the pane counter when highlights are active
        compare: 'Compare',
        comparing: 'Comparing…',
        swap: 'Swap',
        swapTitle: 'Swap baseline ⇄ changed',
        trust: 'Free · metered per day · logs are not stored',
        paneBaseline: 'Baseline', // result view: the left log-pane title
        paneChanged: 'Changed', // result view: the right log-pane title
        swapSides: 'Swap sides',
        swapSidesTitle: 'Swap baseline ⇄ changed and re-compare',
        newComparison: 'New comparison',
        significantChanges: 'Significant changes',
        clearPinned: 'clear {count} pinned',
        hint: 'hover to preview · click to pin (stack multiple) · color = severity, not add/remove',
        emptyResult:
            'No structurally significant changes — all {count} observed changes are within noise.',
        // Names its own denominator. The frame above this footer counts LINES
        // ("lines a plain text diff reports"); this counts CHANGES at template
        // grain. Both were true and neither said which, so 1 + 743 read as an
        // instrument that cannot add up — the one impression the honest-instrument
        // position cannot survive. Do not drop {total}: it is the bridging
        // quantity, and without it the arithmetic is unclosable on screen.
        suppressed:
            '{count} of the {total} changes Sift observed were suppressed as noise (proportional / low-frequency). The plain-diff line count above counts lines, not changes.',
        ciCallout: 'Want this in CI? The same engine runs as a local CLI and a GitHub Action.',
        // UI display labels for the engine's severity enum (+ recovery polarity).
        severity: {
            critical: 'CRITICAL',
            high: 'SUSPICIOUS',
            medium: 'NOTABLE',
            low: 'WEAK',
            recovery: 'RECOVERED',
        },
        // UI display labels for the engine's change-kind enum (fallback = unknown kind).
        kind: {
            new_error_pattern: 'error appeared',
            escalated_pattern: 'escalated',
            resolved_pattern: 'resolved',
            new_template: 'appeared',
            vanished_template: 'vanished',
            frequency_shift: 'shifted',
            entropy_shift: 'branching',
            emerging_tail: 'emerging in tail',
            unit_outcome_changed: 'outcome changed',
            fallback: 'changed',
        },
        error: {
            // {perDay} is replaced with " (N/day)" or "" by the component.
            //
            // Names the METER'S AXIS, because /diff is where the provenance claim
            // stops being an assertion and becomes checkable — and a refusal that
            // reads as "you are cut off" retracts that claim as effectively as the
            // 403 did. The cap is per network address, and carriers put thousands
            // of subscribers behind one IPv4, so a reader can be denied entirely by
            // other people's runs. Saying so is what lets them tell "I am collateral"
            // from "I am rate-limited", and the CLI line is the way out that
            // actually exists.
            quotaReached:
                'Daily free limit reached{perDay}. The cap counts per network address, so a shared or mobile-carrier address can be used up by other people’s comparisons. It resets tomorrow — or run the same engine locally with the CLI, which has no cap.',
            accessDenied: 'Access denied.',
            failed: 'Comparison failed.',
            presetFailed: 'That sample could not be loaded. Check your connection and try again.',
        },
        // Provenance — BINDING, and shown on EVERY preset in the picker, not only
        // the real ones: an unlabelled fixture sitting beside a labelled real log
        // invites the visitor to assume the fixture is real too. Two values, no third.
        provenance: {
            realCi: 'Real CI run · anonymized',
            generated: 'Generated fixture',
        },
        // The one-line expansion of each provenance value, shown with the selected
        // preset. States what "anonymized" means precisely enough for a skeptic:
        // it is a redaction guarantee over real bytes, not a by-construction one.
        provenanceNote: {
            realCi:
                'A real run of one of our own repositories. Real bytes, with machine and filesystem identity redacted — nothing reconstructed, nothing regenerated. The build\'s own output is the runner\'s verbatim bytes.',
            generated:
                'Synthesised to isolate one narrative — no real run behind it. Baseline and changed share the same templates; only the parameters differ.',
        },
        // Captions for a real pair's two published figures (MANIFEST.json's own).
        figures: {
            plainDiff: 'lines a plain text diff reports',
            sift: 'changes Sift reports',
        },
        // Preset-picker labels + tooltips + the narrative shown once a preset is
        // selected, keyed by diffPresets.ts id (the log text itself stays in
        // src/assets/ and diffPresets.ts, English by design).
        presets: {
            'real-ci-noise': {
                label: 'Real CI · two green builds',
                description:
                    'Two passing runs of the same job. Thousands of lines differ; almost nothing matters.',
                story: [
                    'Somebody added nine tests. That is the whole change.',
                    'The test runner renumbered every line it prints — 762 tests became 771 — and the build renumbered every step with it, […/700] → […/704]. A plain text diff, with timestamps already stripped, reports 5 571 changed lines. Nothing broke. Nothing is wrong.',
                    'Sift reports one change, and it is not an error.',
                    'This is the number the rest of the page rests on. Every tool can find a failure in a failing build. The question is what a tool says when nothing is wrong — and a tool that hands you five thousand lines to read is one you turn off inside a week.',
                ],
            },
            'real-ci-triage': {
                label: 'Real CI · the build that broke',
                // "Ranks the cause at the top" was ruled an OVERSTATEMENT by PRD-6 (006-web-copy.md,
                // 2026-07-27) and shipped anyway. The published report in the same directory
                // (coderoast-hub showcase/sift/reports/regression.report.md:12) ranks at 1 the FACT
                // of failure — the process-exit-code line — with the package build failure and the
                // raised error at 2 and 3. Anyone can open it and check, which is exactly why the
                // copy must not round up. The wording below is PRD-6's ratified replacement.
                description:
                    'The same passing run against the failing one. The top three are the failure and its cause.',
                story: [
                    'The same job, green then failing. A plain text diff reports 4 889 changed lines. Sift reports 13 — and the top three are the whole story: the step exited non-zero, then why — the package that failed to build, and the error it raised.',
                    'Not “we found the word ERROR.” The failing line was already in the log — grep would have handed it to you along with thousands of lines of build chatter that moved at the same time. What a plain diff cannot tell you is which of them is the one that mattered.',
                ],
            },
            'hotfix': {
                label: 'Hotfix verify',
                description: 'A broken run vs its hotfix: the DB errors recovered, a new timeout regressed.',
            },
            'silent-regression': {
                label: 'Silent regression',
                description: 'No new error at all — a success line vanished and a retry surged. grep finds nothing.',
            },
            'error-decoy': {
                label: 'Same errors, real change',
                description: 'Both runs have the IDENTICAL errors (the decoy) — but orders silently stopped completing. Sift mutes the unchanged errors and shows what really moved.',
            },
            'cache-degradation': {
                label: 'Cache silently died',
                description: 'Zero errors, still all 200s — but the cache stopped serving and origin fetches surged. A latent p99 cliff a filter is blind to.',
            },
            'canary-deploy': {
                label: 'Canary vs stable',
                description: 'Same traffic, two builds: the new one swapped the checkout handler and lit a flag. A pure behavior diff — no errors involved.',
            },
            'hot-key': {
                label: 'Throttling takes over',
                description: 'No errors — but a new throttling line appears and takes over a third of the run. A text diff shows the new lines exist; Sift ranks the one template now dominating the stream.',
            },
            'escalating-warning': {
                label: 'Escalating warning',
                description: 'A pool-pressure WARN goes from rare to pervasive — the pre-incident creep, minutes before it pages. Not a new error, so a filter stays quiet.',
            },
        },
    },
    problem: {
        title: 'You can\'t ship observability you\'ve never tested.',
        subtitle:
            'Staging is calm. Mocks are clean. Then production breaks at 3 a.m. and your alerts have never fired in anger. LogCraft is the missing input for everything downstream.',
        points: [
            {
                title: 'Your alerts work in staging — because nothing happens in staging.',
                description:
                    'No bursts, no cascades, no garbage records. The first real incident is the first real test.',
            },
            {
                title: 'Your dashboards look great until the cascade actually hits.',
                description:
                    'p99 spikes you never plotted. Topology effects no one drew. Buffers you never sized.',
            },
            {
                title: 'Your on-call learns by getting paged at 3 a.m.',
                description:
                    'Without a sandbox, the only training data is real outages. There is a better way.',
            },
        ],
    },
    showcase: {
        title: 'Incident in. Explanation out.',
        subtitle:
            'Run a deterministic LogCraft scenario and watch InSight compress the stream into templates, MetaLogs, detector evidence, and a concise explanation a human can act on.',
        yamlLabel: 'scenario.yaml',
        // NOT 'live': the feed is a fixed array replayed on a timer, and the explain panel
        // beside it has no data source at all. Both say so on their face.
        logsLabel: 'sample evidence stream',
        illustrationBadge: 'Illustration — not live output',
        cta: 'Open the InSight Playground',
    },
    features: {
        title: 'Every knob the real world has.',
        subtitle:
            'LogCraft is not a mock library. It is a deterministic engine that models traffic shape, failure modes and latency the way production does — only on a seed you control.',
        items: [
            {
                title: 'Deterministic by seed',
                description:
                    'Same YAML, same seed, same logs — on any host, on any day. Repro any bug. Replay any incident bit-for-bit.',
            },
            {
                title: 'Twenty-plus output formats',
                description:
                    'JSON · ECS · OTLP · CLF · Syslog · Prometheus · StatsD · HTTP · file. Drop in front of any pipeline.',
            },
            {
                title: 'Cascading failures',
                description:
                    'Declare topology, set a blast radius and a dampening factor — watch one DB take half your fleet down on cue.',
            },
            {
                title: 'Latency distributions',
                description:
                    'p50, p95, p99 tails with realistic shape. Burst, ramp, sinusoidal day/night cycles, business hours.',
            },
            {
                title: 'Browser Lab, zero install',
                description:
                    'Open the Lab, pick a scenario, hit Run. Live agent grid, live log tail, live incident timeline.',
            },
            {
                title: 'C++20 core',
                description:
                    'Sharded, lock-light, microsecond pipeline. Drives multi-million-record runs from a laptop.',
            },
        ],
    },
    howItWorks: {
        title: 'Three steps. No collectors, no clusters, no cards.',
        steps: [
            {
                title: 'Describe',
                description:
                    'A short YAML: a few agents, the sinks they write to, the incidents to schedule. Start from the demo, edit one line, you\'re done.',
            },
            {
                title: 'Run',
                description:
                    'Hit Run in the browser Lab — or call the REST API from CI. The engine spins up real threads and starts emitting at the rate you asked for.',
            },
            {
                title: 'Pipe',
                description:
                    'Stream into your stack: Datadog, Loki, Splunk, Elastic, OpenTelemetry collector — or straight into InSight for explainable anomaly detection.',
            },
        ],
    },
    portfolio: {
        title: 'One engine. A surface for every job.',
        subtitle:
            'Every CodeRoast product turns log noise into signal for a specific job — pick the one that matches the problem in front of you. The slate grows; the engine underneath stays the same.',
        sift: {
            name: 'Sift',
            description:
                'Paste a baseline run and a changed run. Sift ranks the structurally significant changes and suppresses the noise a plain diff buries you in — the CI/CD wedge: zero-infra, ~90 seconds.',
            status: 'Live · free demo',
            highlights: [
                'Ranked “what changed”, noise suppressed',
                'Line-level provenance highlighting',
                'Runs locally — logs never leave (CLI / Action)',
            ],
        },
        logcraft: {
            name: 'LogCraft',
            description:
                'A synthetic log generator and chaos scenario engine. Describe a fleet of agents in YAML, hit run, and get reproducible, production-shaped log streams — cascading failures, latency distributions, 20+ output formats. Test your pipeline, demo your dashboards, train your on-call.',
            status: 'Beta · usable today',
            highlights: [
                'YAML-defined agents & topology',
                'Deterministic seed → bit-stable replays',
                'Cascading failures & chaos incidents',
                '20+ output formats (ECS, OTLP, Prometheus…)',
            ],
        },
        insight: {
            name: 'InSight',
            description:
                'The streaming analysis pipeline behind it all: noisy logs become templates, MetaLogs, detector evidence, and explanation packets — precision-first, so one alert means one real incident. Try it live in the Lab.',
            status: 'Beta · API live',
            highlights: [
                'Explain-first insight cards',
                // NOT "Drain-style template mining": ADR-16.D5 ripped the Drain-family miner as a
                // determinism defect at the root of the product — its cluster learning made the
                // template identity order-dependent across runs. What ships is the stateless
                // per-line masker that replaced it, and that is the stronger claim anyway.
                'Stateless per-line template identity',
                'MetaLog compression layer',
                'Detector evidence for AI explain',
            ],
        },
        metalogForwarding: {
            name: 'MetaLog forwarding',
            description:
                'Compress the stream into MetaLogs and forward those, not raw gigabytes — a structural fingerprint at a fraction of the volume. The CFO-visible half of the story.',
            status: 'Coming soon',
        },
        canary: {
            name: 'Canary validation',
            description:
                'diff(baseline, canary) as a structural kill-signal — catch a bad release before the metrics move, on the same engine as the CI diff.',
            status: 'Coming soon',
        },
    },
    roadmap: {
        title: 'On the roadmap',
        subtitle:
            'What we are building next, and where the product is going.',
        badge: 'Next',
        items: [
            {
                title: 'AI explain demo',
                description:
                    'Attach an agent to InSight\'s output stream — clearer explanations, with no hallucinated interpretation.',
            },
            {
                title: 'Compatibility fixtures',
                description:
                    'Promote selected scenario-library fixtures into release gates that prove LogCraft, IPC, InSight, server, and web stay aligned.',
            },
            {
                title: 'MetaLog trace views',
                description:
                    'Expose deeper MetaLog windows and detector traces after the explain-first demo is stable enough for buyer walkthroughs.',
            },
        ],
    },
    maker: {
        title: 'Built by one engineer.',
        body:
            'I\'m Manu. I\'ve spent enough time hand-rolling fake log generators in shell scripts to want a real one. LogCraft is what I wish I had — a deterministic, scenario-driven engine you can point at any pipeline. It\'s free to try in the Lab, the scenario library is open on GitHub, and I take feedback seriously.',
        ctaCode: 'Scenario library on GitHub',
        ctaContact: 'Get in touch',
        ctaSupport: 'Support the build',
        supportNote: 'A small thank-you keeps the late-night commits coming.',
    },
    licensing: {
        title: 'LogCraft Plans',
        subtitle:
            'LogCraft is not distributed yet: the engine runs in the Lab, in your browser, and nowhere else. This is the shape the offer will take — tell us now if it is the wrong shape.',
        badge: 'The intended offer — not on sale yet',
        free: {
            name: 'Free',
            price: '$0',
            period: 'forever',
            availability: 'Available now — in the Lab, in your browser.',
            description:
                'Run starter scenarios and basic agents. Everything here is live today, and you can check every claim on this page by running it.',
            features: [
                '1–2 agent scenarios',
                'Console & file output',
                'Basic field generators',
                'The full scenario DSL reference',
                'Community support',
            ],
            cta: 'Open the Lab',
        },
        pro: {
            name: 'Pro',
            price: 'TBD',
            period: '/month',
            availability: 'Not sold yet — priced when it ships.',
            description:
                'The realistic stuff: chaos incidents, cascades, all output formats, deterministic replay — as your own binary, on your own machines.',
            features: [
                'CLI binary, self-hosted',
                'Unlimited agents & scenarios',
                'All output sinks (HTTP, ECS, OTLP, Prometheus, StatsD)',
                'Error cascading & incident scenarios',
                'Latency distributions (p50/p95/p99)',
                'Deterministic replay mode',
                'Agent templates & registry',
                'Priority email support',
            ],
            cta: 'Coming soon',
        },
        enterprise: {
            name: 'Enterprise',
            price: 'Custom',
            period: '',
            availability: 'Not sold yet — talk to us and shape it.',
            description:
                'For teams running LogCraft as the synthetic-data backbone of an observability stack.',
            features: [
                'Everything in Pro',
                'State machines & conditional effects',
                'Custom output sink development',
                'Dedicated support & SLA',
                'On-prem / air-gapped deployment',
                'Onboarding & training',
            ],
            cta: 'Contact us',
        },
    },
    howWeBuild: {
        badge: 'Engineering discipline',
        title: 'How we build',
        subtitle: 'Determinism is a product promise. It starts with how we engineer.',
        intro:
            'CodeRoast makes one guarantee: same inputs, same output — bit for bit. A diff you can put behind a CI gate. That isn’t a slogan; it’s an engineering discipline, and it governs everything we ship — including how we use our own tools.',
        sections: [
            {
                title: 'Generation is not decision.',
                body:
                    'We treat AI the way we treat any powerful, unspecified tool: bounded. AI generates — boilerplate, test scaffolding, exploration. Contracts bound it — types, unit and regression tests, API surfaces, human review. A human decides. Nothing reaches a release on a model’s say-so; it reaches a release because it passed a gate a human designed. Reliability isn’t a property of the generator — it’s a property of the frame around it.',
            },
            {
                title: 'The product inherits the same line.',
                body:
                    'This is why InSight is deterministic. A model never decides whether your incident is real, whether a log change is significant, or what belongs in a window — those are structural facts our engine computes and reproduces. In our product, AI only ever narrates what the deterministic engine has already ranked: on your infrastructure, opt-in, your own key, over a bounded fingerprint — never raw logs, never in the path that decides. Other “AI log analysis” hallucinates the finding. We rank deterministically and narrate optionally. The boundary is bright on purpose.',
            },
        ],
        commit: {
            title: 'What we commit to.',
            items: [
                {
                    title: 'Determinism is a gate, not a claim.',
                    description:
                        'Every release re-proves that the same logs produce the same fingerprint byte for byte — built three ways: gcc and clang on Linux, MSVC on Windows (three compilers, two operating systems, three C++ standard libraries — and on both x86-64 and arm64). One identical result, or the release doesn’t ship. Most “reproducible” tools mean on the same machine; we mean across whatever toolchain you happen to have.',
                },
                {
                    title: 'Don’t trust us — reproduce us.',
                    description:
                        'The exact compilers we pin are public and open — our build toolchain is its own repo, source and recipe included. Build CodeRoast yourself and you get the same bytes we do. A determinism claim you can’t reproduce is marketing; ours ships with the recipe.',
                },
                {
                    title: 'The guarantee path is model-free.',
                    description:
                        'Detection, ranking, significance, window membership — no model inference touches any of it. It is reproducible structural computation.',
                },
                {
                    title: 'Your logs never leave your infrastructure.',
                    description:
                        'The CLI and Action run in your CI; nothing is shipped to us. When AI narration is enabled, it runs on your key and your machine, over a bounded fingerprint — not raw logs.',
                },
            ],
        },
        canonOpen: {
            title: 'We open the language — the moat is untouched.',
            description:
                'How Sift reads a CI or compiler log — the grammar, the semantic packages, the contract you extend to teach it a new format — is Apache-2.0, public. Read exactly how we understand your logs. That was never the moat: understanding a log is not detecting what changed. We give away the language and keep the intelligence.',
        },
        closing: 'We hold internally the discipline we sell externally. That’s the whole point.',
        cta: 'Diff two logs',
    },
    howWeCompare: {
        badge: 'A different machine',
        title: 'How we compare',
        subtitle: 'Short version: we’re not a cheaper anything. We’re a different machine.',
        intro:
            'You’re probably here to slot us next to a tool you already know. Fair. But one thing makes the comparison strange before we start: almost everything on the shelf is a warehouse. It stores your observability data and competes on price, cardinality, and who hosts it. We don’t store it. We distil it into a bounded, deterministic fingerprint — on your own infrastructure. That’s not a cheaper warehouse. It’s a different machine. Here’s how that lands against the two tools people put us next to.',
        versus: [
            {
                title: 'vs Datadog — a different machine, not a cheaper one',
                body: [
                    'Datadog’s model is accumulate-and-bill: ship everything to their cloud, pay by volume. When the bill bites, their own answer is to sample — decide which lines stay searchable and hope you didn’t drop the one that mattered. The famous Datadog invoice is the tax of the accumulate model, and sampling is the blind cut it forces.',
                    'We don’t make that bill cheaper. We remove the reason to ship logs off-box at all: distil a complete behavioural fingerprint locally, keep your raw logs where they are. More logs, on-prem — the parachute for the cut teams are already making blind. The cost savings fall out of that, but cost isn’t the pitch: the pitch is that a deterministic structural fact — same inputs, same answer — is something a sampled, probabilistic warehouse structurally cannot hand you. You’re not buying a cheaper Datadog. You’re buying a different object.',
                ],
            },
            {
                title: 'vs Honeycomb — the same conviction, the opposite bet',
                body: [
                    'We start where Honeycomb starts: dumb storage is over, the intelligence is the product. They’re pushing observability forward, and so are we — same conviction, opposite directions. They’re not the enemy; the warehouse mindset is.',
                    'Then the bet diverges, cleanly. Honeycomb bets on richness: keep every event at full cardinality so you can ask any question after the fact. We bet on compression: distil the behaviour up front into a bounded, comparable fingerprint, so “what changed / what’s wrong” is already structured when you look. Honeycomb is unbeatable when you don’t yet know what you’ll need to ask. We’re unbeatable when you need a deterministic, gateable, on-prem fact — reproducible bit for bit, the only kind you can put behind a hard CI gate. Their bet asks you to instrument wide events; ours reads the logs you already write. Pick the bet that fits your problem — plenty of teams will want both.',
                ],
            },
        ],
        wrongTool: {
            title: 'Where we’re the wrong tool',
            body:
                'We’re honest about our edges, because a tool that claims to win everything is lying. We are not a shared searchable UI for 200 engineers, not your compliance-retention store, and we will not fetch the exact payload user 4823 sent last Tuesday. That’s the warehouse’s job — keep it. We tell you what your system’s behaviour did and how it changed, deterministically, without shipping your logs anywhere. If your dominant need is org-wide ad-hoc search over raw history, we’re a complement, not a replacement.',
        },
        otel: {
            title: 'Already on OpenTelemetry?',
            body:
                'Good — your logs are already well-formed, which means there’s even less reason to ship them somewhere to make sense of them. We distil them where they are, and you keep a sovereign fingerprint you own. Same inputs, same answer. Keep your logs.',
            depth:
                'And if you emit spans, Sift diffs the trace itself: a new span, a broken parent chain, a latency blow-up — surfaced as one ranked structural change, deterministically, on your infrastructure. Honeycomb and Spectroscope show you the trace live and beautifully; we tell you what changed between two runs, bit-for-bit, and gate on it — the read a dashboard can’t give you. (Trace depth needs span telemetry; it’s inert on plaintext CI logs — a different axis from the CI-log diff above, claimed only where spans exist.)',
        },
        cta: 'Diff two logs',
    },
    footer: {
        tagline: 'Independent, and uncompromising. C++ at the core, web at the edge.',
        rights: 'All rights reserved.',
        sections: {
            product: 'Product',
            resources: 'Resources',
            more: 'More',
            legal: 'Legal & Security',
        },
        links: {
            logcraft: 'LogCraft',
            lab: 'InSight Playground',
            useCases: 'Use cases',
            pricing: 'Pricing',
            tierMatrix: 'Access profile',
            roadmap: 'Roadmap',
            howWeBuild: 'How we build',
            howWeCompare: 'How we compare',
            github: 'GitHub',
            contact: 'Contact',
            support: 'Support the build',
            terms: 'Terms of Service',
            privacy: 'Privacy Policy',
            trademark: 'Trademark Policy',
            cookiePrefs: 'Your cookie preferences',
        },
    },
    cookiePrefs: {
        title: 'Your Cookie Preferences',
        subtitle:
            'CodeRoast uses only one functional cookie — no trackers, no analytics, no ads. Clear cookies or use incognito for a fresh session.',
        category: 'Functional · Required',
        categoryDesc:
            'Strictly necessary for the product to work correctly. These cookies cannot be switched off.',
        alwaysOn: 'Always on',
        onboardingName: 'Lab Onboarding State',
        onboardingDesc:
            'Remembers that you have completed the Lab onboarding wizard. Without it, the tutorial reappears on every visit to the Lab.',
        cookieKey: 'logcraft_onboarding_dismissed',
        cookieDuration: '1 year',
        resetBtn: 'Reset',
        resetDone:
            'Done — the onboarding tutorial will reappear the next time you visit the Lab.',
        close: 'Close',
    },
    useCases: {
        badge: 'For LogCraft',
        title: 'Three ways teams put LogCraft to work',
        subtitle:
            'LogCraft is a single binary and a YAML file. The story changes with the audience. Here are the three we hear most.',
        tryIt: 'Open this scenario in the Lab',
        narratives: {
            test: {
                tag: 'Engineering',
                title: 'Stress your log pipeline before prod does',
                outcome:
                    'Pump 50k records/sec of ECS into your collector. Watch your buffers, your error budgets, your sampling rules — under traffic that looks real, not under cURL loops.',
                yamlSnippet:
                    '# 5 services, ECS over HTTP, 50k r/s, deterministic\nseed: 42\nagents:\n  - name: api-gw\n    type: web_server\n    rate: 18000\n  - name: orders\n    type: web_server\n    rate: 14000\nsinks:\n  - type: http\n    format: ecs\n    endpoint: http://collector:8080',
                bullets: [
                    'Deterministic seed so two runs reproduce the same incident',
                    'ECS / OTLP / Syslog / file sinks in the same scenario',
                    'Drop into CI as a GitHub Action step',
                ],
            },
            demo: {
                tag: 'Sales / SE',
                title: 'Show a believable cascade in five minutes',
                outcome:
                    'Open the Lab on a screen-share, hit “Cascade”, and let your prospect watch their would-be dashboards light up red. No staging coordination, no risk of leaking real data.',
                yamlSnippet:
                    '# DB chokes → cache misses spike → web 5xx surge\nseed: 1337\nauto_cascade:\n  enabled: true\n  radius: 2\nincidents:\n  - at: "00:00:30"\n    target: orders-db\n    impact: { error_rate: 0.4, latency_x: 8 }',
                bullets: [
                    'Auto-cascade replays a real outage chain',
                    'Pre-baked scenarios for finance, e-commerce, SaaS',
                    '100% synthetic — not one log of yours is involved',
                ],
            },
            train: {
                tag: 'On-call enablement',
                title: 'Train an on-call without paging real people',
                outcome:
                    'Hand a junior the Lab URL, give them a scenario with a known root cause, and let them work it like a real ticket. Replay the same seed across the team for a fair benchmark.',
                yamlSnippet:
                    '# Hidden root cause: payment-gw timeout at 02:15\nseed: 7\nincidents:\n  - at: "02:15:00"\n    target: payment-gw\n    impact: { error_rate: 0.6 }\n    silent: true',
                bullets: [
                    'Same seed = identical incident for every learner',
                    'Pause / resume from a snapshot for guided sessions',
                    'Pairs with InSight to grade the diagnosis',
                ],
            },
        },
    },
    logcraft: {
        betaBadge: 'Beta · free to try in the Lab',
        heroTagline: 'Realistic synthetic logs, on tap.',
        heroSubtitle:
            'LogCraft is a deterministic log & chaos simulator. Describe a fleet of services in YAML, run it, and get production-shaped log streams — cascading failures, latency tails, scheduled incidents, ECS / OTLP / Prometheus output. Use it to load-test your pipeline, demo your dashboards, train your on-call, or feed an analytics engine like InSight.',
        launchLab: 'Open the Lab',
        viewGitHub: 'View on GitHub',
        featuresTitle: 'What LogCraft actually does',
        featuresSubtitle:
            'Not an observability backend. Not a SaaS log store. A generator that makes the logs your pipeline never gets to see in staging.',
        ctaTitle: 'Pick a scenario, hit run.',
        ctaSubtitle:
            'Open the Lab, click "Run Demo", watch a fake e-commerce stack misbehave on demand.',
        deepDiveTitle: 'How LogCraft fits in your stack',
        deepDiveSubtitle:
            'LogCraft sits before your observability stack — generating the streams, so you can stress everything downstream.',
        fitDiagram: {
            yaml: 'YAML scenario',
            engine: 'LogCraft engine',
            sinks: 'Sinks',
            downstream: 'Your stack',
            downstreamDesc:
                'Elastic · Datadog · Loki · Splunk · OTel collector · InSight',
            yamlDesc: 'Agents, topology, incidents, output formats',
            engineDesc: 'Deterministic, sharded, microsecond pipeline',
            sinksDesc:
                'JSON · ECS · OTLP · CLF · Syslog · Prometheus · StatsD · HTTP · file',
        },
        useCases: {
            title: 'What people use it for',
            subtitle:
                'Three concrete jobs LogCraft is good at — pick the one that sounds like yours.',
            items: [
                {
                    title: 'Test your log pipeline',
                    description:
                        'Replay the same multi-service incident every CI run. Verify your parsing, alerting and retention rules survive bursts, cascades and malformed records.',
                },
                {
                    title: 'Demo your observability product',
                    description:
                        'Spin up a "production" without a production. Make the SE story show real cascades, real p99 spikes, real incident timelines — in 10 seconds.',
                },
                {
                    title: 'Train your on-call',
                    description:
                        'Hand a junior the Lab URL, hit "Cascade", and let them debug a real-looking incident with a known root cause — no risk to production.',
                },
            ],
        },
        conceptsTitle: 'Five concepts and you\'re fluent',
        conceptsSubtitle:
            'The rest of the YAML reference is for the day you outgrow these.',
        conceptsShowAdvanced: 'Show advanced concepts',
        conceptsHideAdvanced: 'Hide advanced concepts',
        concepts: {
            agents: {
                title: 'Agents',
                body:
                    'An agent is a fake service. You give it a name, a type ("web_server", "database"…), a rate, a message template and some fields. The engine spins it up on its own thread and starts emitting structured records at the rate you asked for. Wire several together with `interactions` to model a topology.',
            },
            outputs: {
                title: 'Sinks (outputs)',
                body:
                    'Where the logs go. A scenario can declare any number of sinks and any agent can route to any subset. Console, file, HTTP, ECS, OTLP, Syslog, CLF, Prometheus, StatsD — all simultaneously. Use it to A/B compare two pipelines on the same stream.',
            },
            incidents: {
                title: 'Incidents & cascades',
                body:
                    'Scheduled disruptions: "at minute 5 the database starts erroring at 20% with 8× latency". Combine with `auto_cascade` to let the failure propagate to dependents with a configurable blast radius and dampening factor — exactly like a real outage.',
            },
            determinism: {
                title: 'Determinism (the seed)',
                body:
                    'Set `seed: 42` and the run becomes bit-stable. Same logs, same incidents, same order, on any host. Share the YAML with a colleague and you both see the same outage. This is what makes LogCraft useful in CI and as training data for InSight.',
            },
            rateModulation: {
                title: 'Traffic shape (phases & modulation)',
                body:
                    'Real traffic isn\'t flat. Use `phases` to script ramps and peaks, or `rate_modulation` to get smooth sinusoidal day/night cycles or business-hours patterns. Build a 24h scenario in 24 minutes.',
            },
            phases: {
                title: 'Phases (scripted ramps)',
                body:
                    'Each agent can declare a `phases` block: a list of `(at, multiplier)` checkpoints that scale the base rate over time. Useful to script a soft warm-up, a midday peak, or a 3 a.m. crash window without rewriting the rate. Phases interpolate linearly between checkpoints.',
            },
            fields: {
                title: 'Fields (the payload)',
                body:
                    'Every record carries a `fields` map you control. You declare static fields, templated fields (`{{user_id}}`), or weighted enums (`status: 200=80%, 500=10%, 503=10%`). The same field schema flows to every sink, so your ECS index, your OTLP exporter and your file tail all see consistent records.',
            },
            cascades: {
                title: 'Auto-cascades (blast radius)',
                body:
                    'When `auto_cascade.enabled: true`, an incident on agent A automatically degrades its declared dependents based on `radius`, `propagation_delay` and `dampening_factor`. This is what turns a single error injection into the realistic chain reaction your dashboards have to detect.',
            },
            replay: {
                title: 'Determinism & replay',
                body:
                    'Beyond `seed`, the engine records every emitted record’s ordinal so two runs of the same YAML produce byte-identical streams. Combined with the `engine.snapshot` API you can pause a run, share the state, and resume it elsewhere — useful for sharing repros and CI snapshots.',
            },
            registry: {
                title: 'Agent type registry',
                body:
                    'Built-in agent types (web_server, database, cache, queue…) come with sensible defaults for fields, error vocabulary and latency shape. You can register your own type via the YAML reference if you need exotic semantics — most users never touch this layer.',
            },
        },
    },
    lab: {
        title: 'Playground',
        simulatedBadge: 'INSIGHT LIVE · synthetic stream',
        playgrounds: {
            label: 'Playground mode',
            logcraft: {
                title: 'LogCraft Playground',
                badge: 'Real time',
                short: 'Scenario lab for LogCraft output, DSL practice, and benchmarks. No InSight analysis in this view.',
                selectScenario: 'Pick a LogCraft scenario',
                selectScenarioDesc:
                    'Run real-time synthetic services, inspect generated logs, and exercise the scenario DSL before wiring any analysis layer.',
                launchAndStart: 'Run LogCraft scenario',
                launchPaused: 'Create LogCraft engine',
            },
            insight: {
                title: 'InSight Playground',
                badge: 'Regression',
                short: 'Deterministic InSight lab for replay, detector evidence, and no-fatigue tuning.',
                selectScenario: 'Pick a deterministic scenario',
                selectScenarioDesc:
                    'Choose a seeded LogCraft scenario, run the pipeline, and use repeatable evidence to tune InSight behavior.',
                launchAndStart: 'Run InSight scenario',
                launchPaused: 'Create paused pipeline',
            },
        },
        backToHome: 'Back to CodeRoast',
        backToScenarios: 'Back to scenarios',
        live: 'Live',
        selectScenario: 'Pick a scenario',
        selectScenarioDesc:
            'Each scenario is a synthetic service topology that feeds InSight. Pick one, edit if you want, then run the pipeline.',
        launchEngine: 'Launch Engine',
        runDemo: 'Run Demo',
        launchAndStart: 'Run scenario',
        launchPaused: 'Create paused',
        autoStartHint: 'auto-starts the engine',
        start: 'Start',
        stop: 'Stop',
        destroy: 'Stop & reset',
        throughput: 'Throughput',
        errorRate: 'Error rate',
        elapsed: 'Elapsed',
        agents: 'Agents',
        noAgents: 'No agents — start the engine to see live data.',
        sinks: 'Output Sinks',
        sinksDesc:
            'Delivery metrics for each output — write rate, backlog, errors. Not the destination contents.',
        drain: {
            title: 'LogCraft Demo Sink',
            caption:
                'Any output with a name: field is intercepted by the server and captured here — file, console, and HTTP sinks alike. The server rewrites them to an internal drain so you can see the raw payloads exactly as they would have reached a real collector.',
            empty: 'No records captured yet. Start the engine — any named output (name: in the scenario YAML) will appear here.',
            targets: 'Captured for',
            noTargets: 'No demo HTTP outputs detected in this scenario.',
            droppedSuffix: ' older record(s) dropped to keep the buffer bounded.',
            showBody: 'Show body',
            hideBody: 'Hide body',
            copy: 'Copy',
            copied: 'Copied',
            receivedAt: 'received',
            bytes: 'bytes',
            sentTo: 'would be sent to',
        },
        scenario: 'Loaded scenario',
        scenarioDesc:
            'The YAML running right now. Compare with the live metrics above.',
        logTail: 'Log Tail',
        logTailDesc: 'Best-effort sample — snapshots carry the last ~20 records each tick. Agents produce far more; only a fraction reaches this feed. The total counter reflects everything the engine generated.',
        entries: 'entries',
        noLogs: 'No log entries yet.',
        noLogsMatch: 'No log entries match your filter.',
        incidents: 'Incidents',
        events: 'events',
        noIncidents: 'No incidents yet.',
        insight: {
            tab: 'Insights',
            title: 'InSight Explain',
            subtitle: 'MetaLog evidence turned into operator-ready explanations.',
            running: 'Running',
            idle: 'Idle',
            syncing: 'Syncing',
            errorShort: 'Error',
            errorTitle: 'InSight unavailable',
            linesIngested: 'lines ingested',
            capabilityLabel: 'InSight capability views',
            latest: 'Latest explanation',
            previous: 'Earlier explanations',
            actionHint: 'Action hint',
            sourceRules: 'Rules',
            sourceAugmented: 'AI augmented',
            sourceFull: 'AI full',
            sourceUnknown: 'Explain',
            evidence: 'Supporting evidence',
            templates: 'Affected templates',
            confidence: 'confidence',
            noEvidence: 'No evidence attached to this report.',
            noTemplates: 'No affected templates attached to this report.',
            noReportsTitle: 'Waiting for first explanation',
            noReportsBody:
                'InSight is ingesting the stream and building evidence. When a detector fires, the explain packet appears here.',
            detectTitle: 'Severity summary',
            detectEmptyTitle: 'No detection signals yet',
            detectEmptyBody: 'Detection signals appear when InSight closes a MetaLog window and finds a statistically anomalous pattern.',
            detectScore: 'score',
            detectConf: 'conf',
            metalogTitle: 'MetaLog evidence',
            metalogBody:
                'MetaLogs compress repeated behavior into compact evidence packets before detection and explain consume them.',
            metalogWindowTitle: 'Latest MetaLog window',
            metalogStabilityTitle: 'Stability',
            metalogTopKTitle: 'Top templates',
            metalogWindowDuration: 'Window duration',
            metalogEntropy: 'Entropy',
            metalogStabilityScore: 'Stability score',
            metalogJsDivergence: 'JS divergence',
            metalogUniqueTemplates: 'Unique templates',
            metalogNoData: 'No MetaLog data yet',
            metalogNoDataBody: 'MetaLog windows accumulate as the engine ingests log lines. The first window appears after one full window duration.',
            configTitle: 'Pipeline configuration',
            configWindowDuration: 'Window duration',
            configWindowCount: 'Windows processed',
            configPyramidMaturity: 'Pyramid maturity',
            configExplainMode: 'Explain mode',
            configLlmModel: 'LLM model',
            configLlmEnabled: 'LLM enabled',
            configLlmDisabled: 'LLM disabled',
            configLlmNotSet: 'not configured',
            configWindowSeconds: 's',
            configNotAvailable: '—',
            pyramidMature: 'Mature',
            pyramidWarmingUp: 'Warming up',
            pyramidUninitialized: 'Not started',
            configWindowsSeen: 'Windows seen',
            acuteDiffTitle: 'Window delta (vs previous)',
            acuteDiffNew: 'New templates',
            acuteDiffVanished: 'Vanished',
            acuteDiffTemplateDelta: 'Template Δ',
            streamLastWindow: 'Last window',
            streamJustNow: 'just now',
            pyramidWarmingUpProgress: 'warming up',
            windowLabel: 'Window',
            insightCatchingUp: 'Catching up…',
            detectSignalsTitle: 'Detection signals',
            detectSeveritySource: 'from explain engine',
            templatesExplainOnly: 'explain-only',
            evidenceTitle: 'Evidence packets',
            evidenceEmptyTitle: 'No evidence packets',
            evidenceEmptyBody: 'Evidence packets appear once a window has been explained. They contain the detection context fed to the AI.',
            evidenceIncident: 'Incident',
            evidenceTemplates: 'Templates',
            evidenceWindow: 'Window context',
            evidenceFreq: 'freq',
            evidenceDelta: 'Δ',
            ingestAvgLines: 'avg lines/window',
            ingestWindows: 'Windows processed',
            configReconfigureTitle: 'Reconfigure',
            configReconfigureApply: 'Apply',
            configReconfigureApplying: 'Applying…',
            configReconfigureApplied: 'Applied',
            configReconfigureError: 'Failed to apply',
            configMinConfidence: 'Min confidence',
            configMaxInsights: 'Max insights',
            configWarmupScale: 'Warmup confidence scale',
            configLlmModelLabel: 'LLM model',
            configLlmModelNone: 'None (rules mode)',
            configLlmFull: 'LLM full mode',
            configReconfigureHint: 'Changes to explain settings take effect immediately. Changing window duration resets pyramid warmup.',
            templatesTitle: 'Template focus',
            templatesEmptyTitle: 'No template focus yet',
            templatesEmptyBody: 'Affected templates appear when an explanation names the log patterns involved.',
            ingestTitle: 'Live ingestion',
            ingestRunning: 'The server pipeline is consuming the engine shared-memory stream.',
            ingestIdle: 'The engine is idle; InSight is waiting for a stream.',
            metrics: {
                lines: 'Lines',
                reports: 'Reports',
                evidence: 'Evidence',
                templates: 'Templates',
            },
            tabs: {
                explain: 'Explain',
                detect: 'Detect',
                metalog: 'MetaLog',
                templates: 'Templates',
                ingest: 'Ingest',
                config: 'Config',
                evidence: 'Evidence',
            },
            states: {
                ready: 'Ready',
                waiting: 'Waiting',
            },
        },
        created: 'Engine ready.',
        error: 'Error',
        noScenarioSelected: 'Pick or paste a scenario YAML to run.',
        yamlPlaceholder:
            'Pick a scenario on the left, or paste your own YAML here…',
        loadingScenarios: 'Loading scenarios…',
        scenarioLoadError: 'Could not load scenarios',
        scenarioYaml: 'Scenario YAML',
        play: 'Play',
        pause: 'Pause',
        advance: 'Advance',
        replay: 'Replay',
        replaying: 'Replaying',
        playToTarget: 'Play to target',
        playingToTarget: 'Playing to target…',
        targetSeconds: 'Target seconds',
        websocketNotConnected: 'WebSocket is not connected yet.',
        mode: 'Mode',
        clock: 'Clock',
        playback: 'Playback',
        speed: 'Speed',
        cascade: 'Cascade now',
        cascadeTip:
            'Force one round of cascade evaluation. Failing agents propagate degradation to their callers using your scenario\'s blast radius / dampening. Great to demo "one DB takes the rest down".',
        rate: 'Rate',
        rateTip:
            'Records per second emitted by this agent. Bump up to stress alerts; drop to 0 to mute without stopping the engine.',
        errorsTip:
            'Share of records flagged as errors (0–100%). Force a failure without editing YAML.',
        burst: 'Burst',
        burstTip: 'Emit N extra records right now. Useful to spike aggregator buffers.',
        apply: 'Apply',
        send: 'Send',
        reset: 'Reset',
        liveControls: 'Live Controls',
        liveControlsDesc:
            'Tweak each agent without touching the YAML. Changes apply instantly and revert when the engine stops.',
        lock: 'Lock',
        unlock: 'Unlock',
        lockedTip:
            'Agent is following the scenario. Click the lock to take ownership and tweak rate / error.',
        unlockedTip:
            'You own this agent — it no longer follows scenario phases. Click again to relock (sliders return to scenario).',
        lockedTierRequired:
            'Requires the {tier} tier. Switch user (top right) to a higher tier to use this control.',
        lockedOperationRequired:
            'Requires the {operation} capability. Switch user (top right) to access this control.',
        seededAgentOwned:
            'Determinism broken: this agent no longer mirrors the seeded scenario.',
        seedDeterminismWarning:
            'This scenario is seeded for deterministic replay. {action} will break that determinism — re-runs will no longer produce identical logs.',
        seedActionUnlock: 'Taking ownership of an agent',
        seedActionBurst: 'Triggering a burst',
        seedActionCascade: 'Forcing a cascade evaluation',
        seedConfirmTitle: 'Seeded scenario — heads up',
        seedConfirmProceed: 'Proceed anyway',
        seedConfirmCancel: 'Cancel',
        leaveEngineTitle: 'Leave the lab?',
        leaveEngineBody:
            'Your engine will be stopped and destroyed. Any run quota already consumed will not be restored.',
        leaveEngineProceed: 'Leave anyway',
        leaveEngineCancel: 'Stay',
        leaveEngineDismiss: 'Dismiss',

        filters: 'Filters',
        filterAllLevels: 'All levels',
        filterAllAgents: 'All agents',
        filterSearch: 'Search message…',
        filterClear: 'Clear filters',
        firstVisitTitle: 'Welcome to the InSight Playground',
        firstVisitBody:
            'This is a live InSight demo powered by synthetic logs. Pick a scenario on the left, run it, and watch InSight turn the stream into explanations. Nothing real is ingested — every line is generated for the demo, and the engine runs on our server, not in your tab. That is the demo; the product runs on your infrastructure.',
        firstVisitDismiss: 'Got it, let\'s go',
        firstVisitLearn: 'Read the LogCraft overview first',
        emptyEngineHint:
            'Engine created — press "Start" to begin emitting logs.',
        simulationElapsed: 'Sim elapsed',
        wallElapsed: 'Wall elapsed',
        duration: 'Duration',
        remaining: 'Remaining',
        openEnded: 'Open-ended',
        timeline: 'Timeline',
        clickToSeek: 'click to seek',
        seekTimeline: 'Seek timeline',
        engineLabel: 'Engine',
        scenarioName: 'Scenario',
        recommendedBadge: 'Recommended start',
        onboarding: {
            skip: 'Skip',
            back: 'Back',
            next: 'Next',
            pickScenario: 'Pick my scenario',
            launch: 'Launch the engine',
            noScenarioFound:
                'Could not find a matching scenario. Pick one from the catalog instead.',
            tierLocked:
                'The best match for these answers is locked behind a higher tier. Pick a different complexity or upgrade.',
            step1Title: 'What do you want to do?',
            step1Subtitle:
                'Pick the closest match. We will use it to suggest a scenario — you can always swap it later.',
            step2Title: 'How busy do you want it?',
            step2Subtitle:
                'Drives how many fake services and incidents the engine spins up.',
            step3Title: 'Ready to run',
            step3Subtitle:
                'Your scenario is loaded. Hit launch to start the engine and watch the logs flow.',
            intents: {
                explore: {
                    title: 'Just explore',
                    desc: 'Show me what the engine looks like with a tiny demo.',
                },
                test: {
                    title: 'Test my log pipeline',
                    desc: 'Pump structured logs into my collector and see if it survives.',
                },
                demo: {
                    title: 'Demo to a customer',
                    desc: 'I need a believable cascade I can show on a call in 5 minutes.',
                },
                train: {
                    title: 'Train an on-call',
                    desc: 'Let a junior debug a scripted incident with a known root cause.',
                },
            },
            complexity: {
                simple: {
                    title: 'Simple',
                    desc: '1–2 services. Steady traffic. No incidents.',
                },
                realistic: {
                    title: 'Realistic',
                    desc: '5–10 services with interactions. A few hiccups along the way.',
                },
                chaos: {
                    title: 'Chaos',
                    desc: 'Multiple services + scripted incidents + cascade-on. Demo material.',
                },
            },
        },
    },
    auth: {
        loadingUsers: 'Loading users…',
        anonymous: 'Anonymous (no token)',
        signedInAs: 'Signed in as',
        requiresTier: 'This feature requires the {tier} tier.',
        youAre: 'You are signed in as {role}.',
        tierMatrix: 'Access profile',
        tierLockTitle: 'This needs a higher tier',
        tierLockBody:
            'The "{permission}" capability is included in the {tier} tier. You\'re currently on {current}.',
        tierLockSeePlans: 'See plans',
        tierLockSwitch: 'Switch user',
        tierLockClose: 'Close',
        tierLockedBadge: 'Locked',
        tierDisabledTitle: 'Not available in this deployment',
        tierDisabledBody:
            'The "{permission}" capability is not enabled in the current deployment. Contact your administrator.',
        scenarioNotAvailable: 'This scenario requires capabilities that are not available in this deployment:',
    },
    tiers: {
        title: 'Access profile',
        description:
            'Your current entitlements, operation access, and quota limits — served live from the backend access-control configuration.',
        loading: 'Loading access profile…',
        feature: 'Feature',
        disabled: 'disabled',
        yourLimits: 'Your limits',
        quota: 'Quota',
        usage: 'Usage',
        limit: 'Limit',
        unlimited: 'Unlimited',
        noAccess: 'No access',
        noQuotas: 'No quota information available.',
    },
}

export default en
