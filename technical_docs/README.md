# CodeRoastWeb Technical Documentation

This folder documents the CodeRoast website, LogCraft Playground, and Insight Playground clients. The app is no longer only a portfolio page: it is also the browser control surface for live LogCraft engines and server-side InSight explanations.

## Read Order

1. [architecture.md](architecture.md) - routes, component boundaries, state stores, REST/WebSocket client model, Lab lifecycle.
2. [deployment.md](deployment.md) - local dev, build, Netlify, `VITE_API_BASE`, Vite proxy, and backend expectations.
3. [i18n.md](i18n.md) - EN/FR translation structure, type safety, and locale workflow.
4. [theming.md](theming.md) - dark-first UI system, Tailwind brand palette, animations, and design constraints.

## AI Quick Path

For a fast pass, read:

1. [architecture.md](architecture.md#system-overview)
2. [deployment.md](deployment.md#api-configuration)
3. [../../coderoast-server/technical_docs/api/server_api_contract.md](../../coderoast-server/technical_docs/api/server_api_contract.md)
4. [../../logcraft/technical_docs/reference/scenario_reference.md](../../logcraft/technical_docs/reference/scenario_reference.md)
5. [../../technical_docs/product/strategy.md](../../technical_docs/product/strategy.md)

That path explains what the site renders, how the Lab talks to CodeRoastServer, what scenario YAML means, and how InSight reports are surfaced.

## Cross-Project Map

| Project | Role | Start here |
|---|---|---|
| CodeRoast parent docs | Cross-repo product strategy, architecture, operations, compatibility, and roadmap. | [../../technical_docs/README.md](../../technical_docs/README.md) |
| CodeRoastWeb | Public website plus browser LogCraft and Insight playgrounds | This folder |
| LogCraft | Engine package and scenario DSL | [../../logcraft/technical_docs/README.md](../../logcraft/technical_docs/README.md) |
| CodeRoastServer | Backend API, RBAC, auth, persistence, and WebSocket snapshots | [../../coderoast-server/technical_docs/README.md](../../coderoast-server/technical_docs/README.md) |
| InSight split repos | Analysis packages behind the server reports consumed by the Lab | [../../insight-eidos/technical_docs/README.md](../../insight-eidos/technical_docs/README.md) |
| logcraft-playground | LogCraft Playground CLI and scenario catalog consumed by the backend | [../../coderoast-hub/logcraft-playground/README.md](../../coderoast-hub/logcraft-playground/README.md) |

## Maintenance Rules

- When adding or changing a route, update [architecture.md](architecture.md#route-map).
- When changing API routes or WebSocket payloads, update CodeRoastServer's [server_api_contract.md](../../coderoast-server/technical_docs/api/server_api_contract.md) and this folder's [architecture.md](architecture.md#logcraft-lab-data-flow).
- When changing `VITE_API_BASE`, proxy behavior, or hosting, update [deployment.md](deployment.md).
- When adding visible copy, update both `src/i18n/en.ts` and `src/i18n/fr.ts`, then update [i18n.md](i18n.md) if the structure changes.
- When changing global colors, motion, or dark-mode assumptions, update [theming.md](theming.md).
- Product strategy, deployment strategy, and roadmap changes belong in [../../technical_docs](../../technical_docs/README.md), not this folder.
