import { SupabaseClient } from "@supabase/supabase-js";
import type { Game, GameInsert, GameUpdate } from "~/app/types/game";
import { db as drizzle_db } from "~/db";
import { supabaseServer } from "~/lib/utils/supabase-server";

export interface IGameService {
    getById(id: Game["id"]): Promise<Game>;
    create(data: {game: GameInsert; userId: string;}): Promise<Game>;
    update(data: GameUpdate): Promise<Game>;
    updateScore(data: GameUpdate): Promise<Game>;
    delete(data: {id: Game["id"]; userId: string}): Promise<Game>;
    getWithTeams(): Promise<Game[]>;
}

export class GameService implements IGameService {
    private supabase: SupabaseClient;
    private drizzle_db: typeof drizzle_db;

    constructor() {
        this.supabase = supabaseServer;
        this.drizzle_db = drizzle_db;
    }


    async getById(id: Game["id"]): Promise<Game> {
        const {data, error} = await this.supabase.from("games").select().eq("id", id).single();
        if (!data || error) {
            throw new Error("Game not found");
        }
        return data;
    }

    async getWithTeams(): Promise<Game[]> {
        // Query games with their related teams
        const games = await this.drizzle_db.query.games.findMany({
            with: {
            team_home_team_id: true,
            team_away_team_id: true,
            },
            orderBy: (games, { asc }) => [asc(games.game_date), asc(games.start_time)]
        });

        // Transform the result to match the SQL query structure
        const gamesWithTeams = games.map(game => {
            return {
            id: game.id,
            game_date: game.game_date,
            start_time: game.start_time,
            location: game.location,
            court: game.court,
            is_completed: game.is_completed,
            home_team_score: game.home_team_score,
            away_team_score: game.away_team_score,
            home_team_id: game.team_home_team_id.id,
            home_team_name: game.team_home_team_id.name,
            home_team_logo: game.team_home_team_id.logo_url,
            away_team_id: game.team_away_team_id.id,
            away_team_name: game.team_away_team_id.name,
            away_team_logo: game.team_away_team_id.logo_url
            };
        });
        return gamesWithTeams;
    }

    async create(data: {game: GameInsert; userId: string;}): Promise<Game> {
        return {} as Game;
    }

    async update(data: GameUpdate): Promise<Game> {
        const {data: updated, error} = await this.supabase.from("games").update({
            game_date: data.game_date,
            start_time: data.start_time,
            location: data.location,
            court: data.court,
            is_completed: data.is_completed,
            home_team_score: data.home_team_score,
            away_team_score: data.away_team_score,
        }).eq("id", data.id).select().single<Game>();
        if (!updated || error) {
            throw new Error("Failed to update game", {cause: error});
        }

        return updated;
    }

    async updateScore(data: GameUpdate): Promise<Game> {
        console.log("data", data);
        const {data: updated, error} = await this.supabase.from("games").update({
            home_team_score: data.home_team_score,
            away_team_score: data.away_team_score,
            is_completed: data.is_completed,
        }).eq("id", data.id).select().single<Game>();
        console.log("updated", updated);
        if (!updated || error) {
            throw new Error("Failed to update game score", {cause: error});
        }
        return updated;
    }

    async delete(data: {id: Game["id"]; userId: string}): Promise<Game> {
        return {} as Game;
    }

}