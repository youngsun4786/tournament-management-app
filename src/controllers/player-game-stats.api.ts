import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { playerGameStatsService, playerService } from "~/src/container";
import { PlayerGameStatsSchema } from "../schemas/player-game-stats.schema";

export const getPlayerGameStatsByGameId = createServerFn({
    method: "GET",
}).inputValidator(z.object({
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
}).inputValidator(PlayerGameStatsSchema).handler(async ({ data }) => {
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
}).inputValidator(PlayerGameStatsSchema).handler(async ({ data }) => {
    try {
        const stats = await playerGameStatsService.update({
            id: data.pgs_id!,
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
}).inputValidator(z.object({
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
}).inputValidator(z.object({
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


export const getTotalPlayerStatsByPlayerId = createServerFn({
    method: "GET",
}).inputValidator(z.object({
    playerId: z.string().uuid(),
})).handler(async ({ data }) => {

    try {
        const stats = await playerGameStatsService.getByPlayerId(data.playerId);

        // Initialize totals object
        const totals = {
            games: 0,
            minutes_played: 0,
            points: 0,
            field_goals_made: 0,
            field_goals_attempted: 0,
            two_pointers_made: 0,
            two_pointers_attempted: 0,
            three_pointers_made: 0,
            three_pointers_attempted: 0,
            free_throws_made: 0,
            free_throws_attempted: 0,
            offensive_rebounds: 0,
            defensive_rebounds: 0,
            total_rebounds: 0,
            assists: 0,
            steals: 0,
            blocks: 0,
            turnovers: 0,
            personal_fouls: 0,
            plus_minus: 0,
        };

        
        // Sum up all stats
        stats.forEach(stat => {
            // Only count games where the player actually played minutes
            // !TODO: Add validation for minutes played > 0 later and player.minutes_played exists
                totals.games += 1;
                totals.minutes_played += stat.minutes_played || 0;
                totals.points += stat.points || 0;
                totals.field_goals_made += stat.field_goals_made || 0;
                totals.field_goals_attempted += stat.field_goals_attempted || 0;
                totals.two_pointers_made += stat.two_pointers_made || 0;
                totals.two_pointers_attempted += stat.two_pointers_attempted || 0;
                totals.three_pointers_made += stat.three_pointers_made || 0;
                totals.three_pointers_attempted += stat.three_pointers_attempted || 0;
                totals.free_throws_made += stat.free_throws_made || 0;
                totals.free_throws_attempted += stat.free_throws_attempted || 0;
                totals.offensive_rebounds += stat.offensive_rebounds || 0;
                totals.defensive_rebounds += stat.defensive_rebounds || 0;
                totals.total_rebounds += stat.total_rebounds || 0;
                totals.assists += stat.assists || 0;
                totals.steals += stat.steals || 0;
                totals.blocks += stat.blocks || 0;
                totals.turnovers += stat.turnovers || 0;
                totals.personal_fouls += stat.personal_fouls || 0;
                totals.plus_minus += stat.plus_minus || 0;
            
        }); 

        // If no games played, return zeroes
        if (totals.games === 0) {
            return {
                player: stats.length > 0 ? stats[0].player : null,
                total_points: 0,
                total_rebounds: 0,
                total_assists: 0,
                total_steals: 0,
                total_blocks: 0,
                total_turnovers: 0,
                total_personal_fouls: 0,
                total_plus_minus: 0,
                // percentages
                total_field_goal_percentage: 0,
                total_two_point_percentage: 0,
                total_three_point_percentage: 0,
                total_free_throw_percentage: 0,
                // attempts per game
                total_field_goal_attempts: 0,
                total_two_point_attempts: 0,
                total_three_point_attempts: 0,
                total_free_throw_attempts: 0,
                // made per game
                total_field_goals_made: 0,
                total_two_pointers_made: 0,
                total_three_pointers_made: 0,
                total_free_throws_made: 0,
                games_played: 0,
            };
        }  

        // Calculate totals
        const playerTotals = {
            player: stats.length > 0 ? stats[0].player : null,
            total_points: totals.points,
            total_rebounds: totals.total_rebounds,
            total_assists: totals.assists,
            total_steals: totals.steals,
            total_blocks: totals.blocks,
            total_turnovers: totals.turnovers,
            total_personal_fouls: totals.personal_fouls,
            total_plus_minus: totals.plus_minus,
            total_field_goal_percentage: totals.field_goals_attempted > 0 
                ? totals.field_goals_made / totals.field_goals_attempted 
                : 0,
            total_two_point_percentage: totals.two_pointers_attempted > 0 
                ? totals.two_pointers_made / totals.two_pointers_attempted 
                : 0,
            total_three_point_percentage: totals.three_pointers_attempted > 0 
                ? totals.three_pointers_made / totals.three_pointers_attempted 
                : 0,
            total_free_throw_percentage: totals.free_throws_attempted > 0 
                ? totals.free_throws_made / totals.free_throws_attempted 
                : 0,
            // attempts per game
            total_field_goal_attempts: totals.field_goals_attempted,
            total_two_point_attempts: totals.two_pointers_attempted,
            total_three_point_attempts: totals.three_pointers_attempted,
            total_free_throw_attempts: totals.free_throws_attempted,
            // made per game
            total_field_goals_made: totals.field_goals_made,
            total_two_pointers_made: totals.two_pointers_made,
            total_three_pointers_made: totals.three_pointers_made,
            total_free_throws_made: totals.free_throws_made,
            games_played: totals.games,
        }
        return playerTotals;
    } catch (error) {
        console.error("Error fetching total player stats by player:", error);
        throw new Error("Failed to fetch total player stats by player");
    }
});



export const getAveragePlayerStatsByPlayerId = createServerFn({
    method: "GET",
}).inputValidator(z.object({
    playerId: z.string().uuid(),
})).handler(async ({ data }) => {
    try {
        // Get all game stats for the player
        const gameStats = await playerGameStatsService.getByPlayerId(data.playerId);
        
        // Initialize totals object
        const totals = {
            games: 0,
            minutes_played: 0,
            points: 0,
            field_goals_made: 0,
            field_goals_attempted: 0,
            two_pointers_made: 0,
            two_pointers_attempted: 0,
            three_pointers_made: 0,
            three_pointers_attempted: 0,
            free_throws_made: 0,
            free_throws_attempted: 0,
            offensive_rebounds: 0,
            defensive_rebounds: 0,
            total_rebounds: 0,
            assists: 0,
            steals: 0,
            blocks: 0,
            turnovers: 0,
            personal_fouls: 0,
            plus_minus: 0,
        };

        
        // Sum up all stats
        gameStats.forEach(stat => {
            // Only count games where the player actually played minutes
            // !TODO: Add validation for minutes played > 0 later and player.minutes_played exists
                totals.games += 1;
                totals.minutes_played += stat.minutes_played || 0;
                totals.points += stat.points || 0;
                totals.field_goals_made += stat.field_goals_made || 0;
                totals.field_goals_attempted += stat.field_goals_attempted || 0;
                totals.two_pointers_made += stat.two_pointers_made || 0;
                totals.two_pointers_attempted += stat.two_pointers_attempted || 0;
                totals.three_pointers_made += stat.three_pointers_made || 0;
                totals.three_pointers_attempted += stat.three_pointers_attempted || 0;
                totals.free_throws_made += stat.free_throws_made || 0;
                totals.free_throws_attempted += stat.free_throws_attempted || 0;
                totals.offensive_rebounds += stat.offensive_rebounds || 0;
                totals.defensive_rebounds += stat.defensive_rebounds || 0;
                totals.total_rebounds += stat.total_rebounds || 0;
                totals.assists += stat.assists || 0;
                totals.steals += stat.steals || 0;
                totals.blocks += stat.blocks || 0;
                totals.turnovers += stat.turnovers || 0;
                totals.personal_fouls += stat.personal_fouls || 0;
                totals.plus_minus += stat.plus_minus || 0;
            
        }); 
        // If no games played, return zeroes
        if (totals.games === 0) {
            return {
                player: gameStats.length > 0 ? gameStats[0].player : null,
                points_per_game: 0,
                rebounds_per_game: 0,
                assists_per_game: 0,
                steals_per_game: 0,
                blocks_per_game: 0,
                turnovers_per_game: 0,
                personal_fouls_per_game: 0,
                plus_minus_per_game: 0,
                // percentages
                field_goal_percentage: 0,
                two_point_percentage: 0,
                three_point_percentage: 0,
                free_throw_percentage: 0,
                // attempts per game
                field_goal_attempts_per_game: 0,
                two_point_attempts_per_game: 0,
                three_point_attempts_per_game: 0,
                free_throw_attempts_per_game: 0,
                // made per game
                field_goals_made_per_game: 0,
                two_pointers_made_per_game: 0,
                three_pointers_made_per_game: 0,
                free_throws_made_per_game: 0,
                games_played: 0,
            };
        }
        
        // Calculate averages
        const averages = {
            player: gameStats.length > 0 ? gameStats[0].player : null,
            points_per_game: totals.points / totals.games, // Points per game
            rebounds_per_game: totals.total_rebounds / totals.games, // Rebounds per game
            assists_per_game: totals.assists / totals.games, // Assists per game
            steals_per_game: totals.steals / totals.games, // Steals per game
            blocks_per_game: totals.blocks / totals.games, // Blocks per game
            // mpg: totals.minutes_played / totals.games, // Minutes per game (add this later)
            turnovers_per_game: totals.turnovers / totals.games, // Turnovers per game
            personal_fouls_per_game: totals.personal_fouls / totals.games, // Personal fouls per game
            plus_minus_per_game: totals.plus_minus / totals.games, // Plus minus per game

            // percentages
            field_goal_percentage: totals.field_goals_attempted > 0 
                ? totals.field_goals_made / totals.field_goals_attempted 
                : 0, // Field goal percentage
            two_point_percentage: totals.two_pointers_attempted > 0 
                ? totals.two_pointers_made / totals.two_pointers_attempted 
                : 0, // Two point percentage
            three_point_percentage: totals.three_pointers_attempted > 0 
                ? totals.three_pointers_made / totals.three_pointers_attempted 
                : 0, // Three point percentage
            free_throw_percentage: totals.free_throws_attempted > 0 
                ? totals.free_throws_made / totals.free_throws_attempted 
                : 0, // Free throw percentage
            // attempts per game
            field_goal_attempts_per_game: totals.field_goals_attempted / totals.games, // Field goal attempts per game
            two_point_attempts_per_game: totals.two_pointers_attempted / totals.games, // Two point attempts per game
            three_point_attempts_per_game: totals.three_pointers_attempted / totals.games, // Three point attempts per game
            free_throw_attempts_per_game: totals.free_throws_attempted / totals.games, // Free throw attempts per game
            // made per game
            field_goals_made_per_game: totals.field_goals_made / totals.games, // Field goals made per game
            two_pointers_made_per_game: totals.two_pointers_made / totals.games, // Two pointers made per game
            three_pointers_made_per_game: totals.three_pointers_made / totals.games, // Three pointers made per game
            free_throws_made_per_game: totals.free_throws_made / totals.games, // Free throws made per game
            games_played: totals.games,
        };
        return averages;
    } catch (error) {
        console.error("Error calculating average player stats:", error);
        throw new Error("Failed to calculate average player stats");
    }
});

export const getPlayerGameStatsByGameIdAndPlayerId = createServerFn({
    method: "GET",
}).inputValidator(z.object({
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

export const getAveragePlayerStatsAllPlayers = createServerFn({
    method: "GET",
}).handler(async () => {
    try {
        const players = await playerService.getPlayers();
        const stats = await Promise.all(players.map(player => getAveragePlayerStatsByPlayerId( { data: { playerId: player.player_id } })));
        return stats;
    } catch (error) {
        console.error("Error fetching average player stats for all players:", error);
        throw new Error("Failed to fetch average player stats for all players");
    }
});

export const getTotalPlayerStatsAllPlayers = createServerFn({
    method: "GET",
}).handler(async () => {
    try {
        const players = await playerService.getPlayers();
        const playerTotals = await Promise.all(players.map(player => getTotalPlayerStatsByPlayerId( { data: { playerId: player.player_id } })));
        return playerTotals;
    } catch (error) {
        console.error("Error fetching total player stats for all players:", error);
        throw new Error("Failed to fetch total player stats for all players");
    }
});

export const getPlayerStatsAllPlayers = createServerFn({
    method: "GET",
}).handler(async () => {
    try {
        const stats = await playerGameStatsService.getAll();
        return stats;
    } catch (error) {
        console.error("Error fetching player stats for all players:", error);
        throw new Error("Failed to fetch player stats for all players");
    }
});
