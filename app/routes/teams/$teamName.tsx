import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  gameQueries,
  playerQueries,
  teamGameStatsQueries,
  teamQueries,
} from "~/app/queries";
import { Game } from "~/app/types/game";
import { Player } from "~/app/types/player";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";

export const Route = createFileRoute("/teams/$teamName")({
  beforeLoad: async ({ params, context }) => {
    const team = await context.queryClient.ensureQueryData(
      teamQueries.detail(params.teamName)
    );

    if (team) {
      // Pre-fetch team players and stats
      const players = await context.queryClient.ensureQueryData(
        playerQueries.teamPlayers(team.id)
      );

      const teamStats = await context.queryClient.ensureQueryData(
        teamGameStatsQueries.teamStats(team.id)
      );

      // Pre-fetch all games for the team
      const games = await context.queryClient.ensureQueryData(
        gameQueries.teamGames(team.id)
      );

      return { team, players, teamStats, games };
    }
  },
  component: RouteComponent,
});

// Add interfaces for the team stats
interface GroupedStats {
  all: TeamGameStatsWithTeam[];
  wins: TeamGameStatsWithTeam[];
  losses: TeamGameStatsWithTeam[];
}

function RouteComponent() {
  const { teamName } = Route.useParams();
  const { data: team } = useSuspenseQuery(teamQueries.detail(teamName));
  const { data: players = [] } = useSuspenseQuery(
    playerQueries.teamPlayers(team?.id || "")
  ) as { data: Player[] };

  const { data: teamStats = [] } = useSuspenseQuery(
    teamGameStatsQueries.teamStats(team?.id || "")
  ) as { data: TeamGameStatsWithTeam[] };

  const { data: games = [] } = useSuspenseQuery(
    gameQueries.teamGames(team?.id || "")
  ) as { data: Game[] };

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

      // We need to load game data to determine if it was a win or loss
      // For now, we'll just categorize by points comparison
      // In a real app, we would have the game data linked to the stats
      const points = stat.points || 0;
      const threshold = 50; // Example threshold

      if (points > threshold) {
        groupedStats.wins.push(stat);
      } else {
        groupedStats.losses.push(stat);
      }
    });
  }

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
          {/* Team Roster */}
          <Card>
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

          <Card>
            <CardHeader>
              <CardTitle>Recent Games</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Recent game results will be displayed here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
