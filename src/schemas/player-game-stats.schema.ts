import { z } from "zod";

export const PlayerGameStatsSchema = z.object({
  id: z.string().uuid().optional(),
  gameId: z.string().uuid(),
  playerId: z.string().uuid(),
  minutesPlayed: z.number().int().nullable(),
  points: z.number().int().nullable(),
  fieldGoalsMade: z.number().int().nullable(),
  fieldGoalsAttempted: z.number().int().nullable(),
  twoPointersMade: z.number().int().nullable(),
  twoPointersAttempted: z.number().int().nullable(),
  threePointersMade: z.number().int().nullable(),
  threePointersAttempted: z.number().int().nullable(),
  freeThrowsMade: z.number().int().nullable(),
  freeThrowsAttempted: z.number().int().nullable(),
  offensiveRebounds: z.number().int().nullable(),
  defensiveRebounds: z.number().int().nullable(),
  totalRebounds: z.number().int().nullable(),
  assists: z.number().int().nullable(),
  steals: z.number().int().nullable(),
  blocks: z.number().int().nullable(),
  turnovers: z.number().int().nullable(),
  personalFouls: z.number().int().nullable(),
  plusMinus: z.number().int().nullable(),
  updatedAt: z.string().datetime().optional(),
});

export const PlayerGameStatsWithPlayerSchema = PlayerGameStatsSchema.extend({
  player: z.object({
    id: z.string().uuid(),
    name: z.string(),
    jerseyNumber: z.number().nullable(),
    teamId: z.string().uuid(),
    teamName: z.string(),
    position: z.string().nullable(),
  }),
});

export type PlayerGameStats = z.infer<typeof PlayerGameStatsSchema>;
export type PlayerGameStatsWithPlayer = z.infer<
  typeof PlayerGameStatsWithPlayerSchema
>;
