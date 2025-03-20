import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { gameQueries, playerGameStatsQueries } from "~/app/queries";
import type { PlayerGameStatsWithPlayer } from "~/app/types/player-game-stats";
import { PlayerGameStatsTable } from "~/lib/components/stats/player-game-stats-table";
import { Button } from "~/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";

export const Route = createFileRoute("/games/$gameId")({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      playerGameStatsQueries.detail(params.gameId)
    );
    await context.queryClient.ensureQueryData(
      gameQueries.list()
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
  const {
    data: playerStats,
    isLoading,
    isError,
  } = useSuspenseQuery(playerGameStatsQueries.detail(gameId));
  const { data: games } = useSuspenseQuery(gameQueries.list());
  const gameInfo = games?.find((game) => game.id === gameId);

  if (!gameInfo) {
    return <div className="container mx-auto p-4">Game not found</div>;
  }

  // Calculate top scorers from each team
  const getTopScorers = () => {
    if (!playerStats || playerStats.length === 0)
      return { home: null, away: null };

    const homeTeamStats = playerStats.filter(
      (stat) => stat.player?.team_name === gameInfo.home_team_name
    );
    const awayTeamStats = playerStats.filter(
      (stat) => stat.player?.team_name === gameInfo.away_team_name
    );

    const sortByPoints = (
      a: PlayerGameStatsWithPlayer,
      b: PlayerGameStatsWithPlayer
    ) => (b.points || 0) - (a.points || 0);

    const homeTopScorer = homeTeamStats.sort(sortByPoints)[0];
    const awayTopScorer = awayTeamStats.sort(sortByPoints)[0];

    return {
      home: homeTopScorer,
      away: awayTopScorer,
    };
  };

  const topScorers = getTopScorers();

  const scrollToVideo = () => {
    const videoSection = document.getElementById("video-section");
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        {/* Game Score Card */}
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Final Score</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center gap-8 py-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-md mb-2">
                <img
                  src={
                    gameInfo.home_team_logo
                      ? `/team_logos/${gameInfo.home_team_logo}`
                      : "/team_logos/ccbc_logo.png"
                  }
                  alt={`${gameInfo.home_team_name} logo`}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <span className="font-semibold text-lg">
                {gameInfo.home_team_name}
              </span>
              <span className="text-4xl font-bold mt-2">
                {gameInfo.home_team_score}
              </span>
            </div>

            <div className="text-center">
              <div className="text-lg font-medium mb-1">VS</div>
              <div className="text-sm text-muted-foreground">
                {new Date(gameInfo.game_date).toLocaleDateString()}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-md mb-2">
                <img
                  src={
                    gameInfo.away_team_logo
                      ? `/team_logos/${gameInfo.away_team_logo}`
                      : "/team_logos/ccbc_logo.png"
                  }
                  alt={`${gameInfo.away_team_name} logo`}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <span className="font-semibold text-lg">
                {gameInfo.away_team_name}
              </span>
              <span className="text-4xl font-bold mt-2">
                {gameInfo.away_team_score}
              </span>
            </div>
          </CardContent>
          <CardFooter className="justify-start pb-4 pt-0">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={scrollToVideo}
            >
              <ArrowDown className="h-4 w-4" />
              Watch Game
            </Button>
          </CardFooter>
        </Card>

        {/* Team Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Home Team */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-white">
                  <img
                    src={
                      gameInfo.home_team_logo
                        ? `/team_logos/${gameInfo.home_team_logo}`
                        : "/team_logos/ccbc_logo.png"
                    }
                    alt={`${gameInfo.home_team_name} logo`}
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>
                {gameInfo.home_team_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Top Scorer</h3>
                {topScorers.home ? (
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 rounded-full px-2 py-1 text-xs font-medium">
                      #{topScorers.home.player?.jersey_number}
                    </div>
                    <span className="font-semibold">
                      {topScorers.home.player?.name}
                    </span>
                    <span className="text-muted-foreground ml-auto">
                      {topScorers.home.points} pts
                    </span>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    No data available
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-2">Recent Form</h3>
                <div className="flex gap-1">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                    W
                  </div>
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                    L
                  </div>
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                    W
                  </div>
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                    W
                  </div>
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                    L
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Away Team */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-white">
                  <img
                    src={
                      gameInfo.away_team_logo
                        ? `/team_logos/${gameInfo.away_team_logo}`
                        : "/team_logos/ccbc_logo.png"
                    }
                    alt={`${gameInfo.away_team_name} logo`}
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>
                {gameInfo.away_team_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Top Scorer</h3>
                {topScorers.away ? (
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 rounded-full px-2 py-1 text-xs font-medium">
                      #{topScorers.away.player?.jersey_number}
                    </div>
                    <span className="font-semibold">
                      {topScorers.away.player?.name}
                    </span>
                    <span className="text-muted-foreground ml-auto">
                      {topScorers.away.points} pts
                    </span>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    No data available
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-2">Recent Form</h3>
                <div className="flex gap-1">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                    W
                  </div>
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                    W
                  </div>
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                    L
                  </div>
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                    L
                  </div>
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                    W
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player Stats Table */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Player Statistics</h2>
          <PlayerGameStatsTable
            playerStats={playerStats}
            isLoading={isLoading}
            isError={isError}
          />
        </div>

        {/* Game Video Section */}
        <div id="video-section" className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Game Recap</h2>
          <Card>
            <CardContent className="p-0 aspect-video">
              <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                {/* Replace with actual video when available */}
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Game Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
