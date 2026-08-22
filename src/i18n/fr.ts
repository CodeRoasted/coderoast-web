// French translations. Must mirror en.ts structure 1:1 — the type
// annotation enforces this at compile time.
import type en from "./en"

const fr: typeof en = {
    nav: {
        home: 'Accueil',
        products: 'Produits',
        product: 'Produit',
        pricing: 'Tarifs',
        logcraft: 'LogCraft',
        lab: 'Playground InSight',
        diff: 'Diff de logs',
        logcraftPlayground: 'Playground LogCraft',
        useCases: 'Cas d’usage',
        contact: 'Contact',
        signIn: 'Connexion',
        back: 'Retour',
        vision: 'Vision',
    },
    hero: {
        badge: 'CodeRoast · du bruit des logs au signal',
        tagline: 'Transformez le bruit des logs en signal.',
        subtitle:
            'CodeRoast compresse le bruit de vos logs en une structure déterministe, classée par pertinence — pour ne garder que la précision, pas des gigaoctets de logs inutilisables.',
        cta: 'Diff de deux logs',
        ctaSecondary: 'Voir tous les produits',
        trust: 'déterministe · précision avant tout · tourne sur votre infra · logs jamais stockés',
    },
    determinismLine: {
        line: 'Mêmes logs en entrée, même réponse en sortie — bit-identique, sur trois compilateurs et deux systèmes d’exploitation. Re-prouvé à chaque release.',
        cta: 'Comment on construit',
    },
    vision: {
        badge: 'CodeRoast · la thèse MetaLog',
        titleLead: 'Pas stockés. Pas échantillonnés. Pas exfiltrés.',
        titleAccent: 'Distillés.',
        subtitle:
            'CodeRoast distille n’importe quel flux de logs en un MetaLog — une petite empreinte déterministe de ce que votre système a réellement fait. Bit-identique d’un run à l’autre, citable, traçable jusqu’à la ligne source exacte, et qui ne quitte jamais votre infra. Sift, détection d’anomalies, triage IA : chaque produit n’est qu’une vue sur cet unique artefact. Lire 4 Ko au lieu de stocker des gigaoctets est l’effet de bord — pas l’argument.',
        ctaPrimary: 'Diff de deux logs',
        ctaSecondary: 'Voir les produits',
        compareCta: 'Voir ce qui nous différencie',
        pain: {
            title: 'Le modèle que tout le monde a fini par accepter est cassé, en silence.',
            subtitle: 'Quatre compromis qu’on vous a présentés comme normaux.',
            points: [
                {
                    title: 'Vous rationnez vos propres logs.',
                    description:
                        'Pour survivre à la facture au Go, les équipes suppriment des lignes de log à la main — en s’aveuglant volontairement pour réduire une facture.',
                },
                {
                    title: 'Vous échantillonnez justement celui qui comptait.',
                    description:
                        'À l’échelle, le fournisseur jette des events. Le fatal rare — celui dont vous aviez besoin — est le premier à disparaître.',
                },
                {
                    title: 'Vos données vivent sur les serveurs d’un autre.',
                    description:
                        'Les logs quittent votre périmètre pour être cherchés, et l’IA les lit bruts. La conformité déteste ça ; vous aussi devriez.',
                },
                {
                    title: 'L’IA vous donne un récit que vous ne pouvez pas reproduire.',
                    description:
                        'Un « pourquoi ça a cassé » plausible, régénéré différemment à chaque fois. Rien qu’on puisse mettre derrière une gate.',
                },
            ],
        },
        artifact: {
            title: 'Voici le MetaLog.',
            subtitle:
                'Une empreinte bornée et déterministe par fenêtre de votre flux. C’est ça, le produit entier — tout le reste ne fait que le lire.',
            steps: [
                {
                    step: 'Des gigaoctets en entrée',
                    description:
                        'Pointez-le sur un flux brut, non instrumenté — sortie CI, un service, une flotte entière.',
                },
                {
                    step: 'Une empreinte bornée en sortie',
                    description:
                        'Il distille en une empreinte structurelle bornée, et elle ne quitte jamais votre infra.',
                },
                {
                    step: 'Attrape la régression',
                    description:
                        'La saillance fait remonter l’erreur fatale isolée, à elle seule — sans baseline, sans requête, sans seuil à régler.',
                },
                {
                    step: 'Diff, instantané',
                    description:
                        'Deux empreintes en entrée, un « ce qui a changé » classé en sortie — et chaque trouvaille remonte jusqu’à la ligne source exacte.',
                },
            ],
            badges: [
                'zéro instrumentation',
                'aucun langage de requête',
                'rien ne quitte votre infra',
                'bit-identique à chaque run',
            ],
        },
        punchThem: 'L’ancien modèle',
        punchUs: 'Le MetaLog',
        punches: [
            {
                title: 'Eux vous font supprimer vos logs. Nous, on vous dit d’en envoyer plus.',
                them:
                    'Le secret honteux de la tarification au Go : les équipes ne font pas que payer — elles rationnent. Des ingénieurs passent du vrai temps de sprint à arracher des lignes de log pour réduire une facture cloud, s’aveuglant volontairement. C’est aussi de la perte — sauf qu’elle est décidée à la main, en amont, avant que quiconque sache ce qui comptera, et payée en heures d’ingénierie. La pire qui soit.',
                us:
                    'Envoyez tout. Loggez plus, pas moins. Le coût cesse d’être le verrou — l’empreinte est bornée et vos logs bruts ne quittent jamais votre infra. Plus aucun ingénieur ne sépare le bon grain de l’ivraie pour tenir un budget, jamais. La distillation est automatique et dirigée par la saillance : le fatal rare survit parce qu’il compte, pas parce que quelqu’un a bien deviné le trimestre dernier.',
            },
            {
                title: 'Votre facture IA est la prochaine à s’envoler.',
                them:
                    'Tout a un LLM greffé dessus maintenant — et les logs bruts sont la chose la plus chère qu’on puisse lui donner à manger. Vous payez au token pour des gigaoctets de bruit, et le modèle s’y noie exactement comme un humain.',
                us:
                    'Ne collez pas vos logs — collez ce qui compte. Un MetaLog est un brief borné et pré-structuré : une fraction des tokens, une fraction du coût. Et un LLM lit un MetaLog mieux que presque n’importe quel humain ne lit le brut — la structure est déjà faite. Moins cher ET plus net.',
            },
        ],
        tie:
            'Tout le monde perd de l’information à l’échelle. La seule question, c’est comment vous perdez. Eux perdent à l’aveugle et en amont — un humain qui supprime des logs, un fournisseur qui les échantillonne. Nous perdons de façon informée et récupérable : la saillance décide quoi garder, et chaque insight remonte jusqu’à la ligne source exacte.',
        contrast: {
            title: 'Ce que le MetaLog n’est pas.',
            subtitle: 'Deux modèles pour la même douleur. L’un accumule. L’autre distille.',
            columnOld: 'Accumuler · Datadog · Splunk · Honeycomb',
            columnNew: 'Distiller · MetaLog',
            rows: [
                {
                    old: 'Échantillonne les events pour plafonner le coût — l’event rare est le premier à partir.',
                    new: 'Garde le saillant, jette l’ennuyeux. L’erreur fatale isolée survit parce qu’elle est saillante, pas parce qu’elle était fréquente.',
                },
                {
                    old: 'L’instrumentation est le ticket d’entrée — réécrivez votre code en wide events avant de voir la moindre valeur.',
                    new: 'Lit les logs non structurés que vous avez déjà. Instrumentation optionnelle, jamais requise.',
                },
                {
                    old: 'Vos logs vivent sur leurs serveurs ; leur IA les lit bruts.',
                    new: 'On-prem et souverain — gardez vos logs. Le LLM voit une empreinte bornée : des gabarits masqués et des nombres, jamais vos lignes de logs brutes.',
                },
                {
                    old: 'Un « pourquoi ça a cassé » probabiliste que vous ne pouvez pas reproduire.',
                    new: 'Un fait structurel déterministe — bit-identique, citable, traçable jusqu’à la ligne source. Le seul qu’on met derrière une gate CI dure.',
                },
                {
                    old: 'Payer pour stocker des gigaoctets à vie — et en lire moins de 5 %.',
                    new: 'Une empreinte bornée. La faible empreinte est un effet de bord de la distillation, pas le but.',
                },
            ],
            otelNote:
                'Déjà sur OTel ? On distille ça aussi — la structure est du signal gratuit. Et vous obtenez quand même un MetaLog souverain, pas un énième entrepôt de spans qui vous enferme.',
        },
        hub: {
            title: 'Un flux en entrée. Un MetaLog en sortie. Tout le reste est une vue.',
            subtitle:
                'La gamme grandit ; l’artefact dessous reste le même. Chaque produit est une vue différente sur la même empreinte.',
            lenses: [
                {
                    name: 'Sift',
                    status: 'Live',
                    description: 'Diff structurel de CI. Deux runs en entrée, un « ce qui a changé » classé en sortie.',
                },
                {
                    name: 'Détection streaming',
                    status: 'Beta',
                    description:
                        'Détection d’anomalies continue, la précision avant tout — une alerte, un vrai incident.',
                },
                {
                    name: 'Forwarding MetaLog',
                    status: 'Bientôt',
                    description:
                        'Transférez des empreintes, pas des gigaoctets bruts. Votre facture d’observabilité suit ce que vous envoyez.',
                },
                {
                    name: 'Validation canary',
                    status: 'Bientôt',
                    description:
                        'diff(baseline, canary) comme signal d’arrêt structurel avant que les métriques ne bougent.',
                },
                {
                    name: 'Post-mortem d’incident',
                    status: 'Bientôt',
                    description: 'Rejouez l’évolution de la structure, à partir des empreintes stockées.',
                },
                {
                    name: 'Débogueur IA',
                    status: 'Bientôt',
                    description:
                        'Donnez à un LLM un brief borné dans le même contexte que votre code — jamais de logs bruts.',
                },
            ],
        },
        closing: {
            title: 'La vision, c’est le MetaLog. Le chemin d’entrée, c’est Sift.',
            subtitle:
                'Comparez deux runs CI en environ 90 secondes — sans agent, sans installation, logs jamais stockés. Le même artefact alimente tout ce qui précède.',
            cta: 'Diff de deux logs',
        },
    },
    sift: {
        eyebrow: 'Sift',
        hero: {
            title: 'Vos tests passent. Vos logs disent le contraire.',
            subtitle:
                'Pass/fail, c’est un bit. grep, lui, doit savoir quoi chercher. Sift lit la structure de deux runs et classe ce qui a vraiment changé — une ligne de succès disparue en silence, une erreur que vous avez corrigée, un pattern qui a pris le dessus sur le run — puis fait taire les centaines de diffs inutiles. Deux fichiers de logs en entrée, un rapport classé en sortie. Sans agent à installer, sans compte utilisateur, ~90 secondes.',
            ctaPrimary: 'Ajoutez l’Action',
            ctaSecondary: 'Essayez dans votre navigateur',
            trust: 'Gratuit, pour toujours · tourne dans votre CI · vos logs ne quittent jamais votre infra.',
            samplePassed: 'les deux runs sont passés',
            kicker:
                'Les deux runs sont au vert. Ni le statut du build ni grep n’y voient quoi que ce soit — il n’y a aucune erreur à chercher. Sift, lui, voit que votre cache a cessé de fonctionner en silence.',
        },
        comment: {
            title: 'Il vit là où vous bossez déjà.',
            body:
                'Branchez Sift une fois, et chaque PR reçoit un diff structurel en commentaire — advisory par défaut, une gate bloquante au besoin. Un seul commentaire épinglé à votre PR, mis à jour à chaque push, déterministe. Même avec une coche verte rassurante, Sift voit le problème là où tout semble validé :',
        },
        catches: {
            title: 'Conçu pour les changements qui ne ressemblent pas à des changements.',
            colChange: 'Ce qui a changé',
            colTextDiff: 'Diff texte',
            colPassFail: 'Pass/fail',
            colSift: 'Sift',
            rows: [
                {
                    change: 'Une ligne de succès disparue en silence (cache, retry, un chemin de code)',
                    textDiff: 'noyée',
                    passFail: 'invisible',
                    sift: 'Disappeared : "…" — une ligne classée',
                },
                {
                    change: 'La part d’un pattern dans le run a bougé (4 % → 38 %)',
                    textDiff: 'invisible',
                    passFail: 'invisible',
                    sift: 'Frequency shift',
                },
                {
                    change: 'Une erreur que vous avez corrigée a vraiment disparu',
                    textDiff: 'invisible',
                    passFail: 'invisible',
                    sift: 'Recovery — green: "your fix worked"',
                },
                {
                    change: 'Les mêmes erreurs qu’avant, mais un vrai changement dessous (leurre)',
                    textDiff: 'noyé',
                    passFail: 'invisible',
                    sift: 'le bruit masqué, le vrai changement remonté',
                },
                {
                    change: 'Un tout nouveau pattern d’erreur',
                    textDiff: 'noyé dans le bruit',
                    passFail: 'invisible si les tests passent',
                    sift: 'une ligne, classée par sévérité',
                },
            ],
            ghaStructure: {
                title: 'Il lit votre run par sa structure — pas seulement ligne à ligne.',
                body:
                    'Pointez Sift sur un run GitHub Actions et il lit le squelette job ▸ step : une étape qui disparaît en silence, une nouvelle étape, une régression de couverture quand un contrôle entier cesse de tourner — remonté au grain de la structure, pas noyé dans un diff de lignes. Une cause, une ligne classée, pas cinquante symptômes.',
            },
            jenkinsStructure: {
                title: 'Jenkins, lu par la structure.',
                body:
                    'Pointez Sift sur un pipeline Declarative et il lit votre squelette stage ▸ step comme il lit déjà les jobs GitHub Actions — les mêmes Disparu / Nouveau / Remplacé structurels, la même détection de régression de couverture, le même repli par structure des méga-logs. Les jobs freestyle et matrix classiques gardent le diff universel au niveau template ; la profondeur structurelle est cantonnée au Declarative Pipeline, et on le dit.',
            },
            jenkinsOutcome: {
                title: 'Et il sait ce que « terminé » veut dire.',
                body:
                    'Jenkins émet quatre verdicts, pas deux — Sift les classe tous (SUCCESS / FAILURE / UNSTABLE / ABORTED) sur n’importe quel job Jenkins. Un build UNSTABLE (des tests ont tourné, certains ont échoué) n’est pas un build vert ; un run ABORTED n’est pas un échec. Mettez une gate dessus : --fail-on regression casse le build sur une régression structurelle, et le rapport porte outcome_regressed: true quand le verdict lui-même glisse — SUCCESS → UNSTABLE — même quand chaque ligne de log a l’air normale.',
            },
        },
        free: {
            title: 'Tout le produit sans état est gratuit. Sans conditions.',
            body:
                'La CLI, la GitHub Action, le commentaire de PR, la gate bloquante — sur n’importe quel dépôt, public ou privé. On ne le facture pas au compteur. Jamais. La gate n’est pas un péage : une équipe qui fait confiance au commentaire ajoute elle-même un exit 1 — facturer un simple if serait insultant. Ce qui est payant, c’est l’échelle et la mémoire — couvrir une organisation (multi-dépôts, sièges, SSO) et un historique déterministe de votre CI dans le temps. Un diff ponctuel est substituable ; un relevé structurel de la dérive de vos builds ne l’est pas.',
            cta: 'Voir les paliers',
        },
        trust: {
            title: 'Un signal déterministe, fiable, conçu pour conditionner un déploiement.',
            body:
                'Mêmes entrées, même diff — bit-identique, sur plusieurs compilateurs et systèmes d’exploitation (on compile avec gcc, clang et MSVC, sous Linux et Windows, et on vérifie un résultat identique à chaque release — la chaîne de compilation est publique, vous pouvez donc la reproduire). C’est ce qui vous permet de mettre Sift derrière une gate CI bloquante ; une gate instable est désactivée en moins d’une journée, et « notre IA trouve ça préoccupant » n’est pas une gate. Rien n’est uploadé, pas de compte utilisateur, aucun agent à installer — ça tourne dans votre CI et vos logs restent sur votre infra. La couche de narration est optionnelle et ne décide jamais : vous l’activez, et c’est vous qui nommez la destination — seule l’empreinte bornée y voyage, jamais les logs bruts, jamais le verdict, jamais rien de ce qui décide.',
            cta: 'Comment on construit',
        },
        install: {
            title: 'Deux fichiers de logs en entrée. Un rapport classé en sortie.',
            actionLabel: 'L’Action',
            cliLabel: 'La CLI',
            cliLead: 'un seul binaire statique, aucun runtime —',
        },
    },
    diff: {
        eyebrow: 'SIFT',
        title: 'Ce qui a changé entre deux logs — et ce qui n’est que du bruit',
        subtitle:
            'Collez deux flux de logs (un run de référence et un run modifié). InSight ingère les deux et classe les changements structurellement significatifs — survolez ou épinglez un changement pour voir exactement les lignes qu’il touche.',
        loadSample: 'Pas de logs sous la main ? Chargez un exemple :',
        loadingSample: 'Chargement…',
        baselineLog: 'Log de référence',
        changedLog: 'Log modifié',
        placeholder: 'collez des lignes de log…',
        lines: 'lignes',
        line: 'ligne',
        flagged: 'signalés',
        compare: 'Comparer',
        comparing: 'Comparaison…',
        swap: 'Inverser',
        swapTitle: 'Inverser référence ⇄ modifié',
        trust: 'Gratuit · quota quotidien · les logs ne sont pas stockés',
        paneBaseline: 'Référence',
        paneChanged: 'Modifié',
        swapSides: 'Inverser les côtés',
        swapSidesTitle: 'Inverser référence ⇄ modifié et recomparer',
        newComparison: 'Nouvelle comparaison',
        significantChanges: 'Changements significatifs',
        clearPinned: 'retirer {count} épinglé(s)',
        hint: 'survolez pour prévisualiser · cliquez pour épingler (cumulables) · couleur = sévérité, pas ajout/suppression',
        emptyResult:
            'Aucun changement structurellement significatif — les {count} changements observés sont dans le bruit.',
        suppressed:
            '{count} des {total} changements observés par Sift ont été masqués comme bruit (proportionnels / basse fréquence). Le nombre de lignes du diff texte ci-dessus compte des lignes, pas des changements.',
        ciCallout: 'Vous le voulez en CI ? Le même moteur tourne en CLI locale et en GitHub Action.',
        severity: {
            critical: 'CRITIQUE',
            high: 'SUSPECT',
            medium: 'NOTABLE',
            low: 'FAIBLE',
            recovery: 'RÉSOLU',
        },
        kind: {
            new_error_pattern: 'erreur apparue',
            escalated_pattern: 'aggravé',
            resolved_pattern: 'résolu',
            new_template: 'apparu',
            vanished_template: 'disparu',
            frequency_shift: 'décalage',
            entropy_shift: 'ramification',
            emerging_tail: 'émergent en queue',
            unit_outcome_changed: 'verdict changé',
            fallback: 'modifié',
        },
        error: {
            quotaReached:
                'Limite gratuite quotidienne atteinte{perDay}. Le plafond est compté par adresse réseau : une adresse partagée ou d’opérateur mobile peut être épuisée par les comparaisons d’autres personnes. Il est réinitialisé demain — ou lancez le même moteur en local avec la CLI, qui n’a aucun plafond.',
            accessDenied: 'Accès refusé.',
            failed: 'La comparaison a échoué.',
            presetFailed: 'Cet exemple n’a pas pu être chargé. Vérifiez votre connexion et réessayez.',
        },
        provenance: {
            realCi: 'Run CI réel · anonymisé',
            generated: 'Fixture générée',
        },
        provenanceNote: {
            realCi:
                'Un run réel de l’un de nos propres dépôts. De vrais octets, dont seules les identités machine et système de fichiers ont été expurgées — rien de reconstruit, rien de regénéré. La sortie du build, elle, est celle du runner, octet pour octet.',
            generated:
                'Synthétisée pour isoler un seul scénario — aucun run réel derrière. Référence et modifié partagent les mêmes templates ; seuls les paramètres changent.',
        },
        figures: {
            plainDiff: 'lignes signalées par un diff texte',
            sift: 'changements signalés par Sift',
        },
        presets: {
            'real-ci-noise': {
                label: 'CI réelle · deux builds verts',
                description:
                    'Deux runs réussis du même job. Des milliers de lignes diffèrent ; presque rien ne compte.',
                story: [
                    'Quelqu’un a ajouté neuf tests. C’est tout le changement.',
                    'Le runner de tests a renuméroté chaque ligne qu’il affiche — 762 tests sont devenus 771 — et le build a renuméroté chaque étape avec lui, […/700] → […/704]. Un diff texte, timestamps déjà retirés, signale 5 571 lignes modifiées. Rien n’a cassé. Rien ne va mal.',
                    'Sift signale un seul changement, et ce n’est pas une erreur.',
                    'C’est le chiffre sur lequel repose tout le reste de la page. N’importe quel outil sait trouver une panne dans un build en échec. La vraie question, c’est ce qu’un outil dit quand rien ne va mal — et un outil qui vous rend cinq mille lignes à lire est un outil que vous désactivez en une semaine.',
                ],
            },
            'real-ci-triage': {
                label: 'CI réelle · le build qui a cassé',
                description:
                    'Le même run réussi face au run en échec. Le trio de tête, c’est l’échec et sa cause.',
                story: [
                    'Le même job, vert puis en échec. Un diff texte signale 4 889 lignes modifiées. Sift en signale 13 — et le trio de tête raconte toute l’histoire : l’étape est sortie en erreur, puis pourquoi — le paquet dont le build a échoué, et l’erreur qu’il a levée.',
                    'Pas « on a trouvé le mot ERROR ». La ligne fautive était déjà dans le log — grep vous l’aurait rendue en même temps que des milliers de lignes de bruit de build qui ont bougé au même moment. Ce qu’un diff texte ne peut pas vous dire, c’est laquelle d’entre elles est celle qui compte.',
                ],
            },
            'hotfix': {
                label: 'Vérif. hotfix',
                description: 'Un run cassé vs son hotfix : les erreurs DB se sont rétablies, un nouveau timeout a régressé.',
            },
            'silent-regression': {
                label: 'Régression silencieuse',
                description: 'Aucune nouvelle erreur — une ligne de succès a disparu et les retries ont explosé. grep ne trouve rien.',
            },
            'error-decoy': {
                label: 'Mêmes erreurs, vrai changement',
                description: 'Les deux runs ont les MÊMES erreurs (le leurre) — mais les commandes ont cessé d’aboutir en silence. Sift masque les erreurs inchangées et montre ce qui a vraiment bougé.',
            },
            'cache-degradation': {
                label: 'Le cache meurt en silence',
                description: 'Zéro erreur, toujours des 200 — mais le cache ne sert plus et les appels à l’origine ont explosé. Une falaise p99 latente, invisible à un filtre.',
            },
            'canary-deploy': {
                label: 'Canary vs stable',
                description: 'Même trafic, deux builds : le nouveau a changé le handler de checkout et activé un flag. Un pur diff de comportement — aucune erreur impliquée.',
            },
            'hot-key': {
                label: 'Le throttling prend le dessus',
                description: 'Aucune erreur — mais une nouvelle ligne de throttling apparaît et accapare un tiers du run. Un diff texte montre que les lignes existent ; Sift classe le template qui domine désormais le flux.',
            },
            'escalating-warning': {
                label: 'Avertissement qui s’aggrave',
                description: 'Un WARN de pression sur le pool passe de rare à omniprésent — la dérive pré-incident, quelques minutes avant que ça ne page. Pas une nouvelle erreur, donc un filtre reste muet.',
            },
        },
    },
    problem: {
        title: 'On ne ship pas une observabilité qu\'on n\'a jamais testée.',
        subtitle:
            'En staging, c\'est calme. Les mocks sont propres. Puis la prod casse à 3 h du matin et vos alertes n\'ont jamais sonné pour de vrai. LogCraft génère les signaux réalistes qui manquent à tous les outils qui suivent.',
        points: [
            {
                title: 'Vos alertes fonctionnent en staging — parce qu\'il ne s\'y passe rien.',
                description:
                    'Pas de rafales, pas de pannes en cascade, pas de record parasite. Le premier vrai incident est le premier vrai test.',
            },
            {
                title: 'Vos dashboards sont beaux jusqu\'au moment où la panne en cascade frappe.',
                description:
                    'Des p99 que vous n\'avez jamais tracés. Des effets de topologie que personne n\'a dessinés. Des buffers jamais dimensionnés.',
            },
            {
                title: 'Votre on-call apprend au rythme des alertes en pleine nuit.',
                description:
                    'Sans sandbox, les vraies pannes deviennent votre seul terrain d\'entraînement. Il existe une meilleure solution.',
            },
        ],
    },
    showcase: {
        title: 'Incident en entrée. Explication en sortie.',
        subtitle:
            'Lancez un scénario LogCraft déterministe et regardez InSight condenser le flux en templates, MetaLogs, preuves de détection et explication exploitable.',
        yamlLabel: 'scenario.yaml',
        logsLabel: 'flux de preuves — exemple',
        illustrationBadge: 'Illustration — pas une sortie réelle',
        cta: 'Ouvrir le Playground InSight',
    },
    features: {
        title: 'Tous les knobs du monde réel.',
        subtitle:
            'LogCraft n\'est pas une lib de mock. C\'est un moteur déterministe qui reproduit le comportement du trafic, les pannes et la latence comme en production — sur une seed que vous contrôlez.',
        items: [
            {
                title: 'Déterministe par seed',
                description:
                    'Même YAML, même seed, mêmes logs — sur n\'importe quelle machine, n\'importe quel jour. Reproduisez n\'importe quel bug. Rejouez n\'importe quel incident, bit-identique.',
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
                    'Ouvrez le Lab, choisissez un scénario, Run. Grille d\'agents, flux de logs, timeline d\'incidents — en direct.',
            },
            {
                title: 'Core C++20',
                description:
                    'Pipeline shardé, faible contention, à la microseconde. Tient des runs de plusieurs millions de records sur un simple ordi portable.',
            },
        ],
    },
    howItWorks: {
        title: 'Trois étapes. Pas de collecteurs, pas de clusters, pas de carte bleue.',
        steps: [
            {
                title: 'Décrire',
                description:
                    'Un YAML court : quelques agents, les sinks où ils écrivent, les incidents à planifier. Partez de la démo, changez une ligne, et c\'est terminé.',
            },
            {
                title: 'Lancer',
                description:
                    'Lancez Run dans le Lab — ou appelez l\'API REST depuis la CI. Le moteur lance de vrais threads et émet à la cadence demandée.',
            },
            {
                title: 'Brancher',
                description:
                    'Envoyez en stream vers votre stack : Datadog, Loki, Splunk, Elastic, OpenTelemetry — ou directement vers InSight pour une détection explicable.',
            },
        ],
    },
    portfolio: {
        title: 'Un moteur. Une surface pour chaque usage.',
        subtitle:
            'Chaque produit CodeRoast transforme le bruit des logs en signal pour un usage précis — choisissez celui qui correspond au problème que vous avez sous les yeux. La gamme s’étoffe ; le moteur sous-jacent reste le même.',
        sift: {
            name: 'Sift',
            description:
                'Collez un run de référence et un run modifié. Sift classe les changements structurellement significatifs et supprime le bruit sous lequel un diff classique vous ensevelit — la porte d’entrée CI/CD : zéro infra, ~90 secondes.',
            status: 'Live · démo gratuite',
            highlights: [
                '« Ce qui a changé » classé par pertinence, bruit supprimé',
                'Surlignage de provenance ligne à ligne',
                'Tourne en local — les logs ne sortent pas (CLI / Action)',
            ],
        },
        logcraft: {
            name: 'LogCraft',
            description:
                'Un générateur de logs synthétiques et un moteur de scénarios chaos. Décrivez une flotte d’agents en YAML, lancez un run, et obtenez des flux de logs reproductibles, calqués sur la production — pannes en cascade, distributions de latence, 20+ formats de sortie. Stressez votre pipeline, démontrez vos dashboards, entraînez votre on-call.',
            status: 'Bêta · utilisable',
            highlights: [
                'Agents & topologie en YAML',
                'Seed déterministe → replays bit-stables',
                'Pannes en cascade & incidents chaos',
                '20+ formats (ECS, OTLP, Prometheus…)',
            ],
        },
        insight: {
            name: 'InSight',
            description:
                'Le pipeline d’analyse en streaming derrière tout ça : les logs bruyants deviennent templates, MetaLogs, preuves de détection et paquets d’explication — la précision avant tout : une alerte = un vrai incident. À essayer en live dans le Lab.',
            status: 'Bêta · API live',
            highlights: [
                'Cartes d’insight explain-first',
                'Identité de template sans état, ligne à ligne',
                'Couche de compression MetaLog',
                'Preuves des détecteurs pour l’IA explain',
            ],
        },
        metalogForwarding: {
            name: 'Forwarding MetaLog',
            description:
                'Compressez le flux en MetaLogs et transférez-les, pas des gigaoctets bruts — une empreinte structurelle pour une fraction du volume. La moitié visible par le CFO.',
            status: 'Bientôt',
        },
        canary: {
            name: 'Validation canary',
            description:
                'diff(baseline, canary) comme signal d’arrêt structurel — détectez une mauvaise release avant que les métriques ne bougent, sur le même moteur que le diff CI.',
            status: 'Bientôt',
        },
    },
    roadmap: {
        title: 'Sur la roadmap',
        subtitle:
            'Ce que nous construisons ensuite, et où va le produit.',
        badge: 'Bientôt',
        items: [
            {
                title: 'Démo explain IA',
                description:
                    'Attacher un agent au flux de sortie d’InSight, pour des explications plus claires, sans aucune interprétation hallucinée.',
            },
            {
                title: 'Fixtures de compatibilité',
                description:
                    'Promouvoir des scénarios de la bibliothèque en gates de release prouvant que LogCraft, IPC, InSight, serveur et web restent synchronisés.',
            },
            {
                title: 'Vues traces MetaLog',
                description:
                    'Exposer les fenêtres MetaLog et traces de détecteurs une fois la démo explain-first suffisamment stable pour des présentations clients.',
            },
        ],
    },
    maker: {
        title: 'Construit par un seul ingénieur.',
        body:
            'Je m\'appelle Manu. J\'ai passé assez de temps à bricoler des générateurs de logs en shell pour avoir envie d\'un vrai. LogCraft, c\'est ce que j\'aurais voulu avoir — un moteur déterministe, piloté par scénarios, que vous pouvez brancher sur n\'importe quel pipeline. Gratuit dans le Lab, la bibliothèque de scénarios est ouverte sur GitHub, et je prends les retours au sérieux.',
        ctaCode: 'Bibliothèque de scénarios (GitHub)',
        ctaContact: 'Me contacter',
        ctaSupport: 'Soutenir le projet',
        supportNote: 'Un petit merci aide à garder les commits du soir.',
    },
    licensing: {
        title: 'Plans LogCraft',
        subtitle:
            'LogCraft n\'est pas encore distribué : le moteur tourne dans le Lab, dans votre navigateur, et nulle part ailleurs. Voici la forme que prendra l\'offre — dites-nous dès maintenant si c\'est la mauvaise.',
        badge: 'L\'offre envisagée — pas encore en vente',
        free: {
            name: 'Gratuit',
            price: '0 €',
            period: 'pour toujours',
            availability: 'Disponible maintenant — dans le Lab, dans votre navigateur.',
            description:
                'Lancez les scénarios starter et les agents basiques. Tout ce qui est ici tourne aujourd\'hui, et vous pouvez vérifier chaque affirmation de cette page en l\'exécutant.',
            features: [
                'Scénarios à 1–2 agents',
                'Sortie console & fichier',
                'Générateurs de champs basiques',
                'La référence complète du DSL de scénarios',
                'Support communautaire',
            ],
            cta: 'Ouvrir le Lab',
        },
        pro: {
            name: 'Pro',
            price: 'TBD',
            period: '/mois',
            availability: 'Pas encore en vente — le prix viendra avec la sortie.',
            description:
                'Le réaliste : incidents, pannes en cascade, tous les formats de sortie, replay déterministe — en binaire à vous, sur vos machines.',
            features: [
                'Binaire CLI, auto-hébergé',
                'Agents & scénarios illimités',
                'Tous les sinks (HTTP, ECS, OTLP, Prometheus, StatsD)',
                'Pannes en cascade & scénarios d\'incident',
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
            availability: 'Pas encore en vente — parlons-en, et façonnez-la.',
            description:
                'Pour les équipes qui font de LogCraft la colonne vertébrale synthétique de leur stack d\'observabilité.',
            features: [
                'Tout ce qui est dans Pro',
                'Machines d\'état & effets conditionnels',
                'Sinks de sortie sur mesure',
                'Support dédié & SLA',
                'Déploiement on-prem / air-gap',
                'Onboarding & formation',
            ],
            cta: 'Nous contacter',
        },
    },
    howWeBuild: {
        badge: 'Discipline d’ingénierie',
        title: 'Comment on construit',
        subtitle: 'Le déterminisme est une promesse produit. Elle commence par notre façon de construire.',
        intro:
            'CodeRoast tient une seule garantie : mêmes entrées, même sortie — bit-identique. Un diff que vous pouvez mettre derrière une gate CI. Ce n’est pas un slogan ; c’est une discipline d’ingénierie, et elle gouverne tout ce qu’on livre — y compris notre façon d’utiliser nos propres outils.',
        sections: [
            {
                title: 'Générer n’est pas décider.',
                body:
                    'On traite l’IA comme tout outil puissant et non spécifié : on la borne. L’IA génère — boilerplate, échafaudage de tests, exploration. Les contrats la bornent — types, tests unitaires et de régression, surfaces d’API, revue humaine. Un humain décide. Rien n’atteint une release sur la seule parole d’un modèle ; ça l’atteint parce que c’est passé par une gate qu’un humain a conçue. La fiabilité n’est pas une propriété du générateur — c’est une propriété du cadre qui l’entoure.',
            },
            {
                title: 'Le produit hérite de la même ligne.',
                body:
                    'C’est pour ça qu’InSight est déterministe. Un modèle ne décide jamais si votre incident est réel, si un changement de log est significatif, ni ce qui appartient à une fenêtre — ce sont des faits structurels que notre moteur calcule et reproduit. Dans notre produit, l’IA ne fait jamais que raconter ce que le moteur déterministe a déjà classé : sur votre infra, en opt-in, avec votre propre clé, sur une empreinte bornée — jamais les logs bruts, jamais dans le chemin qui décide. Les autres « analyses de logs par IA » hallucinent le résultat. Nous, on classe de façon déterministe et on raconte en option. La frontière est nette, volontairement.',
            },
        ],
        commit: {
            title: 'Ce sur quoi on s’engage.',
            items: [
                {
                    title: 'Le déterminisme, on le teste — on ne se contente pas de le promettre.',
                    description:
                        'Chaque release re-prouve que les mêmes logs produisent la même empreinte, bit-identique, compilée de trois manières : gcc et clang sous Linux, MSVC sous Windows — trois compilateurs, deux systèmes d’exploitation, trois bibliothèques standard C++, sur x86-64 comme sur arm64. Résultat identique, sinon la release ne part pas. La plupart des outils « reproductibles » sous-entendent sur la même machine ; nous, c’est quelle que soit votre chaîne de compilation.',
                },
                {
                    title: 'Ne nous croyez pas sur parole — reproduisez-nous.',
                    description:
                        'Les compilateurs exacts que nous épinglons sont publics et ouverts : notre chaîne de compilation est un dépôt à part entière, sources et recette comprises. Recompilez CodeRoast vous-même, vous obtenez les mêmes octets que nous. Une promesse de déterminisme qu’on ne peut pas reproduire, c’est du marketing ; la nôtre est livrée avec la recette.',
                },
                {
                    title: 'Le chemin de garantie est sans modèle.',
                    description:
                        'Détection, classement, significativité, appartenance à une fenêtre — aucune inférence de modèle n’y touche. C’est du calcul structurel reproductible.',
                },
                {
                    title: 'Vos logs ne quittent jamais votre infra.',
                    description:
                        'La CLI et l’Action tournent dans votre CI ; rien ne nous est envoyé. Quand la narration IA est activée, elle tourne avec votre clé, sur votre machine, sur une empreinte bornée — pas les logs bruts.',
                },
            ],
        },
        canonOpen: {
            title: 'On ouvre le langage — le moat reste intact.',
            description:
                'La façon dont Sift lit un log CI ou de compilation — la grammaire, les paquets sémantiques, le contrat que vous étendez pour lui apprendre un nouveau format — est Apache-2.0, publique. Lisez exactement comment on comprend vos logs. Ça n’a jamais été le moat : comprendre un log, ce n’est pas détecter ce qui a changé. On donne le langage, on garde l’intelligence.',
        },
        closing: 'On tient en interne la discipline qu’on vend en externe. C’est tout l’enjeu.',
        cta: 'Diff de deux logs',
    },
    howWeCompare: {
        badge: 'Une autre conception',
        title: 'Ce qui nous différencie',
        subtitle: 'Version courte : on ne fait pas moins cher. On fait autre chose.',
        intro:
            'Vous êtes sûrement là pour nous ranger à côté d’un outil que vous connaissez déjà. C’est légitime. Sauf qu’une chose fausse la comparaison avant même de commencer : presque tout ce qui existe est un entrepôt. Ça stocke vos données d’observabilité et rivalise sur le prix, la cardinalité, l’hébergement. Nous, on ne stocke pas : on distille — une empreinte bornée et déterministe, sur votre propre infra. Pas un entrepôt moins cher : une autre conception. Voici ce que ça donne face aux deux outils auxquels on nous compare le plus.',
        versus: [
            {
                title: 'face à Datadog — une autre conception, pas une moins chère',
                body: [
                    'Le modèle de Datadog, c’est accumuler-et-facturer : envoyez tout vers leur cloud, payez au volume. Quand la facture pique, leur réponse, c’est d’échantillonner — décider quelles lignes restent cherchables et prier pour ne pas avoir jeté celle qui comptait. La fameuse facture Datadog est la taxe du modèle d’accumulation, et l’échantillonnage en est la coupe à l’aveugle.',
                    'On ne rend pas cette facture moins chère. On supprime la raison même d’exfiltrer vos logs : on distille une empreinte comportementale complète en local, et vos logs bruts restent là où ils sont. Plus de logs, sur votre infra — le parachute de la coupe que les équipes font déjà à l’aveugle. Les économies en découlent, mais le coût n’est pas l’argument : l’argument, c’est qu’un fait structurel déterministe — mêmes entrées, même réponse — est quelque chose qu’un entrepôt échantillonné et probabiliste ne peut structurellement pas vous donner. Vous n’achetez pas un Datadog moins cher. Vous achetez une garantie différente.',
                ],
            },
            {
                title: 'face à Honeycomb — la même conviction, le pari inverse',
                body: [
                    'On part du même constat qu’Honeycomb : le stockage bête, c’est fini, l’intelligence est le produit. Ils font avancer l’observabilité, nous aussi — même conviction, directions opposées. Ce n’est pas eux l’ennemi ; c’est la mentalité entrepôt.',
                    'Puis le pari diverge, nettement. Honeycomb mise sur la richesse : garder chaque événement à pleine cardinalité pour poser n’importe quelle question après coup. Nous, on mise sur la compression : distiller le comportement en amont en une empreinte bornée et comparable, pour que « ce qui a changé / ce qui ne va pas » soit déjà structuré quand vous regardez. Honeycomb est imbattable quand vous ne savez pas encore ce que vous aurez à demander. Nous, on est imbattables quand il vous faut un fait déterministe, sur votre infra — bit-identique, le seul qu’on peut mettre derrière une vraie gate CI. Leur pari vous demande d’instrumenter des wide events ; le nôtre lit les logs que vous écrivez déjà. Choisissez le pari qui colle à votre problème — beaucoup d’équipes voudront les deux.',
                ],
            },
        ],
        wrongTool: {
            title: 'Là où on est le mauvais outil',
            body:
                'On est honnêtes sur nos limites, parce qu’un outil qui prétend tout gagner ment. On n’est pas une UI de recherche partagée pour 200 ingénieurs, pas votre stockage de rétention conformité, et on n’ira pas vous chercher le payload exact que l’utilisateur 4823 a envoyé mardi dernier. Ça, c’est le boulot de l’entrepôt — gardez-le. Nous, on vous dit ce que le comportement de votre système a fait et comment il a changé, de façon déterministe, sans exfiltrer vos logs où que ce soit. Si votre besoin dominant, c’est la recherche ad-hoc à l’échelle de l’org sur tout l’historique brut, on est un complément, pas un remplaçant.',
        },
        otel: {
            title: 'Déjà sous OpenTelemetry ?',
            body:
                'Tant mieux — vos logs sont déjà bien formés, donc il y a encore moins de raison de les exfiltrer quelque part pour leur donner du sens. On les distille là où ils sont, et vous gardez une empreinte souveraine qui vous appartient. Mêmes entrées, même réponse. Gardez vos logs.',
            depth:
                'Et si vous émettez des spans, Sift diffe la trace elle-même : un nouveau span, une chaîne parent cassée, une explosion de latence — remontés comme un seul changement structurel classé, de façon déterministe, sur votre infra. Honeycomb et Spectroscope vous montrent la trace en direct et magnifiquement ; nous, on vous dit ce qui a changé entre deux runs, bit pour bit, et on met une gate dessus — la lecture qu’un dashboard ne peut pas donner. (La profondeur trace exige de la télémétrie de spans ; elle est inerte sur des logs CI en texte brut — un axe distinct du diff CI, revendiqué uniquement là où il y a des spans.)',
        },
        cta: 'Diff de deux logs',
    },
    footer: {
        tagline: 'Indépendant, et sans compromis. Le C++ au cœur, le web en surface.',
        rights: 'Tous droits réservés.',
        sections: {
            product: 'Produit',
            resources: 'Ressources',
            more: 'Plus',
            legal: 'Mentions légales & sécurité',
        },
        links: {
            logcraft: 'LogCraft',
            lab: 'Playground InSight',
            useCases: 'Cas d’usage',
            pricing: 'Tarifs',
            tierMatrix: 'Profil d\'accès',
            roadmap: 'Roadmap',
            howWeBuild: 'Comment on construit',
            howWeCompare: 'Ce qui nous différencie',
            github: 'GitHub',
            contact: 'Contact',
            support: 'Soutenir le projet',
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
            'Mémorise que vous avez terminé l’assistant d’onboarding du Lab. Sans lui, le tutoriel réapparaît à chaque visite.',
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
                title: 'Montrer une panne en cascade crédible en cinq minutes',
                outcome:
                    'Ouvrez le Lab en partage d’écran, lancez “Panne en cascade”, et regardez les dashboards potentiels du prospect virer au rouge. Pas de coordination staging, pas de fuite de données réelles.',
                yamlSnippet:
                    '# DB sature → misses cache → 5xx web\nseed: 1337\nauto_cascade:\n  enabled: true\n  radius: 2\nincidents:\n  - at: "00:00:30"\n    target: orders-db\n    impact: { error_rate: 0.4, latency_x: 8 }',
                bullets: [
                    'L’auto-cascade rejoue une vraie chaîne de panne',
                    'Scénarios prêts pour finance, e-commerce, SaaS',
                    '100 % synthétique — aucun log à vous n’entre en jeu',
                ],
            },
            train: {
                tag: 'Formation on-call',
                title: 'Former un on-call sans réveiller personne',
                outcome:
                    'Donnez l’URL du Lab à un junior, un scénario avec root cause connue, et laissez-le le traiter comme un vrai ticket. Rejouez la même seed dans toute l’équipe pour un benchmark juste.',
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
            'LogCraft est un simulateur déterministe de logs et de chaos. Décrivez une flotte de services en YAML, lancez, et obtenez des flux de logs aux formes de production — pannes en cascade, queues de latence, incidents planifiés, sortie ECS / OTLP / Prometheus. Idéal pour stresser votre pipeline, démontrer vos dashboards, former votre on-call, ou alimenter un moteur d\'analyse comme InSight.',
        launchLab: 'Ouvrir le Lab',
        viewGitHub: 'Voir sur GitHub',
        featuresTitle: 'Ce que LogCraft fait vraiment',
        featuresSubtitle:
            'Pas un backend d\'observabilité. Pas un SaaS de stockage. Un générateur qui produit les logs que votre pipeline ne voit jamais en staging.',
        ctaTitle: 'Choisissez un scénario, lancez Run.',
        ctaSubtitle:
            'Ouvrez le Lab, cliquez "Run Demo", observez une fausse boutique e-commerce dérailler à la demande.',
        deepDiveTitle: 'Où LogCraft se branche',
        deepDiveSubtitle:
            'LogCraft se place avant votre stack d\'observabilité — il génère des flux pour stresser tout le reste de la chaîne.',
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
                    title: 'Tester votre pipeline de logs',
                    description:
                        'Rejouer le même incident multi-services à chaque run CI. Vérifier que vos règles de parsing, d\'alerte et de rétention survivent aux rafales, aux pannes en cascade et aux records malformés.',
                },
                {
                    title: 'Démontrer votre produit d\'observabilité',
                    description:
                        'Monter une "production" sans production. Faire la démo SE avec de vraies pannes en cascade, de vrais pics p99, de vraies timelines d\'incident — en 10 secondes.',
                },
                {
                    title: 'Former votre on-call',
                    description:
                        'Donnez l\'URL du Lab à un junior, cliquez "Panne en cascade", laissez-le debug un incident réaliste à root cause connue — sans risque pour la prod.',
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
                    'Un agent est un service factice. Vous lui donnez un nom, un type ("web_server", "database"…), une cadence, un template de message et des champs. Le moteur le lance sur son propre thread et émet des records structurés au rythme demandé. Reliez-en plusieurs avec `flows` pour modéliser une topologie.',
            },
            outputs: {
                title: 'Sinks (sorties)',
                body:
                    'Où vont les logs. Un scénario peut déclarer autant de sinks qu\'il veut, et chaque agent peut router vers n\'importe quel sous-ensemble. Console, fichier, HTTP, ECS, OTLP, Syslog, CLF, Prometheus, StatsD — simultanément. Pratique pour A/B comparer deux pipelines sur le même flux.',
            },
            incidents: {
                title: 'Incidents & pannes en cascade',
                body:
                    'Perturbations planifiées : "À la 5e minute, la database passe à 20 % d\'erreurs avec 8× de latence". Combinez avec `auto_cascade` pour propager la panne aux dépendants avec un rayon d\'impact et un facteur d\'atténuation configurables — comme une vraie panne.',
            },
            determinism: {
                title: 'Déterminisme (la seed)',
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
                    'Chaque record embarque une map `fields` que vous contrôlez. Vous déclarez des champs statiques, templatés (`{{user_id}}`) ou des enums pondérés (`status: 200=80%, 500=10%, 503=10%`). Le même schéma traverse tous les sinks, donc votre index ECS, votre exporter OTLP et votre tail fichier voient des records cohérents.',
            },
            cascades: {
                title: 'Auto-cascades (rayon d\'impact)',
                body:
                    'Avec `auto_cascade.enabled: true`, un incident sur l\'agent A dégrade automatiquement ses dépendants déclarés selon `radius`, `propagation_delay` et `dampening_factor`. C\'est ce qui transforme une seule injection d\'erreur en réaction en chaîne réaliste que vos dashboards doivent détecter.',
            },
            replay: {
                title: 'Déterminisme & replay',
                body:
                    'Au-delà de la `seed`, le moteur enregistre l\'ordinal de chaque record émis pour que deux runs du même YAML produisent des flux bit-identiques. Combiné à l\'API `engine.snapshot`, vous pouvez mettre en pause un run, partager l\'état et le reprendre ailleurs — pratique pour partager des repros et snapshots CI.',
            },
            registry: {
                title: 'Registre des types d\'agent',
                body:
                    'Les types d\'agent intégrés (web_server, database, cache, queue…) ont des valeurs par défaut sensées pour les champs, le vocabulaire d\'erreur et la forme de latence. Vous pouvez enregistrer le vôtre via la référence YAML si la sémantique attendue est exotique — la plupart des utilisateurs ne touchent jamais cette couche.',
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
                    'Choisissez un scénario LogCraft avec seed, lancez le pipeline et utilisez des preuves reproductibles pour régler InSight.',
                launchAndStart: 'Lancer le scénario InSight',
                launchPaused: 'Créer le pipeline en pause',
            },
        },
        backToHome: 'Retour à CodeRoast',
        backToScenarios: 'Retour aux scénarios',
        live: 'Live',
        selectScenario: 'Choisissez un scénario',
        selectScenarioDesc:
            'Chaque scénario est une topologie synthétique qui nourrit InSight. Choisissez, éditez si besoin, puis lancez le pipeline.',
        launchEngine: 'Lancer le Moteur',
        runDemo: 'Run Demo',
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
            title: 'Sink de démo LogCraft',
            caption:
                'Toute sortie avec un champ name: est interceptée par le serveur et capturée ici — qu\'il s\'agisse d\'une sortie fichier, console ou HTTP. Le serveur les redirige vers un drain interne pour que vous voyiez les payloads bruts exactement comme ils seraient arrivés à un vrai collecteur.',
            empty: 'Aucun record capturé pour le moment. Démarrez le moteur — toute sortie nommée (name: dans le YAML du scénario) apparaîtra ici.',
            targets: 'Capturé pour',
            noTargets: 'Aucune sortie HTTP de démo détectée dans ce scénario.',
            droppedSuffix: ' record(s) plus ancien(s) ont été abandonnés pour borner le buffer.',
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
            detectEmptyBody: "Les signaux de détection apparaissent quand InSight ferme une fenêtre MetaLog et trouve un pattern statistiquement anormal.",
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
            configLlmHost: 'Narration envoyée à',
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
            configLlmUnavailableWhy: 'La narration est inactive parce que ce déploiement ne nomme aucune destination pour elle. Ce n\'est pas une fonctionnalité manquante : le rapport est calculé ici dans tous les cas, et rien n\'est envoyé nulle part tant qu\'un opérateur n\'a pas inscrit un endpoint dans la config du moteur. L\'activer est une décision de déploiement, pas un interrupteur de ce panneau.',
            configLlmModelLabel: 'Modèle LLM',
            configLlmModelNone: 'Aucun (mode règles)',
            configLlmFull: 'Mode LLM complet',
            configReconfigureHint: 'Les modifications des réglages explain prennent effet immédiatement. La modification de la durée de fenêtre réinitialise le chauffage de la pyramide.',
            templatesTitle: 'Focus templates',
            templatesEmptyTitle: 'Aucun focus template',
            templatesEmptyBody: 'Les templates affectés apparaissent quand une explication nomme les patterns de logs impliqués.',
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
        playToTarget: 'Jouer jusqu\'à la cible',
        playingToTarget: 'En train de jouer jusqu\'à la cible…',
        targetSeconds: 'Secondes cible',
        websocketNotConnected: 'Le WebSocket n\'est pas encore connecté.',
        mode: 'Mode',
        clock: 'Horloge',
        playback: 'Lecture',
        speed: 'Vitesse',
        cascade: 'Panne en cascade',
        cascadeTip:
            'Force un cycle d\'évaluation de panne en cascade. Les agents en panne propagent la dégradation à leurs appelants selon le rayon / l\'atténuation du scénario. Idéal pour montrer "une DB qui entraîne tout le reste".',
        rate: 'Cadence',
        rateTip:
            'Records par seconde émis par cet agent. Augmentez pour stresser les alertes ; descendez à 0 pour faire taire l\'agent sans arrêter le moteur.',
        errorsTip:
            'Part de records marqués comme erreurs (0–100%). Force une panne sans toucher au YAML.',
        burst: 'Rafale',
        burstTip: 'Émet immédiatement N records de plus. Pour saturer les buffers de l\'agrégateur.',
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
            'Nécessite le palier {tier}. Changez d\'utilisateur (en haut à droite) pour un palier supérieur.',
        lockedOperationRequired:
            'Nécessite la capacité {operation}. Changez d\'utilisateur (en haut à droite) pour accéder à ce contrôle.',
        seededAgentOwned:
            'Déterminisme rompu : cet agent ne reflète plus le scénario avec seed.',
        seedDeterminismWarning:
            'Ce scénario utilise une seed pour une reproduction déterministe. {action} cassera ce déterminisme — les ré-exécutions ne produiront plus des logs identiques.',
        seedActionUnlock: 'Prendre la main sur un agent',
        seedActionBurst: 'Déclencher une rafale',
        seedActionCascade: 'Forcer une évaluation de panne en cascade',
        seedConfirmTitle: 'Scénario avec seed — attention',
        seedConfirmProceed: 'Procéder quand même',
        seedConfirmCancel: 'Annuler',
        leaveEngineTitle: 'Quitter le lab ?',
        leaveEngineBody:
            "Votre moteur sera arrêté et détruit. Le quota de runs déjà consommé ne sera pas restauré.",
        leaveEngineProceed: 'Quitter quand même',
        leaveEngineCancel: 'Rester',
        leaveEngineDismiss: 'Ignorer',

        filters: 'Filtres',
        filterAllLevels: 'Tous niveaux',
        filterAllAgents: 'Tous agents',
        filterSearch: 'Rechercher dans les messages…',
        filterClear: 'Effacer les filtres',
        firstVisitTitle: 'Bienvenue dans le Playground InSight',
        firstVisitBody:
            'C\'est une démo InSight live alimentée par des logs synthétiques. Choisissez un scénario à gauche, lancez-le, et regardez InSight transformer le flux en explications. Rien de réel n\'est ingéré — chaque ligne est générée pour la démo, et le moteur tourne sur notre serveur, pas dans votre onglet. Ça, c\'est la démo ; le produit, lui, tourne sur votre infrastructure.',
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
                    desc: 'J’ai besoin d’une panne en cascade crédible à montrer en réunion dans 5 minutes.',
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
                    desc: 'Plusieurs services + incidents scriptués + panne en cascade activée. Du matériel de démo.',
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
