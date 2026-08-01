# CodeRoastWeb Deployment

Cross-product deployment topology and release order live in the internal workspace's `technical_docs/operations/deployment_strategy.md`, which is not published. This file is the CodeRoastWeb-specific runbook for local development, Vite/Netlify, API base configuration, and browser deployment checks.

## Local Development

Install dependencies once:

```sh
npm install
```

Start the Vite dev server:

```sh
npm run dev
```

Default URL: `http://localhost:5173`.

When developing the Lab, run CodeRoastServer on `localhost:8080`. Vite proxies API and WebSocket traffic to it.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server with HMR. |
| `npm run build` | TypeScript project build plus Vite production bundle. |
| `npm run preview` | Serve `dist/` locally for production preview. |
| `npm run lint` | ESLint over the repo. |
| `npm test` | Vitest test suite once. |
| `npm run test:watch` | Vitest watch mode. |

## API Configuration

The REST base is resolved in `src/services/api.ts`:

```ts
const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1'
```

### Development

`vite.config.ts` proxies:

```text
/api         -> http://localhost:8080
/api/v1/ws  -> ws://localhost:8080
```

The front end keeps the full `/api/v1/*` prefix. The backend should expose versioned routes directly.

### Production

`netlify.toml` sets:

```toml
VITE_API_BASE = "https://api.coderoast.fr/api/v1"
```

The WebSocket client converts that to `wss://api.coderoast.fr/api/v1/ws/engine?...`.

If production moves to a different API host, update `VITE_API_BASE` in the hosting environment and keep the `/api/v1` suffix unless the backend version changes.

## Production Build

```sh
npm run build
```

Build output lands in `dist/`. The build command runs `tsc -b` before Vite bundling, so type errors fail deployment.

## Preview

```sh
npm run preview
```

Default preview URL: `http://localhost:4173`.

Use preview to catch React Router, asset, and environment-variable issues before pushing hosting changes.

## Netlify

The checked-in `netlify.toml` is the canonical static hosting config:

```toml
[build]
	command = "npm run build"
	publish = "dist"

[[redirects]]
	from = "/*"
	to = "/index.html"
	status = 200
```

The redirect is required because React Router owns client-side routes such as `/lab`, `/logcraft`, and `/legal/privacy`.

Static asset headers:

- `/assets/*` receives long immutable caching;
- `*.js` is forced to JavaScript content type;
- `*.wasm` is forced to WebAssembly content type for future assets.

## Backend Expectations

The hosted Lab needs a reachable CodeRoastServer instance with:

- `/api/v1/login`, `/whoami`, `/users`, `/tiers`;
- scenario listing and validation routes;
- engine lifecycle routes;
- WebSocket snapshots at `/api/v1/ws/engine`;
- CORS allowing the deployed web origin;
- scenario roots configured through CodeRoastServer's `CODEROAST_LOGCRAFT_SCENARIO_PATH` and `CODEROAST_INSIGHT_SCENARIO_PATH`.

See CodeRoastServer's `technical_docs/api/server_api_contract.md` and its README — CodeRoastServer is not a published repository.

## Deployment Checklist

1. Run `npm test`.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Confirm `VITE_API_BASE` points to the intended API host.
5. Confirm the API host accepts the web origin through CORS.
6. Confirm WebSocket upgrades work from the deployed origin.
7. Open `/lab`, create an engine from a starter scenario, and verify snapshots arrive.

## Common Failures

| Symptom | Likely cause | Fix |
|---|---|---|
| `/lab` returns 404 after refresh | Missing SPA redirect | Keep Netlify `/* -> /index.html 200`. |
| API works locally but not in production | Missing or wrong `VITE_API_BASE` | Set full `https://host/api/v1`. |
| WebSocket connects locally but not hosted | API host rejects upgrade or uses wrong scheme | Ensure `wss://` is reachable and routed to `/api/v1/ws/engine`. |
| Tier buttons enabled but server denies | Front-end permission mirror drifted | Update `src/utils/permissions.ts` and CodeRoastServer permission keys together. |
| Scenario list empty | CodeRoastServer lacks the matching scenario root | Set `CODEROAST_LOGCRAFT_SCENARIO_PATH` or `CODEROAST_INSIGHT_SCENARIO_PATH` on the server. |
