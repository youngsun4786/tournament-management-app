import { db as drizzle_db } from "~/db";
import { TeamGameStatsWithTeam } from "../types/team-game-stats";
import { Team } from "../types/team";

export interface ITeamGameStatsService {
  getByGameId(gameId: string): Promise<TeamGameStatsWithTeam[]>;
  getByTeamId(teamId: string): Promise<TeamGameStatsWithTeam[]>;
  getTeamStats(): Promise<TeamGameStatsWithTeam[]>;
}

export class TeamGameStatsService implements ITeamGameStatsService {
  private db: typeof drizzle_db;

  constructor() {
    this.db = drizzle_db;
  }

  // this should return an array of team game stats with the team -- at most 2
  async getByGameId(gameId: string): Promise<TeamGameStatsWithTeam[]> {
    const teamStats = await this.db.query.teamGameStats.findMany({
      where: {
        gameId,
      },
      with: {
        team: true,
      },
    });

    if (!teamStats) {
      throw new Error("Team game stats not found");
    }

    const teamStatsWithTeam = teamStats.map((teamStat) => {
      return {
        id: teamStat.id,
        gameId: teamStat.gameId,
        teamId: teamStat.teamId,
        points: teamStat.totalPoints,
        fieldGoalsMade: teamStat.fieldGoalsMade,
        fieldGoalsAttempted: teamStat.fieldGoalsAttempted,
        fieldGoalPercentage: teamStat.fieldGoalPercentage,
        twoPointersMade: teamStat.twoPointersMade,
        twoPointersAttempted: teamStat.twoPointersAttempted,
        twoPointPercentage: teamStat.twoPointPercentage,
        threePointersMade: teamStat.threePointersMade,
        threePointersAttempted: teamStat.threePointersAttempted,
        threePointPercentage: teamStat.threePointPercentage,
        freeThrowsMade: teamStat.freeThrowsMade,
        freeThrowsAttempted: teamStat.freeThrowsAttempted,
        freeThrowPercentage: teamStat.freeThrowPercentage,
        offensiveRebounds: teamStat.offensiveRebounds,
        defensiveRebounds: teamStat.defensiveRebounds,
        totalRebounds: teamStat.totalRebounds,
        assists: teamStat.assists,
        steals: teamStat.steals,
        blocks: teamStat.blocks,
        turnovers: teamStat.turnovers,
        teamFouls: teamStat.teamFouls,
        team: {
          id: teamStat.team!.id,
          name: teamStat.team!.name,
          wins: teamStat.team!.wins,
          losses: teamStat.team!.losses,
          isActive: teamStat.team!.isActive,
          imageUrl: teamStat.team!.imageUrl,
        } as Omit<Team, "logoUrl" | "seasonId" | "createdAt" | "updatedAt">,
      };
    });

    return teamStatsWithTeam;
  }

  async getTeamStats(): Promise<TeamGameStatsWithTeam[]> {
    const teamStats = await this.db.query.teamGameStats.findMany({
      with: {
        team: true,
      },
    });

    if (!teamStats) {
      throw new Error("Team game stats not found");
    }

    const teamStatsWithTeam = teamStats.map((teamStat) => {
      
      return {
        id: teamStat.id,
        gameId: teamStat.gameId,
        teamId: teamStat.teamId,
        points: teamStat.totalPoints,
        fieldGoalsMade: teamStat.fieldGoalsMade,
        fieldGoalsAttempted: teamStat.fieldGoalsAttempted,
        fieldGoalPercentage: teamStat.fieldGoalPercentage,
        twoPointersMade: teamStat.twoPointersMade,
        twoPointersAttempted: teamStat.twoPointersAttempted,
        twoPointPercentage: teamStat.twoPointPercentage,
        threePointersMade: teamStat.threePointersMade,
        threePointersAttempted: teamStat.threePointersAttempted,
        threePointPercentage: teamStat.threePointPercentage,
        freeThrowsMade: teamStat.freeThrowsMade,
        freeThrowsAttempted: teamStat.freeThrowsAttempted,
        freeThrowPercentage: teamStat.freeThrowPercentage,
        offensiveRebounds: teamStat.offensiveRebounds,
        defensiveRebounds: teamStat.defensiveRebounds,
        totalRebounds: teamStat.totalRebounds,
        assists: teamStat.assists,
        steals: teamStat.steals,
        blocks: teamStat.blocks,
        turnovers: teamStat.turnovers,
        teamFouls: teamStat.teamFouls,
        team: {
          id: teamStat.team!.id,
          name: teamStat.team!.name,
          wins: teamStat.team!.wins,
          losses: teamStat.team!.losses,
          isActive: teamStat.team!.isActive,
          imageUrl: teamStat.team!.imageUrl,
        } as Omit<Team, "logoUrl" | "seasonId" | "createdAt" | "updatedAt">,
      };
    });
    return teamStatsWithTeam;
  }

  async getByTeamId(teamId: string): Promise<TeamGameStatsWithTeam[]> {
    const teamStats = await this.db.query.teamGameStats.findMany({
      where: {
        teamId: teamId,
      },
      with: {
        team: true,
      },
    });

    if (!teamStats) {
      throw new Error("Team game stats not found");
    }

    const teamStatsWithTeam = teamStats.map((teamStat) => {
      return {
        id: teamStat.id,
        gameId: teamStat.gameId,
        teamId: teamStat.teamId,
        points: teamStat.totalPoints,
        fieldGoalsMade: teamStat.fieldGoalsMade,
        fieldGoalsAttempted: teamStat.fieldGoalsAttempted,
        fieldGoalPercentage: teamStat.fieldGoalPercentage,
        twoPointersMade: teamStat.twoPointersMade,
        twoPointersAttempted: teamStat.twoPointersAttempted,
        twoPointPercentage: teamStat.twoPointPercentage,
        threePointersMade: teamStat.threePointersMade,
        threePointersAttempted: teamStat.threePointersAttempted,
        threePointPercentage: teamStat.threePointPercentage,
        freeThrowsMade: teamStat.freeThrowsMade,
        freeThrowsAttempted: teamStat.freeThrowsAttempted,
        freeThrowPercentage: teamStat.freeThrowPercentage,
        offensiveRebounds: teamStat.offensiveRebounds,
        defensiveRebounds: teamStat.defensiveRebounds,
        totalRebounds: teamStat.totalRebounds,
        assists: teamStat.assists,
        steals: teamStat.steals,
        blocks: teamStat.blocks,
        turnovers: teamStat.turnovers,
        teamFouls: teamStat.teamFouls,
        team: {
          id: teamStat.team!.id,
          name: teamStat.team!.name,
          wins: teamStat.team!.wins,
          losses: teamStat.team!.losses,
          isActive: teamStat.team!.isActive,
          imageUrl: teamStat.team!.imageUrl,
        } as Omit<Team, "logoUrl" | "seasonId" | "createdAt" | "updatedAt">,
      };
    });

    return teamStatsWithTeam;
  }
}
