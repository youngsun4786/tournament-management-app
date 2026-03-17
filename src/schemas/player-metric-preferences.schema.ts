import { z } from "zod";

const ratingField = z.number().int().min(0).max(100);

export const UpsertPlayerSkillRatingsSchema = z.object({
  playerId: z.string().uuid(),
  points: ratingField,
  rebounds: ratingField,
  assists: ratingField,
  steals: ratingField,
  blocks: ratingField,
});
