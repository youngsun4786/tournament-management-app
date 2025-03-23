import { SupabaseClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { Player, PlayerInsert, PlayerUpdate } from "~/app/types/player";
import { db as drizzle_db } from "~/db";
import { players } from "~/db/schema";
import { supabaseServer } from "~/lib/utils/supabase-server";

export interface IPlayerService {
    create(data: PlayerInsert): Promise<Player>;
    update(data: PlayerUpdate): Promise<Player>;
    delete(data: {playerId : Player["player_id"];}): Promise<Player>;
    getPlayers(): Promise<Player[]>;
    getPlayerById(playerId: string): Promise<Player>;
    getPlayersByTeamId(teamId: string): Promise<Player[]>;
}

export class PlayerService implements IPlayerService {
    private supabase: SupabaseClient;
    private drizzle_db: typeof drizzle_db;

    constructor() {
        this.supabase = supabaseServer;
        this.drizzle_db = drizzle_db;
    }

    async create(data: PlayerInsert): Promise<Player> {
        const {data: player, error} = await this.supabase.from("players").insert(data).select().single<Player>();
        if (!player || error) {
            throw new Error("Failed to create player", {cause: error});
        }
        return player;
    }

    async update(data: PlayerUpdate): Promise<Player> {
        const {data: player, error} = await this.supabase.from("players").update(data).eq("player_id", data.player_id).select().single<Player>();
        if (!player || error) {
            throw new Error("Failed to update player", {cause: error});
        }
        return player;
    }

    async delete({ playerId }: { playerId: Player["player_id"]}): Promise<Player> {
        const {data: player, error} = await this.supabase.from("players").delete().eq("player_id", playerId).select().single<Player>();
        if (!player || error) {
            throw new Error("Failed to delete player", {cause: error});
        }
        return player;
    }

    async getPlayers(): Promise<Player[]> {
          // Query all players with their related teams
        const players = await this.drizzle_db.query.players.findMany({
            with: {
            team: true
            },
            orderBy: (players, { asc }) => [asc(players.jersey_number)]
        });

        // Transform the result to match the SQL query structure
        const playersWithTeams = players.map(player => {
            return {
            player_id: player.id,
            team_name: player.team!.name,
            name: player.name,
            jersey_number: player.jersey_number,
            height: player.height,
            weight: player.weight,
            position: player.position
            };
        });

        return playersWithTeams;
    }

    async getPlayerById(playerId: string): Promise<Player> {
        const {data: player, error} = await this.supabase.from("players").select("*").eq("id", playerId).single<Player>();
        if (!player || error) {
            throw new Error("Failed to get player by ID", {cause: error});
        }
        return player;
    }

    async getPlayersByTeamId(teamId: string): Promise<Player[]> {
        // Query players by team ID with their related team info
        const teamPlayers = await this.drizzle_db.query.players.findMany({
            where: eq(players.team_id, teamId),
            with: {
                team: true
            },
            orderBy: (players, { asc }) => [asc(players.jersey_number)]
        });

        // Transform the result to match the expected structure
        const playersWithTeams = teamPlayers.map(player => {
            return {
                player_id: player.id,
                team_id: player.team!.id,
                team_name: player.team!.name,
                name: player.name,
                jersey_number: player.jersey_number,
                height: player.height,
                weight: player.weight,
                position: player.position
            };
        });

        return playersWithTeams;
    }
}