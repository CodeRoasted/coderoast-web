/**
 * Locale-independent number rendering for every shipped surface.
 *
 * This lives here rather than beside one page because there must be exactly ONE
 * formatter: the policy below was ruled for `/diff`, and a second page reaching for
 * `toLocaleString()` is how the two surfaces come to disagree again.
 */

/**
 * Groups thousands with a non-breaking space, in BOTH languages: that is the grouping
 * the authored copy uses, and a headline figure must not read differently from the
 * sentence right beside it.
 *
 * Locale-independent, and the reason is the product, not typography. `toLocaleString()`
 * with no argument reads the VISITOR'S BROWSER, not the bundle that produced the prose
 * around it — so an FR-bundle visitor on an en-US browser read French sentences with US
 * separators, and one report rendered two ways depending on where it was opened. The
 * claim Sift sells is that output is a function of input; a shipped surface whose
 * rendering depends on the viewer's environment contradicts that in the one place a
 * buyer looks. `sift-action` already ruled this way for the PR comment (frame.ts, same
 * regex, ',' because that surface is English-only) — same rule here, so the shipped
 * surfaces no longer disagree about the policy.
 *
 * The separator is spelled as an ESCAPE, never a pasted literal: a U+00A0 in a source
 * file is invisible in review, and one editor's whitespace pass would silently collapse
 * it to an ordinary space — turning the policy off without touching anything a
 * reviewer could see.
 */
export function groupThousands(value: number): string {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')
}
