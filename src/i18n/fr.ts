// French translations. Must mirror en.ts structure 1:1 — the type
// annotation enforces this at compile time.
import type en from "./en"

const fr: typeof en = {
    nav: {
        home: 'Accueil',
        product: 'Produit',
        how: 'Comment',
        features: 'Fonctionnalités',
        pricing: 'Tarifs',
        logcraft: 'LogCraft',
        lab: 'Playground InSight',
        logcraftPlayground: 'Playground LogCraft',
        useCases: 'Cas d’usage',
        contact: 'Contact',
    },
    hero: {
        badge: 'Démo explain InSight · flux LogCraft déterministe · backend /api/v1 live',
        tagline: 'Du chaos de logs à l’explication claire.',
        subtitle:
            'InSight transforme des incidents synthétiques live en preuves MetaLog, détections, puis explications prêtes pour l’opérateur. LogCraft fournit le signal reproductible ; InSight montre ce qui s’est passé et pourquoi.',
        cta: 'Ouvrir le Playground InSight',
        ctaSecondary: 'Voir le pipeline',
        trust: 'MetaLog · templates Drain · détection de dérive · paquets explain · replay déterministe',
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
        title: 'Incident en entrée. Explication en sortie.',
        subtitle:
            'Lancez un scénario LogCraft déterministe et regardez InSight condenser le flux en templates, MetaLogs, preuves de détection et explication exploitable.',
        yamlLabel: 'scenario.yaml',
        logsLabel: 'flux de preuve live',
        cta: 'Ouvrir le Playground InSight',
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
                    'Streamez vers votre stack : Datadog, Loki, Splunk, Elastic, OpenTelemetry — ou directement vers InSight pour une détection explicable.',
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
            'InSight est le produit CodeRoast promu. LogCraft est la source de signal déterministe qui rend la démo live reproductible.',
        insight: {
            name: 'InSight',
            description:
                'Un pipeline d’analyse streaming qui transforme des logs bruyants en templates, MetaLogs, preuves de détection et paquets d’explication. Il tourne maintenant derrière le Lab pour produire des résultats visibles, pas seulement une sortie brute.',
            status: 'Promu · API live',
            highlights: [
                'Cartes explain en premier plan',
                'Mining de templates type Drain',
                'Couche de compression MetaLog',
                'Preuves de détection pour l’IA explain',
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
            name: 'Playground InSight',
            description:
                'La démo navigateur où LogCraft nourrit InSight. Choisissez un scénario, lancez le moteur, observez le flux brut, puis inspectez la vue explain avec sévérité, confiance, action, templates et preuves.',
            status: 'Disponible',
            highlights: [
                'Zéro installation',
                'Rapports InSight live',
                'Logs, incidents, templates, preuves',
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
                title: 'Démo explain IA',
                description:
                    'Brancher un agent sur le payload explain pour narrer les preuves MetaLog et recommander l’étape d’investigation suivante.',
            },
            {
                title: 'Fixtures de compatibilité',
                description:
                    'Promouvoir des scénarios de la bibliothèque en gates de release prouvant que LogCraft, IPC, InSight, serveur et web restent alignés.',
            },
            {
                title: 'Vues traces MetaLog',
                description:
                    'Exposer les fenêtres MetaLog et traces de détecteurs après stabilisation de la démo explain-first.',
            },
        ],
    },
    maker: {
        title: 'Construit par un seul ingé.',
        body:
            'Je m\'appelle Manu. J\'ai passé assez de temps à bricoler des générateurs de logs en shell pour avoir envie d\'un vrai. LogCraft, c\'est ce que j\'aurais voulu avoir — un moteur déterministe, scriptable en YAML, à brancher devant n\'importe quel pipeline. Gratuit dans le Lab, la bibliothèque de scénarios est ouverte sur GitHub, retours sérieusement écoutés.',
        ctaCode: 'Bibliothèque de scénarios (GitHub)',
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
            lab: 'Playground InSight',
            useCases: 'Cas d’usage',
            pricing: 'Tarifs',
            tierMatrix: 'Profil d\'accès',
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
        title: 'Playground',
        simulatedBadge: 'INSIGHT LIVE · flux synthétique',
        playgrounds: {
            label: 'Mode de playground',
            logcraft: {
                title: 'Playground LogCraft',
                badge: 'Temps réel',
                short: 'Lab de scénarios pour sorties LogCraft, DSL et benchmarks. Pas d’analyse InSight dans cette vue.',
                selectScenario: 'Choisissez un scénario LogCraft',
                selectScenarioDesc:
                    'Lancez des services synthétiques temps réel, inspectez les logs générés et exercez le DSL avant toute couche d’analyse.',
                launchAndStart: 'Lancer le scénario LogCraft',
                launchPaused: 'Créer le moteur LogCraft',
            },
            insight: {
                title: 'Playground InSight',
                badge: 'Non-régression',
                short: 'Lab InSight déterministe pour replay, preuves détecteur et réglage sans fatigue.',
                selectScenario: 'Choisissez un scénario déterministe',
                selectScenarioDesc:
                    'Choisissez un scénario LogCraft seedé, lancez le pipeline et utilisez des preuves reproductibles pour régler InSight.',
                launchAndStart: 'Lancer le scénario InSight',
                launchPaused: 'Créer le pipeline en pause',
            },
        },
        backToLogCraft: 'Retour au produit',
        backToScenarios: 'Retour aux scénarios',
        live: 'En direct',
        selectScenario: 'Choisissez un scénario',
        selectScenarioDesc:
            'Chaque scénario est une topologie synthétique qui nourrit InSight. Choisissez, éditez si besoin, puis lancez le pipeline.',
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
                'Toute sortie avec un champ name: est interceptée par le serveur et capturée ici — qu\'il s\'agisse d\'une sortie fichier, console ou HTTP. Le serveur les redirige vers un drain interne pour que vous voyiez les payloads bruts exactement comme ils seraient arrivés à un vrai collecteur.',
            empty: 'Aucun enregistrement capturé pour le moment. Démarrez le moteur — toute sortie nommée (name: dans le YAML du scénario) apparaîtra ici.',
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
        insight: {
            tab: 'Insights',
            title: 'InSight Explain',
            subtitle: 'Preuves MetaLog transformées en explications opérateur.',
            running: 'Actif',
            idle: 'Inactif',
            syncing: 'Sync',
            errorShort: 'Erreur',
            errorTitle: 'InSight indisponible',
            linesIngested: 'lignes ingérées',
            capabilityLabel: 'Vues de capacités InSight',
            latest: 'Dernière explication',
            previous: 'Explications précédentes',
            actionHint: 'Action proposée',
            sourceRules: 'Règles',
            sourceAugmented: 'IA augmentée',
            sourceFull: 'IA complète',
            sourceUnknown: 'Explain',
            evidence: 'Preuves de support',
            templates: 'Templates affectés',
            confidence: 'confiance',
            noEvidence: 'Aucune preuve attachée à ce rapport.',
            noTemplates: 'Aucun template affecté attaché à ce rapport.',
            noReportsTitle: 'En attente de la première explication',
            noReportsBody:
                'InSight ingère le flux et construit les preuves. Quand un détecteur se déclenche, le paquet explain apparaît ici.',
            detectTitle: 'Résumé par sévérité',
            detectEmptyTitle: 'Aucun signal détecteur pour le moment',
            detectEmptyBody: "Les signaux de détection apparaissent quand InSight ferme une fenêtre MetaLog et trouve un motif statistiquement anormal.",
            detectScore: 'score',
            detectConf: 'conf',
            metalogTitle: 'Preuves MetaLog',
            metalogBody:
                "Les MetaLogs compressent les comportements répétés en paquets de preuve compacts avant la détection et l'explain.",
            metalogWindowTitle: 'Dernière fenêtre MetaLog',
            metalogStabilityTitle: 'Stabilité',
            metalogTopKTitle: 'Top templates',
            metalogWindowDuration: 'Durée de fenêtre',
            metalogEntropy: 'Entropie',
            metalogStabilityScore: 'Score de stabilité',
            metalogJsDivergence: 'Divergence JS',
            metalogUniqueTemplates: 'Templates uniques',
            metalogNoData: 'Aucune donnée MetaLog',
            metalogNoDataBody: "Les fenêtres MetaLog s'accumulent au fil de l'ingestion. La première apparaît après une durée de fenêtre complète.",
            configTitle: 'Configuration du pipeline',
            configWindowDuration: 'Durée de fenêtre',
            configWindowCount: 'Fenêtres traitées',
            configPyramidMaturity: 'Maturité pyramide',
            configExplainMode: 'Mode explain',
            configLlmModel: 'Modèle LLM',
            configLlmEnabled: 'LLM activé',
            configLlmDisabled: 'LLM désactivé',
            configLlmNotSet: 'non configuré',
            configWindowSeconds: 's',
            configNotAvailable: '—',
            pyramidMature: 'Mature',
            pyramidWarmingUp: 'En chauffe',
            pyramidUninitialized: 'Non démarré',
            configWindowsSeen: 'Fenêtres vues',
            acuteDiffTitle: 'Delta fenêtre (vs précédente)',
            acuteDiffNew: 'Nouveaux templates',
            acuteDiffVanished: 'Disparus',
            acuteDiffTemplateDelta: 'Templates Δ',
            streamLastWindow: 'Dernière fenêtre',
            streamJustNow: 'à l\'instant',
            pyramidWarmingUpProgress: 'en chauffe',
            windowLabel: 'Fenêtre',
            insightCatchingUp: 'Rattrapage…',
            detectSignalsTitle: 'Signaux détecteur',
            detectSeveritySource: 'depuis le moteur explain',
            templatesExplainOnly: 'explain uniquement',
            evidenceTitle: 'Paquets de preuves',
            evidenceEmptyTitle: 'Aucun paquet de preuves',
            evidenceEmptyBody: 'Les paquets de preuves apparaissent une fois qu\'une fenêtre a été expliquée. Ils contiennent le contexte de détection fourni à l\'IA.',
            evidenceIncident: 'Incident',
            evidenceTemplates: 'Templates',
            evidenceWindow: 'Contexte fenêtre',
            evidenceFreq: 'fréq',
            evidenceDelta: 'Δ',
            ingestAvgLines: 'lignes moy/fenêtre',
            ingestWindows: 'Fenêtres traitées',
            configReconfigureTitle: 'Reconfigurer',
            configReconfigureApply: 'Appliquer',
            configReconfigureApplying: 'Application…',
            configReconfigureApplied: 'Appliqué',
            configReconfigureError: 'Échec de l\'application',
            configMinConfidence: 'Confiance minimale',
            configMaxInsights: 'Max insights',
            configWarmupScale: 'Échelle de confiance de chauffe',
            configLlmModelLabel: 'Modèle LLM',
            configLlmModelNone: 'Aucun (mode règles)',
            configLlmFull: 'Mode LLM complet',
            configReconfigureHint: 'Les modifications des réglages explain prennent effet immédiatement. La modification de la durée de fenêtre réinitialise le chauffage de la pyramide.',
            templatesTitle: 'Focus templates',
            templatesEmptyTitle: 'Aucun focus template',
            templatesEmptyBody: 'Les templates affectés apparaissent quand une explication nomme les motifs de logs impliqués.',
            ingestTitle: 'Ingestion live',
            ingestRunning: 'Le pipeline serveur consomme le flux shared-memory du moteur.',
            ingestIdle: 'Le moteur est inactif ; InSight attend un flux.',
            metrics: {
                lines: 'Lignes',
                reports: 'Rapports',
                evidence: 'Preuves',
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
                ready: 'Prêt',
                waiting: 'Attente',
            },
        },
        created: 'Moteur prêt.',
        error: 'Erreur',
        noScenarioSelected: 'Choisissez ou collez un scénario YAML pour lancer.',
        yamlPlaceholder:
            'Choisissez un scénario à gauche, ou collez votre propre YAML ici…',
        loadingScenarios: 'Chargement des scénarios…',
        scenarioLoadError: 'Impossible de charger les scénarios',
        scenarioYaml: 'Scénario YAML',
        play: 'Lecture',
        pause: 'Pause',
        advance: 'Avancer',
        replay: 'Rejouer',
        replaying: 'Replay en cours',
        replayToTarget: 'Rejouer jusqu\'à la cible',
        replayingToTarget: 'Replay jusqu\'à la cible…',
        targetSeconds: 'Secondes cible',
        websocketNotConnected: 'Le WebSocket n\'est pas encore connecté.',
        mode: 'Mode',
        clock: 'Horloge',
        playback: 'Lecture',
        speed: 'Vitesse',
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
        lockedOperationRequired:
            'Nécessite la capacité {operation}. Changez d\'utilisateur (en haut à droite) pour accéder à ce contrôle.',
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
        firstVisitTitle: 'Bienvenue dans le Playground InSight',
        firstVisitBody:
            'C\'est une démo InSight live alimentée par des logs synthétiques. Choisissez un scénario à gauche, lancez-le, et regardez InSight transformer le flux en explications. Rien de réel n\'est ingéré — les données restent dans cette session navigateur.',
        firstVisitDismiss: 'OK, c\'est parti',
        firstVisitLearn: 'Lire la présentation de LogCraft d\'abord',
        emptyEngineHint:
            'Moteur créé — cliquez "Démarrer" pour commencer à émettre des logs.',
        simulationElapsed: 'Temps simulé',
        wallElapsed: 'Temps réel',
        duration: 'Durée',
        remaining: 'Restant',
        openEnded: 'Sans fin',
        timeline: 'Timeline',
        clickToSeek: 'cliquer pour naviguer',
        seekTimeline: 'Naviguer dans la timeline',
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
        tierMatrix: 'Profil d\'accès',
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
        title: 'Profil d\'accès',
        description:
            'Vos droits actuels, l\'accès aux opérations et les limites de quota — servis en direct depuis la configuration du contrôle d\'accès du backend.',
        loading: 'Chargement du profil d\'accès…',
        feature: 'Fonctionnalité',
        disabled: 'désactivé',
        yourLimits: 'Vos limites',
        quota: 'Quota',
        usage: 'Utilisation',
        limit: 'Limite',
        unlimited: 'Illimité',
        noAccess: 'Aucun accès',
        noQuotas: 'Aucune information de quota disponible.',
    },
}

export default fr
