import { z } from "zod";

export const PlayerSchema = z.object({
    id: z.string().uuid(),
    team_name: z.string().optional(),
    team_id: z.string().uuid(),
    name: z.string(),
    jersey_number: z.number().int(),
    height: z.string().optional(),
    weight: z.string().optional(),
    position: z.string().optional(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
})

export type Player = z.infer<typeof PlayerSchema>;