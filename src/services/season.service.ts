import { eq } from "drizzle-orm";
import { db as drizzle_db } from "~/db";
import { seasons } from "~/db/schema";
import type { Season } from "~/src/types/season";

export interface ISeasonService {
  getSeasons(): Promise<Season[]>;
  getActiveSeason(): Promise<Season | null>;
}

export class SeasonService implements ISeasonService {
  private drizzle_db: typeof drizzle_db;

  constructor() {
    this.drizzle_db = drizzle_db;
  }

  async getSeasons(): Promise<Season[]> {
    const seasonsData = await this.drizzle_db.query.seasons.findMany();

    if (!seasonsData) {
      throw new Error("No teams found");
    }

    const formattedSeasons = seasonsData.map((season) => ({
      id: season.id,
      name: season.name,
      startDate: season.startDate,
      endDate: season.endDate,
      isActive: season.isActive ?? false,
    }));

    return formattedSeasons;
  }

  async getActiveSeason(): Promise<Season | null> {
    const [seasonData] = await this.drizzle_db
      .select()
      .from(seasons)
      .where(eq(seasons.isActive, true))
      .limit(1);

    if (!seasonData) {
      return null;
    }

    return {
      id: seasonData.id,
      name: seasonData.name,
      startDate: seasonData.startDate,
      endDate: seasonData.endDate,
      isActive: seasonData.isActive ?? false,
    };
  }
}
