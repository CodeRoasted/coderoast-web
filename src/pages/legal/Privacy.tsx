import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useStore } from '@/store/useStore'
import { LEGAL_LAST_UPDATED } from './legalDate'
import { Rich, Section } from './LegalText'

interface PrivacyCopy {
    title: string
    lastUpdated: string
    inShortTitle: string
    inShort: string
    responsibleTitle: string
    responsible: string
    keptTitle: string
    keptHead: [string, string, string, string]
    kept: [string, string, string, string][]
    keptAfter: string
    cookiesTitle: string
    cookies: string[]
    cookiesAfter: string
    recipientsTitle: string
    recipients: string[]
    recipientsAfter: string
    modelsTitle: string
    models: string
    rightsTitle: string
    rights: string
    changesTitle: string
    changes: string
}

const COPY: Record<'en' | 'fr', PrivacyCopy> = {
    en: {
        title: 'Privacy policy',
        lastUpdated: `Last updated: ${LEGAL_LAST_UPDATED}`,
        inShortTitle: 'In short',
        inShort:
            'CodeRoast has no analytics, no advertising and no third-party scripts, and sells no data. There are no user accounts today. The site keeps what it needs to run and to stay secure, and every store deletes it by age, on the periods below.',
        responsibleTitle: 'Who is responsible',
        responsible:
            'Emmanuel Prunet, entrepreneur individuel, trading as CodeRoast, Tour 6 La Galice, 30 allée Granados, 13008 Marseille, France. Contact for any privacy request: contact@coderoast.fr. See the [legal notice](/legal/notice).',
        keptTitle: 'What we keep, why, and for how long',
        keptHead: ['Data', 'Why', 'Kept for', 'Legal basis'],
        kept: [
            ['Audit trail of actions on the server, which can include your IP address', 'Security and abuse investigation', '12 months', 'Legitimate interest: securing the service'],
            ['Server access logs on the host (SSH, intrusion prevention)', 'Security', '12 months', 'Legitimate interest: securing the service'],
            ['Application, web server and system logs, which contain IP addresses and request paths', 'Running the service, security', '30 days at most', 'Legitimate interest: running and securing the service'],
            ['Database engine logs', 'Running the service', '30 days at most', 'Legitimate interest: running the service'],
            ['A Lab session', 'Running your session', '1 hour', 'Legitimate interest: providing the Lab you asked for'],
            ['Usage counters tied to your IP address', 'Fair use of the free Lab', '48 hours (daily), 60 days (monthly)', 'Legitimate interest: preventing abuse'],
            ['A database dump taken for a migration', 'Rolling back a failed migration', 'Until verified, 30 days at most', 'Legitimate interest: protecting the service'],
            ['E-mail you send us', 'Replying to you', 'Deleted once the exchange is over, 3 years after the last exchange at most', 'Legitimate interest: answering you'],
        ],
        keptAfter:
            'The scenarios you run in the Lab and the logs they generate are held in memory for your session. They are never written to a persistent store, and they are discarded when your session ends.',
        cookiesTitle: 'Cookies and browser storage',
        cookies: [
            '`logcraft_onboarding_dismissed`, a cookie kept for 12 months, remembers that you have seen the Lab onboarding.',
            "If you sign in, your sign-in state stays in your browser's local storage until you log out or your token is refused.",
        ],
        cookiesAfter:
            'Both are strictly necessary for what you asked for, so no consent banner is required. We set no marketing, analytics or tracking cookies. You can reset the cookie through the preferences link in the footer, or clear both in your browser.',
        recipientsTitle: 'Who receives data',
        recipients: [
            '**OVH SAS** (France) hosts the server and our mailboxes.',
            "**Netlify, Inc.** (United States) hosts this website and serves its pages. Your IP address reaches Netlify when you load a page, and its own policy governs the logs it keeps, which we do not control. This is a transfer outside the EU, under Netlify's participation in the EU-US Data Privacy Framework.",
        ],
        recipientsAfter:
            'The site loads its assets from its own origin. Nobody else receives your data, and we sell nothing.',
        modelsTitle: 'Models',
        models:
            'InSight can optionally narrate a finished report through a language model. That option is not enabled on this Lab: the engine names no destination for it, and the analysis itself is deterministic and never involves a model. If you run InSight on your own infrastructure and point narration at a provider, that provider is your own choice and your own relationship.',
        rightsTitle: 'Your rights',
        rights:
            'Under the GDPR you can ask to access, correct or erase your data, restrict or object to its processing, or receive it in a portable form. Write to contact@coderoast.fr. Because we hold no accounts, we may need the date and approximate time of your visit and your IP address to find anything. You can complain to the French regulator, the [CNIL](https://www.cnil.fr/).',
        changesTitle: 'Changes',
        changes:
            'If we add accounts, analytics or any new collection, we will update this page before it takes effect.',
    },
    fr: {
        title: 'Politique de confidentialité',
        lastUpdated: `Dernière mise à jour : ${LEGAL_LAST_UPDATED}`,
        inShortTitle: 'En bref',
        inShort:
            "CodeRoast n'utilise ni outil d'analyse, ni publicité, ni script tiers, et ne vend aucune donnée. Il n'existe aucun compte utilisateur à ce jour. Le site conserve ce qui lui sert à fonctionner et à rester sûr, et chaque stockage supprime ces données selon les durées ci-dessous.",
        responsibleTitle: 'Responsable du traitement',
        responsible:
            'Emmanuel Prunet, entrepreneur individuel, exerçant sous le nom CodeRoast, Tour 6 La Galice, 30 allée Granados, 13008 Marseille, France. Contact pour toute demande : contact@coderoast.fr. Voir les [mentions légales](/legal/notice).',
        keptTitle: 'Ce que nous conservons, pourquoi et combien de temps',
        keptHead: ['Données', 'Finalité', 'Durée', 'Base légale'],
        kept: [
            ["Journal d'audit des actions sur le serveur, pouvant inclure votre adresse IP", 'Sécurité, enquête sur les abus', '12 mois', 'Intérêt légitime : sécuriser le service'],
            ["Journaux d'accès de l'hôte (SSH, prévention des intrusions)", 'Sécurité', '12 mois', 'Intérêt légitime : sécuriser le service'],
            ['Journaux applicatifs, du serveur web et du système, contenant adresses IP et chemins de requête', 'Fonctionnement, sécurité', '30 jours au plus', 'Intérêt légitime : faire fonctionner et sécuriser le service'],
            ['Journaux du moteur de base de données', 'Fonctionnement', '30 jours au plus', 'Intérêt légitime : faire fonctionner le service'],
            ['Une session du Lab', 'Faire fonctionner votre session', '1 heure', 'Intérêt légitime : fournir le Lab demandé'],
            ["Compteurs d'usage liés à votre adresse IP", 'Usage équitable du Lab gratuit', '48 heures (quotidien), 60 jours (mensuel)', 'Intérêt légitime : prévenir les abus'],
            ['Copie de base de données prise pour une migration', 'Revenir en arrière si elle échoue', "Jusqu'à vérification, 30 jours au plus", 'Intérêt légitime : protéger le service'],
            ['Les e-mails que vous nous envoyez', 'Vous répondre', "Supprimés à la fin de l'échange, 3 ans au plus après le dernier échange", 'Intérêt légitime : vous répondre'],
        ],
        keptAfter:
            "Les scénarios que vous exécutez dans le Lab et les journaux qu'ils génèrent restent en mémoire le temps de votre session. Ils ne sont jamais écrits dans un stockage persistant, et ils disparaissent à la fin de votre session.",
        cookiesTitle: 'Cookies et stockage du navigateur',
        cookies: [
            '`logcraft_onboarding_dismissed`, un cookie conservé 12 mois, retient que vous avez vu le tutoriel du Lab.',
            "Si vous vous connectez, l'état de connexion reste dans le stockage local de votre navigateur jusqu'à la déconnexion ou au refus du jeton.",
        ],
        cookiesAfter:
            "Ces deux éléments sont strictement nécessaires au service demandé, aucune bannière de consentement n'est donc requise. Nous ne déposons aucun cookie publicitaire, d'analyse ou de suivi. Vous pouvez réinitialiser le cookie par le lien des préférences en pied de page, ou effacer les deux dans votre navigateur.",
        recipientsTitle: 'Destinataires',
        recipients: [
            '**OVH SAS** (France) héberge le serveur et nos boîtes mail.',
            "**Netlify, Inc.** (États-Unis) héberge ce site et en sert les pages. Votre adresse IP parvient à Netlify lorsque vous chargez une page, et sa propre politique régit les journaux qu'elle conserve, que nous ne maîtrisons pas. Il s'agit d'un transfert hors de l'UE, dans le cadre de la participation de Netlify au Data Privacy Framework UE-États-Unis.",
        ],
        recipientsAfter:
            "Le site charge ses ressources depuis sa propre origine. Personne d'autre ne reçoit vos données, et nous ne vendons rien.",
        modelsTitle: 'Modèles',
        models:
            "InSight peut, en option, faire raconter un rapport terminé par un modèle de langage. Cette option n'est pas activée sur ce Lab : le moteur n'y désigne aucune destination, et l'analyse elle-même est déterministe et n'utilise jamais de modèle. Si vous exécutez InSight sur votre propre infrastructure et le raccordez à un fournisseur, ce choix et cette relation sont les vôtres.",
        rightsTitle: 'Vos droits',
        rights:
            "Le RGPD vous permet de demander l'accès à vos données, leur rectification, leur effacement, la limitation du traitement, de vous y opposer ou d'en recevoir une copie portable. Écrivez à contact@coderoast.fr. Comme nous n'avons pas de comptes, il nous faudra peut-être la date et l'heure approximatives de votre visite et votre adresse IP pour retrouver quoi que ce soit. Vous pouvez saisir l'autorité française, la [CNIL](https://www.cnil.fr/).",
        changesTitle: 'Évolutions',
        changes:
            'Si nous ajoutons des comptes, un outil d\'analyse ou une nouvelle collecte, nous mettrons cette page à jour avant leur entrée en vigueur.',
    },
}

export default function Privacy() {
    const language = useStore((state) => state.language)
    const copy = COPY[language]
    return (
        <div className="bg-gray-950 text-gray-100 min-h-screen">
            <Navbar />
            <main className="pt-24 pb-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors mb-8"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to CodeRoast
                        </Link>

                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-700/30">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                Legal & Security
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
                            {copy.title}
                        </h1>
                        <p className="text-sm text-gray-500 mb-4">{copy.lastUpdated}</p>

                        <div className="mb-12 rounded-xl bg-emerald-950/30 border border-emerald-800/40 p-5">
                            <p className="text-sm font-semibold text-emerald-300 mb-2">{copy.inShortTitle}</p>
                            <p className="text-sm text-gray-400 leading-relaxed">{copy.inShort}</p>
                        </div>

                        <div className="prose-sm max-w-none">
                            <Section title={copy.responsibleTitle}>
                                <p>
                                    <Rich text={copy.responsible} />
                                </p>
                            </Section>

                            <Section title={copy.keptTitle}>
                                <div className="rounded-xl border border-gray-800 overflow-x-auto mt-2">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-gray-800 bg-gray-900/60">
                                                {copy.keptHead.map((heading) => (
                                                    <th
                                                        key={heading}
                                                        className="px-4 py-2.5 text-left font-semibold text-gray-300"
                                                    >
                                                        {heading}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {copy.kept.map(([data, why, period, basis], index) => (
                                                <tr
                                                    key={data}
                                                    className={
                                                        index < copy.kept.length - 1
                                                            ? 'border-b border-gray-800/50'
                                                            : undefined
                                                    }
                                                >
                                                    <td className="px-4 py-3 text-gray-400">{data}</td>
                                                    <td className="px-4 py-3 text-gray-500">{why}</td>
                                                    <td className="px-4 py-3 text-gray-500">{period}</td>
                                                    <td className="px-4 py-3 text-gray-500">{basis}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p>{copy.keptAfter}</p>
                            </Section>

                            <Section title={copy.cookiesTitle}>
                                <ul className="list-disc list-inside space-y-1 pl-2">
                                    {copy.cookies.map((line) => (
                                        <li key={line}>
                                            <Rich text={line} />
                                        </li>
                                    ))}
                                </ul>
                                <p>{copy.cookiesAfter}</p>
                            </Section>

                            <Section title={copy.recipientsTitle}>
                                <ul className="list-disc list-inside space-y-1 pl-2">
                                    {copy.recipients.map((line) => (
                                        <li key={line}>
                                            <Rich text={line} />
                                        </li>
                                    ))}
                                </ul>
                                <p>{copy.recipientsAfter}</p>
                            </Section>

                            <Section title={copy.modelsTitle}>
                                <p>{copy.models}</p>
                            </Section>

                            <Section title={copy.rightsTitle}>
                                <p>
                                    <Rich text={copy.rights} />
                                </p>
                            </Section>

                            <Section title={copy.changesTitle}>
                                <p>{copy.changes}</p>
                            </Section>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
