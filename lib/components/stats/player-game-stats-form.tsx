import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  createPlayerGameStats,
  updatePlayerGameStats,
} from "~/app/controllers/player-game-stats.api";
import { PlayerGameStatsSchema } from "~/app/schemas/player-game-stats.schema";
import type { PlayerGameStats } from "~/app/types/player-game-stats";
import { useAppForm } from "~/lib/form";
import { FormField } from "../form/form-field";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface PlayerGameStatsFormProps {
  gameId: string;
  playerId: string;
  initialData?: Partial<PlayerGameStats>;
  onSuccess?: () => void;
}

// Define the stats data type
type PlayerStatsFormData = z.infer<typeof PlayerGameStatsSchema>;

export const PlayerGameStatsForm = ({
  gameId,
  playerId,
  initialData,
  onSuccess,
}: PlayerGameStatsFormProps) => {
  const queryClient = useQueryClient();

  // Keep track of the current values for shot calculations
  const [shotValues, setShotValues] = useState({
    twoPointersMade: initialData?.two_pointers_made || 0,
    threePointersMade: initialData?.three_pointers_made || 0,
    freeThrowsMade: initialData?.free_throws_made || 0,
  });

  const mutation = useMutation({
    mutationFn: async (formData: PlayerStatsFormData & { pgs_id?: string }) => {
      // Calculate derived fields
      const twoPointersMade = Number(formData.two_pointers_made || 0);
      const twoPointersAttempted = Number(formData.two_pointers_attempted || 0);
      const threePointersMade = Number(formData.three_pointers_made || 0);
      const threePointersAttempted = Number(
        formData.three_pointers_attempted || 0
      );
      const offensiveRebounds = Number(formData.offensive_rebounds || 0);
      const defensiveRebounds = Number(formData.defensive_rebounds || 0);

      // Calculate field goals (sum of 2PT and 3PT)
      formData.field_goals_made = twoPointersMade + threePointersMade;
      formData.field_goals_attempted =
        twoPointersAttempted + threePointersAttempted;

      // Calculate total rebounds
      formData.total_rebounds = offensiveRebounds + defensiveRebounds;

      // Convert all string values to numbers
      formData.minutes_played = Number(formData.minutes_played);
      formData.points = Number(formData.points);
      formData.three_pointers_made = Number(formData.three_pointers_made);
      formData.three_pointers_attempted = Number(
        formData.three_pointers_attempted
      );
      formData.two_pointers_made = twoPointersMade;
      formData.two_pointers_attempted = twoPointersAttempted;
      formData.free_throws_made = Number(formData.free_throws_made);
      formData.free_throws_attempted = Number(formData.free_throws_attempted);
      formData.offensive_rebounds = Number(formData.offensive_rebounds);
      formData.defensive_rebounds = Number(formData.defensive_rebounds);
      formData.assists = Number(formData.assists);
      formData.steals = Number(formData.steals);
      formData.blocks = Number(formData.blocks);
      formData.turnovers = Number(formData.turnovers);
      formData.personal_fouls = Number(formData.personal_fouls);
      formData.plus_minus = Number(formData.plus_minus);

      // Check if we're updating or creating
      if (initialData?.pgs_id) {
        // For update, we need to include the pgs_id
        return await updatePlayerGameStats({
          data: {
            ...formData,
            pgs_id: initialData.pgs_id,
          },
        });
      } else {
        // For create, we use the base schema
        return await createPlayerGameStats({
          data: formData,
        });
      }
    },
    onSuccess: () => {
      toast.success("Player stats saved successfully");
      queryClient.invalidateQueries({ queryKey: ["gamePlayerStats", gameId] });
      onSuccess?.();
    },
  });

  const form = useAppForm({
    defaultValues: {
      game_id: gameId,
      player_id: playerId,
      minutes_played: initialData?.minutes_played ?? 0,
      points: initialData?.points ?? 0,
      field_goals_made: initialData?.field_goals_made ?? 0,
      field_goals_attempted: initialData?.field_goals_attempted ?? 0,
      two_pointers_made: initialData?.two_pointers_made ?? 0,
      two_pointers_attempted: initialData?.two_pointers_attempted ?? 0,
      three_pointers_made: initialData?.three_pointers_made ?? 0,
      three_pointers_attempted: initialData?.three_pointers_attempted ?? 0,
      free_throws_made: initialData?.free_throws_made ?? 0,
      free_throws_attempted: initialData?.free_throws_attempted ?? 0,
      offensive_rebounds: initialData?.offensive_rebounds ?? 0,
      defensive_rebounds: initialData?.defensive_rebounds ?? 0,
      total_rebounds: initialData?.total_rebounds ?? 0,
      assists: initialData?.assists ?? 0,
      steals: initialData?.steals ?? 0,
      blocks: initialData?.blocks ?? 0,
      turnovers: initialData?.turnovers ?? 0,
      personal_fouls: initialData?.personal_fouls ?? 0,
      plus_minus: initialData?.plus_minus ?? 0,
    } as PlayerStatsFormData,
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });

  // Handler for when shot values change
  const updatePoints = () => {
    // Calculate points
    const totalPoints =
      shotValues.twoPointersMade * 2 +
      shotValues.threePointersMade * 3 +
      shotValues.freeThrowsMade;

    // Update points field in the form
    form.setFieldValue("points", totalPoints);
  };

  // Define the fields organized in columns as requested
  const columnOneFields = [
    { name: "two_pointers_made" as const, label: "2PT Made" },
    { name: "two_pointers_attempted" as const, label: "2PT Attempted" },
    { name: "three_pointers_made" as const, label: "3PT Made" },
    { name: "three_pointers_attempted" as const, label: "3PT Attempted" },
    { name: "free_throws_made" as const, label: "FT Made" },
    { name: "free_throws_attempted" as const, label: "FT Attempted" },
  ];

  const columnTwoFields = [
    { name: "offensive_rebounds" as const, label: "Off. Rebounds" },
    { name: "defensive_rebounds" as const, label: "Def. Rebounds" },
    { name: "assists" as const, label: "Assists" },
    { name: "steals" as const, label: "Steals" },
    { name: "blocks" as const, label: "Blocks" },
    { name: "turnovers" as const, label: "Turnovers" },
  ];

  const columnThreeFields = [
    { name: "plus_minus" as const, label: "Plus/Minus" },
    { name: "minutes_played" as const, label: "Minutes Played" },
    { name: "points" as const, label: "Points" },
    { name: "personal_fouls" as const, label: "Personal Fouls" },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          {initialData ? "Edit Player Stats" : "Enter Player Stats"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          {/* Column 1 */}
          <div className="space-y-4">
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
                      field.name === "two_pointers_made" ||
                      field.name === "three_pointers_made" ||
                      field.name === "free_throws_made"
                        ? () => {
                            // Update the state with the new value
                            const newValue = Number(formField.state.value || 0);
                            if (field.name === "two_pointers_made") {
                              setShotValues((prev) => ({
                                ...prev,
                                twoPointersMade: newValue,
                              }));
                            } else if (field.name === "three_pointers_made") {
                              setShotValues((prev) => ({
                                ...prev,
                                threePointersMade: newValue,
                              }));
                            } else if (field.name === "free_throws_made") {
                              setShotValues((prev) => ({
                                ...prev,
                                freeThrowsMade: newValue,
                              }));
                            }
                            // Update points after state update
                            setTimeout(updatePoints, 0);
                          }
                        : undefined
                    }
                  />
                )}
              />
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
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
          <div className="space-y-4">
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

          <div className="col-span-1 md:col-span-3 mt-6">
            <form.AppForm>
              <form.SubmitButton
                label={initialData ? "Update Stats" : "Save Stats"}
              />
            </form.AppForm>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
