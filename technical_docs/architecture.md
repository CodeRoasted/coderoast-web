# CodeRoastWeb Architecture

## System Overview

CodeRoastWeb is a React 18 + Vite single-page application. It has two responsibilities:

1. Public product website for LogCraft, InSight, use cases, pricing, legal pages, and contact paths.
2. Browser Lab split into LogCraft Playground and Insight Playground. Both create live LogCraft engines, stream snapshots over WebSocket, and send runtime commands; Insight Playground additionally polls InSight status/reports and displays detector evidence/explanations.

```text
Browser route
	-> React page/component tree
	-> Zustand stores
	-> REST client / WebSocket client
	-> CodeRoastServer /api/v1
```

LogCraft owns engine truth. InSight owns analysis truth. CodeRoastServer owns API/session truth and hosts the per-engine InSight pipeline. CodeRoastWeb owns presentation state, optimistic UI hints, bounded client-side live tail, and retained explanation cards.

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18, TypeScript strict mode |
| Build | Vite 6 |
| Routing | React Router v6 |
| State | Zustand, with persisted auth store |
| Styling | Tailwind CSS, dark-first palette |
| Motion | Framer Motion |
| Icons | lucide-react |
| Editor | CodeMirror YAML editor |
| Tests | Vitest + Testing Library + jsdom |

## Route Map

| Route | Page | Purpose |
|---|---|---|
| `/` | `Home` | Marketing homepage, product story, use cases, portfolio, maker note. |
| `/logcraft` | `LogCraft` | Product deep dive and conceptual model for LogCraft. |
| `/lab` | `Playground` | Default Insight Playground entry backed by a LogCraft engine. |
| `/lab/logcraft` | `Playground` | LogCraft Playground mode: real-time scenario lab, logs, incidents, sinks, and Drain/demo views without InSight panels. |
| `/lab/insight` | `Playground` | Insight Playground mode: deterministic LogCraft feed plus InSight status/reports and explain views. |
| `/playground` | `Playground` | Legacy alias for `/lab`. |
| `/tiers` | `TierMatrix` | RBAC tier/permission matrix. |
| `/use-cases` | `UseCases` | Detailed use-case narratives. |
| `/legal/terms` | `Terms` | Terms of service. |
| `/legal/privacy` | `Privacy` | Privacy policy and cookie posture. |
| `/legal/trademark` | `Trademark` | Trademark policy. |

Non-home routes are lazy-loaded in `src/App.tsx` behind `React.lazy` and `Suspense`.

## Component Boundaries

```text
App
	BrowserRouter
	HashScrollManager
	ErrorBoundary
	Routes
		Home
			Navbar
			Hero
			home/* sections (lazy)
			Portfolio / ComingSoon / MakerNote (lazy)
			Footer
		LogCraft
			ProductNavbar
			product narrative sections
			Footer
		Playground
			LabTopBar
			OnboardingModal
			PlaygroundModeSwitch
			LabPickerView OR LabDashboardView
			EngineTimeline
			TierLockModal
			LabStatusToast
```

Home-page sections are intentionally separate components under `src/components/home/` so marketing copy, product education, and page pacing can evolve without touching the Lab.

The Lab page is a thin orchestrator. State and commands live in hooks/stores:

| Module | Responsibility |
|---|---|
| `useEngineLifecycle` | validation, engine create/delete, WebSocket wiring, optional InSight polling, live commands, tier errors. |
| `useFirstVisitOnboarding` | cookie-gated onboarding and Hello World pre-load. |
| `useEngineStore` | engine id, snapshot, YAML, selected scenario, live tail, InSight status/reports. |
| `useAuthStore` | persisted token, selected demo user, current tier. |

## State Model

| Store | Persistence | Contents |
|---|---|---|
| `useStore` | memory only | `language`, dark-only `theme` placeholder. |
| `useAuthStore` | `localStorage` key `coderoast.auth` | bearer token, current user, tier, selected demo user. |
| `useEngineStore` | memory only | engine id, latest snapshot, scenario YAML, status toast, bounded live tail, InSight status/reports. |

The app forces `document.documentElement.classList.add('dark')` on mount. `toggleTheme` is a no-op because light mode has been removed from the product surface even though Tailwind still uses class-based dark mode.

## Lab Data Flow

```text

LogCraft Playground:

```text
Scenario picker / YAML editor
	-> validateScenario(yaml)
	-> createEngine(yaml)
	-> WebSocket /ws/engine?id=...
	-> snapshot stream
	-> LabDashboardView
	-> EngineTimeline progress + incident markers
	-> logs / incidents / sinks / demo Drain views
	-> runtime commands over WebSocket
```

Insight Playground:

```text
Scenario picker / YAML editor
	-> validateScenario(yaml)
	-> createEngine(yaml)
	-> WebSocket /ws/engine?id=...
	-> snapshot stream
	-> poll /engines/{id}/insight/status
	-> poll /engines/{id}/insight/reports when lines advance
	-> LabDashboardView
	-> EngineTimeline progress + incident markers
	-> runtime commands over WebSocket
```

The Lab validates YAML before creating an engine. Validation can return:

- hard errors, rendered near the editor;
- warnings/notices, shown as non-blocking context;
- unavailable capabilities, used to block scenarios the hosted demo cannot run;
- tier errors, rendered by `TierLockModal`.

Once attached, the WebSocket streams snapshots. The server snapshot tail is only the latest slice; `useEngineStore.appendToLiveTail()` deduplicates records by `(timestamp, agent, level, message)` and caps the browser buffer at 1000 records.

In Insight Playground mode, `useEngineLifecycle` polls InSight status every few seconds. When the reported ingested line count or InSight revision changes, it fetches `/engines/{id}/insight/reports` and replaces the local explanation list with the bounded history owned by the server. The observation column defaults to `InsightPanel`, with logs, incidents, and demo sink payloads kept as supporting views.

In LogCraft Playground mode, InSight polling is disabled and the observation column starts on the log tail. The same engine snapshot, sink, incident, and demo Drain views remain available, but InSight configuration, reports, and AI explain controls are not rendered.

## REST Client

`src/services/api.ts` wraps `fetch` with:

- base URL from `VITE_API_BASE` or `/api/v1`;
- bearer token injection from `useAuthStore`;
- default request timeout of 15 seconds;
- `PolicyDenialError` for HTTP 403 payloads;
- typed response helpers for scenarios, engines, auth, capability profiles, drain snapshots, and InSight status/reports.

The authoritative endpoint contract lives in CodeRoastServer's `technical_docs/api/server_api_contract.md`; that repository is not published.

## WebSocket Client

`src/services/websocket.ts` owns a singleton `EngineWebSocket`:

- uses `?token=` because browsers cannot attach custom headers to WebSocket upgrades;
- derives a production `wss://` URL from `VITE_API_BASE` when configured;
- uses the Vite proxied `/api/v1/ws/engine` path in development;
- reconnects with capped backoff `[1s, 2s, 4s, 8s, 15s]`;
- resets backoff after `connected` or `snapshot` messages.

The client accepts `connected`, `snapshot`, `result`, and `error` messages, then exposes callbacks to `useEngineLifecycle`.

## Auth And Tier UX

The backend is the source of truth for access control. The front end mirrors permission levels in `src/utils/permissions.ts` so buttons can be disabled before a user clicks them.

| Permission family | Minimum tier |
|---|---|
| create/start/stop/destroy engine, WebSocket | Free |
| live rate/error/burst commands | Pro |
| cascade evaluation | Enterprise |

When the backend denies a request, `PolicyDenialError` carries the denial detail from the capability profile. UI components should render that detail instead of a generic error.

## Cookies And Local Storage

The product currently sets one functional cookie: `logcraft_onboarding_dismissed`. It stores whether the Lab onboarding wizard has already been dismissed.

Auth state is persisted in local storage, not cookies. On app bootstrap, `App` calls `/whoami`; if the token is invalid but a selected demo user remains, it re-logins as that user.

## Testing Surface

Vitest tests live under `src/test/` and cover:

- API request behavior and WebSocket behavior;
- auth/tier lock behavior;
- engine store and Lab UI pieces;
- translation parity;
- cookies and onboarding;
- log tail, YAML editor, agent metrics, navbar, and error boundary.

Run:

```sh
npm test
npm run lint
npm run build
```

## Cross-Repo Dependencies

| Dependency | Direction | Contract |
|---|---|---|
| CodeRoastServer | CodeRoastWeb -> CodeRoastServer | REST/WebSocket API and engine snapshot shape. |
| LogCraft scenario library | CodeRoastWeb -> LogCraft data path | Scenario ids, metadata, and YAML examples served by backend. |
| InSight | CodeRoastWeb -> CodeRoastServer -> InSight engine | Lab explanation views consume `status` and `reports` DTOs; deeper MetaLog traces remain future work. |

CodeRoastWeb should not parse LogCraft internals beyond public YAML and API DTOs.
