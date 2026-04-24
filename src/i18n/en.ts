// English translations. Source of truth for the TranslationKey type.
// Per-language modules are aggregated in `./translations.ts`.
const en = {
    nav: {
        home: 'Home',
        product: 'Product',
        how: 'How',
        features: 'Features',
        pricing: 'Pricing',
        logcraft: 'LogCraft',
        lab: 'Open Lab',
        useCases: 'Use cases',
        contact: 'Contact',
    },
    hero: {
        badge: 'Performant engine · Zero-install Lab · 20+ output formats',
        tagline: 'Realistic synthetic logs. On demand.',
        subtitle:
            'LogCraft generates production-shaped log streams from a YAML scenario — cascading failures, latency tails, scheduled incidents, twenty-plus output formats. Test your pipeline before production does.',
        cta: 'Try LogCraft live',
        ctaSecondary: 'See how it works',
        trust: 'Deterministic · ECS · OTLP · Prometheus · StatsD · Syslog · CLF · HTTP · file',
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
        title: 'YAML in. Production-shaped logs out.',
        subtitle:
            'Describe a fleet of services in a few lines. The engine spins them up on real threads, emits structured records, and ships them to any sink you wire in.',
        yamlLabel: 'scenario.yaml',
        logsLabel: 'live engine output',
        cta: 'Open the live Lab',
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
                    'Stream into your stack: Datadog, Loki, Splunk, Elastic, OpenTelemetry collector — or straight into InSight when it ships.',
            },
        ],
    },
    useCasesHome: {
        title: 'Three jobs LogCraft is good at.',
        subtitle: 'Pick the one that sounds like yours.',
        items: [
            {
                title: 'Test your log pipeline',
                description:
                    'Replay the same multi-service incident every CI run. Verify your parsing, alerting and retention rules survive bursts, cascades and malformed records.',
            },
            {
                title: 'Demo your observability product',
                description:
                    'Spin up a "production" without a production. Make the SE story show real cascades, real p99 spikes, real incident timelines — in ten seconds.',
            },
            {
                title: 'Train your on-call',
                description:
                    'Hand a junior the Lab URL, hit Cascade, and let them debug a real-looking incident with a known root cause — no risk to anything live.',
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
        title: 'The other half of the picture.',
        subtitle:
            'LogCraft is one half of a two-engine plan. InSight is the other — and the Lab is where they meet.',
        insight: {
            name: 'InSight',
            description:
                'A 5-phase streaming pipeline (tokenization → sequencing → metalog → drift detection → optional LLM insight) that auto-detects log formats, mines templates with Drain, builds behavioral models, and catches anomalies via an ADWIN / Page-Hinkley / EWMA / CUSUM ensemble. Currently a POC; LogCraft is its training ground.',
            status: 'In R&D · POC',
            highlights: [
                '5-phase streaming pipeline',
                'Drain-style template mining',
                'Drift detector ensemble',
                'Optional LLM root-cause hints',
            ],
        },
        logcraft: {
            name: 'LogCraft',
            description:
                'A synthetic log generator and chaos scenario engine. Describe a fleet of agents in YAML, hit run, and get reproducible, production-shaped log streams — with cascading failures, scheduled incidents, latency distributions and 20+ output formats (JSON, ECS, OTLP, Syslog, CLF, Prometheus, StatsD…). Use it to test your log pipeline, demo your dashboards, train your on-call.',
            status: 'Beta · usable today',
            highlights: [
                'YAML-defined agents & topology',
                'Deterministic seed → bit-stable replays',
                'Cascading failures & chaos incidents',
                '20+ output formats (ECS, OTLP, Prometheus…)',
            ],
        },
        playground: {
            name: 'LogCraft Lab',
            description:
                'The browser playground around LogCraft. Pick a scenario, launch a live engine, watch the metrics and the log tail in real time — no install, no download. The bridge to InSight (anomaly view) lands here once InSight is out of POC.',
            status: 'Live now',
            highlights: [
                'Zero-install, browser-based',
                'Live agent & sink metrics',
                'Searchable, filterable log tail',
            ],
        },
    },
    roadmap: {
        title: 'On the roadmap',
        subtitle:
            'What we are building next, and where the product is going.',
        badge: 'Next',
        items: [
            {
                title: 'InSight v0.1',
                description:
                    'First end-to-end anomaly-detection slice on top of LogCraft streams: format auto-detect, template mining, baseline + drift score per template.',
            },
            {
                title: 'Lab → InSight bridge',
                description:
                    'Pipe a running LogCraft scenario directly into the InSight pipeline and visualise drift in the same browser session. No collectors, no ingest config.',
            },
            {
                title: 'REST + Kafka outputs',
                description:
                    'Drive LogCraft engines from CI, and stream generated logs to Kafka and webhooks for downstream pipeline tests.',
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
            lab: 'Open the Lab',
            useCases: 'Use cases',
            pricing: 'Pricing',
            tierMatrix: 'Tier matrix',
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
        title: 'Lab',
        simulatedBadge: 'SIMULATED · 100% synthetic data',
        backToLogCraft: 'Back to LogCraft',
        backToScenarios: 'Back to scenarios',
        live: 'Live',
        selectScenario: 'Pick a scenario',
        selectScenarioDesc:
            'Each scenario is a YAML file describing a fake service topology. Pick one, edit if you want, then hit "Run".',
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
                'These HTTP outputs target *.logcraft.demo — a hostname we own that resolves to nothing. The server intercepts the requests and shows the raw payloads here so you can see exactly what would have hit a real collector.',
            empty: 'No requests captured yet. Start the engine and any HTTP output that points at *.logcraft.demo will appear here.',
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
        created: 'Engine ready.',
        error: 'Error',
        noScenarioSelected: 'Pick or paste a scenario YAML to run.',
        yamlPlaceholder:
            'Pick a scenario on the left, or paste your own YAML here…',
        loadingScenarios: 'Loading scenarios…',
        scenarioLoadError: 'Could not load scenarios',
        scenarioYaml: 'Scenario YAML',
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
        filters: 'Filters',
        filterAllLevels: 'All levels',
        filterAllAgents: 'All agents',
        filterSearch: 'Search message…',
        filterClear: 'Clear filters',
        firstVisitTitle: 'Welcome to the LogCraft Lab',
        firstVisitBody:
            'This is a sandbox for synthetic logs. Pick a scenario on the left (we pre-loaded "Hello World"), hit "Run scenario", and watch a fleet of fake services emit production-shaped logs. Nothing real is ingested — the data lives only in this browser tab.',
        firstVisitDismiss: 'Got it, let\'s go',
        firstVisitLearn: 'Read the LogCraft overview first',
        emptyEngineHint:
            'Engine created — press "Start" to begin emitting logs.',
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
        tierMatrix: 'Tier matrix',
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
        title: 'Tier & Feature Matrix',
        description:
            'This page mirrors the live access-control configuration of the backend. Every permission key is grouped by category; ✓ means the tier grants the feature, ✗ means it does not.',
        loading: 'Loading feature matrix…',
        feature: 'Feature',
        disabled: 'disabled',
    },
}

export default en
