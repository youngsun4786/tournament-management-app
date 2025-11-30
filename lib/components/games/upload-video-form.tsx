import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { addVideo } from "~/src/controllers/media.api";
import { mediaQueries } from "~/src/queries";
import { Game } from "~/src/types/game";
import { Button } from "~/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/lib/components/ui/form";
import { Input } from "~/lib/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/lib/components/ui/select";
import { Textarea } from "~/lib/components/ui/textarea";

const formSchema = z.object({
  youtube_url: z.string().url("Please enter a valid YouTube URL"),
  quarter: z.number().int().min(1).max(4),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type UploadVideoFormProps = {
  game: Game;
};

export function UploadVideoForm({ game }: UploadVideoFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      youtube_url: "",
      quarter: 1,
      description: "",
    },
  });

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
        `Failed to upload video: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    },
  });

  async function onSubmit(data: FormValues) {
    await mutation.mutateAsync(data);
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Upload Game Video</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="youtube_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the full YouTube video URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quarter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quarter</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select quarter" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1st</SelectItem>
                      <SelectItem value="2">2nd</SelectItem>
                      <SelectItem value="3">3rd</SelectItem>
                      <SelectItem value="4">4th</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Which quarter of the game does this video cover?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add notes about this video..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Uploading..." : "Upload Video"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
