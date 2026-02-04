import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";
import { PlayerGameStatsWithPlayer } from "~/src/types/player-game-stats";
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
      const teamName = stat.player?.teamName || "Unknown Team";
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
    >,
  );

  const statHeaders = [
    { key: "jerseyNumber", label: "No.", className: "text-center" },
    { key: "name", label: "Player", className: "text-left" },
    { key: "minutesPlayed", label: "MIN", className: "text-center" },
    { key: "points", label: "PTS", className: "text-center" },
    { key: "twoPointersMade", label: "2PM", className: "text-center" },
    { key: "twoPointersAttempted", label: "2PA", className: "text-center" },
    { key: "twoPointersPercentage", label: "2P%", className: "text-center" },
    { key: "threePointersMade", label: "3PM", className: "text-center" },
    { key: "threePointersAttempted", label: "3PA", className: "text-center" },
    {
      key: "threePointersPercentage",
      label: "3P%",
      className: "text-center",
    },
    { key: "fieldGoalsMade", label: "FGM", className: "text-center" },
    { key: "fieldGoalsAttempted", label: "FGA", className: "text-center" },
    { key: "fieldGoalsPercentage", label: "FG%", className: "text-center" },
    { key: "freeThrowsMade", label: "FTM", className: "text-center" },
    { key: "freeThrowsAttempted", label: "FTA", className: "text-center" },
    { key: "freeThrowsPercentage", label: "FT%", className: "text-center" },
    { key: "totalRebounds", label: "REB", className: "text-center" },
    { key: "assists", label: "AST", className: "text-center" },
    { key: "steals", label: "STL", className: "text-center" },
    { key: "blocks", label: "BLK", className: "text-center" },
    { key: "personalFouls", label: "PF", className: "text-center" },
    { key: "plusMinus", label: "+/-", className: "text-center" },
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
                              header.key !== "jerseyNumber" && (
                                <TableHead
                                  key={header.key}
                                  className={header.className}
                                >
                                  {header.label}
                                </TableHead>
                              ),
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.map((stat) => (
                          <TableRow key={stat.id}>
                            {!isPlayerProfile && (
                              <TableCell className="text-center">
                                {stat.player?.jerseyNumber}
                              </TableCell>
                            )}
                            {!isPlayerProfile && (
                              <TableCell className="font-medium">
                                {stat.player?.name}
                              </TableCell>
                            )}
                            <TableCell className="text-center">
                              {stat.minutesPlayed}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.points}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.twoPointersMade}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.twoPointersAttempted}
                            </TableCell>
                            <TableCell className="text-center">
                              {formatStat(
                                stat.twoPointersAttempted,
                                stat.twoPointersMade,
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.threePointersMade}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.threePointersAttempted}
                            </TableCell>
                            <TableCell className="text-center">
                              {formatStat(
                                stat.threePointersAttempted,
                                stat.threePointersMade,
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.fieldGoalsMade}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.fieldGoalsAttempted}
                            </TableCell>
                            <TableCell className="text-center">
                              {formatStat(
                                stat.fieldGoalsAttempted,
                                stat.fieldGoalsMade,
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.freeThrowsMade}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.freeThrowsAttempted}
                            </TableCell>
                            <TableCell className="text-center">
                              {formatStat(
                                stat.freeThrowsAttempted,
                                stat.freeThrowsMade,
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.totalRebounds}
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
                              {stat.personalFouls}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.plusMinus}
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
