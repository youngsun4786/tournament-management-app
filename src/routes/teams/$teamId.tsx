import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
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
  gameQueries,
  playerGameStatsQueries,
  playerQueries,
  teamGameStatsQueries,
  teamQueries,
} from "~/src/queries";
import { Game } from "~/src/types/game";
import { Player } from "~/src/types/player";
import { PlayerGameStatsAverage } from "~/src/types/player-game-stats";
import { Team } from "~/src/types/team";
import { TeamGameStatsWithTeam } from "~/src/types/team-game-stats";

export const Route = createFileRoute("/teams/$teamId")({
  beforeLoad: async ({ params, context }) => {
    // Pre-fetch data
    const team = await context.queryClient.ensureQueryData(
      teamQueries.getTeamById(params.teamId)
    );

    // Pre-fetch team players and stats
    await context.queryClient.ensureQueryData(
      playerQueries.teamPlayers(team!.id)
    );

    await context.queryClient.ensureQueryData(
      teamGameStatsQueries.teamStats(team!.id)
    );

    // Pre-fetch all games for the team
    await context.queryClient.ensureQueryData(gameQueries.teamGames(team!.id));

    await context.queryClient.ensureQueryData(
      playerGameStatsQueries.playerGameStatsAveragesByTeam(team!.id)
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
  const [
    teamQuery,
    playerQuery,
    teamStatsQuery,
    gamesQuery,
    playerGameStatsAveragesQuery,
  ] = useSuspenseQueries({
    queries: [
      teamQueries.getTeamById(teamId),
      playerQueries.teamPlayers(teamId),
      teamGameStatsQueries.teamStats(teamId),
      gameQueries.teamGames(teamId),
      playerGameStatsQueries.playerGameStatsAveragesByTeam(teamId),
    ],
  });

  const team = teamQuery.data as Team;
  const players = playerQuery.data as Player[];
  const teamStats = teamStatsQuery.data as TeamGameStatsWithTeam[];
  const games = gamesQuery.data as Game[];
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
        const opponentScore = isHome
          ? game.awayTeamScore
          : game.homeTeamScore;

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

  return (
    <div className="">
      <div className="max-w-7xl p-8 mx-auto flex items-center gap-6 mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-md">
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
        <div>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">Est. 2023</p>
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
              game.homeTeamName === team.name ||
              game.awayTeamName === team.name
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
