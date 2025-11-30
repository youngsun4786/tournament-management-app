import type { Season } from "~/src/types/season";
import { db as drizzle_db } from "~/db";

export interface ISeasonService {
    getSeasons(): Promise<Season[]>;
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
            start_date: season.start_date,
            end_date: season.end_date,
            is_active: season.is_active ?? false
        }));

        return formattedSeasons;
    }
}