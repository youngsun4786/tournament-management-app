import { z } from "zod";
import { TeamSchema } from "./team.schema";
export const TeamGameStatsSchema = z.object({
    tgs_id: z.string().uuid(),
    game_id: z.string().uuid(),
    team_id: z.string().uuid(),
    points: z.number().int(),
    field_goals_made: z.number().int(),
    field_goals_attempted: z.number().int(),
    field_goal_percentage: z.number().int(),
    two_pointers_made: z.number().int(),
    two_pointers_attempted: z.number().int(),
    two_point_percentage: z.number().int(),
    three_pointers_made: z.number().int(),
    three_pointers_attempted: z.number().int(),
    three_point_percentage: z.number().int(),
    free_throws_made: z.number().int(),
    free_throws_attempted: z.number().int(),
    free_throw_percentage: z.number().int(),
    offensive_rebounds: z.number().int(),
    defensive_rebounds: z.number().int(),
    total_rebounds: z.number().int(),
    assists: z.number().int(),
    steals: z.number().int(),
    blocks: z.number().int(),
    turnovers: z.number().int(),
    team_fouls: z.number().int(),
    team: TeamSchema,
});

export type TeamGameStats = z.infer<typeof TeamGameStatsSchema>;