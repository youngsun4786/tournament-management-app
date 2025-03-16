import { z } from 'zod';

export const TeamSchema = z.object({
    name: z.string(),
    logo_url: z.string(),
    created_at: z.string().datetime().optional(),
});


export type Team = z.infer<typeof TeamSchema>;