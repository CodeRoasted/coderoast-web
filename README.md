# CodeRoast Website

CodeRoastWeb is the public website and browser Lab for the CodeRoast stack. It presents LogCraft and InSight, and it lets users run live LogCraft scenarios from the browser without installing the C++ backend locally.

## What It Contains

- Marketing and product pages for LogCraft, InSight, pricing, use cases, and legal content.
- LogCraft Playground (`/lab/logcraft`): scenario picker, YAML editor, engine lifecycle controls, live agent/sink metrics, log tail, drain inspection, onboarding, and tier-aware controls without InSight panels.
- Insight Playground (`/lab/insight`, also `/lab`): deterministic LogCraft scenarios with InSight status, reports, and explain views for regression/tuning work.
- Typed EN/FR translations.
- Dark-first Tailwind UI with Framer Motion and lucide icons.
- REST and WebSocket clients for the CodeRoastServer API.

## Quick Start

```sh
npm install
npm run dev
```

Open `http://localhost:5173`.

For the Lab, also run CodeRoastServer on `localhost:8080`; Vite proxies `/api/v1/*` and `/api/v1/ws/*` to it.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite dev server. |
| `npm run build` | Type-check and build production assets into `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm test` | Run Vitest once. |
| `npm run test:watch` | Run Vitest in watch mode. |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18, TypeScript 5 strict mode |
| Build | Vite 6 |
| Styling | Tailwind CSS 3, custom brand palette |
| Motion | Framer Motion 11 |
| Routing | React Router v6 |
| State | Zustand 5 |
| Editor | CodeMirror YAML editor |
| Tests | Vitest, Testing Library, jsdom |

## Project Layout

```text
CodeRoastWeb/
├── src/
│   ├── App.tsx                 # Router, auth bootstrap, dark-mode bootstrap
│   ├── pages/                  # Home, LogCraft, Lab, tiers, use cases, legal pages
│   ├── components/             # Shared UI plus Lab/dashboard components
│   ├── hooks/                  # Translation, engine lifecycle, onboarding
│   ├── i18n/                   # en/fr translation bundles
│   ├── services/               # REST and WebSocket clients
│   ├── store/                  # Zustand stores
│   ├── test/                   # Vitest suites
│   ├── types/                  # DTOs shared by services and UI
│   └── utils/                  # permissions and cookie helpers
├── technical_docs/             # Canonical technical documentation
├── public/                     # Static assets
├── netlify.toml                # Static hosting config
├── vite.config.ts              # Vite aliases, proxy, Vitest config
└── package.json
```

## Documentation Map

| Document | Contents |
|---|---|
| [../technical_docs/README.md](../technical_docs/README.md) | Cross-repo status, compatibility, and roadmap entry point. |
| [technical_docs/README.md](technical_docs/README.md) | Read order and cross-project links. |
| [technical_docs/architecture.md](technical_docs/architecture.md) | Routes, state, REST/WebSocket flow, Lab lifecycle. |
| [technical_docs/deployment.md](technical_docs/deployment.md) | Local dev, build, Netlify, `VITE_API_BASE`. |
| [technical_docs/i18n.md](technical_docs/i18n.md) | Typed EN/FR translation workflow. |
| [technical_docs/theming.md](technical_docs/theming.md) | Dark-first Tailwind and brand system. |

## Cross-Project Links

- Parent roadmap: [../technical_docs/ROADMAP.md](../technical_docs/ROADMAP.md)
- LogCraft docs: [../logcraft/technical_docs/README.md](../logcraft/technical_docs/README.md)
- CodeRoastServer API contract: [../coderoast-server/technical_docs/api/server_api_contract.md](../coderoast-server/technical_docs/api/server_api_contract.md)
- InSight docs: [../insight-eidos/technical_docs/README.md](../insight-eidos/technical_docs/README.md)
- LogCraft Playground: [../logcraft-playground/README.md](../logcraft-playground/README.md)

## Deployment

The app is a static SPA. Netlify uses `npm run build` and publishes `dist/`. Production API routing is configured with `VITE_API_BASE`, currently `https://api.coderoast.fr/api/v1` in `netlify.toml`.

Before deploying:

```sh
npm test
npm run lint
npm run build
```
