# coderoast-web — website + browser Lab (TypeScript)

> The root C++ / concurrency / determinism doctrine does NOT apply here — this
> repo is a React + TypeScript SPA. The repo-wide conventions (docs, git,
> planning) still do.

The public site and browser Lab: marketing/product pages plus the LogCraft and
InSight playground UIs, talking REST + WebSocket to `coderoast-server`.

## Arrival

- `npm run dev` (Vite, port 5173; proxies `/api/v1/*` and `/api/v1/ws/*` to a
  local server on 8080) · `npm test` (Vitest) · `npm run lint` ·
  `npm run build`.
- Layout: `src/pages/`, `src/components/`, `src/hooks/`, `src/services/`
  (REST + WebSocket clients), `src/store/` (Zustand), `src/i18n/` (typed EN/FR
  bundles), `src/types/` (DTOs).
- Docs: `technical_docs/README.md` — architecture, deployment (Netlify,
  `VITE_API_BASE`), i18n, theming.

## Constraints & traps

- The API contract is owned by
  the superproject checkout's `coderoast-server/technical_docs/api/server_api_contract.md` —
  `src/types/` mirrors it; never invent or fork DTO shapes here.
- Auth is a bearer token resolved to a server-side session
  (`src/services/api.ts`) — there is no JWT and no client-side refresh dance.
  The UI reflects server state; no business logic or local divergence in the
  frontend.
- Every user-facing string lands in BOTH typed translation bundles
  (`src/i18n/`) — the workflow is `technical_docs/i18n.md`.
- Dark-first Tailwind theming — follow `technical_docs/theming.md`, not ad-hoc
  colors.
