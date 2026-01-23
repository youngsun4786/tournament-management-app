import { eq } from "drizzle-orm";
import { db as drizzle_db } from "~/db";
import { playerGameStats } from "~/db/schema";
import type { Player } from "~/src/types/player";
import type {
  PlayerGameStats,
  PlayerGameStatsInsert,
  PlayerGameStatsUpdate,
  PlayerGameStatsWithPlayer,
} from "~/src/types/player-game-stats";

export interface IPlayerGameStatsService {
  getByGameId(gameId: string): Promise<PlayerGameStatsWithPlayer[]>;
  getByPlayerId(playerId: string): Promise<PlayerGameStatsWithPlayer[]>;
  getByGameIdAndPlayerId(
    gameId: string,
    playerId: string,
  ): Promise<PlayerGameStatsWithPlayer>;
  getAll(): Promise<PlayerGameStatsWithPlayer[]>;
  create(data: PlayerGameStatsInsert): Promise<PlayerGameStats>;
  update(
    data: PlayerGameStatsUpdate & { id: string },
  ): Promise<PlayerGameStats>;
  delete(id: string): Promise<void>;
}

export class PlayerGameStatsService implements IPlayerGameStatsService {
  private drizzle_db: typeof drizzle_db;

  constructor() {
    this.drizzle_db = drizzle_db;
  }

  async getByGameId(gameId: string): Promise<PlayerGameStatsWithPlayer[]> {
    // Query player game stats with their related player information
    const stats = await this.drizzle_db.query.playerGameStats.findMany({
      where: {
        gameId,
      },
      with: {
        player: {
          with: {
            team: true,
          },
        },
      },
      orderBy: (pgs, { desc }) => [desc(pgs.minutesPlayed)],
    });

    // Transform the result to match the expected schema
    const statsWithPlayer = stats.map((stat) => {
      return {
        id: stat.id,
        gameId: stat.gameId,
        playerId: stat.playerId,
        minutesPlayed: stat.minutesPlayed,
        points: stat.points,
        fieldGoalsMade: stat.fieldGoalsMade,
        fieldGoalsAttempted: stat.fieldGoalsAttempted,
        fieldGoalPercentage: stat.fieldGoalPercentage,
        twoPointersMade: stat.twoPointersMade,
        twoPointersAttempted: stat.twoPointersAttempted,
        twoPointPercentage: stat.twoPointPercentage,
        threePointersMade: stat.threePointersMade,
        threePointersAttempted: stat.threePointersAttempted,
        threePointPercentage: stat.threePointPercentage,
        freeThrowsMade: stat.freeThrowsMade,
        freeThrowsAttempted: stat.freeThrowsAttempted,
        freeThrowPercentage: stat.freeThrowPercentage,
        offensiveRebounds: stat.offensiveRebounds,
        defensiveRebounds: stat.defensiveRebounds,
        totalRebounds: stat.totalRebounds,
        assists: stat.assists,
        steals: stat.steals,
        blocks: stat.blocks,
        turnovers: stat.turnovers,
        personalFouls: stat.personalFouls,
        plusMinus: stat.plusMinus,
        updatedAt: stat.updatedAt,
        player: {
          id: stat!.player!.id,
          teamId: stat!.player!.teamId,
          name: stat!.player!.name,
          jerseyNumber: stat!.player!.jerseyNumber,
          position: stat!.player!.position,
          teamName: stat!.player!.team?.name,
          playerUrl: stat!.player!.playerUrl,
          isCaptain: stat!.player!.isCaptain,
        } as Omit<Player, "height" | "weight">,
      };
    });

    return statsWithPlayer;
  }

  async getByPlayerId(playerId: string): Promise<PlayerGameStatsWithPlayer[]> {
    const stats = await this.drizzle_db.query.playerGameStats.findMany({
      where: {
        playerId,
      },
      with: {
        player: {
          with: {
            team: true,
          },
        },
      },
      orderBy: (pgs, { desc }) => [desc(pgs.minutesPlayed)],
    });

    const statsWithPlayer = stats.map((stat) => {
      return {
        id: stat.id,
        gameId: stat.gameId,
        playerId: stat.playerId,
        minutesPlayed: stat.minutesPlayed,
        points: stat.points,
        fieldGoalsMade: stat.fieldGoalsMade,
        fieldGoalsAttempted: stat.fieldGoalsAttempted,
        fieldGoalPercentage: stat.fieldGoalPercentage,
        twoPointersMade: stat.twoPointersMade,
        twoPointersAttempted: stat.twoPointersAttempted,
        twoPointPercentage: stat.twoPointPercentage,
        threePointersMade: stat.threePointersMade,
        threePointersAttempted: stat.threePointersAttempted,
        threePointPercentage: stat.threePointPercentage,
        freeThrowsMade: stat.freeThrowsMade,
        freeThrowsAttempted: stat.freeThrowsAttempted,
        freeThrowPercentage: stat.freeThrowPercentage,
        offensiveRebounds: stat.offensiveRebounds,
        defensiveRebounds: stat.defensiveRebounds,
        totalRebounds: stat.totalRebounds,
        assists: stat.assists,
        steals: stat.steals,
        blocks: stat.blocks,
        turnovers: stat.turnovers,
        personalFouls: stat.personalFouls,
        plusMinus: stat.plusMinus,
        updatedAt: stat.updatedAt,
        player: {
          id: stat!.player!.id,
          teamId: stat!.player!.teamId,
          name: stat!.player!.name,
          jerseyNumber: stat!.player!.jerseyNumber,
          position: stat!.player!.position,
          teamName: stat!.player!.team!.name,
          playerUrl: stat!.player!.playerUrl,
          isCaptain: stat!.player!.isCaptain,
        } as Omit<Player, "height" | "weight">,
      };
    });

    return statsWithPlayer;
  }

  async getByGameIdAndPlayerId(
    gameId: string,
    playerId: string,
  ): Promise<PlayerGameStatsWithPlayer> {
    const stats = await this.drizzle_db.query.playerGameStats.findFirst({
      where: {
        gameId,
        playerId,
      },
      with: {
        player: {
          with: {
            team: true,
          },
        },
      },
    });
    if (!stats) {
      throw new Error("Player game stats not found");
    }

    return {
      id: stats.id,
      gameId: stats.gameId,
      playerId: stats.playerId,
      minutesPlayed: stats.minutesPlayed,
      points: stats.points,
      fieldGoalsMade: stats.fieldGoalsMade,
      fieldGoalsAttempted: stats.fieldGoalsAttempted,
      fieldGoalPercentage: stats.fieldGoalPercentage,
      twoPointersMade: stats.twoPointersMade,
      twoPointersAttempted: stats.twoPointersAttempted,
      twoPointPercentage: stats.twoPointPercentage,
      threePointersMade: stats.threePointersMade,
      threePointersAttempted: stats.threePointersAttempted,
      threePointPercentage: stats.threePointPercentage,
      freeThrowsMade: stats.freeThrowsMade,
      freeThrowsAttempted: stats.freeThrowsAttempted,
      freeThrowPercentage: stats.freeThrowPercentage,
      offensiveRebounds: stats.offensiveRebounds,
      defensiveRebounds: stats.defensiveRebounds,
      totalRebounds: stats.totalRebounds,
      assists: stats.assists,
      steals: stats.steals,
      blocks: stats.blocks,
      turnovers: stats.turnovers,
      personalFouls: stats.personalFouls,
      plusMinus: stats.plusMinus,
      updatedAt: stats.updatedAt,
      player: {
        id: stats!.player!.id,
        teamId: stats!.player!.team?.id,
        name: stats!.player!.name,
        jerseyNumber: stats!.player!.jerseyNumber,
        position: stats!.player!.position,
        teamName: stats!.player!.team?.name,
        playerUrl: stats!.player!.playerUrl,
        isCaptain: stats!.player!.isCaptain,
      } as Omit<Player, "height" | "weight">,
    };
  }

  async getAll(): Promise<PlayerGameStatsWithPlayer[]> {
    const stats = await this.drizzle_db.query.playerGameStats.findMany({
      with: {
        player: {
          with: {
            team: true,
          },
        },
      },
    });

    const statsWithPlayer = stats.map((stat) => {
      return {
        id: stat.id,
        gameId: stat.gameId,
        playerId: stat.playerId,
        minutesPlayed: stat.minutesPlayed,
        points: stat.points,
        fieldGoalsMade: stat.fieldGoalsMade,
        fieldGoalsAttempted: stat.fieldGoalsAttempted,
        fieldGoalPercentage: stat.fieldGoalPercentage,
        twoPointersMade: stat.twoPointersMade,
        twoPointersAttempted: stat.twoPointersAttempted,
        twoPointPercentage: stat.twoPointPercentage,
        threePointersMade: stat.threePointersMade,
        threePointersAttempted: stat.threePointersAttempted,
        threePointPercentage: stat.threePointPercentage,
        freeThrowsMade: stat.freeThrowsMade,
        freeThrowsAttempted: stat.freeThrowsAttempted,
        freeThrowPercentage: stat.freeThrowPercentage,
        offensiveRebounds: stat.offensiveRebounds,
        defensiveRebounds: stat.defensiveRebounds,
        totalRebounds: stat.totalRebounds,
        assists: stat.assists,
        steals: stat.steals,
        blocks: stat.blocks,
        turnovers: stat.turnovers,
        personalFouls: stat.personalFouls,
        plusMinus: stat.plusMinus,
        updatedAt: stat.updatedAt,
        player: {
          id: stat!.player!.id,
          teamId: stat!.player!.team?.id,
          name: stat!.player!.name,
          jerseyNumber: stat!.player!.jerseyNumber,
          position: stat!.player!.position,
          teamName: stat!.player!.team?.name,
          playerUrl: stat!.player!.playerUrl,
          isCaptain: stat!.player!.isCaptain,
        } as Omit<Player, "height" | "weight">,
      };
    });

    return statsWithPlayer;
  }

  async create(data: PlayerGameStatsInsert): Promise<PlayerGameStats> {
    const [created] = await this.drizzle_db
      .insert(playerGameStats)
      .values({
        ...data,
        updatedAt: new Date(),
      })
      .returning();

    if (!created) {
      throw new Error("Failed to create player game stats");
    }

    return {
      id: created.id,
      gameId: created.gameId,
      playerId: created.playerId,
      minutesPlayed: created.minutesPlayed,
      points: created.points,
      fieldGoalsMade: created.fieldGoalsMade,
      fieldGoalsAttempted: created.fieldGoalsAttempted,
      fieldGoalPercentage: created.fieldGoalPercentage,
      twoPointersMade: created.twoPointersMade,
      twoPointersAttempted: created.twoPointersAttempted,
      twoPointPercentage: created.twoPointPercentage,
      threePointersMade: created.threePointersMade,
      threePointersAttempted: created.threePointersAttempted,
      threePointPercentage: created.threePointPercentage,
      freeThrowsMade: created.freeThrowsMade,
      freeThrowsAttempted: created.freeThrowsAttempted,
      freeThrowPercentage: created.freeThrowPercentage,
      offensiveRebounds: created.offensiveRebounds,
      defensiveRebounds: created.defensiveRebounds,
      totalRebounds: created.totalRebounds,
      assists: created.assists,
      steals: created.steals,
      blocks: created.blocks,
      turnovers: created.turnovers,
      personalFouls: created.personalFouls,
      plusMinus: created.plusMinus,
      updatedAt: created.updatedAt,
    };
  }

  async update(
    data: Partial<PlayerGameStats> & { id: string },
  ): Promise<PlayerGameStats> {
    const [updated] = await this.drizzle_db
      .update(playerGameStats)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(playerGameStats.id, data.id))
      .returning();

    if (!updated) {
      throw new Error("Failed to update player game stats");
    }

    return {
      id: updated.id,
      gameId: updated.gameId,
      playerId: updated.playerId,
      minutesPlayed: updated.minutesPlayed,
      points: updated.points,
      fieldGoalsMade: updated.fieldGoalsMade,
      fieldGoalsAttempted: updated.fieldGoalsAttempted,
      fieldGoalPercentage: updated.fieldGoalPercentage,
      twoPointersMade: updated.twoPointersMade,
      twoPointersAttempted: updated.twoPointersAttempted,
      twoPointPercentage: updated.twoPointPercentage,
      threePointersMade: updated.threePointersMade,
      threePointersAttempted: updated.threePointersAttempted,
      threePointPercentage: updated.threePointPercentage,
      freeThrowsMade: updated.freeThrowsMade,
      freeThrowsAttempted: updated.freeThrowsAttempted,
      freeThrowPercentage: updated.freeThrowPercentage,
      offensiveRebounds: updated.offensiveRebounds,
      defensiveRebounds: updated.defensiveRebounds,
      totalRebounds: updated.totalRebounds,
      assists: updated.assists,
      steals: updated.steals,
      blocks: updated.blocks,
      turnovers: updated.turnovers,
      personalFouls: updated.personalFouls,
      plusMinus: updated.plusMinus,
      updatedAt: updated.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    await this.drizzle_db
      .delete(playerGameStats)
      .where(eq(playerGameStats.id, id));
  }
}
