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
    key: viewMode === "per_game" ? "pointsPerGame" : "totalPoints",
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
      key: value === "per_game" ? "pointsPerGame" : "totalPoints",
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
    { key: "player.teamName", label: "Team", align: "center" },
    { key: "gamesPlayed", label: "GP", align: "center" },
    { key: "pointsPerGame", label: "PPG", align: "center" },
    { key: "fieldGoalAttemptsPerGame", label: "FGA", align: "center" },
    { key: "fieldGoalsMadePerGame", label: "FGM", align: "center" },
    { key: "fieldGoalPercentage", label: "FG%", align: "center" },
    { key: "twoPointAttemptsPerGame", label: "2PA", align: "center" },
    { key: "twoPointersMadePerGame", label: "2PM", align: "center" },
    { key: "twoPointPercentage", label: "2P%", align: "center" },
    { key: "threePointAttemptsPerGame", label: "3PA", align: "center" },
    { key: "threePointersMadePerGame", label: "3PM", align: "center" },
    { key: "threePointPercentage", label: "3P%", align: "center" },
    { key: "freeThrowAttemptsPerGame", label: "FTA", align: "center" },
    { key: "freeThrowsMadePerGame", label: "FTM", align: "center" },
    { key: "freeThrowPercentage", label: "FT%", align: "center" },
    { key: "reboundsPerGame", label: "RPG", align: "center" },
    { key: "assistsPerGame", label: "APG", align: "center" },
    { key: "stealsPerGame", label: "SPG", align: "center" },
    { key: "blocksPerGame", label: "BPG", align: "center" },
    { key: "turnoversPerGame", label: "TOV", align: "center" },
  ];

  const totalHeaders = [
    { key: "player.name", label: "Player", align: "" },
    { key: "player.teamName", label: "Team", align: "center" },
    { key: "gamesPlayed", label: "GP", align: "center" },
    { key: "totalPoints", label: "PTS", align: "center" },
    { key: "totalFieldGoalAttempts", label: "FGA", align: "center" },
    { key: "totalFieldGoalsMade", label: "FGM", align: "center" },
    { key: "totalFieldGoalPercentage", label: "FG%", align: "center" },
    { key: "totalTwoPointAttempts", label: "2PA", align: "center" },
    { key: "totalTwoPointersMade", label: "2PM", align: "center" },
    { key: "totalTwoPointPercentage", label: "2P%", align: "center" },
    { key: "totalThreePointAttempts", label: "3PA", align: "center" },
    { key: "totalThreePointersMade", label: "3PM", align: "center" },
    { key: "totalThreePointPercentage", label: "3P%", align: "center" },
    { key: "totalFreeThrowAttempts", label: "FTA", align: "center" },
    { key: "totalFreeThrowsMade", label: "FTM", align: "center" },
    { key: "totalFreeThrowPercentage", label: "FT%", align: "center" },
    { key: "totalRebounds", label: "REB", align: "center" },
    { key: "totalAssists", label: "AST", align: "center" },
    { key: "totalSteals", label: "STL", align: "center" },
    { key: "totalBlocks", label: "BLK", align: "center" },
    { key: "totalTurnovers", label: "TOV", align: "center" },
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
                        {stat.player?.teamName || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {stat.gamesPlayed}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.pointsPerGame)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.fieldGoalAttemptsPerGame)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.fieldGoalsMadePerGame)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.fieldGoalPercentage)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.twoPointAttemptsPerGame)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.twoPointersMadePerGame)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPercentage(stat.twoPointPercentage)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.threePointAttemptsPerGame)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.threePointersMadePerGame)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPercentage(stat.threePointPercentage)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.freeThrowAttemptsPerGame)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.freeThrowsMadePerGame)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPercentage(stat.freeThrowPercentage)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.reboundsPerGame)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.assistsPerGame)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.stealsPerGame)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.blocksPerGame)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.turnoversPerGame)}
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
                        {stat.player?.teamName || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {stat.gamesPlayed}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.totalPoints)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.totalFieldGoalAttempts)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.totalFieldGoalsMade)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPercentage(stat.totalFieldGoalPercentage)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.totalTwoPointAttempts)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.totalTwoPointersMade)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPercentage(stat.totalTwoPointPercentage)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.totalThreePointAttempts)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.totalThreePointersMade)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPercentage(stat.totalThreePointPercentage)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.totalFreeThrowAttempts)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.totalFreeThrowsMade)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPercentage(stat.totalFreeThrowPercentage)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.totalRebounds)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.totalAssists)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.totalSteals)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.totalBlocks)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDecimal(stat.totalTurnovers)}
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
