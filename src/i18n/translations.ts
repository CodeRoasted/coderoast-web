const translations = {
    en: {
        nav: {
            home: 'Home',
            portfolio: 'Portfolio',
            donate: 'Support Us',
            licensing: 'Pricing',
        },
        hero: {
            tagline: 'Where Logs Turn Into Decisions',
            subtitle:
                'Simulate, analyze, and detect — in real time. Our C++20 engines process millions of log events with microsecond latency, turning raw streams into actionable intelligence before incidents escalate.',
            cta: 'Explore Our Work',
            ctaSecondary: 'Support the Project',
        },
        portfolio: {
            title: 'What We\'re Building',
            subtitle: 'A complete log intelligence ecosystem — from realistic simulation to anomaly detection — engineered in C++20 for maximum performance.',
            insight: {
                name: 'InSight',
                description:
                    'Your logs hold the answers — InSight finds them. A 5-phase streaming pipeline that auto-detects 19 log formats (JSON, Syslog, CloudWatch, Logcat, and more), mines semantic templates with the Drain algorithm, builds behavioral models, and catches anomalies using an ensemble of drift detectors (ADWIN, Page-Hinkley, EWMA, CUSUM). Zero-copy architecture means millions of events processed with microsecond-level latency.',
                status: 'In Development',
                highlights: [
                    '19 log formats auto-detected',
                    'Ensemble anomaly detection',
                    'Zero-copy, microsecond latency',
                    'Optional AI-powered root cause analysis',
                ],
            },
            logcraft: {
                name: 'LogCraft',
                description:
                    'Simulate any distributed system — no code required. Define agents, failure scenarios, and network topology in pure YAML. LogCraft generates deterministic, production-realistic log streams with error cascading, latency distributions (p50/p95/p99), chaos incidents, and health state machines. Output to console, file, Elasticsearch (ECS), OpenTelemetry, Prometheus, or StatsD — all at once.',
                status: 'In Development',
                highlights: [
                    'Pure YAML — zero code changes',
                    'Deterministic & reproducible',
                    'Error cascading & chaos incidents',
                    'Multi-format output (ECS, OTEL, Prometheus)',
                ],
            },
            playground: {
                name: 'InSight Playground',
                description:
                    'The live fusion of LogCraft and InSight — right in your browser. Craft a scenario, generate realistic multi-agent log streams, and watch anomaly detection happen in real time. No install, no setup, instant results.',
                status: 'Coming Soon',
                highlights: [
                    'Browser-based, zero install',
                    'Live scenario editing',
                    'Real-time anomaly visualization',
                ],
            },
        },
        comingSoon: {
            title: 'Coming Soon',
            subtitle:
                'We\'re building the full log intelligence platform. Here\'s what\'s landing next.',
            badge: 'Coming Soon',
            items: [
                {
                    title: 'REST API',
                    description: 'Control LogCraft engines remotely — create, start, stop, and query simulations via a clean REST interface. Perfect for CI/CD pipelines and automated testing.',
                },
                {
                    title: 'Live Demo',
                    description: 'Try LogCraft and InSight directly from our website. No download, no signup — just pick a scenario and see the magic happen in real time.',
                },
                {
                    title: 'Advanced Integrations',
                    description: 'Kafka output, HTTP streaming pipelines, and webhook notifications. Plug LogCraft into your existing observability stack with zero friction.',
                },
            ],
        },
        donation: {
            title: 'Fuel the Build',
            subtitle:
                'This project is built with passion, C++20, and a lot of late-night coffee. If you find value in what we\'re crafting, consider fueling the next session.',
            cta: 'Buy Me a Coffee',
        },
        licensing: {
            title: 'LogCraft Pricing',
            subtitle:
                'From personal exploration to enterprise-scale simulation. Pick the plan that fits your needs.',
            badge: 'Pricing details coming soon',
            free: {
                name: 'Free',
                price: '$0',
                period: 'forever',
                description: 'Get started with LogCraft at no cost. Perfect for learning, prototyping, and personal projects.',
                features: [
                    'Single-agent scenarios',
                    'Console & file output',
                    'Basic field generators',
                    'Community support',
                    'CLI access',
                ],
                cta: 'Get Started',
            },
            pro: {
                name: 'Pro',
                price: 'TBD',
                period: '/month',
                description: 'Unlock the full power of LogCraft for your team. Multi-agent simulation, all output sinks, and advanced scenario features.',
                features: [
                    'Unlimited agents & scenarios',
                    'All output sinks (HTTP, ECS, OTEL, Prometheus)',
                    'Error cascading & chaos incidents',
                    'Latency distributions (p50/p95/p99)',
                    'Deterministic replay mode',
                    'Agent templates & registry',
                    'Priority email support',
                ],
                cta: 'Coming Soon',
            },
            enterprise: {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                description: 'For organizations that need custom deployments, dedicated support, and advanced simulation at scale.',
                features: [
                    'Everything in Pro',
                    'Network topology simulation',
                    'State machines & conditional effects',
                    'Custom output sink development',
                    'Dedicated support & SLA',
                    'On-premise deployment',
                    'Training & onboarding',
                ],
                cta: 'Contact Us',
            },
        },
        footer: {
            tagline: 'Crafted with passion by the CodeRoast team.',
            rights: 'All rights reserved.',
        },
    },
    fr: {
        nav: {
            home: 'Accueil',
            portfolio: 'Portfolio',
            donate: 'Nous soutenir',
            licensing: 'Tarifs',
        },
        hero: {
            tagline: 'Là où les Logs Deviennent des Décisions',
            subtitle:
                'Simulez, analysez et détectez — en temps réel. Nos moteurs C++20 traitent des millions d\'événements log avec une latence en microsecondes, transformant vos flux bruts en intelligence actionnable avant que les incidents ne s\'aggravent.',
            cta: 'Découvrir nos créations',
            ctaSecondary: 'Soutenir le projet',
        },
        portfolio: {
            title: 'Ce Qu\'on Construit',
            subtitle: 'Un écosystème complet d\'intelligence log — de la simulation réaliste à la détection d\'anomalies — conçu en C++20 pour des performances maximales.',
            insight: {
                name: 'InSight',
                description:
                    'Vos logs ont les réponses — InSight les trouve. Un pipeline streaming en 5 phases qui auto-détecte 19 formats de logs (JSON, Syslog, CloudWatch, Logcat, et plus), extrait des templates sémantiques via l\'algorithme Drain, construit des modèles comportementaux, et détecte les anomalies grâce à un ensemble de détecteurs de dérive (ADWIN, Page-Hinkley, EWMA, CUSUM). Architecture zero-copy pour des millions d\'événements traités avec une latence en microsecondes.',
                status: 'En développement',
                highlights: [
                    '19 formats de logs auto-détectés',
                    'Détection d\'anomalies par ensemble',
                    'Zero-copy, latence en microsecondes',
                    'Analyse de cause racine par IA (optionnel)',
                ],
            },
            logcraft: {
                name: 'LogCraft',
                description:
                    'Simulez n\'importe quel système distribué — sans code. Définissez agents, scénarios de panne et topologie réseau en pur YAML. LogCraft génère des flux de logs déterministes et réalistes avec cascade d\'erreurs, distributions de latence (p50/p95/p99), incidents chaos, et machines d\'état de santé. Sortie vers console, fichier, Elasticsearch (ECS), OpenTelemetry, Prometheus ou StatsD — simultanément.',
                status: 'En développement',
                highlights: [
                    'Pur YAML — zéro code',
                    'Déterministe & reproductible',
                    'Cascade d\'erreurs & incidents chaos',
                    'Multi-format (ECS, OTEL, Prometheus)',
                ],
            },
            playground: {
                name: 'InSight Playground',
                description:
                    'La fusion en direct de LogCraft et InSight — directement dans votre navigateur. Créez un scénario, générez des flux multi-agents réalistes, et observez la détection d\'anomalies en temps réel. Zéro installation, zéro configuration, résultats instantanés.',
                status: 'Bientôt disponible',
                highlights: [
                    'Dans le navigateur, zéro installation',
                    'Édition de scénarios en direct',
                    'Visualisation d\'anomalies en temps réel',
                ],
            },
        },
        comingSoon: {
            title: 'Bientôt Disponible',
            subtitle:
                'Nous construisons la plateforme complète d\'intelligence log. Voici ce qui arrive.',
            badge: 'Bientôt',
            items: [
                {
                    title: 'API REST',
                    description: 'Contrôlez les moteurs LogCraft à distance — créez, démarrez, arrêtez et interrogez vos simulations via une API REST claire. Idéal pour les pipelines CI/CD et les tests automatisés.',
                },
                {
                    title: 'Démo en direct',
                    description: 'Essayez LogCraft et InSight directement depuis notre site. Pas de téléchargement, pas d\'inscription — choisissez un scénario et voyez la magie opérer en temps réel.',
                },
                {
                    title: 'Intégrations avancées',
                    description: 'Sortie Kafka, pipelines HTTP streaming et notifications webhook. Branchez LogCraft à votre stack d\'observabilité existante sans friction.',
                },
            ],
        },
        donation: {
            title: 'Alimenter la Build',
            subtitle:
                'Ce projet est construit avec passion, C++20 et beaucoup de café. Si ce que nous créons vous apporte de la valeur, pensez à alimenter la prochaine session nocturne.',
            cta: 'Offrir un café',
        },
        licensing: {
            title: 'Tarifs LogCraft',
            subtitle:
                'De l\'exploration personnelle à la simulation à l\'échelle entreprise. Choisissez la formule adaptée à vos besoins.',
            badge: 'Tarifs bientôt disponibles',
            free: {
                name: 'Gratuit',
                price: '0 €',
                period: 'pour toujours',
                description: 'Démarrez avec LogCraft gratuitement. Parfait pour apprendre, prototyper et les projets personnels.',
                features: [
                    'Scénarios mono-agent',
                    'Sortie console & fichier',
                    'Générateurs de champs basiques',
                    'Support communautaire',
                    'Accès CLI',
                ],
                cta: 'Commencer',
            },
            pro: {
                name: 'Pro',
                price: 'TBD',
                period: '/mois',
                description: 'Libérez toute la puissance de LogCraft pour votre équipe. Simulation multi-agents, tous les sinks de sortie et fonctionnalités avancées.',
                features: [
                    'Agents & scénarios illimités',
                    'Tous les sinks (HTTP, ECS, OTEL, Prometheus)',
                    'Cascade d\'erreurs & incidents chaos',
                    'Distributions de latence (p50/p95/p99)',
                    'Mode replay déterministe',
                    'Templates d\'agents & registre',
                    'Support email prioritaire',
                ],
                cta: 'Bientôt disponible',
            },
            enterprise: {
                name: 'Entreprise',
                price: 'Sur mesure',
                period: '',
                description: 'Pour les organisations qui ont besoin de déploiements personnalisés, de support dédié et de simulation avancée à grande échelle.',
                features: [
                    'Tout ce qui est dans Pro',
                    'Simulation de topologie réseau',
                    'Machines d\'état & effets conditionnels',
                    'Développement de sinks personnalisés',
                    'Support dédié & SLA',
                    'Déploiement on-premise',
                    'Formation & onboarding',
                ],
                cta: 'Nous contacter',
            },
        },
        footer: {
            tagline: 'Créé avec passion par l\'équipe CodeRoast.',
            rights: 'Tous droits réservés.',
        },
    },
}

export type TranslationKey = typeof translations.en
export default translations
