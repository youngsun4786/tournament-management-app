import { SupabaseClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm/sql";
import { TeamWithSeason } from "~/app/types/team";
import { db as drizzle_db } from "~/db";
import { teams } from "~/db/schema";
import { supabaseServer } from "~/lib/utils/supabase-server";
export interface ITeamService {
    getTeams(): Promise<TeamWithSeason[]>;
    getTeamsBySeasonId(seasonId: string): Promise<TeamWithSeason[]>;
}

export class TeamService implements ITeamService {
    private supabase: SupabaseClient;
    private drizzle_db: typeof drizzle_db;

    constructor() {
        this.supabase = supabaseServer;
        this.drizzle_db = drizzle_db;
    }

    async getTeams(): Promise<TeamWithSeason[]> {
        const teamsData = await this.drizzle_db.query.teams.findMany({
            with: {
                season: true,
            },
        });

        if (!teamsData) {
            throw new Error("No teams found");
        }

        const formattedTeams = teamsData.map((team) => ({
            ...team,
            season: {
                id: team.season!.id,
                name: team.season!.name,
                start_date: team.season!.start_date,
                end_date: team.season!.end_date,
                is_active: team.season!.is_active ?? false
            },
        }));

        return formattedTeams;
    }

    async getTeamsBySeasonId(seasonId: string): Promise<TeamWithSeason[]> {
        const teamsData = await this.drizzle_db.query.teams.findMany({
            where: eq(teams.season_id, seasonId),
            with: {
                season: true,
            },
        });

        if (!teamsData) {
            throw new Error("No teams found");
        }

        const formattedTeams = teamsData.map((team) => ({
            ...team,
            season: {
                id: team.season!.id,
                name: team.season!.name,
                start_date: team.season!.start_date,
                end_date: team.season!.end_date,
                is_active: team.season!.is_active ?? false
            },
        }));

        return formattedTeams;
    }

}