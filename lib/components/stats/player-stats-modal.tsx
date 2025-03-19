import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { getPlayersByGameId } from "~/app/controllers/game-players.api";
import { createPlayerGameStats } from "~/app/controllers/player-game-stats.api";
import { PlayerGameStatsSchema } from "~/app/schemas/player-game-stats.schema";
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
      // convert fields that require number 
      formData.minutes_played = Number(formData.minutes_played);
      formData.points = Number(formData.points)
      formData.field_goals_made = Number(formData.field_goals_made);
      formData.field_goals_attempted = Number(formData.field_goals_attempted);
      formData.three_pointers_made = Number(formData.three_pointers_made);
      formData.three_pointers_attempted = Number(formData.three_pointers_attempted);
      formData.free_throws_made = Number(formData.free_throws_made);
      formData.free_throws_attempted = Number(formData.free_throws_attempted);
      formData.offensive_rebounds = Number(formData.offensive_rebounds);
      formData.defensive_rebounds = Number(formData.defensive_rebounds);
      formData.total_rebounds = Number(formData.total_rebounds);
      formData.assists = Number(formData.assists);
      formData.steals = Number(formData.steals);
      formData.blocks = Number(formData.blocks);
      formData.turnovers = Number(formData.turnovers);
      formData.personal_fouls = Number(formData.personal_fouls);
      formData.plus_minus = Number(formData.plus_minus);
      
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
      game_id: gameId,
      player_id: "",
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
    } as PlayerStatsFormData,
    onSubmit: async ({ value }) => {
      if (!selectedPlayer) {
        toast.error("Please select a player");
        return;
      }

      value.player_id = selectedPlayer;
      await mutation.mutateAsync(value);
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setSelectedPlayer(null);
    }
  }, [open, form]);

  // Define the fields with typed names
  const statFields = [
    { name: "minutes_played" as const, label: "Minutes Played" },
    { name: "points" as const, label: "Points" },
    { name: "field_goals_made" as const, label: "FG Made" },
    { name: "field_goals_attempted" as const, label: "FG Attempted" },
    { name: "three_pointers_made" as const, label: "3PT Made" },
    { name: "three_pointers_attempted" as const, label: "3PT Attempted" },
    { name: "free_throws_made" as const, label: "FT Made" },
    { name: "free_throws_attempted" as const, label: "FT Attempted" },
    { name: "offensive_rebounds" as const, label: "Off. Rebounds" },
    { name: "defensive_rebounds" as const, label: "Def. Rebounds" },
    { name: "total_rebounds" as const, label: "Total Rebounds" },
    { name: "assists" as const, label: "Assists" },
    { name: "steals" as const, label: "Steals" },
    { name: "blocks" as const, label: "Blocks" },
    { name: "turnovers" as const, label: "Turnovers" },
    { name: "personal_fouls" as const, label: "Personal Fouls" },
    { name: "plus_minus" as const, label: "Plus/Minus" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add Player Stats
          </DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <Label htmlFor="player-select" className="mb-2 block">
            Select Player
          </Label>
          <Select
            value={selectedPlayer || ""}
            onValueChange={setSelectedPlayer}
            disabled={loading}
          >
            <SelectTrigger id="player-select" className="w-full">
              <SelectValue placeholder="Select a player" />
            </SelectTrigger>
            <SelectContent>
              {players.map((player) => (
                <SelectItem key={player.id} value={player.id}>
                  {player.jersey_number} - {player.name} ({player.team_name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          {statFields.map((field) => (
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
