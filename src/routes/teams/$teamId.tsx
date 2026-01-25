import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute, Link, useRouteContext } from "@tanstack/react-router";
import { CarouselSpacing } from "~/lib/components/carousel-spacing";
import { TeamOverallStatsTable } from "~/lib/components/stats/team-overall-stats-table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/lib/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";
import {
  GlossaryItem,
  StatsGlossary,
} from "~/lib/components/ui/stats-glossary";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";
import {
  playerGameStatsQueries,
  playerQueries,
  teamGameStatsQueries,
} from "~/src/queries";
import { Player } from "~/src/types/player";
import { PlayerGameStatsAverage } from "~/src/types/player-game-stats";
import { TeamGameStatsWithTeam } from "~/src/types/team-game-stats";

export const Route = createFileRoute("/teams/$teamId")({
  beforeLoad: async ({ params, context }) => {
    // Pre-fetch team players and stats
    await context.queryClient.ensureQueryData(
      playerQueries.teamPlayers(params.teamId!),
    );

    await context.queryClient.ensureQueryData(
      teamGameStatsQueries.teamStats(params.teamId!),
    );

    await context.queryClient.ensureQueryData(
      playerGameStatsQueries.playerGameStatsAveragesByTeam(params.teamId!),
    );
  },
  component: RouteComponent,
});

// Add interfaces for the team stats
interface GroupedStats {
  all: TeamGameStatsWithTeam[];
  wins: TeamGameStatsWithTeam[];
  losses: TeamGameStatsWithTeam[];
}

// Interface for player stat leaders
interface StatLeader {
  player: PlayerGameStatsAverage["player"];
  value: number;
  label: string;
}

function RouteComponent() {
  const { teamId } = Route.useParams();
  const [playerQuery, teamStatsQuery, playerGameStatsAveragesQuery] =
    useSuspenseQueries({
      queries: [
        playerQueries.teamPlayers(teamId),
        teamGameStatsQueries.teamStats(teamId),
        playerGameStatsQueries.playerGameStatsAveragesByTeam(teamId),
      ],
    });
  const { teams: teamInfo } = useRouteContext({ from: "__root__" });
  const { games: gameInfo } = useRouteContext({ from: "__root__" });

  const team = teamInfo.find((t) => t.id === teamId)!;
  const games = gameInfo.filter(
    (g) => g.homeTeamId === teamId || g.awayTeamId === teamId,
  );

  const players = playerQuery.data as Player[];
  const teamStats = teamStatsQuery.data as TeamGameStatsWithTeam[];
  const playerGameStatsAverages =
    playerGameStatsAveragesQuery.data as PlayerGameStatsAverage[];

  // Process team stats to calculate averages
  const groupedStats: GroupedStats = {
    all: [],
    wins: [],
    losses: [],
  };

  if (teamStats && teamStats.length > 0) {
    teamStats.forEach((stat) => {
      // Add to all games
      groupedStats.all.push(stat);

      // Find the game to determine if it was a win or loss
      const game = games.find((g) => g.id === stat.gameId);
      if (game) {
        const isHome = game.homeTeamId === teamId;
        const teamScore = isHome ? game.homeTeamScore : game.awayTeamScore;
        const opponentScore = isHome ? game.awayTeamScore : game.homeTeamScore;

        if (teamScore > opponentScore) {
          groupedStats.wins.push(stat);
        } else if (teamScore < opponentScore) {
          groupedStats.losses.push(stat);
        }
      }
    });
  }

  // Calculate player stat leaders based on mock stats
  const statLeaders: StatLeader[] = [];

  // Define stat categories with their sorting criteria
  const statCategories = [
    { key: "pointsPerGame", label: "PPG" },
    { key: "assistsPerGame", label: "APG" },
    { key: "stealsPerGame", label: "SPG" },
    { key: "blocksPerGame", label: "BPG" },
    { key: "reboundsPerGame", label: "RBG" },
    { key: "twoPointAttemptsPerGame", label: "2PA" },
    { key: "twoPointersMadePerGame", label: "2PM" },
    { key: "twoPointPercentage", label: "2PT%" },
    { key: "threePointAttemptsPerGame", label: "3PA" },
    { key: "threePointersMadePerGame", label: "3PM" },
    { key: "threePointPercentage", label: "3PT%" },
    { key: "freeThrowAttemptsPerGame", label: "FTA" },
    { key: "freeThrowsMadePerGame", label: "FTM" },
    { key: "freeThrowPercentage", label: "FT%" },
    { key: "turnoversPerGame", label: "TPG" },
    { key: "personalFoulsPerGame", label: "PFPG" },
  ];

  if (playerGameStatsAverages.length > 0) {
    // Calculate leaders for each stat category
    statCategories.forEach(({ key, label }) => {
      // Type-safe approach to sorting numeric stats
      const sortedPlayers = [...playerGameStatsAverages].sort((a, b) => {
        const valueA = a[key as keyof PlayerGameStatsAverage];
        const valueB = b[key as keyof PlayerGameStatsAverage];

        // Ensure we're comparing numbers
        if (typeof valueA === "number" && typeof valueB === "number") {
          return valueB - valueA; // Descending order
        }
        return 0;
      });

      const leader = sortedPlayers[0];

      if (leader) {
        const statValue = leader[key as keyof PlayerGameStatsAverage];

        // Only add the leader if the value is a number
        if (typeof statValue === "number") {
          statLeaders.push({
            player: leader.player,
            value: statValue,
            label: label,
          });
        }
      }
    });
  }

  // Create glossaryItems only if we have statLeaders
  const glossaryItems =
    playerGameStatsAverages.length > 0
      ? (statCategories as GlossaryItem[])
      : [];

  // Find the captain
  const captain = players?.find((p) => p.isCaptain);

  return (
    <div className="">
      <div className="max-w-7xl px-8 pt-8 mx-auto space-y-8">
        {/* Row 1: Team Header (Logo + Name) */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-white shadow-xl ring-4 ring-white/50 shrink-0">
            <img
              src={
                team.logoUrl && team.logoUrl.startsWith("http")
                  ? team.logoUrl
                  : team.logoUrl
                    ? `/team_logos/${team.logoUrl}`
                    : ""
              }
              alt={`${team.name} logo`}
              className="w-full h-full object-contain p-2"
            />
          </div>
          <div className="text-center md:text-left space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">
              {team.name}
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Est. {team.createdAt.getFullYear()}
            </p>
          </div>
        </div>

        {/* Row 2: Captain & Team Image Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Captain Card (Takes 1 col) */}
          {captain ? (
            <div className="lg:col-span-1 h-[350px]">
              <div className="relative group overflow-hidden rounded-2xl shadow-2xl transition-all hover:shadow-3xl h-full flex flex-col">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-red-600 z-0" />

                {/* Captain Content */}
                <div className="relative z-10 w-full h-full">
                  {/* Player Cutout - Centered/Bottom */}
                  <div className="absolute inset-0 flex items-end justify-center pb-20 z-10 pointer-events-none">
                    <div className="relative w-full h-full flex items-end justify-center max-w-[280px] transition-transform group-hover:scale-105 duration-300">
                      {captain.playerUrl ? (
                        <img
                          src={captain.playerUrl}
                          alt={captain.name}
                          className="w-full h-full object-cover object-top mask-image-gradient"
                          style={{
                            maskImage:
                              "linear-gradient(to bottom, black 80%, transparent 100%)",
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/10 text-6xl font-bold text-white/20 rounded-t-xl mb-4">
                          {captain.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info Overlay - Absolute Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-5 text-white">
                    <div className="flex flex-col gap-3">
                      <div>
                        <h3 className="text-xs uppercase tracking-widest font-semibold text-red-300 mb-1">
                          Team Captain
                        </h3>
                        <h2 className="text-3xl font-bold leading-none truncate">
                          {captain.name}
                        </h2>
                      </div>
                      <Link
                        to="/players/$playerId"
                        params={{ playerId: captain.id }}
                        className="w-full py-3 rounded-xl bg-white text-indigo-950 text-sm font-bold hover:bg-indigo-50 transition-colors uppercase tracking-wider text-center"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-1 bg-muted/20 rounded-2xl border flex items-center justify-center h-[350px]">
              <p className="text-muted-foreground font-medium">
                No Captain Assigned
              </p>
            </div>
          )}

          {/* Team Image (Takes 2 cols) */}
          {team.imageUrl ? (
            <div
              className={`lg:col-span-2 relative rounded-2xl overflow-hidden shadow-xl group h-[350px]`}
            >
              <div className="absolute inset-0 transition-colors z-10" />
              <img
                src={team.imageUrl}
                alt={`${team.name} Team Photo`}
                className="w-full h-full object-cover transform decoration-transparent transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="lg:col-span-2 bg-muted/20 rounded-2xl border flex items-center justify-center h-[350px]">
              <p className="text-muted-foreground font-medium">No Team Photo</p>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">All Games</h1>
      </div>
      <div className="max-w-full bg-slate-100 dark:bg-gray-800">
        <div className="container mx-auto">
          <CarouselSpacing
            isTeamInfo={true}
            filter={(game) =>
              game.homeTeamName === team.name || game.awayTeamName === team.name
            }
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Team Roster and Player Leaders */}
          <div className="grid grid-cols-1 gap-6">
            {/* Team Roster */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-bold text-xl">Roster</CardTitle>
              </CardHeader>
              <CardContent>
                {players && players.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16 text-center">No.</TableHead>
                        <TableHead className="text-center">Name</TableHead>
                        <TableHead className="text-center">Position</TableHead>
                        <TableHead className="text-center">Height</TableHead>
                        <TableHead className="text-center">Weight</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {players.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell className="text-center">
                            {player.jerseyNumber}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="pl-4 flex items-center gap-4">
                              <Avatar>
                                <AvatarImage
                                  src={player.playerUrl || ""}
                                  alt={player.name}
                                  className="object-cover"
                                />
                                <AvatarFallback>
                                  {player.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <Link
                                to="/players/$playerId"
                                params={{ playerId: player.id }}
                                className="flex items-center gap-3 hover:underline underline-offset-4"
                              >
                                <span className="font-medium">
                                  {player.name}
                                </span>
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {player.position || "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            {player.height ? `${player.height} cm` : "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            {player.weight ? `${player.weight} kg` : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">
                    No players found for this team.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Player Stat Leaders */}
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-bold text-xl">
                  Leaderboard Stats
                </CardTitle>
                <StatsGlossary
                  items={glossaryItems}
                  title="Player Stats Glossary"
                />
              </CardHeader>
              <CardContent>
                {statLeaders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">Category</TableHead>
                        <TableHead className="text-center">Player</TableHead>
                        <TableHead className="text-center">Average</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statLeaders.map((leader, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-center">
                            {leader.label}
                          </TableCell>
                          <TableCell className="text-center">
                            {leader.player.name}
                          </TableCell>
                          <TableCell className="text-center">
                            {leader.label.includes("%")
                              ? `${(leader.value * 100).toFixed(1)}%`
                              : leader.value.toFixed(1)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">
                    No player statistics available.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Team Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-xl">Team Stats</CardTitle>
            </CardHeader>
            <CardContent>
              {teamStats.length > 0 ? (
                <TeamOverallStatsTable
                  teamName={team.name}
                  teamStats={teamStats}
                  games={games}
                  teamId={team.id}
                />
              ) : (
                <p className="text-muted-foreground">
                  No stats available for this team.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
