# CodeRoastWeb Technical Documentation

This folder documents the CodeRoast website and LogCraft Lab client. The app is no longer only a portfolio page: it is also the browser control surface for live LogCraft engines.

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
5. [../../insight-eidos/technical_docs/product/strategy.md](../../insight-eidos/technical_docs/product/strategy.md)
6. Parent [ROADMAP.md](../../technical_docs/ROADMAP.md#next-step)

That path explains what the site renders, how the Lab talks to CodeRoastServer, what scenario YAML means, and where InSight fits next.

## Cross-Project Map

| Project | Role | Start here |
|---|---|---|
| CodeRoast parent docs | Cross-repo status, compatibility, and roadmap. | [../../technical_docs/README.md](../../technical_docs/README.md) |
| CodeRoastWeb | Public website plus browser LogCraft Lab | This folder |
| LogCraft | Engine package and scenario DSL | [../../logcraft/technical_docs/README.md](../../logcraft/technical_docs/README.md) |
| CodeRoastServer | Backend API, RBAC, auth, persistence, and WebSocket snapshots | [../../coderoast-server/technical_docs/README.md](../../coderoast-server/technical_docs/README.md) |
| InSight split repos | Future consumer views for MetaLog, detection, and explanation | [../../insight-eidos/technical_docs/README.md](../../insight-eidos/technical_docs/README.md) |
| logcraft-scenario-library | Scenario YAML catalog consumed by the backend | [../../logcraft-scenario-library/README.md](../../logcraft-scenario-library/README.md) |

## Maintenance Rules

- When adding or changing a route, update [architecture.md](architecture.md#route-map).
- When changing API routes or WebSocket payloads, update CodeRoastServer's [server_api_contract.md](../../coderoast-server/technical_docs/api/server_api_contract.md) and this folder's [architecture.md](architecture.md#logcraft-lab-data-flow).
- When changing `VITE_API_BASE`, proxy behavior, or hosting, update [deployment.md](deployment.md).
- When adding visible copy, update both `src/i18n/en.ts` and `src/i18n/fr.ts`, then update [i18n.md](i18n.md) if the structure changes.
- When changing global colors, motion, or dark-mode assumptions, update [theming.md](theming.md).
- Product roadmap changes belong in [../../technical_docs/ROADMAP.md](../../technical_docs/ROADMAP.md), not this folder.
