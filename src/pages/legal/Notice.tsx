import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Building2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useStore } from '@/store/useStore'
import { Rich, Section } from './LegalText'

interface NoticeCopy {
    title: string
    blocks: { title: string; lines: string[] }[]
}

const COPY: Record<'en' | 'fr', NoticeCopy> = {
    en: {
        title: 'Legal notice',
        blocks: [
            {
                title: 'Publisher',
                lines: [
                    'Emmanuel Prunet, sole trader (*entrepreneur individuel*), trading as CodeRoast',
                    'SIREN 102 485 463 · SIRET 102 485 463 00016 · APE 62.01Z, computer programming',
                    'Tour 6 La Galice, 30 allée Granados, 13008 Marseille, France',
                    'Phone: +33 6 23 28 28 10 · E-mail: contact@coderoast.fr',
                ],
            },
            { title: 'Publication director', lines: ['Emmanuel Prunet'] },
            {
                title: 'Server and data hosting',
                lines: [
                    'OVH SAS, French simplified joint-stock company with a capital of €50,000,000, RCS Lille Métropole 424 761 419 00045',
                    '2 rue Kellermann, 59100 Roubaix, France',
                    'Phone: 1007 (from France) or +33 9 72 10 10 07',
                ],
            },
            {
                title: 'Website hosting',
                lines: [
                    'Netlify, Inc.',
                    '101 2nd Street, San Francisco, CA 94105, United States',
                    'Contact: privacy@netlify.com',
                ],
            },
            {
                title: 'Contact',
                lines: [
                    'General and personal-data questions: contact@coderoast.fr',
                    'Security: security@coderoast.fr',
                ],
            },
        ],
    },
    fr: {
        title: 'Mentions légales',
        blocks: [
            {
                title: 'Éditeur du site',
                lines: [
                    'Emmanuel Prunet, entrepreneur individuel, exerçant sous le nom CodeRoast',
                    'SIREN 102 485 463 · SIRET 102 485 463 00016 · APE 62.01Z, programmation informatique',
                    'Tour 6 La Galice, 30 allée Granados, 13008 Marseille, France',
                    'Téléphone : 06 23 28 28 10 · E-mail : contact@coderoast.fr',
                ],
            },
            { title: 'Directeur de la publication', lines: ['Emmanuel Prunet'] },
            {
                title: 'Hébergement du serveur et des données',
                lines: [
                    'OVH SAS, SAS au capital de 50 000 000 €, RCS Lille Métropole 424 761 419 00045',
                    '2 rue Kellermann, 59100 Roubaix, France',
                    'Téléphone : 1007 (depuis la France) ou +33 9 72 10 10 07',
                ],
            },
            {
                title: 'Hébergement du site web',
                lines: [
                    'Netlify, Inc.',
                    '101 2nd Street, San Francisco, CA 94105, États-Unis',
                    'Contact : privacy@netlify.com',
                ],
            },
            {
                title: 'Contact',
                lines: [
                    'Questions générales et données personnelles : contact@coderoast.fr',
                    'Sécurité : security@coderoast.fr',
                ],
            },
        ],
    },
}

export default function Notice() {
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
                                <Building2 className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                Legal & Security
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-12">
                            {copy.title}
                        </h1>

                        <div className="prose-sm max-w-none">
                            {copy.blocks.map((block) => (
                                <Section key={block.title} title={block.title}>
                                    <p>
                                        {block.lines.map((line, index) => (
                                            <span key={line}>
                                                {index > 0 && <br />}
                                                <Rich text={line} />
                                            </span>
                                        ))}
                                    </p>
                                </Section>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
