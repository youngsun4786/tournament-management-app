import { z } from 'zod';

export const GameSchema = z.object({
  id: z.string().uuid(),
  home_team_id: z.string().uuid(),
  away_team_id: z.string().uuid(),
  game_date: z.string().datetime(),
  start_time: z.string(),
  location: z.string(),
  court: z.string().nullable(),
  is_completed: z.boolean().default(false),
  home_team_score: z.number().int().default(0),
  away_team_score: z.number().int().default(0),
  created_at: z.string().datetime().optional(),
});

export const GameWithTeamsSchema = GameSchema.extend({
  home_team: z.object({
    id: z.string().uuid(),
    name: z.string(),
    logo_url: z.string().nullable()
  }),
  away_team: z.object({
    id: z.string().uuid(),
    name: z.string(),
    logo_url: z.string().nullable()
  })
});

export type Game = z.infer<typeof GameSchema>;
export type GameWithTeams = z.infer<typeof GameWithTeamsSchema>;

// Schema for game creation/update
export const GameInputSchema = GameSchema.omit({ 
  id: true, 
  created_at: true 
}).partial({
  home_team_score: true,
  away_team_score: true,
  court: true,
});

export type GameInput = z.infer<typeof GameInputSchema>;