import { z } from "zod";

export const PlayerSchema = z.object({
  id: z.string().uuid().optional(),
  teamName: z.string().optional(),
  teamId: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  jerseyNumber: z
    .number()
    .int()
    .min(0, "Jersey number must be a positive number"),
  height: z.string().optional(),
  weight: z.string().optional(),
  position: z.string().optional(),
  playerUrl: z.string().url().optional(),
  waiverUrl: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Player = z.infer<typeof PlayerSchema>;
