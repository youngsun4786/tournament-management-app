import { Pencil } from "lucide-react";
import { useState } from "react";
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
import { PlayerGameStatsForm } from "./player-game-stats-form";

interface PlayerGameStatsTableProps {
  gameId: string;
  canEdit?: boolean;
  playerStats: PlayerGameStatsWithPlayer[];
}

export const PlayerGameStatsTable = ({
  gameId,
  canEdit = false,
  playerStats,
}: PlayerGameStatsTableProps) => {
  const [editingStat, setEditingStat] =
    useState<PlayerGameStatsWithPlayer | null>(null);

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
          playerId={editingStat.player_id!}
          initialData={editingStat}
          onSuccess={() => setEditingStat(null)}
        />
      </div>
    );
  }

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

  const formatStat = (
    made: number | null,
    attempted: number | null,
    percentage: number | null
  ) => {
    if (made === null || attempted === null) return "-";
    return `${made}-${attempted} (${percentage?.toFixed(1)}%)`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Player Statistics</CardTitle>
      </CardHeader>
      <CardContent>
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
              {playerStats?.map((stat) => (
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
                      stat.field_goal_percentage
                        ? parseFloat(stat.field_goal_percentage)
                        : null
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatStat(
                      stat.three_pointers_made,
                      stat.three_pointers_attempted,
                      stat.three_point_percentage
                        ? parseFloat(stat.three_point_percentage)
                        : null
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatStat(
                      stat.free_throws_made,
                      stat.free_throws_attempted,
                      stat.free_throw_percentage
                        ? parseFloat(stat.free_throw_percentage)
                        : null
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
      </CardContent>
    </Card>
  );
};
