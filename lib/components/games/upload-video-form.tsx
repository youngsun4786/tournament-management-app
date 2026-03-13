import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import z from "zod";
import { addVideo } from "~/src/controllers/media.api";
import { mediaQueries } from "~/src/queries";
import { Game } from "~/src/types/game";
import { useAppForm } from "~/lib/form";
import { FormField } from "~/lib/components/form/form-field";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";

const formSchema = z.object({
  youtube_url: z.string().url("Please enter a valid YouTube URL"),
  quarter: z.number().int().min(1).max(4),
  description: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

type UploadVideoFormProps = {
  game: Game;
};

export function UploadVideoForm({ game }: UploadVideoFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      return addVideo({
        data: {
          game_id: game.id,
          quarter: values.quarter,
          youtube_url: values.youtube_url,
          description: values.description || null,
        },
      });
    },
    onSuccess: () => {
      toast.success("Video uploaded successfully");
      queryClient.invalidateQueries(mediaQueries.videosByGameId(game.id));
      form.reset();
    },
    onError: (error) => {
      toast.error(
        `Failed to upload video: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    },
  });

  const form = useAppForm({
    defaultValues: {
      youtube_url: "",
      quarter: 1 as number,
      description: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Upload Game Video</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField
            name="youtube_url"
            children={(field) => (
              <FormField
                id="youtube_url"
                label="YouTube URL"
                field={field}
                placeholder="https://www.youtube.com/watch?v=..."
                className=""
              />
            )}
          />

          <form.AppField
            name="quarter"
            children={(field) => (
              <field.SelectField
                label="Quarter"
                type="number"
                options={[
                  { value: 1, label: "1st" },
                  { value: 2, label: "2nd" },
                  { value: 3, label: "3rd" },
                  { value: 4, label: "4th" },
                ]}
              />
            )}
          />

          <form.AppField
            name="description"
            children={(field) => (
              <FormField
                id="description"
                label="Description (Optional)"
                field={field}
                text_type="textarea"
                placeholder="Add notes about this video..."
                className="resize-none"
              />
            )}
          />

          <div className="w-full">
            <form.AppForm>
              <form.SubmitButton label="Upload Video" />
            </form.AppForm>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
