# 2bleA — Servicios Digitales

Argentine web agency platform with a public landing page, client portal, and admin panel backed by a real PostgreSQL database and JWT-authenticated REST API.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run typecheck:libs` — build composite lib packages (run this after schema changes)
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (runtime-managed by Replit)
- Required env: `SESSION_SECRET` — JWT signing secret (already configured)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TailwindCSS v4 + framer-motion + wouter
- API: Express 5 + pino logging
- DB: PostgreSQL + Drizzle ORM (lib/db)
- Auth: JWT tokens (jsonwebtoken + bcryptjs), signed with SESSION_SECRET
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/2blea/` — React frontend (landing page, portal, admin)
- `artifacts/api-server/` — Express REST API
- `lib/db/src/schema/` — Drizzle ORM schema (projects, payments, messages, files, adminUsers)
- `artifacts/api-server/src/lib/auth.ts` — JWT sign/verify helpers
- `artifacts/api-server/src/lib/middleware.ts` — requireAdmin / requirePortal / requirePortalOrAdmin
- `artifacts/api-server/src/lib/seed.ts` — auto-migration + seed on startup
- `artifacts/2blea/src/lib/api.ts` — frontend HTTP client
- `artifacts/2blea/src/lib/store.ts` — hybrid store (optimistic localStorage + async API)

## API Routes

All routes prefixed with `/api`:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /healthz | none | Health check |
| POST | /portal/auth | none | Authenticate client with code → JWT token |
| GET | /portal/me | portal token | Get authenticated client's project |
| POST | /admin/auth | none | Admin login → JWT token |
| GET | /admin/projects | admin token | List all projects |
| PUT | /admin/projects/:code | admin token | Update project (progress, stage, status, payments) |
| GET | /messages/:code | portal or admin | Get messages for project |
| POST | /messages/:code | portal or admin | Add message to project |

## Architecture decisions

- **Optimistic updates**: store.ts writes to localStorage instantly, then persists to API in background — no loading flicker for admin edits
- **JWT in localStorage**: portal tokens expire in 30 days, admin tokens in 24h, both signed with SESSION_SECRET
- **Auto-migrate + seed**: api-server runs `migrateSchema()` + `seedDatabase()` on startup so fresh deployments just work
- **Hybrid store**: localStorage still used as cache/fallback; API data overwrites on hydration so the UI is always instant
- **PostgreSQL via Replit DB**: DATABASE_URL is runtime-managed (Replit PostgreSQL). To switch to Supabase, update DATABASE_URL to the Supabase direct connection string — everything else stays the same

## Product

- **Landing page** (`/`) — agency home with services, budget calculator, contact form, testimonials, FAQ
- **Client portal** (`/portal`) — clients log in with a unique code, see project progress, timeline, files, and chat with the agency
- **Admin panel** (`/admin`) — agency staff manage all projects, update progress/stages/payments, and compose messages to clients
- **Real-time sync** — admin changes propagate to the portal via optimistic localStorage updates + API persistence

## User preferences

- All prices in ARS (Argentine Pesos)
- Spanish language throughout the UI
- WhatsApp: 5492622530837, Email: 2bleadeveloper@gmail.com
- Dark theme, violet/blue color palette

## Gotchas

- Run `pnpm run typecheck:libs` after any schema change in `lib/db/` before running `pnpm --filter @workspace/api-server run typecheck`
- Never run `console.log` in server code — use `req.log` in routes, `logger` elsewhere
- The API server auto-seeds on startup only if the DB is empty (checks admin_users count)
- Demo credentials: portal codes `BARBER-2026`, `STORE-2026`, `FITNESS-2026` / admin: `admin` / `2blea2026`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
