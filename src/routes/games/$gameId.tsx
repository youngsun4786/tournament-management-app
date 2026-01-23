import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { useEffect } from "react";
import { PlayerGameStatsTable } from "~/lib/components/stats/player-game-stats-table";
import { TeamGameStatsTable } from "~/lib/components/stats/team-game-stats-table";
import { Button } from "~/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/lib/components/ui/tabs";
import {
  gameQueries,
  mediaQueries,
  playerGameStatsQueries,
  teamGameStatsQueries,
} from "~/src/queries";
import type { PlayerGameStatsWithPlayer } from "~/src/types/player-game-stats";

export const Route = createFileRoute("/games/$gameId")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      section: search.section as string | undefined,
    };
  },
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      playerGameStatsQueries.detail(params.gameId),
    );
    await context.queryClient.ensureQueryData(
      teamGameStatsQueries.detail(params.gameId),
    );
    await context.queryClient.ensureQueryData(gameQueries.list());
    await context.queryClient.ensureQueryData(
      mediaQueries.videosByGameId(params.gameId),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { gameId } = Route.useParams();
  const { data: playerStats, isLoading } = useQuery(
    playerGameStatsQueries.detail(gameId),
  );
  const { data: games } = useQuery(gameQueries.list());
  const gameInfo = games?.find((game) => game.id === gameId);
  const { data: videos } = useQuery(mediaQueries.videosByGameId(gameId));
  const { section } = Route.useSearch();

  // Scroll to video section if section=video-section is in the URL
  useEffect(() => {
    if (section === "video-section") {
      const videoSection = document.getElementById("video-section");
      if (videoSection) {
        videoSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [section]);

  if (!gameInfo) {
    return <div className="container mx-auto p-4">Game not found</div>;
  }

  // Calculate top scorers from each team
  const getTopScorers = () => {
    if (!playerStats || playerStats.length === 0)
      return { home: null, away: null };

    const homeTeamStats = playerStats.filter(
      (stat) => stat.player?.teamName === gameInfo.homeTeamName,
    );
    const awayTeamStats = playerStats.filter(
      (stat) => stat.player?.teamName === gameInfo.awayTeamName,
    );

    const sortByPoints = (
      a: PlayerGameStatsWithPlayer,
      b: PlayerGameStatsWithPlayer,
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
                    gameInfo.homeTeamLogo
                      ? `/team_logos/${gameInfo.homeTeamLogo}`
                      : "/team_logos/ccbc_logo.png"
                  }
                  alt={`${gameInfo.homeTeamName} logo`}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <span className="font-semibold text-lg">
                {gameInfo.homeTeamName}
              </span>
              <span className="text-4xl font-bold mt-2">
                {gameInfo.homeTeamScore}
              </span>
            </div>

            <div className="text-center">
              <div className="text-lg font-medium mb-1">VS</div>
              <div className="text-sm text-muted-foreground">
                {new Date(gameInfo.gameDate).toLocaleDateString()}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-md mb-2">
                <img
                  src={
                    gameInfo.awayTeamLogo
                      ? `/team_logos/${gameInfo.awayTeamLogo}`
                      : "/team_logos/ccbc_logo.png"
                  }
                  alt={`${gameInfo.awayTeamName} logo`}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <span className="font-semibold text-lg">
                {gameInfo.awayTeamName}
              </span>
              <span className="text-4xl font-bold mt-2">
                {gameInfo.awayTeamScore}
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
                      gameInfo.homeTeamLogo
                        ? `/team_logos/${gameInfo.homeTeamLogo}`
                        : "/team_logos/ccbc_logo.png"
                    }
                    alt={`${gameInfo.homeTeamName} logo`}
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>
                {gameInfo.homeTeamName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Top Scorer</h3>
                {topScorers.home ? (
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 rounded-full px-2 py-1 text-xs font-medium">
                      #{topScorers.home.player?.jerseyNumber}
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

              {/* !TODO: ADD RECENT FORM TO DISPLAY LATEST WIN/LOSS STREAK */}
              {/* <div>
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
              </div> */}
            </CardContent>
          </Card>

          {/* Away Team */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-white">
                  <img
                    src={
                      gameInfo.awayTeamLogo
                        ? `/team_logos/${gameInfo.awayTeamLogo}`
                        : "/team_logos/ccbc_logo.png"
                    }
                    alt={`${gameInfo.awayTeamName} logo`}
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>
                {gameInfo.awayTeamName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Top Scorer</h3>
                {topScorers.away ? (
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 rounded-full px-2 py-1 text-xs font-medium">
                      #{topScorers.away.player?.jerseyNumber}
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

              {/* !TODO: ADD RECENT FORM TO DISPLAY LATEST WIN/LOSS STREAK */}
              {/* <div>
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
              </div> */}
            </CardContent>
          </Card>
        </div>

        {/* Player Stats Table */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Game Statistics</h2>
          <Tabs defaultValue="player-stats" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="player-stats">Player Stats</TabsTrigger>
              <TabsTrigger value="team-stats">Team Stats</TabsTrigger>
            </TabsList>
            <TabsContent value="player-stats">
              <PlayerGameStatsTable
                playerStats={playerStats || []}
                isLoading={isLoading}
                isPlayerProfile={false}
              />
            </TabsContent>
            <TabsContent value="team-stats">
              <TeamGameStatsTable gameId={gameId} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Game Video Section */}
        <div id="video-section" className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Game Recaps</h2>
          {videos && videos.length > 0 ? (
            <Card>
              <Tabs defaultValue="1" className="w-full">
                <CardHeader className="pb-0">
                  <TabsList>
                    {[1, 2, 3, 4].map((quarter) => {
                      const hasVideos = videos.some(
                        (video) => video.quarter === quarter,
                      );
                      return (
                        <TabsTrigger
                          key={quarter}
                          value={quarter.toString()}
                          disabled={!hasVideos}
                        >
                          Quarter {quarter}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </CardHeader>
                <CardContent className="pt-4">
                  {[1, 2, 3, 4].map((quarter) => {
                    const quarterVideos = videos.filter(
                      (video) => video.quarter === quarter,
                    );
                    return (
                      <TabsContent
                        key={`quarter-${quarter}`}
                        value={quarter.toString()}
                        className="p-0"
                      >
                        {quarterVideos.length > 0 ? (
                          <div className="grid gap-4">
                            {quarterVideos.map((video) => (
                              <div
                                key={`video-${video.id}`}
                                className="flex flex-col gap-3"
                              >
                                <div className="aspect-video w-full max-w-4xl mx-auto">
                                  <iframe
                                    className="w-full h-full border-none rounded-lg shadow-md"
                                    src={video.youtubeUrl.replace(
                                      "watch?v=",
                                      "embed/",
                                    )}
                                    title={`Quarter ${quarter} Video`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                                {video.description && (
                                  <p className="text-sm p-3 bg-gray-200 rounded-md max-w-4xl mx-auto w-full">
                                    {video.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            No videos available for Quarter {quarter}
                          </div>
                        )}
                      </TabsContent>
                    );
                  })}
                </CardContent>
              </Tabs>
            </Card>
          ) : (
            <Card className="w-full">
              <CardContent className="p-8 text-center text-muted-foreground">
                No game videos available yet
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
