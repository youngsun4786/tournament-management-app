import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { playerGameStatsService, playerService } from "~/src/container";
import { PlayerGameStatsSchema } from "../schemas/player-game-stats.schema";

const mapToServiceInput = (data: z.infer<typeof PlayerGameStatsSchema>) => {
  return {
    gameId: data.gameId,
    playerId: data.playerId,
    minutesPlayed: data.minutesPlayed,
    points: data.points,
    fieldGoalsMade: data.fieldGoalsMade,
    fieldGoalsAttempted: data.fieldGoalsAttempted,
    twoPointersMade: data.twoPointersMade,
    twoPointersAttempted: data.twoPointersAttempted,
    threePointersMade: data.threePointersMade,
    threePointersAttempted: data.threePointersAttempted,
    freeThrowsMade: data.freeThrowsMade,
    freeThrowsAttempted: data.freeThrowsAttempted,
    offensiveRebounds: data.offensiveRebounds,
    defensiveRebounds: data.defensiveRebounds,
    totalRebounds: data.totalRebounds,
    assists: data.assists,
    steals: data.steals,
    blocks: data.blocks,
    turnovers: data.turnovers,
    personalFouls: data.personalFouls,
    plusMinus: data.plusMinus,
  };
};

export const getPlayerGameStatsByGameId = createServerFn({
  method: "GET",
})
  .inputValidator(
    z.object({
      gameId: z.string().uuid(),
    }),
  )
  .handler(async ({ data }) => {
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
})
  .inputValidator(PlayerGameStatsSchema)
  .handler(async ({ data }) => {
    try {
      const stats = await playerGameStatsService.create(
        mapToServiceInput(data),
      );
      return stats;
    } catch (error) {
      console.error("Error creating player game stats:", error);
      throw new Error("Failed to create player game stats");
    }
  });

export const updatePlayerGameStats = createServerFn({
  method: "POST",
})
  .inputValidator(PlayerGameStatsSchema)
  .handler(async ({ data }) => {
    try {
      const stats = await playerGameStatsService.update({
        id: data.id!,
        ...mapToServiceInput(data),
      });
      return stats;
    } catch (error) {
      console.error("Error updating player game stats:", error);
      throw new Error("Failed to update player game stats");
    }
  });

export const deletePlayerGameStats = createServerFn({
  method: "POST",
})
  .inputValidator(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .handler(async ({ data }) => {
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
})
  .inputValidator(
    z.object({
      playerId: z.string().uuid(),
    }),
  )
  .handler(async ({ data }) => {
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
})
  .inputValidator(
    z.object({
      playerId: z.string().uuid(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const stats = await playerGameStatsService.getByPlayerId(data.playerId);

      // Initialize totals object
      const totals = {
        games: 0,
        minutesPlayed: 0,
        points: 0,
        fieldGoalsMade: 0,
        fieldGoalsAttempted: 0,
        twoPointersMade: 0,
        twoPointersAttempted: 0,
        threePointersMade: 0,
        threePointersAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        offensiveRebounds: 0,
        defensiveRebounds: 0,
        totalRebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        personalFouls: 0,
        plusMinus: 0,
      };

      // Sum up all stats
      stats.forEach((stat) => {
        // Only count games where the player actually played minutes
        // !TODO: Add validation for minutes played > 0 later and player.minutes_played exists
        totals.games += 1;
        totals.minutesPlayed += stat.minutesPlayed || 0;
        totals.points += stat.points || 0;
        totals.fieldGoalsMade += stat.fieldGoalsMade || 0;
        totals.twoPointersMade += stat.twoPointersMade || 0;
        totals.twoPointersAttempted += stat.twoPointersAttempted || 0;
        totals.threePointersMade += stat.threePointersMade || 0;
        totals.threePointersAttempted += stat.threePointersAttempted || 0;
        totals.freeThrowsMade += stat.freeThrowsMade || 0;
        totals.freeThrowsAttempted += stat.freeThrowsAttempted || 0;
        totals.offensiveRebounds += stat.offensiveRebounds || 0;
        totals.defensiveRebounds += stat.defensiveRebounds || 0;
        totals.totalRebounds += stat.totalRebounds || 0;
        totals.assists += stat.assists || 0;
        totals.steals += stat.steals || 0;
        totals.blocks += stat.blocks || 0;
        totals.turnovers += stat.turnovers || 0;
        totals.personalFouls += stat.personalFouls || 0;
        totals.plusMinus += stat.plusMinus || 0;
      });

      // If no games played, return zeroes
      if (totals.games === 0) {
        return {
          player: stats.length > 0 ? stats[0].player : null,
          totalPoints: 0,
          totalRebounds: 0,
          totalAssists: 0,
          totalSteals: 0,
          totalBlocks: 0,
          totalTurnovers: 0,
          totalPersonalFouls: 0,
          totalPlusMinus: 0,
          // percentages
          totalFieldGoalPercentage: 0,
          totalTwoPointPercentage: 0,
          totalThreePointPercentage: 0,
          totalFreeThrowPercentage: 0,
          // attempts per game
          totalFieldGoalAttempts: 0,
          totalTwoPointAttempts: 0,
          totalThreePointAttempts: 0,
          totalFreeThrowAttempts: 0,
          // made per game
          totalFieldGoalsMade: 0,
          totalTwoPointersMade: 0,
          totalThreePointersMade: 0,
          totalFreeThrowsMade: 0,
          gamesPlayed: 0,
        };
      }

      // Calculate totals
      const playerTotals = {
        player: stats.length > 0 ? stats[0].player : null,
        totalPoints: totals.points,
        totalRebounds: totals.totalRebounds,
        totalAssists: totals.assists,
        totalSteals: totals.steals,
        totalBlocks: totals.blocks,
        totalTurnovers: totals.turnovers,
        totalPersonalFouls: totals.personalFouls,
        totalPlusMinus: totals.plusMinus,
        totalFieldGoalPercentage:
          totals.fieldGoalsAttempted > 0
            ? totals.fieldGoalsMade / totals.fieldGoalsAttempted
            : 0,
        totalTwoPointPercentage:
          totals.twoPointersAttempted > 0
            ? totals.twoPointersMade / totals.twoPointersAttempted
            : 0,
        totalThreePointPercentage:
          totals.threePointersAttempted > 0
            ? totals.threePointersMade / totals.threePointersAttempted
            : 0,
        totalFreeThrowPercentage:
          totals.freeThrowsAttempted > 0
            ? totals.freeThrowsMade / totals.freeThrowsAttempted
            : 0,
        // attempts per game
        totalFieldGoalAttempts: totals.fieldGoalsAttempted,
        totalTwoPointAttempts: totals.twoPointersAttempted,
        totalThreePointAttempts: totals.threePointersAttempted,
        totalFreeThrowAttempts: totals.freeThrowsAttempted,
        // made per game
        totalFieldGoalsMade: totals.fieldGoalsMade,
        totalTwoPointersMade: totals.twoPointersMade,
        totalThreePointersMade: totals.threePointersMade,
        totalFreeThrowsMade: totals.freeThrowsMade,
        gamesPlayed: totals.games,
      };
      return playerTotals;
    } catch (error) {
      console.error("Error fetching total player stats by player:", error);
      throw new Error("Failed to fetch total player stats by player");
    }
  });

export const getAveragePlayerStatsByPlayerId = createServerFn({
  method: "GET",
})
  .inputValidator(
    z.object({
      playerId: z.string().uuid(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      // Get all game stats for the player
      const gameStats = await playerGameStatsService.getByPlayerId(
        data.playerId,
      );

      // Initialize totals object
      const totals = {
        games: 0,
        minutesPlayed: 0,
        points: 0,
        fieldGoalsMade: 0,
        fieldGoalsAttempted: 0,
        twoPointersMade: 0,
        twoPointersAttempted: 0,
        threePointersMade: 0,
        threePointersAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        offensiveRebounds: 0,
        defensiveRebounds: 0,
        totalRebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        personalFouls: 0,
        plusMinus: 0,
      };

      // Sum up all stats
      gameStats.forEach((stat) => {
        // Only count games where the player actually played minutes
        // !TODO: Add validation for minutes played > 0 later and player.minutes_played exists
        totals.games += 1;
        totals.minutesPlayed += stat.minutesPlayed || 0;
        totals.points += stat.points || 0;
        totals.fieldGoalsMade += stat.fieldGoalsMade || 0;
        totals.fieldGoalsAttempted += stat.fieldGoalsAttempted || 0;
        totals.twoPointersMade += stat.twoPointersMade || 0;
        totals.twoPointersAttempted += stat.twoPointersAttempted || 0;
        totals.threePointersMade += stat.threePointersMade || 0;
        totals.threePointersAttempted += stat.threePointersAttempted || 0;
        totals.freeThrowsMade += stat.freeThrowsMade || 0;
        totals.freeThrowsAttempted += stat.freeThrowsAttempted || 0;
        totals.offensiveRebounds += stat.offensiveRebounds || 0;
        totals.defensiveRebounds += stat.defensiveRebounds || 0;
        totals.totalRebounds += stat.totalRebounds || 0;
        totals.assists += stat.assists || 0;
        totals.steals += stat.steals || 0;
        totals.blocks += stat.blocks || 0;
        totals.turnovers += stat.turnovers || 0;
        totals.personalFouls += stat.personalFouls || 0;
        totals.plusMinus += stat.plusMinus || 0;
      });
      // If no games played, return zeroes
      if (totals.games === 0) {
        return {
          player: gameStats.length > 0 ? gameStats[0].player : null,
          pointsPerGame: 0,
          reboundsPerGame: 0,
          assistsPerGame: 0,
          stealsPerGame: 0,
          blocksPerGame: 0,
          turnoversPerGame: 0,
          personalFoulsPerGame: 0,
          plusMinusPerGame: 0,
          // percentages
          fieldGoalPercentage: 0,
          twoPointPercentage: 0,
          threePointPercentage: 0,
          freeThrowPercentage: 0,
          // attempts per game
          fieldGoalAttemptsPerGame: 0,
          twoPointAttemptsPerGame: 0,
          threePointAttemptsPerGame: 0,
          freeThrowAttemptsPerGame: 0,
          // made per game
          fieldGoalsMadePerGame: 0,
          twoPointersMadePerGame: 0,
          threePointersMadePerGame: 0,
          freeThrowsMadePerGame: 0,
          gamesPlayed: 0,
        };
      }

      // Calculate averages
      const averages = {
        player: gameStats.length > 0 ? gameStats[0].player : null,
        pointsPerGame: totals.points / totals.games, // Points per game
        reboundsPerGame: totals.totalRebounds / totals.games, // Rebounds per game
        assistsPerGame: totals.assists / totals.games, // Assists per game
        stealsPerGame: totals.steals / totals.games, // Steals per game
        blocksPerGame: totals.blocks / totals.games, // Blocks per game
        // mpg: totals.minutes_played / totals.games, // Minutes per game (add this later)
        turnoversPerGame: totals.turnovers / totals.games, // Turnovers per game
        personalFoulsPerGame: totals.personalFouls / totals.games, // Personal fouls per game
        plusMinusPerGame: totals.plusMinus / totals.games, // Plus minus per game

        // percentages
        fieldGoalPercentage:
          totals.fieldGoalsAttempted > 0
            ? totals.fieldGoalsMade / totals.fieldGoalsAttempted
            : 0, // Field goal percentage
        twoPointPercentage:
          totals.twoPointersAttempted > 0
            ? totals.twoPointersMade / totals.twoPointersAttempted
            : 0, // Two point percentage
        threePointPercentage:
          totals.threePointersAttempted > 0
            ? totals.threePointersMade / totals.threePointersAttempted
            : 0, // Three point percentage
        freeThrowPercentage:
          totals.freeThrowsAttempted > 0
            ? totals.freeThrowsMade / totals.freeThrowsAttempted
            : 0, // Free throw percentage
        // attempts per game
        fieldGoalAttemptsPerGame: totals.fieldGoalsAttempted / totals.games, // Field goal attempts per game
        twoPointAttemptsPerGame: totals.twoPointersAttempted / totals.games, // Two point attempts per game
        threePointAttemptsPerGame: totals.threePointersAttempted / totals.games, // Three point attempts per game
        freeThrowAttemptsPerGame: totals.freeThrowsAttempted / totals.games, // Free throw attempts per game
        // made per game
        fieldGoalsMadePerGame: totals.fieldGoalsMade / totals.games, // Field goals made per game
        twoPointersMadePerGame: totals.twoPointersMade / totals.games, // Two pointers made per game
        threePointersMadePerGame: totals.threePointersMade / totals.games, // Three pointers made per game
        freeThrowsMadePerGame: totals.freeThrowsMade / totals.games, // Free throws made per game
        gamesPlayed: totals.games,
      };
      return averages;
    } catch (error) {
      console.error("Error calculating average player stats:", error);
      throw new Error("Failed to calculate average player stats");
    }
  });

export const getPlayerGameStatsByGameIdAndPlayerId = createServerFn({
  method: "GET",
})
  .inputValidator(
    z.object({
      gameId: z.string().uuid(),
      playerId: z.string().uuid(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const stats = await playerGameStatsService.getByGameIdAndPlayerId(
        data.gameId,
        data.playerId,
      );
      return stats;
    } catch (error) {
      console.error(
        "Error fetching player game stats by game and player:",
        error,
      );
      throw new Error("Failed to fetch player game stats");
    }
  });

export const getAveragePlayerStatsAllPlayers = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const players = await playerService.getPlayers();
    const stats = await Promise.all(
      players.map((player) =>
        getAveragePlayerStatsByPlayerId({ data: { playerId: player.id } }),
      ),
    );
    return stats;
  } catch (error) {
    console.error(
      "Error fetching average player stats for all players:",
      error,
    );
    throw new Error("Failed to fetch average player stats for all players");
  }
});

export const getTotalPlayerStatsAllPlayers = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const players = await playerService.getPlayers();
    const playerTotals = await Promise.all(
      players.map((player) =>
        getTotalPlayerStatsByPlayerId({ data: { playerId: player.id } }),
      ),
    );
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
