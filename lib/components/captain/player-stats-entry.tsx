import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RotateCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createPlayerGameStats } from "~/app/controllers/player-game-stats.api";
import { FormField } from "~/lib/components/form/form-field";
import { Button } from "~/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/lib/components/ui/tabs";
import { useAppForm } from "~/lib/form";

// Mock function to get player info - in real app, this would come from the API
const getPlayerInfo = (playerId: string) => {
  const players = [
    {
      id: "d0e4f073-14fa-4257-83b2-c70ae57961ae",
      name: "Li Pei",
      jersey_number: 10,
      position: "PG",
    },
    {
      id: "6690057e-d522-437d-a1d4-70d32ec855e8",
      name: "Youdong Ma",
      jersey_number: 23,
      position: "SF",
    },
    {
      id: "bbae11fa-b200-481a-b4a9-86c61085c13c",
      name: "Howard Liou",
      jersey_number: 7,
      position: "SG",
    },
    {
      id: "2a44f44a-d311-4f55-bca7-ac4388862ed8",
      name: "Paul Chen",
    jersey_number: 33,
      position: "PF",
    },
  ];
  return players.find((p) => p.id === playerId);
};

// Mock function to get game info - in real app, this would come from the API
const getGameInfo = (gameId: string) => {
  return {
    id: gameId,
    home_team_name: "Team Korea",
    away_team_name: "Black Mamba",
    game_date: "2025-03-16T16:30:00.000Z",
    location: "CCBC Court",
  };
};

interface PlayerStatsEntryProps {
  gameId: string;
  playerId: string;
  onSuccess?: () => void;
}

export const PlayerStatsEntry = ({
  gameId,
  playerId,
  onSuccess,
}: PlayerStatsEntryProps) => {
  const [activeTab, setActiveTab] = useState("standard");
  const [isCalculatingTotal, setIsCalculatingTotal] = useState(false);

  const queryClient = useQueryClient();
  const player = getPlayerInfo(playerId);
  const game = getGameInfo(gameId);

  const mutation = useMutation({
    mutationFn: (data: any) => createPlayerGameStats({ data }),
    onSuccess: () => {
      toast.success(`Stats for ${player?.name} saved successfully`);
      queryClient.invalidateQueries({ queryKey: ["gamePlayerStats", gameId] });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to save player stats");
    },
  });

  const form = useAppForm({
    defaultValues: {
      game_id: gameId,
      player_id: playerId,
      minutes_played: 0,
      points: 0,
      field_goals_made: 0,
      field_goals_attempted: 0,
      three_pointers_made: 0,
      three_pointers_attempted: 0,
      free_throws_made: 0,
      free_throws_attempted: 0,
      offensive_rebounds: 0,
      defensive_rebounds: 0,
      total_rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      personal_fouls: 0,
      plus_minus: 0,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });

  // Helper function to calculate totals and percentages
  const calculateTotals = () => {
    setIsCalculatingTotal(true);

    const formValues = form.state.values;

    // Calculate total points
    const points =
      (formValues.field_goals_made - formValues.three_pointers_made) * 2 +
      formValues.three_pointers_made * 3 +
      formValues.free_throws_made;

    // Calculate total rebounds
    const totalRebounds =
      formValues.offensive_rebounds + formValues.defensive_rebounds;

    form.setFieldValue("points", points);
    form.setFieldValue("total_rebounds", totalRebounds);

    setIsCalculatingTotal(false);

    toast.success("Stats calculated automatically");
  };

  const standardFields = [
    { name: "minutes_played", label: "Minutes Played" },
    { name: "field_goals_made", label: "FG Made" },
    { name: "field_goals_attempted", label: "FG Attempted" },
    { name: "three_pointers_made", label: "3PT Made" },
    { name: "three_pointers_attempted", label: "3PT Attempted" },
    { name: "free_throws_made", label: "FT Made" },
    { name: "free_throws_attempted", label: "FT Attempted" },
    { name: "offensive_rebounds", label: "Off. Rebounds" },
    { name: "defensive_rebounds", label: "Def. Rebounds" },
    { name: "assists", label: "Assists" },
    { name: "steals", label: "Steals" },
    { name: "blocks", label: "Blocks" },
    { name: "turnovers", label: "Turnovers" },
    { name: "personal_fouls", label: "Personal Fouls" },
    { name: "plus_minus", label: "Plus/Minus" },
  ];

  const calculatedFields = [
    { name: "points", label: "Points (Calculated)" },
    { name: "total_rebounds", label: "Total Rebounds (Calculated)" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Enter Game Stats</CardTitle>
        <CardDescription>
          For {player?.name} (#{player?.jersey_number}) - {game.home_team_name}{" "}
          vs {game.away_team_name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="standard">Standard Stats</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="standard" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {standardFields.map((field) => (
                  <form.AppField
                    key={field.name}
                    name={field.name}
                    children={(formField) => (
                      <FormField
                        id={field.name}
                        label={field.label}
                        field={formField}
                        type="text"
                        className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {calculatedFields.map((field) => (
                  <form.AppField
                    key={field.name}
                    name={field.name}
                    children={(formField) => (
                      <FormField
                        id={field.name}
                        label={field.label}
                        field={formField}
                        type="number"
                        className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 bg-muted"
                        readOnly
                      />
                    )}
                  />
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={calculateTotals}
                  disabled={isCalculatingTotal}
                  className="w-full"
                >
                  {isCalculatingTotal && (
                    <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Calculate Stats Automatically
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4 border-t">
            <form.AppForm>
              <form.SubmitButton label="Save Player Stats" />
            </form.AppForm>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
