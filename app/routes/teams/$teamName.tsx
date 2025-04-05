import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  gameQueries,
  playerGameStatsQueries,
  playerQueries,
  teamGameStatsQueries,
  teamQueries,
} from "~/app/queries";
import { Game } from "~/app/types/game";
import { Player } from "~/app/types/player";
import { PlayerGameStatsAverage } from "~/app/types/player-game-stats";
import { TeamGameStatsWithTeam } from "~/app/types/team-game-stats";
import { CarouselSpacing } from "~/lib/components/carousel-spacing";
import { TeamOverallStatsTable } from "~/lib/components/stats/team-overall-stats-table";
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

export const Route = createFileRoute("/teams/$teamName")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    // Pre-fetch data
    const team = await context.queryClient.ensureQueryData(
      teamQueries.detail(params.teamName)
    );

    if (team) {
      // Pre-fetch team players and stats
      await context.queryClient.ensureQueryData(
        playerQueries.teamPlayers(team.id)
      );

      await context.queryClient.ensureQueryData(
        teamGameStatsQueries.teamStats(team.id)
      );

      // Pre-fetch all games for the team
      await context.queryClient.ensureQueryData(gameQueries.teamGames(team.id));

      await context.queryClient.ensureQueryData(
        playerGameStatsQueries.playerGameStatsAveragesByTeam(team.id)
      );
    }

    return { team };
  },
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
  const { team } = Route.useLoaderData();
  const [
    playerQuery,
    teamStatsQuery,
    gamesQuery,
    playerGameStatsAveragesQuery,
  ] = useSuspenseQueries({
    queries: [
      playerQueries.teamPlayers(team!.id),
      teamGameStatsQueries.teamStats(team!.id),
      gameQueries.teamGames(team!.id),
      playerGameStatsQueries.playerGameStatsAveragesByTeam(team!.id),
    ],
  });

  const players = playerQuery.data as Player[];
  const teamStats = teamStatsQuery.data as TeamGameStatsWithTeam[];
  const games = gamesQuery.data as Game[];
  const playerGameStatsAverages =
    playerGameStatsAveragesQuery.data as PlayerGameStatsAverage[];

  if (!team) {
    return <div className="p-8">Loading team information...</div>;
  }

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
      const game = games.find((g) => g.id === stat.game_id);
      if (game) {
        const isHome = game.home_team_id === team.id;
        const teamScore = isHome ? game.home_team_score : game.away_team_score;
        const opponentScore = isHome
          ? game.away_team_score
          : game.home_team_score;

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
    { key: "points_per_game", label: "PPG" },
    { key: "assists_per_game", label: "APG" },
    { key: "steals_per_game", label: "SPG" },
    { key: "blocks_per_game", label: "BPG" },
    { key: "rebounds_per_game", label: "RBG" },
    { key: "two_point_attempts_per_game", label: "2PA" },
    { key: "two_pointers_made_per_game", label: "2PM" },
    { key: "two_point_percentage", label: "2PT%" },
    { key: "three_point_attempts_per_game", label: "3PA" },
    { key: "three_pointers_made_per_game", label: "3PM" },
    { key: "three_point_percentage", label: "3PT%" },
    { key: "free_throw_attempts_per_game", label: "FTA" },
    { key: "free_throws_made_per_game", label: "FTM" },
    { key: "free_throw_percentage", label: "FT%" },
    { key: "turnovers_per_game", label: "TPG" },
    { key: "personal_fouls_per_game", label: "PFPG" },
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
            src={`/team_logos/${team.logo_url}`}
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
              game.home_team_name === team.name ||
              game.away_team_name === team.name
            }
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Team Roster and Player Leaders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <TableRow key={player.player_id}>
                          <TableCell className="text-center">
                            {player.jersey_number}
                          </TableCell>
                          <TableCell className="text-center">
                            {player.name}
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
