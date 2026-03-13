# Brainstorm: Frontend UI/UX Refactor

**Date:** 2026-03-11
**Status:** Decisions made, ready for planning

## What We're Building

A comprehensive frontend refactor of the CCBC Website that addresses three dimensions:

1. **Code organization** — Break apart monolithic components, remove dead code, consolidate to a single form system
2. **Visual refresh** — Transform from generic Shadcn look to a sports/league-style aesthetic (bold, ESPN-inspired)
3. **UX improvements** — Flatten modal-heavy stats navigation, redesign player management as a dashboard

## Why This Approach

The frontend has grown to ~86 components (~13,800 lines) with concentrated bloat in a few files. Three competing form systems create confusion. Stats UX buries full data tables inside modals. The visual design doesn't reflect the sports league identity.

An aggressive, phased refactor lets us clean the foundation (dead code, layout system) before tackling the complex redesigns (stats, players).

## Key Decisions

| Decision | Choice | Alternatives Considered |
|----------|--------|------------------------|
| Design direction | Sports/league style (ESPN-inspired) | Keep current look, Modern minimal, Figma mockups |
| Refactor scope | Aggressive (full code + visual + UX) | Conservative (worst offenders only), Moderate |
| Form system | TanStack Form only (remove react-hook-form) | Keep both, Switch to react-hook-form |
| framer-motion | Replace with `motion` (lighter fork) | Keep it, Replace with CSS, auto-animate |
| Player management | Redesign as dashboard layout | Split by function, Split by tabs |
| Layout system | Full PageLayout (title, breadcrumbs, actions) | Minimal container, No shared layout |
| Stats navigation | Route-based tabs instead of modals | Keep modals, Accordion/expandable |
| Sponsor pages | Keep as separate routes | Consolidate to dynamic route, Remove |
| chart.js | Keep (client needs it for upcoming feature) | Remove |

## Scope Boundaries

**In scope:**
- All frontend code (routes, components, hooks, styles)
- Dependency cleanup (remove unused, swap framer-motion)
- New shared components (PageLayout, SportCard, GameStatusBadge, etc.)
- Stats module route restructuring + UX redesign
- Player management decomposition + dashboard layout

**Out of scope:**
- Backend (services, controllers, queries, database)
- TanStack Start framework (keeping as-is)
- Sponsor page content (keeping separate routes)
- Test infrastructure (none exists, not adding in this refactor)

## Open Questions

None — all decisions resolved through dialogue.
