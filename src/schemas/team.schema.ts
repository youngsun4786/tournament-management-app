import { z } from "zod";

export const TeamSchema = z.object({
  name: z.string(),
  logoUrl: z.string(),
  createdAt: z.string().datetime().optional(),
});

export type Team = z.infer<typeof TeamSchema>;
