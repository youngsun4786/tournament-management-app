import {
  createFileRoute,
  redirect,
  useRouteContext,
} from "@tanstack/react-router";
import { FinalScoreForm } from "~/lib/components/games/final-score-form";
import { UploadVideoForm } from "~/lib/components/games/upload-video-form";
import { PlayerStatsManager } from "~/lib/components/stats/player-stats-manager";

export const Route = createFileRoute("/edit-games/$gameId")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.authState.isAuthenticated) {
      throw redirect({ to: "/" });
    }

    if (
      context.authState.user.role !== "admin" &&
      context.authState.user.role !== "score-keeper"
    ) {
      throw redirect({ to: "/" });
    }
  },
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
        {gameInfo.homeTeamName} vs {gameInfo.awayTeamName}
      </h1>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-4 pb-10">
          <PlayerStatsManager gameId={gameId} />
        </div>
        <div className="flex flex-row justify-center items-center gap-4">
          <FinalScoreForm game={gameInfo} />
          <UploadVideoForm game={gameInfo} />
        </div>
      </div>
    </div>
  );
}
