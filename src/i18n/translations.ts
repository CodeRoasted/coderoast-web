const translations = {
    en: {
        nav: {
            home: 'Home',
            portfolio: 'Portfolio',
            donate: 'Support Us',
            licensing: 'Licensing',
        },
        hero: {
            tagline: 'Crafting Elegant Developer Tools',
            subtitle:
                'We build beautifully simple tools that make complex development workflows feel effortless.',
            cta: 'Explore Our Work',
            ctaSecondary: 'Support the Project',
        },
        portfolio: {
            title: 'Our Creations',
            subtitle: 'Tools designed with passion, built for developers who care about quality.',
            insight: {
                name: 'Insight',
                description:
                    'See the big picture. Insight gives you a bird\'s-eye view of your projects, surfacing the patterns and connections that matter most.',
                status: 'In Development',
            },
            logcraft: {
                name: 'LogCraft',
                description:
                    'Logs, beautifully tamed. LogCraft transforms raw log data into clear, actionable narratives — so you spend less time searching and more time solving.',
                status: 'Active',
            },
            playground: {
                name: 'Insight Playground',
                description:
                    'Experiment freely. Powered by LogCraft, the Playground lets you explore, test, and visualize your data in a safe, sandboxed environment — no setup required.',
                status: 'Coming Soon',
            },
        },
        comingSoon: {
            title: 'More on the Horizon',
            subtitle:
                'We\'re always cooking up new ideas. Stay tuned for upcoming tools, integrations, and features.',
            badge: 'Coming Soon',
        },
        donation: {
            title: 'Fuel the Roast',
            subtitle:
                'CodeRoast is built with love and late-night coffee. If our tools save you time, consider buying us a cup.',
            cta: 'Buy Me a Coffee',
        },
        licensing: {
            title: 'Licensing & Plans',
            subtitle:
                'Flexible options for individuals and teams. Pricing details coming soon.',
            badge: 'Coming Soon',
            free: {
                name: 'Open Source',
                description: 'Core tools, always free. Contribute, fork, enjoy.',
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
            tagline: 'Des outils élégants pour développeurs',
            subtitle:
                'Nous créons des outils simples et élégants qui rendent les workflows complexes agréables et fluides.',
            cta: 'Découvrir nos créations',
            ctaSecondary: 'Soutenir le projet',
        },
        portfolio: {
            title: 'Nos Créations',
            subtitle: 'Des outils conçus avec passion, pour les développeurs exigeants.',
            insight: {
                name: 'Insight',
                description:
                    'Voyez l\'ensemble. Insight vous offre une vue panoramique de vos projets, révélant les connexions et les patterns qui comptent.',
                status: 'En développement',
            },
            logcraft: {
                name: 'LogCraft',
                description:
                    'Des logs, magnifiquement domptés. LogCraft transforme vos données brutes en récits clairs et exploitables — moins de recherche, plus de solutions.',
                status: 'Actif',
            },
            playground: {
                name: 'Insight Playground',
                description:
                    'Expérimentez librement. Propulsé par LogCraft, le Playground vous permet d\'explorer, tester et visualiser vos données dans un environnement sécurisé — aucune installation requise.',
                status: 'Bientôt disponible',
            },
        },
        comingSoon: {
            title: 'D\'autres nouveautés à venir',
            subtitle:
                'Nous avons toujours de nouvelles idées en préparation. Restez à l\'écoute pour les prochains outils et fonctionnalités.',
            badge: 'Bientôt',
        },
        donation: {
            title: 'Alimentez le Roast',
            subtitle:
                'CodeRoast est construit avec amour et beaucoup de café. Si nos outils vous font gagner du temps, offrez-nous une tasse.',
            cta: 'Offrir un café',
        },
        licensing: {
            title: 'Licences & Formules',
            subtitle:
                'Des options flexibles pour individus et équipes. Détails des tarifs à venir.',
            badge: 'Bientôt disponible',
            free: {
                name: 'Open Source',
                description: 'Les outils essentiels, toujours gratuits. Contribuez, forkez, profitez.',
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
