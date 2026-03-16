# Client-Side Standings Filtering

## Summary

Refactor the standings page to filter games and teams client-side using data already preloaded by the root context, eliminating redundant server calls from `ScoreBoard` and `TeamRankings`.

## Problem

`ScoreBoard` and `TeamRankings` each make 3 sequential server calls:
1. Fetch seasons
2. Fetch teams by season (`getTeamsBySeason`)
3. Fetch games for those teams (`getGamesForTeams`)

The root context (`__root.tsx`) already preloads all `teams` and `games` across all seasons. Both have `seasonId` fields, so filtering can happen client-side with zero additional fetches.

## Design

### Data Flow

```
__root.tsx beforeLoad → preloads teams + games (all seasons)
standings/index.tsx loader → preloads seasons list via ensureQueryData(seasonQueries.list())
ScoreBoard component → reads teams + games from route context, filters by selected seasonId
```

### Changes

#### 1. `src/routes/standings/index.tsx`
- Add `loader` that calls `queryClient.ensureQueryData(seasonQueries.list())` to preload seasons

#### 2. `lib/components/standings/score-board.tsx`
- Remove `getGamesForTeams` and `getTeamsBySeason` imports and server calls
- Add `useRouteContext({ from: "__root__" })` to read `games` and `teams`
- Replace `useGetSeasons()` with `useSuspenseQuery(seasonQueries.list())` to match the query key used by the route loader (`["seasons", "list"]`), ensuring the preloaded cache is hit
- Filter `teams` by `team.seasonId === selectedSeasonId`
- Filter `games` by `game.seasonId === selectedSeasonId`
- Keep the season dropdown, default to the active season
- Pass filtered teams + games to `calculateTeamStandings()`
- Remove debug `console.log` if present

#### 3. `lib/components/standings/team-rankings.tsx`
- Same refactor as `ScoreBoard`: use route context + client-side filtering
- Remove server calls for teams and games
- Note: `TeamRankings` only shows the active season (no dropdown) — this behavior stays the same, it just filters client-side instead of fetching

#### 4. `lib/utils/calculateTeamStandings.ts`
- Widen first parameter type from `TeamWithSeason[]` to `Team[]` — the function only uses `id`, `name`, and `logoUrl`, never accesses the `season` relation, so this is safe

#### 5. Revert `getGamesForTeams` `seasonId` parameter
- `src/services/game.service.ts` — remove `seasonId` from interface and implementation
- `src/controllers/game.api.ts` — remove `seasonId` from Zod validator and handler call

#### 6. Cleanup
- `getTeamsBySeason` and `getGamesForTeams` remain in their respective controllers/services for potential future use, but their imports are removed from `score-board.tsx` and `team-rankings.tsx`

### What Stays the Same
- `GameCard` and `CarouselSpacing` — unrelated, no changes
- Season dropdown UX in ScoreBoard — same behavior, defaults to active season, allows switching
- TeamRankings — continues to show only active season standings (no dropdown)

### Filtering Logic (client-side)
```ts
const { teams, games } = useRouteContext({ from: "__root__" });
const filteredTeams = teams.filter(t => t.seasonId === selectedSeasonId);
const filteredGames = games.filter(g => g.seasonId === selectedSeasonId);
const standings = calculateTeamStandings(filteredTeams, filteredGames);
```

## Trade-offs

**Pros:**
- Eliminates 4-6 server round-trips on the standings page (2 components x 2-3 calls each)
- Instant season switching — no loading state when changing the dropdown
- Leverages existing root context preloading pattern

**Cons:**
- Root context loads all games/teams across all seasons (slightly larger initial payload)
- If the dataset grows very large, client-side filtering could become slow (unlikely for a league app)

## Out of Scope
- Changing root context preloading strategy
- Adding new features to the standings page
