const translations = {
    en: {
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
            badge: 'C++20 engine · Browser Lab · Self-hosted ready',
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
            title: 'Built by one engineer, in the open.',
            body:
                'I\'m Manu. I\'ve spent enough time hand-rolling fake log generators in shell scripts to want a real one. LogCraft is what I wish I had — a deterministic, scenario-driven engine you can point at any pipeline. It\'s free to try in the Lab, the source is on GitHub, and I take feedback seriously.',
            ctaCode: 'Source on GitHub',
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
    },
    fr: {
        nav: {
            home: 'Accueil',
            product: 'Produit',
            how: 'Comment',
            features: 'Fonctionnalités',
            pricing: 'Tarifs',
            logcraft: 'LogCraft',
            lab: 'Ouvrir le Lab',
            useCases: 'Cas d’usage',
            contact: 'Contact',
        },
        hero: {
            badge: 'Moteur C++20 · Lab navigateur · Self-hosted',
            tagline: 'Des logs synthétiques réalistes. À la demande.',
            subtitle:
                'LogCraft génère des flux de logs aux formes de production à partir d\'un scénario YAML — cascades de pannes, queues de latence, incidents planifiés, plus de vingt formats de sortie. Stressez votre pipeline avant que la prod ne le fasse.',
            cta: 'Essayer LogCraft en direct',
            ctaSecondary: 'Voir comment ça marche',
            trust: 'Déterministe · ECS · OTLP · Prometheus · StatsD · Syslog · CLF · HTTP · fichier',
        },
        problem: {
            title: 'On ne livre pas une observabilité qu\'on n\'a jamais testée.',
            subtitle:
                'En staging, c\'est calme. Les mocks sont propres. Puis la prod casse à 3 h du matin et vos alertes n\'ont jamais sonné pour de vrai. LogCraft est l\'entrée qui manque à tout votre aval.',
            points: [
                {
                    title: 'Vos alertes marchent en staging — parce qu\'il ne s\'y passe rien.',
                    description:
                        'Pas de rafales, pas de cascades, pas de records sales. Le premier vrai incident est le premier vrai test.',
                },
                {
                    title: 'Vos dashboards sont jolis jusqu\'au moment où la cascade frappe.',
                    description:
                        'Des p99 que vous n\'avez jamais tracés. Des effets de topologie que personne n\'a dessinés. Des buffers jamais dimensionnés.',
                },
                {
                    title: 'Votre astreinte se forme en se faisant réveiller.',
                    description:
                        'Sans bac à sable, le seul jeu d\'entraînement, ce sont les vraies pannes. Il y a mieux.',
                },
            ],
        },
        showcase: {
            title: 'YAML en entrée. Logs aux formes de production en sortie.',
            subtitle:
                'Décrivez une flotte de services en quelques lignes. Le moteur les lance sur de vrais threads, émet des records structurés, et les expédie vers le sink que vous voulez.',
            yamlLabel: 'scenario.yaml',
            logsLabel: 'sortie moteur live',
            cta: 'Ouvrir le Lab',
        },
        features: {
            title: 'Tous les boutons que la vraie vie a.',
            subtitle:
                'LogCraft n\'est pas une lib de mock. C\'est un moteur déterministe qui modélise la forme du trafic, les pannes et la latence comme la prod — sur un seed que vous contrôlez.',
            items: [
                {
                    title: 'Déterministe par seed',
                    description:
                        'Même YAML, même seed, mêmes logs — sur n\'importe quelle machine. Reproduisez n\'importe quel bug. Rejouez n\'importe quel incident bit-pour-bit.',
                },
                {
                    title: 'Plus de vingt formats',
                    description:
                        'JSON · ECS · OTLP · CLF · Syslog · Prometheus · StatsD · HTTP · fichier. À placer devant n\'importe quel pipeline.',
                },
                {
                    title: 'Pannes en cascade',
                    description:
                        'Déclarez la topologie, fixez un rayon d\'impact et un facteur d\'atténuation — regardez une DB tomber et entraîner la moitié de la flotte sur commande.',
                },
                {
                    title: 'Distributions de latence',
                    description:
                        'Queues p50, p95, p99 aux formes réalistes. Rafales, rampes, cycles jour/nuit sinusoïdaux, heures de bureau.',
                },
                {
                    title: 'Lab navigateur, zéro install',
                    description:
                        'Ouvrez l\'URL, choisissez un scénario, cliquez Run. Grille d\'agents, flux de logs, timeline d\'incidents — en direct.',
                },
                {
                    title: 'Cœur C++20',
                    description:
                        'Pipeline shardé, faible contention, microseconde. Tient des runs multi-millions de records sur un laptop.',
                },
            ],
        },
        howItWorks: {
            title: 'Trois étapes. Pas de collecteur, pas de cluster, pas de carte bleue.',
            subtitle: '',
            steps: [
                {
                    title: 'Décrire',
                    description:
                        'Un YAML court : quelques agents, les sinks où ils écrivent, les incidents à planifier. Partez de la démo, changez une ligne, c\'est joué.',
                },
                {
                    title: 'Lancer',
                    description:
                        'Cliquez Run dans le Lab — ou appelez l\'API REST depuis la CI. Le moteur lance de vrais threads et émet à la cadence demandée.',
                },
                {
                    title: 'Brancher',
                    description:
                        'Streamez vers votre stack : Datadog, Loki, Splunk, Elastic, OpenTelemetry — ou directement vers InSight quand il sortira.',
                },
            ],
        },
        useCasesHome: {
            title: 'Trois usages où LogCraft excelle.',
            subtitle: 'Choisissez celui qui ressemble au vôtre.',
            items: [
                {
                    title: 'Stresser votre pipeline de logs',
                    description:
                        'Rejouer le même incident multi-services à chaque run CI. Vérifier que vos règles de parsing, d\'alerte et de rétention survivent aux rafales, cascades et records mal formés.',
                },
                {
                    title: 'Démontrer votre produit d\'observabilité',
                    description:
                        'Monter une "production" sans production. Faire la démo SE avec de vraies cascades, de vrais pics p99, de vraies timelines d\'incident — en dix secondes.',
                },
                {
                    title: 'Former votre astreinte',
                    description:
                        'Donnez l\'URL du Lab à un junior, cliquez Cascade, laissez-le debug un incident réaliste à cause racine connue — sans risque pour quoi que ce soit.',
                },
            ],
        },
        pricingTeaser: {
            title: 'Gratuit pour le solo. Payant là où ça devient sérieux.',
            subtitle:
                'Les scénarios starter restent gratuits. Pro et Entreprise débloquent le chaos, les cascades et tout le catalogue de sorties.',
            seePlans: 'Voir les tarifs détaillés',
            free: { name: 'Gratuit', price: '0 €', tagline: 'Solo & évaluation' },
            pro: { name: 'Pro', price: 'TBD', tagline: 'Le moteur complet' },
            enterprise: { name: 'Entreprise', price: 'Sur mesure', tagline: 'Topologie & on-prem' },
        },
        portfolio: {
            title: 'L\'autre moitié du tableau.',
            subtitle:
                'LogCraft est une moitié d\'un plan à deux moteurs. InSight est l\'autre — et le Lab, c\'est là où ils se rejoignent.',
            insight: {
                name: 'InSight',
                description:
                    'Un pipeline streaming en 5 phases (tokenisation → séquencement → metalog → détection de dérive → insight LLM optionnel) qui auto-détecte les formats, mine les templates avec Drain, construit des modèles comportementaux et capte les anomalies via un ensemble ADWIN / Page-Hinkley / EWMA / CUSUM. POC en cours ; LogCraft sert de terrain d\'entraînement.',
                status: 'R&D · POC',
                highlights: [
                    'Pipeline streaming 5 phases',
                    'Mining de templates type Drain',
                    'Ensemble de détecteurs de dérive',
                    'Indices LLM en option',
                ],
            },
            logcraft: {
                name: 'LogCraft',
                description:
                    'Un générateur de logs synthétiques et un moteur de scénarios chaos. Décrivez une flotte de services en YAML, lancez, et obtenez des flux de logs aux formes de production — cascades de pannes, queues de latence, incidents planifiés, 20+ formats de sortie. Pour stresser votre pipeline, démontrer vos dashboards, entraîner votre astreinte.',
                status: 'Bêta · utilisable',
                highlights: [
                    'Agents & topologie en YAML',
                    'Seed déterministe → replays bit-stables',
                    'Cascades & incidents chaos',
                    '20+ formats (ECS, OTLP, Prometheus…)',
                ],
            },
            playground: {
                name: 'LogCraft Lab',
                description:
                    'Le playground navigateur autour de LogCraft. Choisissez un scénario, lancez un moteur en direct, observez les métriques et le flux de logs en temps réel — sans installation. La passerelle vers InSight arrive dès qu\'InSight sort de POC.',
                status: 'Disponible',
                highlights: [
                    'Zéro installation',
                    'Métriques agents & sinks en direct',
                    'Flux de logs filtrable',
                ],
            },
        },
        roadmap: {
            title: 'Sur la roadmap',
            subtitle:
                'Ce que nous construisons ensuite, et la direction que prend le produit.',
            badge: 'Bientôt',
            items: [
                {
                    title: 'InSight v0.1',
                    description:
                        'Première tranche end-to-end de détection d\'anomalies sur les flux LogCraft : auto-détection de format, mining de templates, baseline + score de dérive par template.',
                },
                {
                    title: 'Pont Lab → InSight',
                    description:
                        'Brancher un scénario LogCraft directement dans le pipeline InSight et visualiser la dérive dans la même session navigateur. Pas de collecteur, pas de config d\'ingestion.',
                },
                {
                    title: 'Sorties REST + Kafka',
                    description:
                        'Piloter les moteurs LogCraft depuis la CI et streamer les logs vers Kafka et webhooks pour les tests de pipeline aval.',
                },
            ],
        },
        maker: {
            title: 'Construit par un seul ingé, en open source.',
            body:
                'Je m\'appelle Manu. J\'ai passé assez de temps à bricoler des générateurs de logs en shell pour avoir envie d\'un vrai. LogCraft, c\'est ce que j\'aurais voulu avoir — un moteur déterministe, scriptable en YAML, à brancher devant n\'importe quel pipeline. Gratuit dans le Lab, source sur GitHub, retours sérieusement écoutés.',
            ctaCode: 'Source sur GitHub',
            ctaContact: 'Me contacter',
            ctaSupport: 'Soutenir le projet',
            supportNote: 'Un petit merci aide à garder les commits du soir.',
        },
        donation: {
            title: 'Soutenir le projet',
            subtitle:
                'LogCraft est construit en solo, en open, le soir et le week-end. Si ça vous a sauvé un après-midi de debug, un petit merci aide.',
            cta: 'Envoyer un merci',
        },
        licensing: {
            title: 'Plans LogCraft',
            subtitle:
                'Gratuit pour le solo et l\'apprentissage. Les paliers payants débloquent les scénarios chaos / cascade / production.',
            badge: 'Tarifs — accès anticipé',
            free: {
                name: 'Gratuit',
                price: '0 €',
                period: 'pour toujours',
                description:
                    'Lancez les scénarios starter et les agents basiques. Idéal pour évaluer LogCraft et essayer le Lab.',
                features: [
                    'Scénarios à 1–2 agents',
                    'Sortie console & fichier',
                    'Générateurs de champs basiques',
                    'Accès CLI',
                    'Support communautaire',
                ],
                cta: 'Ouvrir le Lab',
            },
            pro: {
                name: 'Pro',
                price: 'TBD',
                period: '/mois',
                description:
                    'Le réaliste : incidents chaos, cascades, tous les formats de sortie, replay déterministe.',
                features: [
                    'Agents & scénarios illimités',
                    'Tous les sinks (HTTP, ECS, OTLP, Prometheus, StatsD)',
                    'Cascade d\'erreurs & incidents chaos',
                    'Distributions de latence (p50/p95/p99)',
                    'Mode replay déterministe',
                    'Templates d\'agents & registre',
                    'Support email prioritaire',
                ],
                cta: 'Bientôt',
            },
            enterprise: {
                name: 'Entreprise',
                price: 'Sur mesure',
                period: '',
                description:
                    'Pour les équipes qui font de LogCraft la colonne synthétique de leur stack d\'observabilité.',
                features: [
                    'Tout ce qui est dans Pro',
                    'Simulation de topologie réseau',
                    'Machines d\'état & effets conditionnels',
                    'Sinks de sortie sur mesure',
                    'Support dédié & SLA',
                    'Déploiement on-prem / air-gap',
                    'Onboarding & formation',
                ],
                cta: 'Nous contacter',
            },
        },
        footer: {
            tagline: 'Atelier indé. C++ là où ça compte, web là où il le faut.',
            rights: 'Tous droits réservés.',
            sections: {
                product: 'Produit',
                resources: 'Ressources',
                more: 'Plus',
                legal: 'Mentions légales',
            },
            links: {
                logcraft: 'LogCraft',
                lab: 'Ouvrir le Lab',
                useCases: 'Cas d’usage',
                pricing: 'Tarifs',
                tierMatrix: 'Matrice des paliers',
                roadmap: 'Roadmap',
                github: 'GitHub',
                contact: 'Contact',
                support: 'Soutenir',
                terms: 'Conditions d’utilisation',
                privacy: 'Politique de confidentialité',
                trademark: 'Politique des marques',
                cookiePrefs: 'Vos préférences cookies',
            },
        },
        cookiePrefs: {
            title: 'Vos Préférences Cookies',
            subtitle:
                'CodeRoast n’utilise qu’un seul cookie fonctionnel — aucun traceur, aucune analytics, aucune pub. Effacez vos cookies ou utilisez le mode incognito pour une session vierge.',
            category: 'Fonctionnel · Requis',
            categoryDesc:
                'Strictement nécessaire au bon fonctionnement du produit. Ce cookie ne peut pas être désactivé.',
            alwaysOn: 'Toujours actif',
            onboardingName: 'État de l’onboarding Lab',
            onboardingDesc:
                'Mémorise que vous avez complété l’assistant d’onboarding du Lab. Sans lui, le tutoriel réapparaît à chaque visite.',
            cookieKey: 'logcraft_onboarding_dismissed',
            cookieDuration: '1 an',
            resetBtn: 'Réinitialiser',
            resetDone:
                'Fait — le tutoriel d’onboarding réapparaîtra lors de votre prochaine visite au Lab.',
            close: 'Fermer',
        },
        useCases: {
            badge: 'Pour LogCraft',
            title: 'Trois façons d’utiliser LogCraft',
            subtitle:
                'LogCraft tient en un binaire et un fichier YAML. L’histoire change selon le public. Voici les trois qu’on entend le plus.',
            tryIt: 'Ouvrir ce scénario dans le Lab',
            narratives: {
                test: {
                    tag: 'Ingénierie',
                    title: 'Stresser son pipeline de logs avant la prod',
                    outcome:
                        'Envoyez 50 k records/s d’ECS dans votre collecteur. Observez vos buffers, vos budgets d’erreurs, votre échantillonnage — sous un trafic qui ressemble au réel, pas sous des boucles cURL.',
                    yamlSnippet:
                        '# 5 services, ECS sur HTTP, 50k r/s, déterministe\nseed: 42\nagents:\n  - name: api-gw\n    type: web_server\n    rate: 18000\n  - name: orders\n    type: web_server\n    rate: 14000\nsinks:\n  - type: http\n    format: ecs\n    endpoint: http://collector:8080',
                    bullets: [
                        'Seed déterministe, deux runs reproduisent le même incident',
                        'Sinks ECS / OTLP / Syslog / fichier dans le même scénario',
                        'S’intègre en CI comme étape GitHub Action',
                    ],
                },
                demo: {
                    tag: 'Commerciaux / SE',
                    title: 'Montrer une cascade crédible en cinq minutes',
                    outcome:
                        'Ouvrez le Lab en partage d’écran, lancez “Cascade”, et regardez les dashboards potentiels du prospect virer au rouge. Pas de coordination staging, pas de fuite de données réelles.',
                    yamlSnippet:
                        '# DB sature → misses cache → 5xx web\nseed: 1337\nauto_cascade:\n  enabled: true\n  radius: 2\nincidents:\n  - at: "00:00:30"\n    target: orders-db\n    impact: { error_rate: 0.4, latency_x: 8 }',
                    bullets: [
                        'L’auto-cascade rejoue une vraie chaîne de panne',
                        'Scénarios prêts pour finance, e-commerce, SaaS',
                        '100 % synthétique — rien ne sort de l’onglet',
                    ],
                },
                train: {
                    tag: 'Formation on-call',
                    title: 'Former un on-call sans éveiller personne',
                    outcome:
                        'Donnez l’URL du Lab à un junior, un scénario avec cause racine connue, et laissez-le le traiter comme un vrai ticket. Rejouez le même seed dans toute l’équipe pour un benchmark juste.',
                    yamlSnippet:
                        '# Cause cachée : timeout payment-gw à 02:15\nseed: 7\nincidents:\n  - at: "02:15:00"\n    target: payment-gw\n    impact: { error_rate: 0.6 }\n    silent: true',
                    bullets: [
                        'Même seed = incident identique pour tous les apprenants',
                        'Pause / reprise via snapshot pour les sessions guidées',
                        'Couplable avec InSight pour noter le diagnostic',
                    ],
                },
            },
        },
        logcraft: {
            betaBadge: 'Bêta · gratuit dans le Lab',
            heroTagline: 'Des logs synthétiques réalistes, à la demande.',
            heroSubtitle:
                'LogCraft est un simulateur de logs et de chaos déterministe. Décrivez une flotte de services en YAML, lancez, et obtenez des flux aux formes de production — cascades, queues de latence, incidents planifiés, sortie ECS / OTLP / Prometheus. Idéal pour stresser votre pipeline, démontrer vos dashboards, former votre astreinte, ou nourrir un moteur d\'analyse comme InSight.',
            launchLab: 'Ouvrir le Lab',
            viewGitHub: 'Voir sur GitHub',
            featuresTitle: 'Ce que LogCraft fait vraiment',
            featuresSubtitle:
                'Pas un backend d\'observabilité. Pas un SaaS de stockage. Un générateur qui produit les logs que votre pipeline ne voit jamais en staging.',
            ctaTitle: 'Choisissez un scénario, lancez.',
            ctaSubtitle:
                'Ouvrez le Lab, cliquez "Run Demo", observez une fausse boutique e-commerce dérailler à la demande.',
            deepDiveTitle: 'Où LogCraft se branche',
            deepDiveSubtitle:
                'LogCraft se place avant votre stack d\'observabilité — il génère les flux pour stresser tout l\'aval.',
            fitDiagram: {
                yaml: 'Scénario YAML',
                engine: 'Moteur LogCraft',
                sinks: 'Sinks',
                downstream: 'Votre stack',
                downstreamDesc:
                    'Elastic · Datadog · Loki · Splunk · OTel · InSight',
                yamlDesc: 'Agents, topologie, incidents, formats de sortie',
                engineDesc: 'Pipeline déterministe, shardé, microseconde',
                sinksDesc:
                    'JSON · ECS · OTLP · CLF · Syslog · Prometheus · StatsD · HTTP · fichier',
            },
            useCases: {
                title: 'À quoi ça sert',
                subtitle:
                    'Trois usages concrets pour lesquels LogCraft excelle — choisissez le vôtre.',
                items: [
                    {
                        title: 'Stresser votre pipeline de logs',
                        description:
                            'Rejouer le même incident multi-services à chaque run CI. Vérifier que vos règles de parsing, d\'alerte et de rétention survivent aux rafales, cascades et records mal formés.',
                    },
                    {
                        title: 'Démontrer votre produit d\'observabilité',
                        description:
                            'Monter une "production" sans production. Faire la démo SE avec de vraies cascades, de vrais pics p99, de vraies timelines d\'incident — en 10 secondes.',
                    },
                    {
                        title: 'Former votre astreinte',
                        description:
                            'Donnez l\'URL du Lab à un junior, cliquez "Cascade", laissez-le debug un incident réaliste à cause racine connue — sans risque pour la prod.',
                    },
                ],
            },
            conceptsTitle: 'Cinq concepts et vous êtes opérationnel',
            conceptsSubtitle:
                'Le reste de la référence YAML, c\'est pour le jour où ça ne suffit plus.',
            conceptsShowAdvanced: 'Afficher les concepts avancés',
            conceptsHideAdvanced: 'Masquer les concepts avancés',
            concepts: {
                agents: {
                    title: 'Agents',
                    body:
                        'Un agent est un faux service. Vous lui donnez un nom, un type ("web_server", "database"…), une cadence, un template de message et des champs. Le moteur le lance sur son propre thread et émet des records structurés au rythme demandé. Reliez-en plusieurs avec `interactions` pour modéliser une topologie.',
                },
                outputs: {
                    title: 'Sinks (sorties)',
                    body:
                        'Où vont les logs. Un scénario peut déclarer autant de sinks qu\'il veut, et chaque agent peut router vers n\'importe quel sous-ensemble. Console, fichier, HTTP, ECS, OTLP, Syslog, CLF, Prometheus, StatsD — simultanément. Pratique pour A/B comparer deux pipelines sur le même flux.',
                },
                incidents: {
                    title: 'Incidents & cascades',
                    body:
                        'Perturbations planifiées : "à la minute 5, la base passe à 20 % d\'erreurs avec 8× de latence". Combinez avec `auto_cascade` pour propager la panne aux dépendants avec un rayon d\'impact et un facteur d\'atténuation configurables — comme une vraie panne.',
                },
                determinism: {
                    title: 'Déterminisme (le seed)',
                    body:
                        'Mettez `seed: 42` et le run devient bit-stable. Mêmes logs, mêmes incidents, même ordre, sur n\'importe quelle machine. Partagez le YAML avec un collègue, vous voyez la même panne. C\'est ce qui rend LogCraft utilisable en CI et comme jeu d\'entraînement pour InSight.',
                },
                rateModulation: {
                    title: 'Forme du trafic (phases & modulation)',
                    body:
                        'Le trafic réel n\'est pas plat. Utilisez `phases` pour scripter rampes et pics, ou `rate_modulation` pour des cycles jour/nuit sinusoïdaux ou des patterns d\'heures de bureau. Construisez un scénario 24h en 24 minutes.',
                },
                phases: {
                    title: 'Phases (rampes scriptées)',
                    body:
                        'Chaque agent peut déclarer un bloc `phases` : une liste de checkpoints `(at, multiplier)` qui modulent le taux de base dans le temps. Pratique pour scripter une montée en charge, un pic du midi ou une fenêtre de crash à 3h sans réécrire le taux. L\'interpolation entre checkpoints est linéaire.',
                },
                fields: {
                    title: 'Champs (la charge utile)',
                    body:
                        'Chaque enregistrement embarque une map `fields` que vous contrôlez. Vous déclarez des champs statiques, templatés (`{{user_id}}`) ou des enums pondérés (`status: 200=80%, 500=10%, 503=10%`). Le même schéma traverse tous les sinks, donc votre index ECS, votre exporter OTLP et votre tail fichier voient des enregistrements cohérents.',
                },
                cascades: {
                    title: 'Auto-cascades (rayon d\'impact)',
                    body:
                        'Avec `auto_cascade.enabled: true`, un incident sur l\'agent A dégrade automatiquement ses dépendants déclarés selon `radius`, `propagation_delay` et `dampening_factor`. C\'est ce qui transforme une seule injection d\'erreur en réaction en chaîne réaliste que vos dashboards doivent détecter.',
                },
                replay: {
                    title: 'Déterminisme & replay',
                    body:
                        'Au-delà du `seed`, le moteur enregistre l\'ordinal de chaque enregistrement émis pour que deux runs du même YAML produisent des flux identiques au bit près. Combiné à l\'API `engine.snapshot`, vous pouvez mettre en pause un run, partager l\'état et le reprendre ailleurs — pratique pour partager des repros et snapshots CI.',
                },
                registry: {
                    title: 'Registre des types d\'agent',
                    body:
                        'Les types d\'agent intégrés (web_server, database, cache, queue…) ont des défauts sensés pour les champs, le vocabulaire d\'erreur et la forme de latence. Vous pouvez enregistrer le vôtre via la référence YAML si la sémantique attendue est exotique — la plupart des utilisateurs ne touchent jamais cette couche.',
                },
            },
        },
        lab: {
            title: 'Lab',
            simulatedBadge: 'SIMULÉ · 100% données synthétiques',
            backToLogCraft: 'Retour à LogCraft',
            live: 'En direct',
            selectScenario: 'Choisissez un scénario',
            selectScenarioDesc:
                'Chaque scénario est un fichier YAML décrivant une fausse topologie de services. Choisissez, éditez si besoin, puis "Run".',
            launchEngine: 'Lancer le Moteur',
            runDemo: 'Lancer la démo',
            launchAndStart: 'Lancer le scénario',
            launchPaused: 'Créer en pause',
            autoStartHint: 'démarre le moteur automatiquement',
            start: 'Démarrer',
            stop: 'Arrêter',
            destroy: 'Arrêter & réinit.',
            throughput: 'Débit',
            errorRate: 'Taux d\'erreur',
            elapsed: 'Écoulé',
            agents: 'Agents',
            noAgents: 'Aucun agent — démarrez le moteur pour voir des données.',
            sinks: 'Sorties',
            sinksDesc:
                'Métriques de livraison de chaque sortie — débit d\'écriture, arriéré, erreurs. Pas le contenu de la destination.',
            drain: {
                title: 'Sink Démo LogCraft',
                caption:
                    'Ces sorties HTTP visent *.logcraft.demo — un domaine que nous possédons et qui ne résout vers rien. Le serveur intercepte les requêtes et affiche ici les payloads bruts, pour que vous voyiez exactement ce qui partirait vers un vrai collecteur.',
                empty: 'Aucune requête capturée pour le moment. Démarrez le moteur — toute sortie HTTP pointant vers *.logcraft.demo apparaîtra ici.',
                targets: 'Capturé pour',
                noTargets: 'Aucune sortie HTTP de démo détectée dans ce scénario.',
                droppedSuffix: ' enregistrement(s) plus ancien(s) ont été abandonnés pour borner le buffer.',
                showBody: 'Afficher le corps',
                hideBody: 'Masquer le corps',
                copy: 'Copier',
                copied: 'Copié',
                receivedAt: 'reçu',
                bytes: 'octets',
                sentTo: 'serait envoyé à',
            },
            scenario: 'Scénario chargé',
            scenarioDesc: 'Le YAML qui tourne. À comparer aux métriques live au-dessus.',
            logTail: 'Flux de Logs',
            logTailDesc: 'Échantillon partiel — chaque snapshot embarque ~20 lignes par tick. Les agents produisent bien plus ; seule une fraction atteint ce flux. Le compteur total reflète tout ce que le moteur a généré.',
            entries: 'entrées',
            noLogs: 'Aucune entrée pour le moment.',
            noLogsMatch: 'Aucune entrée ne correspond au filtre.',
            incidents: 'Incidents',
            events: 'événements',
            noIncidents: 'Aucun incident pour le moment.',
            created: 'Moteur prêt.',
            error: 'Erreur',
            noScenarioSelected: 'Choisissez ou collez un scénario YAML pour lancer.',
            yamlPlaceholder:
                'Choisissez un scénario à gauche, ou collez votre propre YAML ici…',
            loadingScenarios: 'Chargement des scénarios…',
            scenarioLoadError: 'Impossible de charger les scénarios',
            scenarioYaml: 'Scénario YAML',
            cascade: 'Cascade',
            cascadeTip:
                'Force un round d\'évaluation cascade. Les agents en panne propagent la dégradation à leurs appelants selon le rayon / l\'atténuation du scénario. Idéal pour montrer "une DB qui entraîne le reste".',
            rate: 'Cadence',
            rateTip:
                'Records par seconde émis par cet agent. Augmentez pour stresser les alertes ; descendez à 0 pour faire taire l\'agent sans arrêter le moteur.',
            errorsTip:
                'Part de records marqués comme erreurs (0–100%). Force une panne sans toucher au YAML.',
            burst: 'Rafale',
            burstTip: 'Émet immédiatement N records en plus. Pour saturer les buffers de l\'agrégateur.',
            apply: 'Appliquer',
            send: 'Envoyer',
            reset: 'Réinit.',
            liveControls: 'Contrôles en Direct',
            liveControlsDesc:
                'Ajustez chaque agent sans toucher au YAML. Les changements sont appliqués immédiatement et disparaissent à l\'arrêt.',
            lock: 'Verrouiller',
            unlock: 'Déverrouiller',
            lockedTip:
                'L\'agent suit le scénario. Cliquez sur le cadenas pour en prendre la main et ajuster cadence / erreurs.',
            unlockedTip:
                'Vous contrôlez cet agent — il ne suit plus les phases du scénario. Cliquez de nouveau pour reverrouiller (les sliders reviennent au scénario).',
            lockedTierRequired:
                'Nécessite le tier {tier}. Changez d\'utilisateur (en haut à droite) pour un tier supérieur.',
            seededAgentOwned:
                'Déterminisme rompu : cet agent ne reflète plus le scénario seedé.',
            seedDeterminismWarning:
                'Ce scénario est seedé pour une reproduction déterministe. {action} cassera ce déterminisme — les ré-exécutions ne produiront plus des logs identiques.',
            seedActionUnlock: 'Prendre la main sur un agent',
            seedActionBurst: 'Déclencher une rafale',
            seedActionCascade: 'Forcer une évaluation cascade',
            seedConfirmTitle: 'Scénario seedé — attention',
            seedConfirmProceed: 'Procéder quand même',
            seedConfirmCancel: 'Annuler',
            filters: 'Filtres',
            filterAllLevels: 'Tous niveaux',
            filterAllAgents: 'Tous agents',
            filterSearch: 'Rechercher dans les messages…',
            filterClear: 'Effacer les filtres',
            firstVisitTitle: 'Bienvenue dans le LogCraft Lab',
            firstVisitBody:
                'C\'est un bac à sable de logs synthétiques. Choisissez un scénario à gauche (on a pré-chargé "Hello World"), cliquez "Lancer le scénario", et regardez une flotte de faux services émettre des logs aux formes de production. Rien n\'est ingéré pour de vrai — les données vivent uniquement dans cet onglet.',
            firstVisitDismiss: 'OK, c\'est parti',
            firstVisitLearn: 'Lire la présentation de LogCraft d\'abord',
            emptyEngineHint:
                'Moteur créé — cliquez "Démarrer" pour commencer à émettre des logs.',
            engineLabel: 'Moteur',
            scenarioName: 'Scénario',
            recommendedBadge: 'Démarrage recommandé',
            onboarding: {
                skip: 'Passer',
                back: 'Retour',
                next: 'Suivant',
                pickScenario: 'Choisir mon scénario',
                launch: 'Lancer le moteur',
                noScenarioFound:
                    'Impossible de trouver un scénario correspondant. Choisissez-en un dans le catalogue.',
                tierLocked:
                    'Le meilleur scénario pour ces réponses est réservé à un palier supérieur. Choisissez une autre complexité ou passez au palier supérieur.',
                step1Title: 'Que voulez-vous faire ?',
                step1Subtitle:
                    'Choisissez l’option la plus proche. On l’utilise pour suggérer un scénario — vous pourrez en changer ensuite.',
                step2Title: 'Avec quelle charge ?',
                step2Subtitle:
                    'Détermine le nombre de services factices et d’incidents lancés par le moteur.',
                step3Title: 'Prêt à lancer',
                step3Subtitle:
                    'Votre scénario est chargé. Cliquez pour lancer le moteur et voir les logs défiler.',
                intents: {
                    explore: {
                        title: 'Juste explorer',
                        desc: 'Montre-moi le moteur avec une petite démo.',
                    },
                    test: {
                        title: 'Tester mon pipeline de logs',
                        desc: 'Envoyer des logs structurés dans mon collecteur et voir s’il tient.',
                    },
                    demo: {
                        title: 'Démontrer à un client',
                        desc: 'J’ai besoin d’une cascade crédible à montrer en réunion dans 5 minutes.',
                    },
                    train: {
                        title: 'Former un on-call',
                        desc: 'Faire déboguer un junior sur un incident scriptué avec une cause connue.',
                    },
                },
                complexity: {
                    simple: {
                        title: 'Simple',
                        desc: '1–2 services. Trafic stable. Aucun incident.',
                    },
                    realistic: {
                        title: 'Réaliste',
                        desc: '5–10 services avec interactions. Quelques accrocs.',
                    },
                    chaos: {
                        title: 'Chaos',
                        desc: 'Plusieurs services + incidents scriptués + cascade activée. Du matériel de démo.',
                    },
                },
            },
        },
        auth: {
            loadingUsers: 'Chargement des utilisateurs…',
            anonymous: 'Anonyme (sans jeton)',
            signedInAs: 'Connecté en tant que',
            requiresTier: 'Cette fonctionnalité requiert le palier {tier}.',
            youAre: 'Vous êtes connecté en tant que {role}.',
            tierMatrix: 'Matrice des paliers',
            tierLockTitle: 'Palier supérieur requis',
            tierLockBody:
                'La capacité « {permission} » est incluse dans le palier {tier}. Vous êtes actuellement sur {current}.',
            tierLockSeePlans: 'Voir les plans',
            tierLockSwitch: 'Changer d\'utilisateur',
            tierLockClose: 'Fermer',
            tierLockedBadge: 'Verrouillé',
            tierDisabledTitle: 'Non disponible dans ce déploiement',
            tierDisabledBody:
                'La capacité « {permission} » n\'est pas activée dans le déploiement actuel. Contactez votre administrateur.',
            scenarioNotAvailable: 'Ce scénario requiert des capacités non disponibles dans ce déploiement :',
        },
        tiers: {
            title: 'Matrice des paliers & fonctionnalités',
            description:
                'Cette page reflète la configuration live du contrôle d\'accès du backend. Chaque clé de permission est regroupée par catégorie ; ✓ indique que le palier de la colonne donne accès à la fonctionnalité, ✗ indique l\'inverse.',
            loading: 'Chargement de la matrice…',
            feature: 'Fonctionnalité',
            disabled: 'désactivé',
        },
    },
}

export type TranslationKey = typeof translations.en
export default translations
