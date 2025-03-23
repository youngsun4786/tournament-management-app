import { PlayerGameStatsWithPlayer } from "~/app/types/player-game-stats";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface PlayerGameStatsTableProps {
  playerStats: PlayerGameStatsWithPlayer[];
  isLoading: boolean;
  isPlayerProfile: boolean;
}

export const PlayerGameStatsTable = ({
  playerStats,
  isLoading,
  isPlayerProfile = false,
}: PlayerGameStatsTableProps) => {
  // Group stats by team
  const groupedStats = playerStats?.reduce(
    (acc, stat) => {
      // Get team id from the player's team relationship
      // Since we might not have team_id directly on player, use a reliable identifier
      const teamName = stat.player?.team_name || "Unknown Team";
      if (!acc[teamName]) {
        acc[teamName] = {
          teamName,
          stats: [],
        };
      }
      acc[teamName].stats.push(stat);
      return acc;
    },
    {} as Record<
      string,
      { teamName: string; stats: PlayerGameStatsWithPlayer[] }
    >
  );

  const statHeaders = [
    { key: "jersey_number", label: "No.", className: "text-center" },
    { key: "name", label: "Player", className: "text-left" },
    { key: "minutes_played", label: "MIN", className: "text-center" },
    { key: "points", label: "PTS", className: "text-center" },
    { key: "two_pointers_made", label: "2PM", className: "text-center" },
    { key: "two_pointers_attempted", label: "2PA", className: "text-center" },
    { key: "two_pointers_percentage", label: "2P%", className: "text-center" },
    { key: "three_pointers_made", label: "3PM", className: "text-center" },
    { key: "three_pointers_attempted", label: "3PA", className: "text-center" },
    {
      key: "three_pointers_percentage",
      label: "3P%",
      className: "text-center",
    },
    { key: "field_goals_made", label: "FGM", className: "text-center" },
    { key: "field_goals_attempted", label: "FGA", className: "text-center" },
    { key: "field_goals_percentage", label: "FG%", className: "text-center" },
    { key: "free_throws_made", label: "FTM", className: "text-center" },
    { key: "free_throws_attempted", label: "FTA", className: "text-center" },
    { key: "free_throws_percentage", label: "FT%", className: "text-center" },
    { key: "rebounds", label: "REB", className: "text-center" },
    { key: "assists", label: "AST", className: "text-center" },
    { key: "steals", label: "STL", className: "text-center" },
    { key: "blocks", label: "BLK", className: "text-center" },
    { key: "turnovers", label: "TOV", className: "text-center" },
    { key: "personal_fouls", label: "PF", className: "text-center" },
    { key: "plus_minus", label: "+/-", className: "text-center" },
  ];

  const formatStat = (attempted: number | null, made: number | null) => {
    if (attempted === null || made === null) {
      return "-";
    }
    if (attempted === 0) {
      return "0%";
    }
    return `${((made / attempted) * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"></div>
      {isLoading ? (
        <div className="text-center py-10">Loading player statistics...</div>
      ) : playerStats?.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-gray-500">
              No player statistics available for this game yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {groupedStats &&
            Object.values(groupedStats).map(({ teamName, stats }) => (
              <Card key={teamName} className="mb-6">
                <CardHeader>
                  <CardTitle>{teamName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {!isPlayerProfile && (
                            <TableHead className="text-center">No.</TableHead>
                          )}
                          {!isPlayerProfile && (
                            <TableHead className="text-center">
                              Player
                            </TableHead>
                          )}
                          {statHeaders.map(
                            (header) =>
                              header.key !== "name" &&
                              header.key !== "jersey_number" && (
                                <TableHead
                                  key={header.key}
                                  className={header.className}
                                >
                                  {header.label}
                                </TableHead>
                              )
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.map((stat) => (
                          <TableRow key={stat.pgs_id}>
                            {!isPlayerProfile && (
                              <TableCell className="text-center">
                                {stat.player?.jersey_number}
                              </TableCell>
                            )}
                            {!isPlayerProfile && (
                              <TableCell className="font-medium">
                                {stat.player?.name}
                              </TableCell>
                            )}
                            <TableCell className="text-center">
                              {stat.minutes_played}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.points}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.two_pointers_made}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.two_pointers_attempted}
                            </TableCell>
                            <TableCell className="text-center">
                              {formatStat(
                                stat.two_pointers_attempted,
                                stat.two_pointers_made
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.three_pointers_made}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.three_pointers_attempted}
                            </TableCell>
                            <TableCell className="text-center">
                              {formatStat(
                                stat.three_pointers_attempted,
                                stat.three_pointers_made
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.field_goals_made}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.field_goals_attempted}
                            </TableCell>
                            <TableCell className="text-center">
                              {formatStat(
                                stat.field_goals_attempted,
                                stat.field_goals_made
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.free_throws_made}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.free_throws_attempted}
                            </TableCell>
                            <TableCell className="text-center">
                              {formatStat(
                                stat.free_throws_attempted,
                                stat.free_throws_made
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.total_rebounds}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.assists}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.steals}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.blocks}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.turnovers}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.personal_fouls}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.plus_minus}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}
        </>
      )}
    </div>
  );
};
