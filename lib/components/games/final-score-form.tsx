import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateGameScore } from "~/app/controllers/game.api";
import { useAppForm } from "~/lib/form";
import { FormField } from "../form/form-field";
import { SwitchField } from "../form/switch-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface FinalScoreFormProps {
  gameId: string;
  home_team_name: string;
  away_team_name: string;
}

type GameScoreFormData = {
  game_id: string;
  home_team_score: number;
  away_team_score: number;
  is_completed: boolean;
};

export const FinalScoreForm = ({
  gameId,
  home_team_name,
  away_team_name,
}: FinalScoreFormProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: GameScoreFormData) => {
      data.away_team_score = Number(data.away_team_score);
      data.home_team_score = Number(data.home_team_score);
      data.is_completed = Boolean(data.is_completed);
      return updateGameScore({
        data: {
          game_id: gameId,
          home_team_score: data.home_team_score,
          away_team_score: data.away_team_score,
          is_completed: data.is_completed,
        },
      });
    },
    onSuccess: () => {
      toast.success("Game score updated successfully");
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });

  const form = useAppForm({
    defaultValues: {
      game_id: gameId,
      home_team_score: 0,
      away_team_score: 0,
      is_completed: false,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Update Game Score</CardTitle>
        <CardDescription>Enter final score after updating ALL PLAYER STATS</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField
            name="home_team_score"
            children={(formField) => (
              <FormField
                id="home_team_score"
                label={`${home_team_name} Score`}
                field={formField}
                className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              />
            )}
          />
          <form.AppField
            name="away_team_score"
            children={(formField) => (
              <FormField
                id="away_team_score"
                label={`${away_team_name} Score`}
                field={formField}
                className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              />
            )}
          />
          <div className="col-span-1 mt-2">
            <form.AppField
              name="is_completed"
              children={(formField) => (
                <SwitchField
                  id="is_completed"
                  label="Is Game Completed?"
                  field={formField}
                  className="transition-all duration-300"
                />
              )}
            />
          </div>

          <div className="col-span-1 md:col-span-2 mt-4">
            <form.AppForm>
              <form.SubmitButton label={"Update Score"} />
            </form.AppForm>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
