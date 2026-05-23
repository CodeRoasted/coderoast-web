# coderoast-web — CLAUDE.md

> The global C++ / concurrency / determinism rules in the root CLAUDE.md do NOT
> apply here — this module is TypeScript. Only repo-wide conventions carry over.

## Module: Web Frontend — Control/UI Plane
Vite + React/Vue + TypeScript. Consumes REST API from coderoast-server.

## Constraints
- No business logic in frontend; only fetch and render
- Auth: JWT from server; refresh on 401
- State: React/Vue state only; no persistence without explicit API call
- UI must reflect server state; no local divergence

## Build & Run
```
npm install && npm run dev
npm run build && npm run preview
npm test && npm run lint
```
