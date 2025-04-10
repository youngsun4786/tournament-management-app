import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { getPlayersByGameId } from "~/app/controllers/game-players.api";
import {
  createPlayerGameStats,
  getPlayerGameStatsByGameId,
} from "~/app/controllers/player-game-stats.api";
import type { PlayerGameStatsWithPlayer } from "~/app/types/player-game-stats";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PlayerStatsActions } from "./player-stats-actions";
import { PlayerStatsModal } from "./player-stats-modal";
// Import Excel processing library
import * as XLSX from "xlsx";
import { z } from "zod";
import { PlayerGameStatsSchema } from "~/app/schemas/player-game-stats.schema";

// Define the Excel row structure
interface ExcelPlayerStatsRow {
  player_name?: string;
  jersey_number?: string | number;
  minutes_played?: string | number;
  two_pointers_made?: string | number;
  two_pointers_attempted?: string | number;
  three_pointers_made?: string | number;
  three_pointers_attempted?: string | number;
  free_throws_made?: string | number;
  free_throws_attempted?: string | number;
  offensive_rebounds?: string | number;
  defensive_rebounds?: string | number;
  assists?: string | number;
  steals?: string | number;
  blocks?: string | number;
  turnovers?: string | number;
  personal_fouls?: string | number;
  plus_minus?: string | number;
}
interface PlayerStatsManagerProps {
  gameId: string;
}

export const PlayerStatsManager = ({ gameId }: PlayerStatsManagerProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: playerStats,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["gamePlayerStats", gameId],
    queryFn: async () => {
      const response = await getPlayerGameStatsByGameId({
        data: { gameId },
      });
      return response;
    },
  });

  const createStatsMutation = useMutation({
    mutationFn: async (data: z.infer<typeof PlayerGameStatsSchema>) => {
      return await createPlayerGameStats({ data });
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Fetch players for the game
  const { data: players } = useQuery({
    queryKey: ["gamePlayers", gameId],
    queryFn: async () => {
      try {
        return await getPlayersByGameId({
          data: { gameId },
        });
      } catch (error) {
        console.error("Failed to fetch players:", error);
        return [];
      }
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

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const processExcelFile = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // Read the Excel file
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });

      // Assume first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert to JSON
      const data = JSON.parse(
        JSON.stringify(XLSX.utils.sheet_to_json(worksheet))
      );

      if (data.length === 0) {
        throw new Error("No data found in the Excel file");
      }

      // Check if we have players data
      if (!players || players.length === 0) {
        throw new Error("No players data available for this game");
      }

      // Map player names/numbers to IDs
      const playerMap = new Map();
      players.forEach((player) => {
        // Map by name and jersey number - this is to avoid conflicts
        playerMap.set(
          `${player.name.toLowerCase()}-${player.jersey_number}`,
          player.id
        );
      });

      // Track success and failures
      let successCount = 0;
      let failureCount = 0;

      // Process each row
      for (const row of data) {
        try {

          console.log(row);

          // Try to find player ID - could be by name or jersey number
          let playerId: string | null = null;
          // Check if there's a player name column
          if (row["Player Name"] && row["Jersey Number"]) {
            playerId = playerMap.get(
              `${row["Player Name"].toLowerCase()}-${row["Jersey Number"]}`
            );
          } else {
            // iterate over the playerMap and find the playerId by name
            for (const [key, value] of playerMap.entries()) {
              if (key.includes(row["Player Name"].toLowerCase())) {
                playerId = value;
                break;
              }
            }
            console.log(row["Player Name"]);
            console.log(playerId);
          }

          if (!playerId) {
            console.warn(`Could not find player ID for row:`, row);
            failureCount++;
            continue;
          }

          // Calculate derived fields
          const twoPointersMade = Number(row["2PT Made"] || 0);
          const twoPointersAttempted = Number(row["2PT Attempted"] || 0);
          const threePointersMade = Number(row["3PT Made"] || 0);
          const threePointersAttempted = Number(row["3PT Attempted"] || 0);
          const offensiveRebounds = Number(row["Off. Rebounds"] || 0);
          const defensiveRebounds = Number(row["Def. Rebounds"] || 0);
          const freeThrowsMade = Number(row["FT Made"] || 0);

          // Prepare the player stats data
          const statsData = {
            game_id: gameId,
            player_id: playerId,
            minutes_played: Number(row["Minutes Played"] || 0),
            field_goals_made: twoPointersMade + threePointersMade,
            field_goals_attempted:
              twoPointersAttempted + threePointersAttempted,
            two_pointers_made: twoPointersMade,
            two_pointers_attempted: twoPointersAttempted,
            three_pointers_made: threePointersMade,
            three_pointers_attempted: threePointersAttempted,
            free_throws_made: freeThrowsMade,
            free_throws_attempted: Number(row["FT Attempted"] || 0),
            offensive_rebounds: offensiveRebounds,
            defensive_rebounds: defensiveRebounds,
            total_rebounds: offensiveRebounds + defensiveRebounds,
            assists: Number(row["Assists"] || 0),
            steals: Number(row["Steals"] || 0),
            blocks: Number(row["Blocks"] || 0),
            turnovers: Number(row["Turnovers"] || 0),
            personal_fouls: Number(row["Personal Fouls"] || 0),
            plus_minus: Number(row["Plus/Minus"] || 0),
            points:
              twoPointersMade * 2 + threePointersMade * 3 + freeThrowsMade,
          };

          // Validate with zod schema
          const validatedData = PlayerGameStatsSchema.parse(statsData);

          // Create the player stats
          await createStatsMutation.mutateAsync(validatedData);
          successCount++;
        } catch (error) {
          console.error("Error processing row:", error);
          failureCount++;
        }
      }

      // Show summary toast
      if (successCount > 0) {
        toast.success(`Successfully added stats for ${successCount} players`);
      }

      if (failureCount > 0) {
        toast.error(`Failed to add stats for ${failureCount} players`);
      }

      // Refetch data
      refetch();
    } catch (error) {
      console.error("Error processing Excel file:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to process Excel file"
      );
      toast.error("Failed to process Excel file");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      toast.error("Please upload a file");
      return;
    }

    if (e.target.files.length > 1) {
      toast.error("Please upload only one file at a time");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (
      fileExtension !== "xlsx" &&
      fileExtension !== "xls" &&
      fileExtension !== "csv"
    ) {
      toast.error("Please upload an Excel file (.xlsx, .xls) or CSV file");
      return;
    }

    processExcelFile(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Player Statistics</h2>
        <Button onClick={handleAddStats} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Player Stats
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading player statistics...</div>
      ) : playerStats?.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center space-y-4">
              <p className="text-gray-500">
                No player statistics available for this game yet.
              </p>

              <div className="flex flex-col items-center mt-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Upload an Excel file to add multiple player statistics at once
                </p>

                {uploadError && (
                  <Alert variant="destructive" className="max-w-md">
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-col items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                  />
                  <Button
                    onClick={handleFileSelect}
                    variant="outline"
                    className="w-48"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Excel File
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-400 mt-1">
                    Excel columns should match the player stats form fields
                  </p>
                </div>
              </div>
            </div>
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
                          <TableHead className="text-center">No.</TableHead>
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
                            <TableCell className="text-center">
                              {stat.player?.jersey_number}
                            </TableCell>
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
