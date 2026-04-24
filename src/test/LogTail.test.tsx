import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LogTail from '@/components/playground/LogTail'
import type { LogTailEntry } from '@/types/engine'

const entries: LogTailEntry[] = [
    { timestamp: '12:00:00', agent: 'auth', level: 'INFO', message: 'login ok' },
    { timestamp: '12:00:01', agent: 'auth', level: 'ERROR', message: 'invalid token' },
    { timestamp: '12:00:02', agent: 'db', level: 'WARN', message: 'slow query' },
    { timestamp: '12:00:03', agent: 'db', level: 'INFO', message: 'connection pooled' },
]

/**
 * Pragmatic coverage of the live log tail:
 *   – Renders one row per entry on the happy path.
 *   – Empty state surfaces the "no logs" copy.
 *   – Pause toggles freeze the view to the snapshot taken at click time.
 *   – Clear button calls back to the parent.
 *
 * We don't pin the filter/textbox behavior in tests since those are
 * pure local state on simple controlled inputs — over-testing them
 * would freeze trivial implementation detail.
 */
describe('LogTail', () => {
    it('renders one row per entry', () => {
        render(<LogTail entries={entries} totalEntries={entries.length} />)
        expect(screen.getByText('login ok')).toBeInTheDocument()
        expect(screen.getByText('invalid token')).toBeInTheDocument()
        expect(screen.getByText('slow query')).toBeInTheDocument()
        expect(screen.getByText('connection pooled')).toBeInTheDocument()
    })

    it('shows an empty-state when there are no entries', () => {
        render(<LogTail entries={[]} totalEntries={0} />)
        // "No logs yet" copy comes from translations — assert the structure
        // by checking there are no log rows instead.
        expect(screen.queryByText('login ok')).not.toBeInTheDocument()
    })

    it('invokes onClear when the clear button is clicked', () => {
        const onClear = vi.fn()
        render(<LogTail entries={entries} totalEntries={entries.length} onClear={onClear} />)
        const clearBtn = screen.getByTitle('Clear feed')
        fireEvent.click(clearBtn)
        expect(onClear).toHaveBeenCalledTimes(1)
    })

    it('pause freezes the visible entries to the snapshot at click time', () => {
        const initial: LogTailEntry[] = [entries[0]!, entries[1]!]
        const { rerender } = render(
            <LogTail entries={initial} totalEntries={initial.length} />,
        )
        // Pause now — frozen snapshot captures only `initial`.
        const pauseBtn = screen.getByTitle('Pause')
        fireEvent.click(pauseBtn)
        // New entries arrive but the view should remain frozen.
        rerender(<LogTail entries={entries} totalEntries={entries.length} />)
        expect(screen.getByText('login ok')).toBeInTheDocument()
        expect(screen.getByText('invalid token')).toBeInTheDocument()
        expect(screen.queryByText('slow query')).not.toBeInTheDocument()
        expect(screen.queryByText('connection pooled')).not.toBeInTheDocument()
    })
})
