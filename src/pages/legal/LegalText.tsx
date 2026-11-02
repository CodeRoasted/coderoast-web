import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g

/**
 * Renders the copy's inline marks, the only ones it uses: **bold**, *italic*, `code` and
 * [text](url). A site path stays inside the router; any other target opens as an external link.
 */
export function Rich({ text }: { text: string }) {
    const parts = text.split(INLINE).filter((part) => part !== '')
    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('**')) {
                    return (
                        <strong key={index} className="text-gray-200">
                            {part.slice(2, -2)}
                        </strong>
                    )
                }
                if (part.startsWith('`')) {
                    return (
                        <code key={index} className="font-mono text-gray-300">
                            {part.slice(1, -1)}
                        </code>
                    )
                }
                const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
                if (link) {
                    const label = link[1] ?? ''
                    const target = link[2] ?? ''
                    const className = 'text-brand-400 hover:text-brand-300 transition-colors'
                    return target.startsWith('/') ? (
                        <Link key={index} to={target} className={className}>
                            {label}
                        </Link>
                    ) : (
                        <a key={index} href={target} target="_blank" rel="noopener noreferrer" className={className}>
                            {label}
                        </a>
                    )
                }
                if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
                    return <em key={index}>{part.slice(1, -1)}</em>
                }
                return <Fragment key={index}>{part}</Fragment>
            })}
        </>
    )
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="mb-10">
            <h2 className="text-lg font-display font-bold text-white mb-3">{title}</h2>
            <div className="space-y-3 text-sm text-gray-400 leading-relaxed">{children}</div>
        </div>
    )
}
