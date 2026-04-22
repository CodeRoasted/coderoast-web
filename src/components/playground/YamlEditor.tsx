import { useMemo } from 'react'
import CodeMirror, { type ReactCodeMirrorProps } from '@uiw/react-codemirror'
import { yaml } from '@codemirror/lang-yaml'
import { oneDark } from '@codemirror/theme-one-dark'
import { lintGutter, linter, type Diagnostic } from '@codemirror/lint'
import { EditorView } from '@codemirror/view'

export interface YamlEditorProps {
    value: string
    onChange: (value: string) => void
    /** Validation errors from the backend, shown as inline gutter markers. */
    errors?: string[]
    placeholder?: string
    /** Minimum height in CSS units (e.g. "300px"). */
    minHeight?: string
    /** Make the editor read-only (used for "loaded scenario" preview). */
    readOnly?: boolean
}

/**
 * YAML editor that stays simple by default (looks like a styled textarea
 * with line numbers and syntax colors) but stays expert-friendly:
 *   - YAML syntax highlighting + bracket matching
 *   - Backend validation errors shown as gutter markers
 *   - Drag-to-resize via the wrapper's overflow rules
 *
 * Built on CodeMirror 6 (~150 KB gzipped) instead of Monaco (~2 MB) to
 * keep the Lab bundle lean. Works in Vite + React without ESM hoops.
 */
export default function YamlEditor({
    value,
    onChange,
    errors = [],
    placeholder,
    minHeight = '320px',
    readOnly = false,
}: YamlEditorProps) {
    const extensions = useMemo<ReactCodeMirrorProps['extensions']>(() => {
        // Convert backend validation errors into Diagnostics anchored to the
        // first non-empty line. Backend errors don't carry positions today,
        // so we surface them at line 1 rather than guessing.
        const errorLinter = linter(() => {
            if (errors.length === 0) return []
            const diagnostics: Diagnostic[] = errors.map((message) => ({
                from: 0,
                to: Math.min(value.length, 1),
                severity: 'error',
                message,
            }))
            return diagnostics
        })

        const baseTheme = EditorView.theme({
            '&': {
                fontSize: '12px',
                backgroundColor: 'transparent',
            },
            '.cm-scroller': {
                fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                lineHeight: '1.55',
            },
            '.cm-gutters': {
                backgroundColor: 'rgba(17, 24, 39, 0.4)',
                borderRight: '1px solid rgba(55, 65, 81, 0.4)',
                color: '#4b5563',
            },
            '.cm-content': {
                caretColor: '#fb923c',
            },
            '.cm-activeLine': {
                backgroundColor: 'rgba(251, 146, 60, 0.04)',
            },
            '.cm-activeLineGutter': {
                backgroundColor: 'rgba(251, 146, 60, 0.08)',
                color: '#fb923c',
            },
        })

        return [
            yaml(),
            oneDark,
            baseTheme,
            lintGutter(),
            errorLinter,
            EditorView.lineWrapping,
        ]
    }, [errors, value.length])

    return (
        <div
            className="flex-1 min-h-0 w-full overflow-hidden rounded-xl border border-gray-700/50 bg-gray-900/50 focus-within:ring-2 focus-within:ring-brand-500/40 focus-within:border-brand-500/60 transition-shadow"
            style={{ minHeight }}
        >
            <CodeMirror
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                extensions={extensions}
                readOnly={readOnly}
                theme="dark"
                height="100%"
                style={{ height: '100%', minHeight }}
                basicSetup={{
                    lineNumbers: true,
                    highlightActiveLine: true,
                    highlightActiveLineGutter: true,
                    foldGutter: true,
                    autocompletion: false,
                    bracketMatching: true,
                    closeBrackets: true,
                    indentOnInput: true,
                    tabSize: 2,
                }}
            />
        </div>
    )
}
