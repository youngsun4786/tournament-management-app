import { z } from "zod";

export const PlayerSchema = z.object({
    player_id: z.string().uuid().optional(),
    team_name: z.string().optional(),
    team_id: z.string().uuid(),
    name: z.string().min(1, "Name is required"),
    jersey_number: z.number().int().min(0, "Jersey number must be a positive number"),
    height: z.string().optional(),
    weight: z.string().optional(),
    position: z.string().optional(),
    player_url: z.string().url().optional(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
})

export type Player = z.infer<typeof PlayerSchema>;