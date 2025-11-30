import { createFileRoute } from "@tanstack/react-router";
import { PlayerGameStatsGrid } from "~/lib/components/stats/player-game-stats-grid";

export const Route = createFileRoute("/stats/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="container m-auto p-4">
        <div className="flex justify-center items-center">
          <PlayerGameStatsGrid />
        </div>
      </div>
    </div>
  );
}
