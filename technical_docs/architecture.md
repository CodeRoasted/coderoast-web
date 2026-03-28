# Architecture

## Overview

CodeRoast Website is a single-page application (SPA) built with React 18 and Vite. All sections live on one route (`/`); navigation uses same-page anchor scrolling.

## Component Tree

```
App
└── BrowserRouter
    └── Home (page)
        ├── Navbar
        │   ├── LanguageToggle
        │   └── ThemeToggle
        ├── Hero
        │   └── ParticleBackground   (canvas, pointer-events: none)
        ├── Portfolio                 (lazy)
        │   └── AppCard × N
        ├── ComingSoon               (lazy)
        ├── Donation                 (lazy)
        ├── Licensing                (lazy)
        └── Footer
```

## Data Flow

```
useStore (Zustand)
├── theme: 'light' | 'dark'   →  document.documentElement.classList ('dark')
└── language: 'en' | 'fr'     →  useTranslation() hook
                                   └── translations[language]  (typed object)
```

State lives entirely in `useStore`. No props are drilled for theme or language — every component that needs them calls `useStore` or `useTranslation` directly.

## Code Splitting

Four heavy sections are loaded lazily via `React.lazy` + `Suspense` in `Home.tsx`:

```
dist/assets/Portfolio-*.js
dist/assets/ComingSoon-*.js
dist/assets/Donation-*.js
dist/assets/Licensing-*.js
```

This keeps the initial bundle (Hero + Navbar + core libs) fast.

## Key Design Decisions

| Decision | Reason |
|---|---|
| Vite over CRA/Next.js | Fastest dev HMR, no SSR complexity needed for a portfolio |
| Zustand over Redux | Zero-boilerplate, perfect for 2 global values (theme, lang) |
| TailwindCSS `darkMode: 'class'` | Controlled programmatically via Zustand, not just media query |
| `framer-motion` `whileInView` | Scroll-triggered entrance animations without IntersectionObserver boilerplate |
| Canvas particles (no library) | Keeps bundle small; full control over mouse interactivity |
| `@` path alias | Clean imports: `@/components/Navbar` instead of `../../components/Navbar` |

## TypeScript Strict Mode

`tsconfig.json` enables full strict mode including `noUncheckedIndexedAccess`. The translation system uses TypeScript inference from the `translations.en` object to provide full autocomplete on `t.nav.home`, `t.hero.tagline`, etc., without manually maintaining separate interfaces.
