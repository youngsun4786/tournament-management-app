import { z } from "zod";
import { TeamSchema } from "./team.schema";
export const TeamGameStatsSchema = z.object({
  id: z.string().uuid(),
  gameId: z.string().uuid(),
  teamId: z.string().uuid(),
  points: z.number().int(),
  fieldGoalsMade: z.number().int(),
  fieldGoalsAttempted: z.number().int(),
  fieldGoalPercentage: z.number().int(),
  twoPointersMade: z.number().int(),
  twoPointersAttempted: z.number().int(),
  twoPointPercentage: z.number().int(),
  threePointersMade: z.number().int(),
  threePointersAttempted: z.number().int(),
  threePointPercentage: z.number().int(),
  freeThrowsMade: z.number().int(),
  freeThrowsAttempted: z.number().int(),
  freeThrowPercentage: z.number().int(),
  offensiveRebounds: z.number().int(),
  defensiveRebounds: z.number().int(),
  totalRebounds: z.number().int(),
  assists: z.number().int(),
  steals: z.number().int(),
  blocks: z.number().int(),
  teamFouls: z.number().int(),
  team: TeamSchema,
});

export type TeamGameStats = z.infer<typeof TeamGameStatsSchema>;
