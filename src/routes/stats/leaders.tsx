import { createFileRoute } from "@tanstack/react-router";
import { PlayerGameStatsGrid } from "~/lib/components/stats/player-game-stats-grid";

export const Route = createFileRoute("/stats/leaders")({
  component: StatsLeadersPage,
});

function StatsLeadersPage() {
  return <PlayerGameStatsGrid />;
}
