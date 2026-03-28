const translations = {
    en: {
        nav: {
            home: 'Home',
            portfolio: 'Portfolio',
            donate: 'Support Us',
            licensing: 'Licensing',
        },
        hero: {
            tagline: 'Where Logs Turn Into Decisions',
            subtitle:
                'Build ultra-fast C++20 systems that transform raw log streams into real-time insights — before issues even surface.',
            cta: 'Explore Our Work',
            ctaSecondary: 'Support the Project',
        },
        portfolio: {
            title: 'What We\'re Building',
            subtitle: 'Two high-performance C++20 systems, engineered from scratch for real-time log intelligence.',
            insight: {
                name: 'Insight',
                description:
                    'A C++20 log analysis engine built for real-time scale. Insight tokenizes raw log streams, extracts semantic templates using the Drain algorithm, builds behavioral transition graphs, and detects anomalies via statistical drift detection (ADWIN, Page-Hinkley) — processing millions of events with minimal latency.',
                status: 'In Development',
            },
            logcraft: {
                name: 'LogCraft',
                description:
                    'A multi-agent, real-time log generation engine written in C++20. Define complex system behaviors in YAML — agents with phases, event rates, error bursts, and latency curves. LogCraft simulates entire distributed systems, emitting structured, realistic log streams at high throughput.',
                status: 'In Development',
            },
            playground: {
                name: 'Insight Playground',
                description:
                    'The live fusion of LogCraft and Insight. Generate realistic multi-agent log streams and watch Insight analyze them in real-time — all in your browser, no install required.',
                status: 'Coming Soon',
            },
        },
        comingSoon: {
            title: 'On the Roadmap',
            subtitle:
                'REST API for live scenario control, Kafka output from LogCraft, HTTP streaming pipeline, and the full Insight Playground — the complete log intelligence suite, launching soon.',
            badge: 'Coming Soon',
        },
        donation: {
            title: 'Fuel the Build',
            subtitle:
                'This project is built with passion, C++20, and a lot of late-night coffee. If you find value in what we\'re crafting, consider fueling the next session.',
            cta: 'Buy Me a Coffee',
        },
        licensing: {
            title: 'Licensing & Plans',
            subtitle:
                'Flexible options for individuals and teams. Pricing details coming soon.',
            badge: 'Coming Soon',
            free: {
                name: 'Personal',
                description: 'Binary access for personal projects and exploration. Community forum support.',
            },
            pro: {
                name: 'Pro',
                description:
                    'Advanced features, priority support, and team collaboration tools.',
            },
            enterprise: {
                name: 'Enterprise',
                description:
                    'Custom deployments, SLAs, and dedicated support for large organizations.',
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
            licensing: 'Licences',
        },
        hero: {
            tagline: 'Là où les Logs Deviennent des Décisions',
            subtitle:
                'Construisez des systèmes C++20 ultra-rapides qui transforment vos flux de logs bruts en insights temps réel — avant que les problèmes ne surgissent.',
            cta: 'Découvrir nos créations',
            ctaSecondary: 'Soutenir le projet',
        },
        portfolio: {
            title: 'Ce Qu\'on Construit',
            subtitle: 'Deux systèmes C++20 hautes performances, conçus de zéro pour l\'intelligence log en temps réel.',
            insight: {
                name: 'Insight',
                description:
                    'Un moteur d\'analyse de logs C++20 pour la performance à grande échelle. Insight tokenise les flux bruts, extrait des templates sémantiques via l\'algorithme Drain, construit des graphes de transitions comportementaux, et détecte les anomalies par dérive statistique (ADWIN, Page-Hinkley).',
                status: 'En développement',
            },
            logcraft: {
                name: 'LogCraft',
                description:
                    'Un moteur de génération de logs multi-agents en temps réel écrit en C++20. Décrivez le comportement de vos systèmes en YAML — agents, phases, taux d\'événements, rafales d\'erreurs et courbes de latence. LogCraft simule des systèmes distribués entiers à haut débit.',
                status: 'En développement',
            },
            playground: {
                name: 'Insight Playground',
                description:
                    'La fusion en direct de LogCraft et Insight. Générez des flux de logs multi-agents et regardez Insight les analyser en temps réel, directement dans votre navigateur. Zéro installation requise.',
                status: 'Bientôt disponible',
            },
        },
        comingSoon: {
            title: 'Sur la Feuille de Route',
            subtitle:
                'API REST pour le contrôle de scénarios en direct, sortie Kafka, pipeline HTTP streaming, et l\'Insight Playground complet — la suite d\'intelligence log, bientôt disponible.',
            badge: 'Bientôt',
        },
        donation: {
            title: 'Alimenter la Build',
            subtitle:
                'Ce projet est construit avec passion, C++20 et beaucoup de café. Si ce que nous créons vous apporte de la valeur, pensez à alimenter la prochaine session nocturne.',
            cta: 'Offrir un café',
        },
        licensing: {
            title: 'Licences & Formules',
            subtitle:
                'Des options flexibles pour individus et équipes. Détails des tarifs à venir.',
            badge: 'Bientôt disponible',
            free: {
                name: 'Personnel',
                description: 'Accès binaire pour vos projets personnels et l\'exploration. Support communautaire.',
            },
            pro: {
                name: 'Pro',
                description:
                    'Fonctionnalités avancées, support prioritaire et outils de collaboration.',
            },
            enterprise: {
                name: 'Entreprise',
                description:
                    'Déploiements personnalisés, SLA et support dédié pour les grandes organisations.',
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
