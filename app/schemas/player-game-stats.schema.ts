import { z } from 'zod';

export const PlayerGameStatsSchema = z.object({
  pgs_id: z.string().uuid().optional(), 
  game_id: z.string().uuid(),
  player_id: z.string().uuid(),
  minutes_played: z.number().int().nullable(),
  points: z.number().int().nullable(),
  field_goals_made: z.number().int().nullable(),
  field_goals_attempted: z.number().int().nullable(),
  three_pointers_made: z.number().int().nullable(),
  three_pointers_attempted: z.number().int().nullable(),
  free_throws_made: z.number().int().nullable(),
  free_throws_attempted: z.number().int().nullable(),
  offensive_rebounds: z.number().int().nullable(),
  defensive_rebounds: z.number().int().nullable(),
  total_rebounds: z.number().int().nullable(),
  assists: z.number().int().nullable(),
  steals: z.number().int().nullable(),
  blocks: z.number().int().nullable(),
  turnovers: z.number().int().nullable(),
  personal_fouls: z.number().int().nullable(),
  plus_minus: z.number().int().nullable(),
  updated_at: z.string().datetime().optional(),
});

export const PlayerGameStatsWithPlayerSchema = PlayerGameStatsSchema.extend({
  player: z.object({
    id: z.string().uuid(),
    name: z.string(),
    jersey_number: z.number().nullable(),
    team_id: z.string().uuid(),
    team_name: z.string(),
    position: z.string().nullable(),
  }),
});

export type PlayerGameStats = z.infer<typeof PlayerGameStatsSchema>;
export type PlayerGameStatsWithPlayer = z.infer<typeof PlayerGameStatsWithPlayerSchema>; 