import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useAppForm } from "~/lib/form";
import {
  createPlayerGameStats,
  updatePlayerGameStats,
} from "~/src/controllers/player-game-stats.api";
import { PlayerGameStatsSchema } from "~/src/schemas/player-game-stats.schema";
import type { PlayerGameStats } from "~/src/types/player-game-stats";
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
    twoPointersMade: initialData?.twoPointersMade || 0,
    threePointersMade: initialData?.threePointersMade || 0,
    freeThrowsMade: initialData?.freeThrowsMade || 0,
  });

  const mutation = useMutation({
    mutationFn: async (formData: PlayerStatsFormData & { id?: string }) => {
      // Calculate derived fields
      const twoPointersMade = Number(formData.twoPointersMade || 0);
      const twoPointersAttempted = Number(formData.twoPointersAttempted || 0);
      const threePointersMade = Number(formData.threePointersMade || 0);
      const threePointersAttempted = Number(
        formData.threePointersAttempted || 0,
      );
      const offensiveRebounds = Number(formData.offensiveRebounds || 0);
      const defensiveRebounds = Number(formData.defensiveRebounds || 0);

      // Calculate field goals (sum of 2PT and 3PT)
      formData.fieldGoalsMade = twoPointersMade + threePointersMade;
      formData.fieldGoalsAttempted =
        twoPointersAttempted + threePointersAttempted;

      // Calculate total rebounds
      formData.totalRebounds = offensiveRebounds + defensiveRebounds;

      // Convert all string values to numbers
      formData.minutesPlayed = Number(formData.minutesPlayed);
      formData.points = Number(formData.points);
      formData.threePointersMade = Number(formData.threePointersMade);
      formData.threePointersAttempted = Number(formData.threePointersAttempted);
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

      // Check if we're updating or creating
      if (initialData?.id) {
        // For update, we need to include the id
        return await updatePlayerGameStats({
          data: {
            ...formData,
            id: initialData.id,
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
      gameId: gameId,
      playerId: playerId,
      minutesPlayed: initialData?.minutesPlayed ?? 0,
      points: initialData?.points ?? 0,
      fieldGoalsMade: initialData?.fieldGoalsMade ?? 0,
      fieldGoalsAttempted: initialData?.fieldGoalsAttempted ?? 0,
      twoPointersMade: initialData?.twoPointersMade ?? 0,
      twoPointersAttempted: initialData?.twoPointersAttempted ?? 0,
      threePointersMade: initialData?.threePointersMade ?? 0,
      threePointersAttempted: initialData?.threePointersAttempted ?? 0,
      freeThrowsMade: initialData?.freeThrowsMade ?? 0,
      freeThrowsAttempted: initialData?.freeThrowsAttempted ?? 0,
      offensiveRebounds: initialData?.offensiveRebounds ?? 0,
      defensiveRebounds: initialData?.defensiveRebounds ?? 0,
      totalRebounds: initialData?.totalRebounds ?? 0,
      assists: initialData?.assists ?? 0,
      steals: initialData?.steals ?? 0,
      blocks: initialData?.blocks ?? 0,
      personalFouls: initialData?.personalFouls ?? 0,
      plusMinus: initialData?.plusMinus ?? 0,
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
