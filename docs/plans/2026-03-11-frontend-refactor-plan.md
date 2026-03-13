# Frontend Refactor — Implementation Plan

**Date:** 2026-03-11
**Source:** [Brainstorm](../brainstorms/2026-03-11-frontend-refactor-brainstorm.md)
**Status:** Ready for execution
**Framework:** TanStack Start (unchanged)

---

## Design System

### Color Palette (OKLCH — replacing current neutral grays)

The current theme is entirely achromatic (zero chroma). The refactor introduces a sports-league identity with CCBC brand colors while keeping the OKLCH system Tailwind v4 expects.

| Token | Light Mode | Dark Mode | Purpose |
|-------|-----------|-----------|---------|
| `--primary` | `oklch(0.25 0.08 250)` | `oklch(0.65 0.18 250)` | Deep navy / Bright blue — league identity |
| `--primary-foreground` | `oklch(0.98 0 0)` | `oklch(0.12 0 0)` | Text on primary |
| `--accent` | `oklch(0.65 0.22 30)` | `oklch(0.70 0.22 30)` | Warm orange — CTA, highlights, live indicators |
| `--accent-foreground` | `oklch(0.12 0 0)` | `oklch(0.12 0 0)` | Text on accent |
| `--secondary` | `oklch(0.95 0.01 250)` | `oklch(0.22 0.03 250)` | Subtle navy tint — card backgrounds, panels |
| `--background` | `oklch(0.97 0.005 250)` | `oklch(0.13 0.02 250)` | Slight blue tint, not pure white/black |
| `--foreground` | `oklch(0.15 0.02 250)` | `oklch(0.95 0 0)` | Text |
| `--muted` | `oklch(0.94 0.01 250)` | `oklch(0.25 0.02 250)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.50 0.02 250)` | `oklch(0.65 0.01 250)` | Secondary text |
| `--destructive` | `oklch(0.55 0.24 27)` | `oklch(0.55 0.24 27)` | Red — losses, errors |
| `--win` | `oklch(0.60 0.19 145)` | `oklch(0.65 0.19 145)` | Green — wins, positive |
| `--live` | `oklch(0.60 0.24 30)` | `oklch(0.65 0.24 30)` | Pulsing orange — live games |
| `--border` | `oklch(0.88 0.01 250)` | `oklch(0.28 0.02 250)` | Borders |

> **Rationale:** Navy + orange is a classic sports broadcast palette (ESPN, TSN). The slight blue tint throughout prevents the "generic Shadcn" look while remaining professional. Win/loss/live are semantic tokens specific to sports apps.

### Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| **Headings** | Bebas Neue | 400 | Page titles, section headers, scoreboards |
| **Body** | Source Sans 3 | 300–700 | All body text, tables, forms, nav |
| **Stats/Numbers** | Bebas Neue | 400 | Scores, stat values, jersey numbers, rankings |

```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');
```

> **Rationale:** Bebas Neue is bold and condensed — perfect for scores and headlines in a sports context. Source Sans 3 is highly readable for data-heavy tables. Using Bebas for stat numbers creates the ESPN/broadcast feel without extra dependencies.

### Spacing & Layout Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--page-max-width` | `80rem` (1280px) | Main content area |
| `--page-padding` | `1rem` mobile, `1.5rem` tablet, `2rem` desktop | Page gutters |
| `--card-radius` | `0.5rem` | Card corners (slightly tighter than current 0.625rem) |
| `--section-gap` | `1.5rem` | Between content sections |

### Component Design Tokens

| Component | Key Styles |
|-----------|-----------|
| **SportCard** | Navy gradient header, bold white title, subtle border-left accent color (team color or orange), elevated shadow on hover |
| **ScoreCard** | Bebas Neue numbers, team logos flanking score, FINAL/LIVE badge, dark navy background |
| **StatBar** | Horizontal bar with fill percentage, team-colored, label left + value right |
| **GameStatusBadge** | Pill shape — green "FINAL", pulsing orange "LIVE", muted "UPCOMING" |
| **PageLayout** | Title (Bebas), optional breadcrumbs, optional action slot (top-right), consistent max-width |

---

## Phase 1 — Foundation (Layout, Theme, Dead Code)

**Goal:** Clean the codebase and establish the new visual foundation without changing features.

### 1.1 Theme Overhaul (`src/styles.css`)
- Replace all OKLCH values with the new sports palette above
- Add custom tokens: `--win`, `--live`, `--accent`
- Import Bebas Neue + Source Sans 3 fonts
- Define heading/body font-family in `@layer base`
- Keep `@custom-variant dark` and `tailwindcss-animate` as-is

### 1.2 Create `PageLayout` Component
**File:** `lib/components/page-layout.tsx` (~60 lines)

```
┌─────────────────────────────────────────┐
│ [Breadcrumb: Home > Teams > Team A]     │
│                                         │
│ PAGE TITLE              [Action Button] │
│ Optional subtitle                       │
├─────────────────────────────────────────┤
│                                         │
│ {children}                              │
│                                         │
└─────────────────────────────────────────┘
```

Props: `title`, `subtitle?`, `breadcrumbs?`, `actions?`, `children`

Every route page will use this wrapper. Replace the current ad-hoc pattern of:
```tsx
<div className="container mx-auto px-4 py-8">
  <div className="flex justify-between items-center mb-8">
    <h1 className="text-4xl font-bold">Title</h1>
```

### 1.3 Dead Code Removal
| Target | Action | Lines Saved (est.) |
|--------|--------|-------------------|
| `lib/components/carousel.tsx` | Delete (350 lines, largely commented out) | ~350 |
| `lib/components/form-components.tsx` | Delete after confirming no imports | ~174 |
| `lib/components/ui/form.tsx` | Keep until react-hook-form removal (Phase 4) | — |
| `tailwind.config.ts` | Delete (commented-out legacy, config is in CSS) | ~50 |
| Unused Radix packages | Audit with `pnpm why`, remove unused | — |

### 1.4 Swap `framer-motion` → `motion`
- `pnpm remove framer-motion && pnpm add motion`
- Update imports: `from "framer-motion"` → `from "motion/react"`
- API is identical for the features used (animate, variants, AnimatePresence)
- Bundle savings: ~30KB gzipped

---

## Phase 2 — Shared Components & Navigation

**Goal:** Build the reusable sports-styled components and fix the navbar.

### 2.1 New Shared Components

| Component | File | Purpose |
|-----------|------|---------|
| `SportCard` | `lib/components/sport-card.tsx` | Replaces generic Card for league content — team-colored accent bar, bold header, hover elevation |
| `ScoreCard` | `lib/components/score-card.tsx` | Game score display — Bebas numbers, team logos, status badge |
| `GameStatusBadge` | `lib/components/game-status-badge.tsx` | Pill badge: FINAL (green), LIVE (pulsing orange), UPCOMING (muted) |
| `StatBar` | `lib/components/stat-bar.tsx` | Horizontal percentage bar for stat comparisons |
| `StatsTable` | `lib/components/stats-table.tsx` | Shared wrapper around React Table with sports styling — alternating rows, bold headers, sorted column highlight |

### 2.2 Navbar Redesign (`lib/components/navbar.tsx`)

Current: 336 lines, generic navigation menu with team dropdowns.

New design:
```
┌──────────────────────────────────────────────────────┐
│ [CCBC LOGO]  Schedule  Standings  Stats  Teams       │
│                                      [Profile/Auth]  │
└──────────────────────────────────────────────────────┘
```

- Navy background (`bg-primary`), white text
- Bold, uppercase nav links (Source Sans 3 semibold, tracking-wide)
- Active route highlighted with orange bottom border
- Mobile: hamburger → slide-out drawer (Shadcn Sheet)
- Remove sponsor links from nav (sponsors stay as separate routes, linked from footer)
- Remove individual team dropdowns from top nav (teams page handles this)
- **Target: ~150 lines** (halved from current)

### 2.3 Footer Component
**File:** `lib/components/footer.tsx`

Currently missing. Add a simple footer:
- CCBC logo + "Calgary Chinese Basketball Club"
- Quick links: Schedule, Standings, Stats, Contact
- Sponsor logo row (linked to sponsor pages)
- Season/copyright line

---

## Phase 3 — Stats Module Refactor (Route-Based)

**Goal:** Replace modal-heavy stats UX with route-based tabbed navigation. This is the biggest UX change.

### 3.1 New Route Structure

**Current:** `/stats` (grid of leaders) + modals for details
**New:**

```
/stats                    → Redirect to /stats/leaders
/stats/leaders            → Leader boards (current grid, redesigned)
/stats/players            → Full player stats table (season aggregates)
/stats/players/$playerId  → Individual player stats detail
/stats/teams              → Team stats comparison table
/stats/games/$gameId      → Single game box score
```

Each sub-route is a **tab** in a shared `StatsLayout`:

```
┌─────────────────────────────────────────┐
│ STATS                                   │
│                                         │
│ [Leaders] [Players] [Teams]             │
│ ─────────────────────────────────────── │
│                                         │
│ {tab content via Outlet}                │
│                                         │
└─────────────────────────────────────────┘
```

Tabs are `<Link>` elements styled as tabs, routing is handled by TanStack Router nested routes — not client-side tab state. This means every view is URL-addressable and shareable.

### 3.2 Component Mapping (Old → New)

| Old Component | Lines | New Location | Notes |
|--------------|-------|-------------|-------|
| `player-game-stats-grid.tsx` | 335 | `/stats/leaders` route | Redesign as leader board cards with SportCard |
| `player-game-stats-modal.tsx` | 432 | `/stats/players` route + `/$playerId` | Full page table replaces modal |
| `player-stats-modal.tsx` | 370 | `/stats/players/$playerId` | Dedicated player stats page |
| `team-overall-stats-table.tsx` | 480 | `/stats/teams` route | Full page with StatsTable wrapper |
| `team-game-stats-table.tsx` | 239 | `/stats/games/$gameId` | Box score view |
| `player-game-stats-table.tsx` | 228 | `/stats/games/$gameId` | Part of box score |
| `player-stats-manager.tsx` | 527 | Keep as admin tool in `/games/$gameId` | Excel import stays, not public-facing |
| `player-stats-actions.tsx` | 122 | Keep in admin context | Edit/delete actions |
| `player-game-stats-form.tsx` | 276 | Keep in admin context | Stats entry form |

### 3.3 Stats Visual Design

**Leader Board Cards** (`/stats/leaders`):
```
┌─────────────────────────────────────┐
│ 🏀 POINTS LEADERS                   │
├──┬──────────────────┬───────────────┤
│ 1│ Player Name      │  25.4 PPG     │
│  │ Team Name        │  ███████████  │
├──┼──────────────────┼───────────────┤
│ 2│ Player Name      │  22.1 PPG     │
│  │ Team Name        │  █████████    │
└──┴──────────────────┴───────────────┘
```

**Player Stats Table** (`/stats/players`):
- Full sortable table with all season stats
- Click row → navigate to `/stats/players/$playerId`
- Mobile: card view via existing `renderMobileItem` pattern

**Box Score** (`/stats/games/$gameId`):
- ESPN-style layout: two team sections side-by-side (stacked on mobile)
- Team header with logo + name + final score
- Player stats table per team below

---

## Phase 4 — Player Management Dashboard

**Goal:** Decompose the 1,130-line `edit-players-section.tsx` into a dashboard layout.

### 4.1 Dashboard Layout

```
┌───────────────────────────────────────────────────┐
│ MANAGE PLAYERS                    [+ Add Player]  │
├───────────┬───────────────────────────────────────┤
│           │                                       │
│ Team A    │  Player List (table)                  │
│ Team B    │  - Name, Position, Jersey, Actions    │
│ Team C    │  - Click → inline edit panel (right)  │
│ All       │                                       │
│           │                                       │
├───────────┴───────────────────────────────────────┤
│ TEAM ASSETS                                       │
│ [Team Logo]  [Team Photo]                         │
└───────────────────────────────────────────────────┘
```

### 4.2 Component Decomposition

| New Component | Extracted From | Purpose | Est. Lines |
|--------------|---------------|---------|------------|
| `PlayerList` | edit-players-section | Table of players with sort/filter | ~150 |
| `PlayerForm` | edit-players-section (create/edit dialogs) | TanStack Form for player data | ~120 |
| `PlayerAvatar` | edit-players-section (avatar upload) | Avatar upload + preview + compression | ~80 |
| `TeamAssets` | edit-players-section (logo/photo) | Team logo + photo management | ~100 |
| `TeamSelector` | New | Sidebar team filter for dashboard | ~40 |

**Total: ~490 lines across 5 focused files** vs current 1,130 in one file.

### 4.3 Remove react-hook-form

After extracting `PlayerForm` with TanStack Form:
- Convert `upload-image.tsx` (180 lines) → TanStack Form
- Convert `upload-video-form.tsx` (174 lines) → TanStack Form
- Delete `lib/components/ui/form.tsx` (165 lines, react-hook-form wrapper)
- `pnpm remove react-hook-form @hookform/resolvers`

---

## Phase 5 — Route Page Polish

**Goal:** Apply the new design system across all remaining route pages.

### 5.1 Page-by-Page Updates

| Route | Current Lines | Changes |
|-------|--------------|---------|
| `/index.tsx` | 622 | Wrap in PageLayout, use ScoreCard for upcoming/recent games, add GameStatusBadge |
| `/schedule/index.tsx` | 446 | PageLayout, calendar view styling with navy headers, SportCard for game list items |
| `/standings/index.tsx` | 19 | PageLayout, redesign standings table with win/loss color coding, StatBar for team comparisons |
| `/games/$gameId.tsx` | 414 | PageLayout + breadcrumbs, ScoreCard header, route-link to box score, video section styling |
| `/teams/$teamId.tsx` | 456 | PageLayout, team hero with logo + record, roster list with player cards |
| `/players/index.tsx` | 54 | PageLayout, player directory with search/filter |
| `/players/$playerId.tsx` | 359 | PageLayout + breadcrumbs, player hero card, stats dashboard layout |
| `/edit-games/index.tsx` | 310 | PageLayout, admin table styling |
| `/admin/index.tsx` | 138 | PageLayout, dashboard cards for admin actions |

### 5.2 Responsive Audit

Every page must work at these breakpoints:
- **375px** (mobile) — single column, cards stacked, tables → card view
- **768px** (tablet) — two-column where appropriate
- **1024px** (desktop) — full layout with sidebars
- **1440px** (wide) — max-width container, centered

### 5.3 Remove Sponsor Sidebars from Root Layout

The current root layout has left/right sponsor sidebars that eat into content width on desktop. Move sponsor visibility to:
- Footer (logo row, always visible)
- Sponsor pages (linked from footer, keep as separate routes per brainstorm)
- Remove the sidebar slots from `__root.tsx`

---

## Dependency Summary

| Action | Package | Reason |
|--------|---------|--------|
| **Remove** | `framer-motion` | Replace with `motion` (lighter) |
| **Add** | `motion` | Lighter fork, same API |
| **Remove** | `react-hook-form` | Consolidate to TanStack Form (Phase 4) |
| **Remove** | `@hookform/resolvers` | Goes with react-hook-form |
| **Keep** | `chart.js`, `react-chartjs-2` | Client needs for upcoming feature |
| **Keep** | All Radix packages | Shadcn primitives still used |
| **Keep** | `xlsx` | Excel import/export in stats manager |
| **Keep** | `embla-carousel-react` | Used in Shadcn carousel component |

---

## Execution Order

```
Phase 1 ──→ Phase 2 ──→ Phase 3 ──→ Phase 4 ──→ Phase 5
Foundation   Components   Stats UX    Players     Polish
(2-3 days)   (2-3 days)   (3-4 days)  (2-3 days)  (2-3 days)
```

**Each phase is independently deployable** — the site works after each phase completes. No big-bang merge.

### Phase Dependencies
- Phase 2 depends on Phase 1 (needs theme + PageLayout)
- Phase 3 depends on Phase 2 (needs shared components)
- Phase 4 depends on Phase 1 (needs theme, but not Phase 2/3)
- Phase 5 depends on Phase 1 + 2 (needs theme + components)

Phase 4 can run **in parallel** with Phase 3 if needed.

---

## What This Plan Does NOT Do

- Change the backend (services, controllers, database, queries)
- Change TanStack Start, Router, or Query patterns
- Add test infrastructure
- Change sponsor page content or routing
- Add new features — this is purely refactor + redesign
- Add any unnecessary React abstractions or wrapper components
