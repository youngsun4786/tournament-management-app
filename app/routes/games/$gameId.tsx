import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { playerGameStatsQueries } from "~/app/queries";
import { PlayerStatsManager } from "~/lib/components/stats/player-stats-manager";

export const Route = createFileRoute("/games/$gameId")({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      playerGameStatsQueries.detail(params.gameId)
    );
  },
  // beforeLoad: async ({ params }) => {
  //   const playerStats = await playerGameStatsService.getByGameId(params.gameId);
  //   return {
  //     playerStats,
  //   };
  // },
  component: RouteComponent,
});

function RouteComponent() {
  const { gameId } = Route.useParams();
  const { data: playerStats } = useSuspenseQuery(
    playerGameStatsQueries.detail(gameId)
  );

  const { games: game } = useRouteContext({ from: "__root__" });
  const gameInfo = game.find((game) => game.game_id === gameId);

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold"></h1>
        <div className="flex flex-col gap-4">
          <PlayerStatsManager
            gameId={gameId}
          />
        </div>
      </div>
    </div>
  );
}
