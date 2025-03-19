import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { playerGameStatsService } from "~/app/container";
import { PlayerGameStatsSchema } from "../schemas/player-game-stats.schema";

export const getPlayerGameStatsByGameId = createServerFn({
    method: "GET",
}).validator(z.object({
    gameId: z.string().uuid(),
})).handler(async ({ data }) => {
    try {
        const stats = await playerGameStatsService.getByGameId(data.gameId);
        return stats;
    } catch (error) {
        console.error("Error fetching player game stats:", error);
        throw new Error("Failed to fetch player game stats");
    }
});

export const createPlayerGameStats = createServerFn({
    method: "POST",
}).validator(PlayerGameStatsSchema).handler(async ({ data }) => {
    try {
        const stats = await playerGameStatsService.create(data);
        return stats;
    } catch (error) {
        console.error("Error creating player game stats:", error);
        throw new Error("Failed to create player game stats");
    }
});

export const updatePlayerGameStats = createServerFn({
    method: "POST",
}).validator(z.object({
    pgs_id: z.string().uuid(),
    game_id: z.string().uuid(),
    player_id: z.string().uuid(),
    minutes_played: z.number().nullable().default(0),
    points: z.number().nullable().default(0),
    field_goals_made: z.number().nullable().default(0),
    field_goals_attempted: z.number().nullable().default(0),
    three_pointers_made: z.number().nullable().default(0),
    three_pointers_attempted: z.number().nullable().default(0),
    free_throws_made: z.number().nullable().default(0),
    free_throws_attempted: z.number().nullable().default(0),
    offensive_rebounds: z.number().nullable().default(0),
    defensive_rebounds: z.number().nullable().default(0),
    total_rebounds: z.number().nullable().default(0),
    assists: z.number().nullable().default(0),
    steals: z.number().nullable().default(0),
    blocks: z.number().nullable().default(0),
    turnovers: z.number().nullable().default(0),
    personal_fouls: z.number().nullable().default(0),
    plus_minus: z.number().nullable().default(0),
})).handler(async ({ data }) => {
    try {
        const stats = await playerGameStatsService.update({
            id: data.pgs_id,
            ...data
        });
        return stats;
    } catch (error) {
        console.error("Error updating player game stats:", error);
        throw new Error("Failed to update player game stats");
    }
});

export const deletePlayerGameStats = createServerFn({
    method: "POST",
}).validator(z.object({
    id: z.string().uuid(),
})).handler(async ({ data }) => {
    try {
        const stats = await playerGameStatsService.delete(data.id);
        return stats;
    } catch (error) {
        console.error("Error deleting player game stats:", error);
        throw new Error("Failed to delete player game stats");
    }
});

export const getPlayerGameStatsByPlayerId = createServerFn({
    method: "GET",
}).validator(z.object({
    playerId: z.string().uuid(),
})).handler(async ({ data }) => {
    try {
        const stats = await playerGameStatsService.getByPlayerId(data.playerId);
        return stats;
    } catch (error) {
        console.error("Error fetching player game stats by player:", error);
        throw new Error("Failed to fetch player game stats");
    }
});

export const getPlayerGameStatsByGameIdAndPlayerId = createServerFn({
    method: "GET",
}).validator(z.object({
    gameId: z.string().uuid(),
    playerId: z.string().uuid(),
})).handler(async ({ data }) => {
    try {
        const stats = await playerGameStatsService.getByGameIdAndPlayerId(
            data.gameId,
            data.playerId
        );
        return stats;
    } catch (error) {
        console.error("Error fetching player game stats by game and player:", error);
        throw new Error("Failed to fetch player game stats");
    }
}); 