# CodeRoastWeb Theming

CodeRoastWeb is dark-first in practice. Tailwind still uses `darkMode: 'class'`, but `App` forces the `dark` class on `<html>` and `toggleTheme` is a no-op. Treat light mode as removed unless it is explicitly reintroduced as product work.

## Theme Runtime

```text
App mount -> document.documentElement.classList.add('dark')
Tailwind -> dark: variants active
useStore.theme -> currently 'dark' placeholder
```

`src/index.css` still defines body light/dark base classes because Tailwind's class strategy remains enabled. Components should assume the shipped surface is dark.

## Brand Palette

The `brand` scale lives in `tailwind.config.ts`.

| Token | Hex | Typical use |
|---|---|---|
| `brand-50` | `#fef3e2` | Rare light accents, not common in shipped dark UI. |
| `brand-100` | `#fde4b9` | Soft light accent. |
| `brand-200` | `#fcd48c` | Soft highlight. |
| `brand-300` | `#fbc35e` | Hover text on dark backgrounds. |
| `brand-400` | `#fab63c` | Accent icons, active states. |
| `brand-500` | `#f9a825` | Primary brand color and gradients. |
| `brand-600` | `#f57f17` | Primary buttons. |
| `brand-700` | `#ef6c00` | Darker gradient stop. |
| `brand-800` | `#e65100` | Deep accent. |
| `brand-900` | `#bf360c` | Dark accent panels. |

Use brand sparingly against the gray shell. Most surfaces use `gray-950`, `gray-900`, `gray-800`, and `gray-700` with brand accents for calls to action and important state.

## Typography

| Token | Stack | Use |
|---|---|---|
| `font-sans` | Inter, system-ui, sans-serif | Body text and dense UI. |
| `font-display` | Space Grotesk, system-ui, sans-serif | Headings, product names, major labels. |

Both families are served from the site's own origin: `src/assets/fonts/fonts.css` (imported by `src/main.tsx`) declares the faces, and the woff2 files sit beside it with each family's SIL OFL 1.1 `OFL.txt`. No page loads a font, stylesheet or preconnect from a third-party host — a font CDN would receive every visitor's IP address on every page view. The shipped set is Inter weights 300–700 and Space Grotesk weights 400–700, upright only (an `italic` class renders as the browser's synthesized oblique), in every unicode-range subset the families publish; a browser fetches a subset only when the page's text uses it. A new weight or style is added as a new face block and file, never by linking a hosted stylesheet.

Keep dashboard and Lab text compact. Reserve large display type for marketing sections and product pages.

## Motion

Tailwind custom animations:

| Class | Effect |
|---|---|
| `animate-float` | Slow vertical float. |
| `animate-glow` | Brand-colored shadow pulse. |
| `animate-slide-up` | One-shot entrance. |

Framer Motion handles scroll and panel transitions. Use it for route sections, modals, accordions, and animated presence. Avoid motion that shifts Lab data layout while the engine is running.

## Component Surface Rules

- Marketing sections can use larger spacing, gradients, and entrance motion.
- Lab/dashboard sections should be dense, predictable, and stable under frequent snapshot updates.
- Do not use cards inside cards for major page layout. Repeated items, modals, and framed tools are acceptable card surfaces.
- Use lucide icons for commands and feature labels.
- Keep buttons stable in size; snapshot updates must not move controls.
- Prefer neutral gray surfaces with brand accents over a one-note orange palette.

## Current Theme-Sensitive Components

| Component | Notes |
|---|---|
| `Navbar` / `ProductNavbar` | Fixed/sticky navigation, dark glass surfaces. |
| `Hero` / `ParticleBackground` | Marketing motion and canvas background. |
| `Playground` Lab components | Data-heavy dark UI; prioritize legibility and fixed dimensions. |
| `CookiePreferences` | Modal panel with required functional cookie state. |
| `TierLockModal` | Tier upsell/error surface; should keep required tier clear. |
| `YamlEditor` | CodeMirror editor; must stay readable on dark background. |

## Reintroducing Light Mode

Light mode is not currently supported despite `Theme = 'light' | 'dark'` existing in the store. To reintroduce it safely:

1. Implement `toggleTheme` in `useStore`.
2. Remove the unconditional `document.documentElement.classList.add('dark')` or make it conditional.
3. Audit every `bg-gray-*`, `text-gray-*`, border, CodeMirror, and modal class for light variants.
4. Add visual regression checks for `/`, `/logcraft`, `/lab`, `/tiers`, and legal pages.
5. Update this document and [architecture.md](architecture.md#state-model).

Until then, new components should be designed for the dark product surface.
