import { eq } from "drizzle-orm";
import { db } from "~/db";
import { playerMetricPreferences } from "~/db/schema";
import { getSupabaseServerClient } from "~/lib/utils/supabase-server";
import type { SkillRatings } from "~/src/types/player-metric-preferences";

export class PlayerMetricPreferencesService {
  private get drizzle_db() {
    return db;
  }

  private get supabase() {
    return getSupabaseServerClient();
  }

  async getByPlayerId(playerId: string): Promise<SkillRatings | null> {
    const result = await this.drizzle_db
      .select({
        points: playerMetricPreferences.points,
        rebounds: playerMetricPreferences.rebounds,
        assists: playerMetricPreferences.assists,
        steals: playerMetricPreferences.steals,
        blocks: playerMetricPreferences.blocks,
      })
      .from(playerMetricPreferences)
      .where(eq(playerMetricPreferences.playerId, playerId))
      .limit(1);

    if (result.length === 0) return null;
    return result[0];
  }

  async upsert(
    playerId: string,
    ratings: SkillRatings,
    updatedBy: string,
  ): Promise<void> {
    const { error } = await this.supabase
      .from("player_metric_preferences")
      .upsert(
        {
          player_id: playerId,
          points: ratings.points,
          rebounds: ratings.rebounds,
          assists: ratings.assists,
          steals: ratings.steals,
          blocks: ratings.blocks,
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "player_id" },
      );

    if (error) {
      throw new Error("Failed to upsert player skill ratings", {
        cause: error,
      });
    }
  }
}
