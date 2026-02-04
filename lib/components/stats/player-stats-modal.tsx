import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { getPlayersByGameId } from "~/src/controllers/game-players.api";
import { createPlayerGameStats } from "~/src/controllers/player-game-stats.api";
import { PlayerGameStatsSchema } from "~/src/schemas/player-game-stats.schema";
import { useAppForm } from "~/lib/form";
import { FormField } from "../form/form-field";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// for adding new players

interface PlayerStatsModalProps {
  gameId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Define the stats data type
type PlayerStatsFormData = z.infer<typeof PlayerGameStatsSchema>;

export const PlayerStatsModal = ({
  gameId,
  open,
  onOpenChange,
  onSuccess,
}: PlayerStatsModalProps) => {
  const queryClient = useQueryClient();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  // Keep track of the current values for shot calculations
  const [shotValues, setShotValues] = useState({
    twoPointersMade: 0,
    threePointersMade: 0,
    freeThrowsMade: 0,
  });

  // Fetch players using Tanstack Start API
  const { data: players = [], isLoading: loading } = useQuery({
    queryKey: ["gamePlayers", gameId],
    queryFn: async () => {
      try {
        const playersData = await getPlayersByGameId({
          data: { gameId },
        });
        return playersData || [];
      } catch (error) {
        console.error("Failed to fetch players:", error);
        toast.error("Failed to fetch players for this game");
        return [];
      }
    },
    enabled: open, // Only fetch when modal is open
  });

  const mutation = useMutation({
    mutationFn: async (formData: PlayerStatsFormData) => {
      // Calculate derived fields
      const twoPointersMade = Number(formData.twoPointersMade || 0);
      const twoPointersAttempted = Number(formData.twoPointersAttempted || 0);
      const threePointersMade = Number(formData.threePointersMade || 0);
      const threePointersAttempted = Number(
        formData.threePointersAttempted || 0
      );
      const offensiveRebounds = Number(formData.offensiveRebounds || 0);
      const defensiveRebounds = Number(formData.defensiveRebounds || 0);

      // Calculate field goals (sum of 2PT and 3PT)
      formData.fieldGoalsMade = twoPointersMade + threePointersMade;
      formData.fieldGoalsAttempted =
        twoPointersAttempted + threePointersAttempted;

      // Calculate total rebounds
      formData.totalRebounds = offensiveRebounds + defensiveRebounds;

      // Convert all numeric fields
      formData.minutesPlayed = Number(formData.minutesPlayed);
      formData.points =
        shotValues.twoPointersMade * 2 +
        shotValues.threePointersMade * 3 +
        shotValues.freeThrowsMade;
      formData.threePointersMade = Number(formData.threePointersMade);
      formData.threePointersAttempted = Number(
        formData.threePointersAttempted
      );
      formData.twoPointersMade = twoPointersMade;
      formData.twoPointersAttempted = twoPointersAttempted;
      formData.freeThrowsMade = Number(formData.freeThrowsMade);
      formData.freeThrowsAttempted = Number(formData.freeThrowsAttempted);
      formData.offensiveRebounds = Number(formData.offensiveRebounds);
      formData.defensiveRebounds = Number(formData.defensiveRebounds);
      formData.assists = Number(formData.assists);
      formData.steals = Number(formData.steals);
      formData.blocks = Number(formData.blocks);
      formData.personalFouls = Number(formData.personalFouls);
      formData.plusMinus = Number(formData.plusMinus);

      return await createPlayerGameStats({ data: formData });
    },
    onSuccess: () => {
      toast.success("Player stats saved successfully");
      queryClient.invalidateQueries({ queryKey: ["gamePlayerStats", gameId] });
      form.reset();
      setSelectedPlayer(null);
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const form = useAppForm({
    defaultValues: {
      gameId: gameId,
      playerId: "",
      minutesPlayed: 0,
      points: 0,
      fieldGoalsMade: 0,
      fieldGoalsAttempted: 0,
      twoPointersMade: 0,
      twoPointersAttempted: 0,
      threePointersMade: 0,
      threePointersAttempted: 0,
      freeThrowsMade: 0,
      freeThrowsAttempted: 0,
      offensiveRebounds: 0,
      defensiveRebounds: 0,
      totalRebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      personalFouls: 0,
      plusMinus: 0,
    } as PlayerStatsFormData,
    onSubmit: async ({ value }) => {
      if (!selectedPlayer) {
        toast.error("Please select a player");
        return;
      }

      value.playerId = selectedPlayer;
      await mutation.mutateAsync(value);
    }
  });

  // Handler for when shot values change
  const updatePoints = () => {
    // Calculate points
    const totalPoints =
      shotValues.twoPointersMade * 2 +
      shotValues.threePointersMade * 3 +
      shotValues.freeThrowsMade;

    // Update the points field
    form.setFieldValue("points", totalPoints);
  };

  // Reset form and shot values when modal closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setSelectedPlayer(null);
      setShotValues({
        twoPointersMade: 0,
        threePointersMade: 0,
        freeThrowsMade: 0,
      });
    }
  }, [open, form]);

  // Define the fields organized in columns as requested
  const columnOneFields = [
    { name: "twoPointersMade" as const, label: "2PT Made" },
    { name: "twoPointersAttempted" as const, label: "2PT Attempted" },
    { name: "threePointersMade" as const, label: "3PT Made" },
    { name: "threePointersAttempted" as const, label: "3PT Attempted" },
    { name: "freeThrowsMade" as const, label: "FT Made" },
    { name: "freeThrowsAttempted" as const, label: "FT Attempted" },
  ];

  const columnTwoFields = [
    { name: "offensiveRebounds" as const, label: "Off. Rebounds" },
    { name: "defensiveRebounds" as const, label: "Def. Rebounds" },
    { name: "assists" as const, label: "Assists" },
    { name: "steals" as const, label: "Steals" },
    { name: "blocks" as const, label: "Blocks" },
  ];

  const columnThreeFields = [
    { name: "plusMinus" as const, label: "Plus/Minus" },
    { name: "minutesPlayed" as const, label: "Minutes Played" },
    { name: "points" as const, label: "Points" },
    { name: "personalFouls" as const, label: "Personal Fouls" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add Player Stats
          </DialogTitle>
        </DialogHeader>
        <div className="mb-4 pt-4 flex justify-between">
          <div className="flex items-center justify-center">
            <Label>Select one player from right to add stats</Label>
          </div>
          <div className="flex items-center justify-center gap-4">
            {/* Group players by team */}
            {Object.entries(
              players.reduce(
                (acc, player) => {
                  const teamName = player.teamName || "Unknown Team";
                  if (!acc[teamName]) {
                    acc[teamName] = [];
                  }
                  acc[teamName].push(player);
                  return acc;
                },
                {} as Record<string, typeof players>
              )
            ).map(([teamName, teamPlayers]) => (
              <div key={teamName}>
                <Label
                  htmlFor={`player-select-${teamName}`}
                  className="mb-2 block"
                >
                  {teamName}
                </Label>
                <Select
                  value={selectedPlayer || ""}
                  onValueChange={setSelectedPlayer}
                  disabled={loading}
                >
                  <SelectTrigger
                    id={`player-select-${teamName}`}
                    className="w-full"
                  >
                    <SelectValue placeholder={`Select player`} />
                  </SelectTrigger>
                  <SelectContent>
                    {teamPlayers.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.jerseyNumber} - {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          {/* Column 1 */}
          <div className="space-y-3">
            {columnOneFields.map((field) => (
              <form.AppField
                key={field.name}
                name={field.name}
                children={(formField) => (
                  <FormField
                    id={field.name}
                    label={field.label}
                    field={formField}
                    text_type="text"
                    className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    onChange={
                      field.name === "twoPointersMade" ||
                      field.name === "threePointersMade" ||
                      field.name === "freeThrowsMade"
                        ? () => {
                            // Update the state with the new value
                            const newValue = Number(formField.state.value || 0);
                            if (field.name === "twoPointersMade") {
                              setShotValues((prev) => ({
                                ...prev,
                                twoPointersMade: newValue,
                              }));
                            } else if (field.name === "threePointersMade") {
                              setShotValues((prev) => ({
                                ...prev,
                                threePointersMade: newValue,
                              }));
                            } else if (field.name === "freeThrowsMade") {
                              setShotValues((prev) => ({
                                ...prev,
                                freeThrowsMade: newValue,
                              }));
                            }

                            updatePoints();
                          }
                        : undefined
                    }
                  />
                )}
              />
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            {columnTwoFields.map((field) => (
              <form.AppField
                key={field.name}
                name={field.name}
                children={(formField) => (
                  <FormField
                    id={field.name}
                    label={field.label}
                    field={formField}
                    text_type="text"
                    className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
            ))}
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            {columnThreeFields.map((field) => (
              <form.AppField
                key={field.name}
                name={field.name}
                children={(formField) => (
                  <FormField
                    id={field.name}
                    label={field.label}
                    field={formField}
                    text_type="text"
                    className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
            ))}
          </div>
          <DialogFooter className="col-span-1 md:col-span-3 pt-4">
            <form.AppForm>
              <form.SubmitButton label="Save Stats" />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
