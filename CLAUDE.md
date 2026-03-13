# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CCBC Website is a full-stack basketball league management application built with TanStack Start, managing games, teams, players, stats, schedules, standings, and waivers for the Calgary Chinese Basketball Club.

## Common Commands

```bash
pnpm dev                    # Dev server on port 3000
pnpm build                  # Production build (includes tsc --noEmit)
pnpm lint                   # ESLint
pnpm format                 # Prettier
pnpm generate               # Generate Drizzle migrations from schema changes
pnpm db-pull                # Pull DB schema from Supabase into schema.ts
pnpm supabase:typegen       # Generate Supabase TypeScript types
pnpm ui                     # Add Shadcn UI components (installs to ~/lib)
```

## Architecture

### Layered Data Flow

```
Route (loader/component) → Controller (createServerFn) → Service → Drizzle ORM / Supabase Client → PostgreSQL
```

- **Routes** (`src/routes/`): File-based routing via TanStack Router. Loaders preload data with `queryClient.ensureQueryData()`.
- **Controllers** (`src/controllers/*.api.ts`): Server functions using `createServerFn()` with Zod input validation. These are the API layer.
- **Services** (`src/services/*.service.ts`): Business logic classes instantiated as singletons in `src/container.ts`. Access the database via both Drizzle and Supabase clients.
- **Schemas** (`src/schemas/*.schema.ts`): Zod validation schemas shared between controllers and forms.
- **Types** (`src/types/*.ts`): TypeScript type definitions for domain entities.
- **Queries** (`src/queries.ts`): Single file containing all TanStack Query `queryOptions` definitions, organized by domain (e.g., `teamQueries`, `gameQueries`, `playerQueries`).

### Dual Database Client Pattern

Services use **two** database clients:

- **`this.drizzle_db`** (Drizzle ORM): Used for **reads** — typed relational queries with `findMany`/`findFirst` and `with:` for joins.
- **`this.supabase`** (Supabase client via `getSupabaseServerClient()`): Used for **writes** — `.insert()`, `.update()`, `.delete()` with RLS enforcement via auth token.

Supabase uses **snake_case** column names (`game_date`, `home_team_score`), while the app uses **camelCase** (`gameDate`, `homeTeamScore`). Services manually transform between the two in their methods.

### Frontend

- **Components** (`lib/components/`): Reusable React components. `lib/components/ui/` contains Shadcn UI primitives.
- **Hooks** (`lib/hooks/`): Custom React hooks (e.g., `useAuth`).
- **Forms**: TanStack Form via `useAppForm()` hook defined in `lib/form.ts`. Includes pre-registered field components (`TextField`, `SelectField`) and `SubmitButton`. Note: `react-hook-form` is still a dependency but TanStack Form is the primary pattern.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin. Uses oklch color system with dark mode support.

### Root Context Preloading

`src/routes/__root.tsx` preloads teams, games, and auth state in `beforeLoad()`. Child routes access this data via `useRouteContext({ from: "__root__" })` without re-fetching.

### Auth & Role Guards

Role-based access is enforced via guard functions in `src/services/auth.service.ts`:

- `requireAdmin(loaderContext)` — admin only
- `requireScoreKeeper(loaderContext)` — score-keeper or admin
- `requireCaptain(loaderContext)` — captain or admin
- `requirePlayer(loaderContext)` — player or admin

Use in route `beforeLoad()` hooks:
```ts
beforeLoad: async ({ context }) => {
  await requireAdmin({ context });
}
```

Roles: `admin`, `score-keeper`, `captain`, `player` — stored in `user_roles` table.

### Database

- **ORM**: Drizzle ORM with PostgreSQL (`postgres` driver)
- **Schema**: `db/schema.ts` — defines tables with RLS policies (via `pgPolicy`), UUID primary keys, timestamps
- **Relations**: `db/relations.ts`
- **Connection**: `db/index.ts` — sets `prepare: false` (required for Supabase transaction pool mode)
- **Migrations**: Output to `supabase/migrations/`
- **Core entities**: games, teams, players, playerGameStats, teamGameStats, seasons, images, profiles, userRoles

### Key Conventions

- Path alias `~/` resolves to project root (e.g., `~/src/controllers/game.api`)
- Service classes are instantiated once in `src/container.ts` and imported as singletons
- File naming: `*.api.ts` (controllers), `*.service.ts` (services), `*.schema.ts` (schemas)
- Toast notifications via `sonner`
- Icons from `lucide-react`
- Deployed to Netlify via `@netlify/vite-plugin-tanstack-start`

### UX Patterns

- Never disable submit buttons — show loading state with `isPending` instead
- Use `Dialog` for delete confirmations with `variant="destructive"` buttons
- Primary actions (Create/Add) go top-right in page headers
- Use toast notifications for success/error feedback on mutations

## Environment Variables

| Variable | Usage |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Drizzle ORM) |
| `VITE_SUPABASE_URL` | Supabase project URL (client-side) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key (client-side) |
| `ADMIN_EMAILS` | Comma-separated admin email addresses |
| `CAPTAIN_EMAILS` | Comma-separated captain email addresses |
| `RESEND_API_KEY` | Resend email service API key |

## Adding a New Feature (End-to-End)

1. **Type** — Define the entity type in `src/types/`
2. **Schema** — Add Zod validation schema in `src/schemas/`
3. **DB table** — Add table to `db/schema.ts`, relations to `db/relations.ts`, run `pnpm generate`
4. **Service** — Create `src/services/foo.service.ts` with Drizzle reads + Supabase writes
5. **Container** — Instantiate and export the service singleton in `src/container.ts`
6. **Controller** — Create `src/controllers/foo.api.ts` with `createServerFn()` endpoints
7. **Queries** — Add `queryOptions` to `src/queries.ts`
8. **Route** — Add route file(s) in `src/routes/`, use loader + query pattern

## Gotchas

- **`.agent/rules/` files are from a different project** (SoundStation music app) — they describe wrong tech (Better Auth, S3/R2, Stripe, playlists). Ignore them entirely.
- **`src/routeTree.gen.ts`** is auto-generated by TanStack Router — never edit manually.
- **No test infrastructure** exists in this project currently.
- **`prepare: false`** in `db/index.ts` is required — Supabase transaction pool mode does not support prepared statements.
- **RLS policies** are defined inline in `db/schema.ts` via `pgPolicy()` — not in separate SQL files.
