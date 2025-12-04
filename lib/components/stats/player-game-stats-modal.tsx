import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/lib/components/ui/dialog";
import { Input } from "~/lib/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/lib/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/lib/components/ui/table";
import type { Player } from "~/src/types/player";
import type {
    PlayerGameStatsAverage,
    PlayerGameStatsTotal,
} from "~/src/types/player-game-stats";

// Define a type that matches what the API is actually returning
type PlayerStatsAverageResponse = Omit<PlayerGameStatsAverage, "player"> & {
  player: Partial<Omit<Player, "player_id" | "height" | "weight">> | null;
};

type PlayerStatsTotalResponse = Omit<PlayerGameStatsTotal, "player"> & {
  player: Partial<Omit<Player, "player_id" | "height" | "weight">> | null;
};

interface PlayerGameStatsModalProps {
  playerStatsAverage: PlayerStatsAverageResponse[];
  playerStatsTotals: PlayerStatsTotalResponse[];
  trigger: React.ReactNode;
}

export const PlayerGameStatsModal = ({
  playerStatsAverage,
  playerStatsTotals,
  trigger,
}: PlayerGameStatsModalProps) => {
  const [viewMode, setViewMode] = useState<"per_game" | "totals">("per_game");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({
    key: viewMode === "per_game" ? "points_per_game" : "total_points",
    direction: "descending",
  });

  // Filter based on search term
  const filteredPerGameStats = playerStatsAverage.filter(
    (stat) =>
      stat.player &&
      stat.player.name &&
      stat.player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTotalStats = playerStatsTotals.filter(
    (stat) =>
      stat.player &&
      stat.player.name &&
      stat.player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort function for per game stats
  const sortPerGameStats = [...filteredPerGameStats].sort((a, b) => {
    if (!sortConfig.key) return 0;

    // Access nested property if it's a player property
    if (sortConfig.key.startsWith("player.")) {
      const key = sortConfig.key.split(".")[1] as keyof typeof a.player;
      const aValue = a.player?.[key];
      const bValue = b.player?.[key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      return sortConfig.direction === "ascending"
        ? aValue < bValue
          ? -1
          : 1
        : aValue < bValue
          ? 1
          : -1;
    } else {
      // Regular property sorting
      const key = sortConfig.key as keyof typeof a;
      const aValue = a[key] as number;
      const bValue = b[key] as number;

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      return sortConfig.direction === "ascending"
        ? aValue - bValue
        : bValue - aValue;
    }
  });

  // Sort function for total stats
  const sortTotalStats = [...filteredTotalStats].sort((a, b) => {
    if (!sortConfig.key) return 0;

    // Access nested property if it's a player property
    if (sortConfig.key.startsWith("player.")) {
      const key = sortConfig.key.split(".")[1] as keyof typeof a.player;
      const aValue = a.player?.[key];
      const bValue = b.player?.[key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      return sortConfig.direction === "ascending"
        ? aValue < bValue
          ? -1
          : 1
        : aValue < bValue
          ? 1
          : -1;
    } else {
      // Regular property sorting
      const key = sortConfig.key as keyof typeof a;
      const aValue = a[key] as number;
      const bValue = b[key] as number;

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      return sortConfig.direction === "ascending"
        ? aValue - bValue
        : bValue - aValue;
    }
  });

  // Handle header click for sorting
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Update sort config when view mode changes
  const handleViewModeChange = (value: "per_game" | "totals") => {
    setViewMode(value);
    setSortConfig({
      key: value === "per_game" ? "points_per_game" : "total_points",
      direction: "descending",
    });
  };

  // Helper to format decimal values
  const formatDecimal = (value: number | null) => {
    if (value === null || value === undefined) return "-";
    return value.toFixed(1);
  };

  // Helper for percentage values
  const formatPercentage = (value: number | null) => {
    if (value === null || value === undefined) return "-";
    return `${(value * 100).toFixed(1)}%`;
  };

  // Helper to render sort indicator
  const getSortIndicator = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? " ▲" : " ▼";
  };

  const perGameHeaders = [
    { key: "player.name", label: "Player", align: "" },
    { key: "player.team_name", label: "Team", align: "center" },
    { key: "games_played", label: "GP", align: "center" },
    { key: "points_per_game", label: "PPG", align: "center" },
    { key: "field_goal_attempts_per_game", label: "FGA", align: "center" },
    { key: "field_goals_made_per_game", label: "FGM", align: "center" },
    { key: "field_goal_percentage", label: "FG%", align: "center" },
    { key: "two_point_attempts_per_game", label: "2PA", align: "center" },
    { key: "two_pointers_made_per_game", label: "2PM", align: "center" },
    { key: "two_point_percentage", label: "2P%", align: "center" },
    { key: "three_point_attempts_per_game", label: "3PA", align: "center" },
    { key: "three_pointers_made_per_game", label: "3PM", align: "center" },
    { key: "three_point_percentage", label: "3P%", align: "center" },
    { key: "free_throw_attempts_per_game", label: "FTA", align: "center" },
    { key: "free_throw_made_per_game", label: "FTM", align: "center" },
    { key: "free_throw_percentage", label: "FT%", align: "center" },
    { key: "rebounds_per_game", label: "RPG", align: "center" },
    { key: "assists_per_game", label: "APG", align: "center" },
    { key: "steals_per_game", label: "SPG", align: "center" },
    { key: "blocks_per_game", label: "BPG", align: "center" },
    { key: "turnovers_per_game", label: "TOV", align: "center" },
  ];

  const totalHeaders = [
    { key: "player.name", label: "Player", align: "" },
    { key: "player.team_name", label: "Team", align: "center" },
    { key: "games_played", label: "GP", align: "center" },
    { key: "total_points", label: "PTS", align: "center" },
    { key: "total_field_goal_attempts", label: "FGA", align: "center" },
    { key: "total_field_goals_made", label: "FGM", align: "center" },
    { key: "total_field_goal_percentage", label: "FG%", align: "center" },
    { key: "total_two_point_attempts", label: "2PA", align: "center" },
    { key: "total_two_pointers_made", label: "2PM", align: "center" },
    { key: "total_two_point_percentage", label: "2P%", align: "center" },
    { key: "total_three_point_attempts", label: "3PA", align: "center" },
    { key: "total_three_pointers_made", label: "3PM", align: "center" },
    { key: "total_three_point_percentage", label: "3P%", align: "center" },
    { key: "total_free_throw_attempts", label: "FTA", align: "center" },
    { key: "total_free_throws_made", label: "FTM", align: "center" },
    { key: "total_free_throw_percentage", label: "FT%", align: "center" },
    { key: "total_rebounds", label: "REB", align: "center" },
    { key: "total_assists", label: "AST", align: "center" },
    { key: "total_steals", label: "STL", align: "center" },
    { key: "total_blocks", label: "BLK", align: "center" },
    { key: "total_turnovers", label: "TOV", align: "center" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Advanced Player Stats</DialogTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-2">
            <div className="flex-1">
              <Input
                placeholder="Search player..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-48">
              <Select value={viewMode} onValueChange={handleViewModeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="View Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per_game">Per Game</SelectItem>
                  <SelectItem value="totals">Totals</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          {viewMode === "per_game" && (
            <div className="relative overflow-x-auto">
              <Table className="w-full">
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    {perGameHeaders.map(({ key, label, align }) => (
                      <TableHead
                        key={key}
                        className={`cursor-pointer ${align ? `text-${align}` : ""}`}
                        onClick={() => requestSort(key)}
                      >
                        {label} {getSortIndicator(key)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortPerGameStats.map((stat, index) => (
                    <TableRow key={`pg-${stat.player?.name || "unknown"}-${index}`}>
                      <TableCell className="font-medium">
                        {stat.player?.name || "Unknown"}
                      </TableCell>
                      <TableCell className="text-center">
                        {stat.player?.team_name || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {stat.games_played}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.points_per_game)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.field_goal_attempts_per_game)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.field_goals_made_per_game)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.field_goal_percentage)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.two_point_attempts_per_game)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.two_pointers_made_per_game)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPercentage(stat.two_point_percentage)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.three_point_attempts_per_game)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.three_pointers_made_per_game)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPercentage(stat.three_point_percentage)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.free_throw_attempts_per_game)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.free_throws_made_per_game)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPercentage(stat.free_throw_percentage)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.rebounds_per_game)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.assists_per_game)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.steals_per_game)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.blocks_per_game)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.turnovers_per_game)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {viewMode === "totals" && (
            <div className="relative overflow-x-auto">
              <Table className="w-full">
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    {totalHeaders.map(({ key, label, align }) => (
                      <TableHead
                        key={key}
                        className={`cursor-pointer ${align ? `text-${align}` : ""}`}
                        onClick={() => requestSort(key)}
                      >
                        {label} {getSortIndicator(key)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortTotalStats.map((stat, index) => (
                    <TableRow key={`total-${stat.player?.name || "unknown"}-${index}`}>
                      <TableCell className="font-medium">
                        {stat.player?.name || "Unknown"}
                      </TableCell>
                      <TableCell className="text-center">
                        {stat.player?.team_name || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {stat.games_played}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.total_points)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.total_field_goal_attempts)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.total_field_goals_made)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPercentage(stat.total_field_goal_percentage)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.total_two_point_attempts)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.total_two_pointers_made)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPercentage(stat.total_two_point_percentage)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.total_three_point_attempts)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.total_three_pointers_made)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPercentage(stat.total_three_point_percentage)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.total_free_throw_attempts)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.total_free_throws_made)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPercentage(stat.total_free_throw_percentage)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.total_rebounds)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.total_assists)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.total_steals)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.total_blocks)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.total_turnovers)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
