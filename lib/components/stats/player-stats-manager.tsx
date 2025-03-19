import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { getPlayerGameStatsByGameId } from "~/app/controllers/player-game-stats.api";
import type { PlayerGameStatsWithPlayer } from "~/app/types/player-game-stats";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PlayerStatsActions } from "./player-stats-actions";
import { PlayerStatsModal } from "./player-stats-modal";

interface PlayerStatsManagerProps {
  gameId: string;
}

export const PlayerStatsManager = ({ gameId }: PlayerStatsManagerProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: playerStats, isLoading } = useQuery({
    queryKey: ["gamePlayerStats", gameId],
    queryFn: async () => {
      const response = await getPlayerGameStatsByGameId({
        data: { gameId },
      });
      return response;
    },
  });

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

  const handleAddStats = () => {
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Player Game Statistics</h2>
        <Button onClick={handleAddStats} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Player Stats
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading player statistics...</div>
      ) : playerStats?.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-gray-500">
              No player statistics available for this game yet.
            </p>
            <Button onClick={handleAddStats} className="mt-4">
              Add Player Stats
            </Button>
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
                          <TableHead className="text-left">Player</TableHead>
                          <TableHead className="text-center">MIN</TableHead>
                          <TableHead className="text-center">PTS</TableHead>
                          <TableHead className="text-center">FG</TableHead>
                          <TableHead className="text-center">3PT</TableHead>
                          <TableHead className="text-center">FT</TableHead>
                          <TableHead className="text-center">REB</TableHead>
                          <TableHead className="text-center">AST</TableHead>
                          <TableHead className="text-center">STL</TableHead>
                          <TableHead className="text-center">BLK</TableHead>
                          <TableHead className="text-center">TO</TableHead>
                          <TableHead className="text-center">PF</TableHead>
                          <TableHead className="text-center">+/-</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.map((stat) => (
                          <TableRow key={stat.pgs_id}>
                            <TableCell className="font-medium">
                              {stat.player?.name}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.minutes_played}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.points}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.field_goals_made}/
                              {stat.field_goals_attempted}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.three_pointers_made}/
                              {stat.three_pointers_attempted}
                            </TableCell>
                            <TableCell className="text-center">
                              {stat.free_throws_made}/
                              {stat.free_throws_attempted}
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
                            <TableCell className="flex items-center justify-center">
                              <PlayerStatsActions
                                gameId={gameId}
                                stats={stat}
                              />
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

      <PlayerStatsModal
        gameId={gameId}
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
