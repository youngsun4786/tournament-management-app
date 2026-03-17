import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { playerMetricPreferencesService } from "~/src/container";
import { UpsertPlayerSkillRatingsSchema } from "~/src/schemas/player-metric-preferences.schema";
import { getSupabaseServerClient } from "~/lib/utils/supabase-server";

export const getPlayerMetricPreferences = createServerFn({
  method: "GET",
})
  .inputValidator(z.object({ playerId: z.string().uuid() }))
  .handler(async ({ data }) => {
    return playerMetricPreferencesService.getByPlayerId(data.playerId);
  });

export const upsertPlayerMetricPreferences = createServerFn({
  method: "POST",
})
  .inputValidator(UpsertPlayerSkillRatingsSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { playerId, ...ratings } = data;
    await playerMetricPreferencesService.upsert(playerId, ratings, user.id);
    return { success: true };
  });
