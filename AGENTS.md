# VPN Admin Dashboard – Agent Guide

This document is the **single source of truth** for AI agents and developers working on this project. Read it at the start of any task so context and conventions stay consistent across threads.

---

## 1. Project overview

- **Purpose**: Admin UI for the **UAP Control Plane** (VPN). Admins monitor and manage users, regions, nodes, reconciliation, events, catalog, and traffic.
- **API spec**: All endpoints are documented in **`api_documentation.md`** at the repo root. Use it for request/response shapes and auth.
- **Current state**: The app runs end-to-end with **mock data**. The intended next phase is **replacing mocks with real API calls** without changing UI structure. When the user asks to "wire to API", "switch from mock to real API", or "implement API", you must only replace the fetcher functions and optionally add env for base URL; do not redesign pages or navigation unless asked.

---

## 2. Tech stack

| Layer | Choice |
|-------|--------|
| Build | Vite, React 19, TypeScript |
| Routing | React Router DOM |
| Data / server state | TanStack Query (useQuery, useMutation) |
| Client state | Zustand (`src/state/authStore.ts`) |
| Styling | TailwindCSS v4 (`@tailwindcss/postcss`), utility-only |
| Charts | Recharts |
| Icons | lucide-react |

- **Entry**: `src/main.tsx` (wraps app with BrowserRouter, QueryClientProvider).
- **Layout**: `src/components/layout/Sidebar.tsx` (grouped nav), `src/components/layout/Topbar.tsx`.
- **Auth**: Basic Auth only. Credentials live in `src/state/authStore.ts` (in-memory; no persist). When calling Admin APIs, send `Authorization: Basic <base64(user:password)>`. No API base URL in code yet; add a config (e.g. `import.meta.env.VITE_API_BASE_URL` or shared config) when wiring real APIs.

---

## 3. Page ↔ API mapping (mock → real)

Use this table when implementing "mock → real API". Replace only the **fetcher** for that page; keep existing types and UI.

| Page | File | Fetcher(s) / mutation | Real API (from `api_documentation.md`) |
|------|------|------------------------|----------------------------------------|
| **Dashboard** | `src/pages/DashboardPage.tsx` | `fetchTelemetrySummary`, `fetchSystemStatus`, `fetchRecentCriticalEvents`, `fetchRegionStats`, `fetchDailyOnline`, `fetchNodeHealthDistribution` | `GET /api/v1/telemetry/summary`; system status can use `GET /healthz`; events from `GET /api/v1/events`; region/node stats from regions + metadata/catalog. |
| **Users** | `src/pages/UsersPage.tsx` | Data: list from mock array → | `GET /api/v1/users` (user projections). Intents: `POST /api/v1/intents/user-upsert`, `POST /api/v1/intents/user-policy`, `POST /api/v1/intents/user-access-patch`. |
| **Regions** | `src/pages/RegionsPage.tsx` | Mock array → | `GET /api/v1/regions`, `POST /api/v1/regions`, `GET /api/v1/regions/{key}`, `PUT /api/v1/regions/{key}`, `DELETE /api/v1/regions/{key}`. |
| **Nodes** | `src/pages/NodesPage.tsx` | Mock array → | `GET /api/v1/metadata/nodes`, `GET /api/v1/metadata/regions/{region}/nodes`. |
| **Node enrollment** | `src/pages/NodeEnrollmentPage.tsx` | `issueEnrollmentToken` | `POST /api/v1/node-enrollment-tokens` (body e.g. `{ "region_key": "..." }`). |
| **Reconcile** | `src/pages/ReconcilePage.tsx` | `fetchReconcilePlan`, `runReconcile` | `GET /api/v1/reconcile-plan`, `POST /api/v1/reconcile-run`. |
| **Events** | `src/pages/EventsPage.tsx` | Mock array + mock event rate → | `GET /api/v1/events`. Event rate can be derived client-side or from a future analytics endpoint. |
| **Catalog** | `src/pages/CatalogPage.tsx` | `fetchCatalogSummary` | `GET /api/v1/catalog/summary`. Optional: `GET /api/v1/catalog/{resource}` for detail. |
| **Traffic** | `src/pages/TrafficPage.tsx` | `fetchTrafficByRegion`, `fetchTrafficByDay`, `fetchTopUsers` | No direct Admin API in doc; SUI/Compatibility APIs: traffic per user, etc. Wire when backend exposes traffic/rollup APIs. |

- **Auth for Admin APIs**: All `/api/v1/*` in the table above use **HTTP Basic Auth** (see `api_documentation.md`). Build the header from `useAuthStore.getState().username` and `password` (or from a shared `api` helper that reads the store).
- **Response shapes**: Backend types live in the **uap-control-plane** repo (e.g. `internal/types/*.go`, `internal/server/*.go`). Keep frontend types (e.g. `UserProjection`, `Region`, `Node`) in sync with those when wiring real API; use the same field names as API JSON (snake_case is used in API).

---

## 4. Enums and types

- **Enums**: Live under **`src/enums/`**, one file per domain. Use **`src/enums/index.ts`** as barrel; all imports should be `from '../enums'` (or `@/enums` if path alias exists). Do not hardcode status/type strings in components; use enum constants and types (e.g. `UserStatus.Active`, `RegionStatus`, `HealthClass`). When backend adds new enum values, add them in the corresponding `src/enums/*.ts` file.
- **Types**: Page-level DTOs (e.g. `UserProjection`, `Region`, `Node`, event row types) are defined in the same page file or in a shared `src/types/` if reused. When switching to real API, align these types with the backend JSON (snake_case fields like `user_id`, `region_key` are used).

---

## 5. Conventions

- Prefer **function components** and **hooks**; TypeScript for all props and API models.
- **Pages** in `src/pages/` own layout and data-fetching for one screen; reuse UI in `src/components/`.
- **Styling**: Tailwind only; no ad-hoc CSS files unless a pattern is heavily reused.
- **Lint**: ESLint + Prettier; run `npm run lint` before considering a task done. Do not introduce new linters or formatters without explicit request.
- **New features**: When adding a page or flow, add the route in `src/App.tsx`, nav item in `src/components/layout/Sidebar.tsx`, and title in `src/components/layout/Topbar.tsx` (`titleMap`).

---

## 6. Quick reference for "wire to real API" tasks

1. Open **`api_documentation.md`** and the **page file** from the table in §3.
2. Identify the **fetcher(s)** or **mutation(s)** to replace (they are currently returning mock data or simulating delay).
3. Create a shared **API client** (e.g. `src/api/client.ts`) that:
   - Reads base URL from env or config.
   - Attaches `Authorization: Basic <base64(user:password)>` from `authStore` for Admin APIs.
   - Uses `fetch` or `axios` and returns typed data.
4. Replace the fetcher implementation with a call to this client; keep the same **queryKey** and **type** so the rest of the page and components stay unchanged.
5. Update **AGENTS.md** if you add new pages or new API mappings.

---

*Last updated to reflect full page list, mock → API mapping, and wiring instructions for future threads.*
