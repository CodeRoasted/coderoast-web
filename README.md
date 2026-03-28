# CodeRoast Website

Portfolio website showcasing CodeRoast developer tools — **Insight**, **LogCraft**, and **Insight Playground**.

## Quick Start

```bash
# MSYS2 / MinGW64 (automated)
bash setup.sh

# Manual
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18, TypeScript 5 (strict) |
| Build | Vite 6 |
| Styling | TailwindCSS 3, custom `brand` palette |
| Animations | Framer Motion 11 |
| State | Zustand 5 |
| Routing | React Router v6 |
| Icons | lucide-react |
| Fonts | Inter, Space Grotesk (Google Fonts) |

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx       # Fixed nav with mobile menu
│   ├── Hero.tsx         # Full-screen hero + particle background
│   ├── ParticleBackground.tsx  # Interactive canvas particle system
│   ├── Portfolio.tsx    # App grid section
│   ├── AppCard.tsx      # Single app card (reusable)
│   ├── ComingSoon.tsx   # Placeholder section for future tools
│   ├── Donation.tsx     # BuyMeACoffee integration
│   ├── Licensing.tsx    # Pricing/plans section (placeholder)
│   ├── Footer.tsx       # Footer with social links
│   ├── ThemeToggle.tsx  # Dark / light mode button
│   └── LanguageToggle.tsx   # EN / FR language switch
├── pages/
│   └── Home.tsx         # Main page — composes all sections
├── store/
│   └── useStore.ts      # Global state (theme, language)
├── i18n/
│   └── translations.ts  # All EN + FR copy in one file
├── hooks/
│   └── useTranslation.ts  # Returns typed translation object for current language
├── App.tsx              # Router root + theme initialisation
├── main.tsx             # React DOM entry point
└── index.css            # Tailwind directives + global styles
```

## Features

- **Bilingual** — full EN/FR support, instant toggle, no page reload
- **Dark / light mode** — respects system preference, toggled via Zustand
- **Particle hero** — mouse-reactive canvas animation
- **Lazy-loaded sections** — Portfolio, ComingSoon, Donation, Licensing are code-split
- **Responsive** — mobile-first, hamburger menu on small screens
- **Accessible** — semantic HTML, ARIA labels, `prefers-color-scheme` support

## Adding a New App Card

1. Add translations in `src/i18n/translations.ts` (both `en` and `fr` blocks).
2. Import an icon from `lucide-react` and add an entry to the `apps` array in `src/components/Portfolio.tsx`.
3. Done — the `AppCard` component handles layout, status badge, and animations automatically.

## Adding a New Page / Route

1. Create `src/pages/MyPage.tsx`.
2. Add a `<Route>` in `src/App.tsx`.
3. Add a nav link entry in `src/components/Navbar.tsx` and the corresponding translation keys.

## Environment

Node.js ≥ 18 required (installed via `pacman -S mingw-w64-x86_64-nodejs` in MSYS2).  
All paths use forward slashes — POSIX-compatible with MSYS2 / MinGW64.

## Links

- Donations: https://buymeacoffee.com/coderoast
- Technical docs: [`technical_docs/`](technical_docs/)
