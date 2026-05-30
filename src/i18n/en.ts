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
        badge: 'CodeRoast · log noise → comprehension',
        tagline: 'Turn log noise into comprehension.',
        subtitle:
            'CodeRoast compresses noisy logs into ranked, deterministic structure — so you (or an LLM) read what actually changed, not gigabytes of it. Precision-first, and it runs on your infra. Start by diffing two CI runs.',
        cta: 'Diff two logs',
        ctaSecondary: 'See all products',
        trust: 'deterministic · precision-first · runs on your infra · logs never stored',
    },
    vision: {
        badge: 'CodeRoast · the MetaLog thesis',
        titleLead: 'Not stored. Not sampled. Not shipped.',
        titleAccent: 'Distilled.',
        subtitle:
            'CodeRoast distils any log stream into a MetaLog — a small, deterministic fingerprint of what your system actually did. Bit-identical across runs, citable, re-derivable to the exact source line, and it never leaves your box. Sift, anomaly detection, AI triage: every product is just a lens on that one artifact. Reading 4 KB instead of storing gigabytes is the side effect — not the pitch.',
        ctaPrimary: 'Diff two logs',
        ctaSecondary: 'See the products',
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
                    step: '4 KB out',
                    description:
                        'It distils to a bounded structural fingerprint. ~150:1, and it never leaves your box.',
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
                    new: 'A bounded fingerprint, ~150:1. The small footprint is a side effect of distilling, not the point.',
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
                        'Forward fingerprints, not raw gigabytes — ~150:1 off your observability bill.',
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
    diffShowcase: {
        eyebrow: 'Sift',
        title: 'Your CI went red. Which lines actually matter?',
        subtitle:
            'Paste the last green run and the failing one. Sift ranks what structurally changed — new errors, a test file gone red, frequency shifts — and mutes the hundreds of lines that didn\'t. No agent, no setup; a shareable report in about 90 seconds.',
        cta: 'Diff two logs',
        note: 'Free · runs in your browser session · logs never stored',
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
                title: 'Your on-call learns by getting paged.',
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
        logsLabel: 'live evidence stream',
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
                    'Open the URL, pick a scenario, hit Run. Live agent grid, live log tail, live incident timeline.',
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
        subtitle: '',
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
    pricingTeaser: {
        title: 'Free for solo. Paid where it gets real.',
        subtitle:
            'Starter scenarios are free forever. Pro and Enterprise unlock chaos, cascades and the full output catalogue.',
        seePlans: 'See full pricing',
        free: { name: 'Free', price: '$0', tagline: 'Solo & evaluation' },
        pro: { name: 'Pro', price: 'TBD', tagline: 'The full engine' },
        enterprise: { name: 'Enterprise', price: 'Custom', tagline: 'Topology & on-prem' },
    },
    portfolio: {
        title: 'One engine. A surface for every job.',
        subtitle:
            'Every CodeRoast product turns log noise into comprehension for a specific job — pick the one that matches the problem in front of you. The slate grows; the engine underneath stays the same.',
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
                'Drain-style template mining',
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
                    'Attach an agent to the explain payload so a demo can narrate the MetaLog evidence and recommend the next investigation step.',
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
    donation: {
        title: 'Support the build',
        subtitle:
            'LogCraft is built solo, in the open, on nights and weekends. If it saves you a debugging afternoon, a small thank-you helps.',
        cta: 'Send a tip',
    },
    licensing: {
        title: 'LogCraft Plans',
        subtitle:
            'Free for solo use and learning. Paid tiers unlock the chaos, cascade and production-shape scenarios.',
        badge: 'Pricing — early access',
        free: {
            name: 'Free',
            price: '$0',
            period: 'forever',
            description:
                'Run starter scenarios and basic agents. Perfect to evaluate LogCraft and try the Lab.',
            features: [
                '1–2 agent scenarios',
                'Console & file output',
                'Basic field generators',
                'CLI access',
                'Community support',
            ],
            cta: 'Open the Lab',
        },
        pro: {
            name: 'Pro',
            price: 'TBD',
            period: '/month',
            description:
                'The realistic stuff: chaos incidents, cascades, all output formats, deterministic replay.',
            features: [
                'Unlimited agents & scenarios',
                'All output sinks (HTTP, ECS, OTLP, Prometheus, StatsD)',
                'Error cascading & chaos incidents',
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
            description:
                'For teams running LogCraft as the synthetic-data backbone of an observability stack.',
            features: [
                'Everything in Pro',
                'Network topology simulation',
                'State machines & conditional effects',
                'Custom output sink development',
                'Dedicated support & SLA',
                'On-prem / air-gapped deployment',
                'Onboarding & training',
            ],
            cta: 'Contact us',
        },
    },
    footer: {
        tagline: 'An indie engineering shop. C++ where it counts, web where it should.',
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
                    '100% synthetic — nothing leaves the browser tab',
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
            'This is a live InSight demo powered by synthetic logs. Pick a scenario on the left, run it, and watch InSight turn the stream into explanations. Nothing real is ingested — the data lives only in this browser session.',
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
