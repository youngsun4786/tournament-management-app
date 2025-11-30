import { z } from 'zod';

export const VideoSchema = z.object({
  id: z.number().int().positive(),
  game_id: z.string().uuid(),
  quarter: z.number().int().min(1).max(4),
  youtube_url: z.string().url("Please enter a valid YouTube URL"),
  description: z.string().nullable(),
  created_at: z.string().datetime().optional(),
});
export const VideoInsertSchema = VideoSchema.omit({ id: true, created_at: true });

export type Video = z.infer<typeof VideoSchema>;
export type VideoInsert = z.infer<typeof VideoInsertSchema>;
