import { useQuery } from "@tanstack/react-query";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { getGamePlayerStats } from "~/app/controllers/player-game-stats.api";
import { PlayerGameStatsWithPlayer } from "~/app/types/player-game-stats";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PlayerGameStatsForm } from "./player-game-stats-form";

interface PlayerStatsTableProps {
  gameId: string;
  canEdit?: boolean;
}

export const PlayerStatsTable = ({
  gameId,
  canEdit = false,
}: PlayerStatsTableProps) => {
  const [editingStat, setEditingStat] =
    useState<PlayerGameStatsWithPlayer | null>(null);
  const [isAddingStats, setIsAddingStats] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");

  const {
    data: stats,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["gamePlayerStats", gameId],
    queryFn: async () => {
      try {
        return await getGamePlayerStats({ data: { game_id: gameId } });
      } catch (error) {
        console.error("Failed to fetch player stats:", error);
        return [];
      }
    },
  });

  // Mock data for players in the game who don't have stats yet
  const { data: availablePlayers, isLoading: playersLoading } = useQuery({
    queryKey: ["availablePlayers", gameId],
    queryFn: async () => {
      // This would be an actual API call in a real implementation
      // Get players who are in the game but don't have stats yet
      return [
        { id: "d0e4f073-14fa-4257-83b2-c70ae57961ae", name: "Li Pei" },
        { id: "6690057e-d522-437d-a1d4-70d32ec855e8", name: "Youdong Ma" },
        { id: "bbae11fa-b200-481a-b4a9-86c61085c13c", name: "Howard Liou" },
        { id: "2a44f44a-d311-4f55-bca7-ac4388862ed8", name: "Paul Chen" },
      ];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleAddSuccess = () => {
    setIsAddingStats(false);
    setSelectedPlayerId("");
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingStat(null);
    refetch();
  };

  if (editingStat) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setEditingStat(null)}
          className="mb-4"
        >
          Back to Stats Table
        </Button>
        <PlayerGameStatsForm
          gameId={gameId}
          playerId={editingStat.player_id || ""}
          initialData={editingStat}
          onSuccess={handleEditSuccess}
        />
      </div>
    );
  }

  const formatStat = (
    made: number | null,
    attempted: number | null,
    percentage: number | null
  ) => {
    if (made === null || attempted === null) return "-";
    return `${made}-${attempted} (${percentage ? percentage.toFixed(1) : 0}%)`;
  };

  const noStats = !stats || stats.length === 0;

  const statHeaders = [
    { key: "name", label: "Player" },
    { key: "minutes_played", label: "MIN" },
    { key: "points", label: "PTS" },
    { key: "field_goals", label: "FG" },
    { key: "three_pointers", label: "3PT" },
    { key: "free_throws", label: "FT" },
    { key: "rebounds", label: "REB" },
    { key: "assists", label: "AST" },
    { key: "steals", label: "STL" },
    { key: "blocks", label: "BLK" },
    { key: "turnovers", label: "TO" },
    { key: "personal_fouls", label: "PF" },
    { key: "plus_minus", label: "+/-" },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Player Statistics</CardTitle>
        {canEdit && (
          <Dialog open={isAddingStats} onOpenChange={setIsAddingStats}>
            <DialogTrigger asChild>
              <Button size="sm" className="ml-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Player Stats
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Player Game Statistics</DialogTitle>
                <DialogDescription>
                  Select a player and enter their statistics for this game.
                </DialogDescription>
              </DialogHeader>

              {selectedPlayerId ? (
                <PlayerGameStatsForm
                  gameId={gameId}
                  playerId={selectedPlayerId}
                  onSuccess={handleAddSuccess}
                />
              ) : (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="player">Select Player</Label>
                    <Select
                      onValueChange={setSelectedPlayerId}
                      value={selectedPlayerId}
                    >
                      <SelectTrigger id="player" className="w-full">
                        <SelectValue placeholder="Select a player" />
                      </SelectTrigger>
                      <SelectContent>
                        {playersLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading players...
                          </SelectItem>
                        ) : (
                          availablePlayers?.map((player) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {noStats ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">
              No player statistics available for this game.
            </p>
            {canEdit && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsAddingStats(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Player Stats
                  </Button>
                </DialogTrigger>
              </Dialog>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {statHeaders.map((header) => (
                    <TableHead
                      key={header.key}
                      className="text-center whitespace-nowrap"
                    >
                      {header.label}
                    </TableHead>
                  ))}
                  {canEdit && <TableHead className="w-[50px]" />}
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.map((stat) => (
                  <TableRow key={stat.pgs_id}>
                    <TableCell className="font-medium">
                      {stat.player.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {stat.minutes_played ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {stat.points ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatStat(
                        stat.field_goals_made,
                        stat.field_goals_attempted,
                        typeof stat.field_goal_percentage === "string"
                          ? parseFloat(stat.field_goal_percentage)
                          : stat.field_goal_percentage
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatStat(
                        stat.three_pointers_made,
                        stat.three_pointers_attempted,
                        typeof stat.three_point_percentage === "string"
                          ? parseFloat(stat.three_point_percentage)
                          : stat.three_point_percentage
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatStat(
                        stat.free_throws_made,
                        stat.free_throws_attempted,
                        typeof stat.free_throw_percentage === "string"
                          ? parseFloat(stat.free_throw_percentage)
                          : stat.free_throw_percentage
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {stat.total_rebounds ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {stat.assists ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {stat.steals ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {stat.blocks ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {stat.turnovers ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {stat.personal_fouls ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {stat.plus_minus ?? "-"}
                    </TableCell>
                    {canEdit && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingStat(stat)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
