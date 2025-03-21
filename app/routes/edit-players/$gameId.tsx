import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { FinalScoreForm } from "~/lib/components/games/final-score-form";
import { PlayerStatsManager } from "~/lib/components/stats/player-stats-manager";

export const Route = createFileRoute("/edit-players/$gameId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { gameId } = Route.useParams();
  const { games } = useRouteContext({ from: "__root__" });
  const gameInfo = games.find((game) => game.id === gameId);

  if (!gameInfo) {
    return <div className="container mx-auto p-4">Game not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {gameInfo.home_team_name} vs {gameInfo.away_team_name}
      </h1>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-4">
          <PlayerStatsManager gameId={gameId} />
        </div>
        <div className="flex flex-col justify-center items-center gap-4">
          <FinalScoreForm
            gameId={gameId}
            home_team_name={gameInfo.home_team_name}
            away_team_name={gameInfo.away_team_name}
          />
        </div>
      </div>
    </div>
  );
}
