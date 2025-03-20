import { SupabaseClient } from "@supabase/supabase-js";
import { and, eq } from "drizzle-orm";
import type { Player } from "~/app/types/player";
import type { PlayerGameStats, PlayerGameStatsInsert, PlayerGameStatsUpdate, PlayerGameStatsWithPlayer } from "~/app/types/player-game-stats";
import { db as drizzle_db } from "~/db";
import { player_game_stats } from "~/db/schema";
import { supabaseServer } from "~/lib/utils/supabase-server";

export interface IPlayerGameStatsService {
    getByGameId(gameId: string): Promise<PlayerGameStatsWithPlayer[]>;
    getByPlayerId(playerId: string): Promise<PlayerGameStatsWithPlayer[]>;
    getByGameIdAndPlayerId(gameId: string, playerId: string): Promise<PlayerGameStatsWithPlayer[]>;
    create(data: PlayerGameStatsInsert): Promise<PlayerGameStats>;
    update(data: PlayerGameStatsUpdate & { id: string }): Promise<PlayerGameStats>;
    delete(id: string): Promise<PlayerGameStats>;
}

export class PlayerGameStatsService implements IPlayerGameStatsService {
    private supabase: SupabaseClient;
    private drizzle_db: typeof drizzle_db;

    constructor() {
        this.supabase = supabaseServer;
        this.drizzle_db = drizzle_db;
    }

    async getByGameId(gameId: string): Promise<PlayerGameStatsWithPlayer[]> {
        // Query player game stats with their related player information
        const stats = await this.drizzle_db.query.player_game_stats.findMany({
            where: eq(player_game_stats.game_id, gameId),
            with: {
                player: {
                    with: {
                        team: true
                    }
                }
            },
            orderBy: (pgs, { desc }) => [desc(pgs.minutes_played)]
        });

        // Transform the result to match the expected schema
        const statsWithPlayer = stats.map(stat => ({
            pgs_id: stat.id,
            game_id: stat.game_id,
            player_id: stat.player_id,
            minutes_played: stat.minutes_played,
            points: stat.points,
            field_goals_made: stat.field_goals_made,
            field_goals_attempted: stat.field_goals_attempted,
            field_goal_percentage: stat.field_goal_percentage,
            two_pointers_made: stat.two_pointers_made,
            two_pointers_attempted: stat.two_pointers_attempted,
            two_point_percentage: stat.two_point_percentage,
            three_pointers_made: stat.three_pointers_made,
            three_pointers_attempted: stat.three_pointers_attempted,
            three_point_percentage: stat.three_point_percentage,
            free_throws_made: stat.free_throws_made,
            free_throws_attempted: stat.free_throws_attempted,
            free_throw_percentage: stat.free_throw_percentage,
            offensive_rebounds: stat.offensive_rebounds,
            defensive_rebounds: stat.defensive_rebounds,
            total_rebounds: stat.total_rebounds,
            assists: stat.assists,
            steals: stat.steals,
            blocks: stat.blocks,
            turnovers: stat.turnovers,
            personal_fouls: stat.personal_fouls,
            plus_minus: stat.plus_minus,
            updated_at: stat.updated_at?.toString(),
            player: {
                name: stat.player!.name,
                jersey_number: stat.player!.jersey_number,
                position: stat.player!.position,
                team_name: stat.player!.team!.name,
            } as Omit<Player, "player_id" | "height" | "weight">,
        }));

        return statsWithPlayer;
    }

    async getByPlayerId(playerId: string): Promise<PlayerGameStatsWithPlayer[]> {
        const stats = await this.drizzle_db.query.player_game_stats.findMany({
            where: eq(player_game_stats.player_id, playerId),
            with: {
                player: {
                    with: {
                        team: true
                    }
                }
            },
            orderBy: (pgs, { desc }) => [desc(pgs.minutes_played)]
        });

        const statsWithPlayer = stats.map(stat => ({
            pgs_id: stat.id,
            game_id: stat.game_id,
            player_id: stat.player_id,
            minutes_played: stat.minutes_played,
            points: stat.points,
            field_goals_made: stat.field_goals_made,
            field_goals_attempted: stat.field_goals_attempted,
            field_goal_percentage: stat.field_goal_percentage,
            two_pointers_made: stat.two_pointers_made,
            two_pointers_attempted: stat.two_pointers_attempted,
            two_point_percentage: stat.two_point_percentage,
            three_pointers_made: stat.three_pointers_made,
            three_pointers_attempted: stat.three_pointers_attempted,
            three_point_percentage: stat.three_point_percentage,
            free_throws_made: stat.free_throws_made,
            free_throws_attempted: stat.free_throws_attempted,
            free_throw_percentage: stat.free_throw_percentage,
            offensive_rebounds: stat.offensive_rebounds,
            defensive_rebounds: stat.defensive_rebounds,
            total_rebounds: stat.total_rebounds,
            assists: stat.assists,
            steals: stat.steals,
            blocks: stat.blocks,
            turnovers: stat.turnovers,
            personal_fouls: stat.personal_fouls,
            plus_minus: stat.plus_minus,
            updated_at: stat.updated_at?.toString(),
            player: {
                name: stat.player!.name,
                jersey_number: stat.player!.jersey_number,
                position: stat.player!.position,
                team_name: stat.player!.team!.name,
            } as Omit<Player, "player_id" | "height" | "weight">,
        }));

        return statsWithPlayer;
    } 
    
    async getByGameIdAndPlayerId(gameId: string, playerId: string): Promise<PlayerGameStatsWithPlayer[]> {
        const stats = await this.drizzle_db.query.player_game_stats.findFirst({
            where: and(eq(player_game_stats.game_id, gameId), eq(player_game_stats.player_id, playerId))
        });

        return stats;
    }
    
    
    async create(data: PlayerGameStatsInsert): Promise<PlayerGameStats> {
        const [created] = await this.drizzle_db.insert(player_game_stats)
            .values(data)
            .returning();

        if (!created) {
            throw new  Error('Failed to create player game stats');
        }

        return created;
    }

    async update(data: Partial<PlayerGameStats> & { id: string }): Promise<PlayerGameStats> {
        const [updated] = await this.drizzle_db.update(player_game_stats)
            .set({
                ...data,
                updated_at: new Date().toISOString()
            })
            .where(eq(player_game_stats.id, data.id))
            .returning();

        if (!updated) {
            throw new Error('Failed to update player game stats');
        }

        return updated;
    }



    async delete(id: string): Promise<void> {
        await this.drizzle_db.delete(player_game_stats)
            .where(eq(player_game_stats.id, id));
    }
} 