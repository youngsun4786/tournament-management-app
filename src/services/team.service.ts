import { eq } from "drizzle-orm/sql";
import { db as drizzle_db } from "~/db";
import { teams } from "~/db/schema";
import { TeamWithSeason } from "~/src/types/team";

export interface ITeamService {
  getTeams(): Promise<TeamWithSeason[]>;
  getTeamById(teamId: string): Promise<TeamWithSeason>;
  getTeamsBySeasonId(seasonId: string): Promise<TeamWithSeason[]>;
  updateTeam(
    teamId: string,
    data: Partial<TeamWithSeason>,
  ): Promise<TeamWithSeason>;
}

export class TeamService implements ITeamService {
  private drizzle_db: typeof drizzle_db;

  constructor() {
    this.drizzle_db = drizzle_db;
  }

  async getTeams(): Promise<TeamWithSeason[]> {
    const teamsData = await this.drizzle_db.query.teams.findMany({
      with: {
        season: true,
      },
      orderBy: (teams, { desc }) => [desc(teams.wins)],
    });

    if (!teamsData) {
      throw new Error("No teams found");
    }

    const formattedTeams = teamsData.map((team) => {
      return {
        ...team,
        season: {
          id: team.season!.id,
          name: team.season!.name,
          startDate: team.season!.startDate,
          endDate: team.season!.endDate,
          isActive: team.season!.isActive ?? false,
        },
      };
    });

    return formattedTeams;
  }

  async getTeamById(teamId: string): Promise<TeamWithSeason> {
    const teamData = await this.drizzle_db.query.teams.findFirst({
      where: {
        id: teamId,
      },
      with: {
        season: true,
      },
    });

    if (!teamData) {
      throw new Error("Team not found");
    }

    return {
      ...teamData,
      season: {
        id: teamData.season!.id,
        name: teamData.season!.name,
        startDate: teamData.season!.startDate,
        endDate: teamData.season!.endDate,
        isActive: teamData.season!.isActive ?? false,
      },
    };
  }

  async getTeamsBySeasonId(seasonId: string): Promise<TeamWithSeason[]> {
    const teamsData = await this.drizzle_db.query.teams.findMany({
      where: {
        seasonId,
        isActive: true,
      },
      with: {
        season: true,
      },
    });

    if (!teamsData) {
      throw new Error("No teams found");
    }

    const formattedTeams = teamsData.map((team) => {
      return {
        ...team,
        season: {
          id: team.season!.id,
          name: team.season!.name,
          startDate: team.season!.startDate,
          endDate: team.season!.endDate,
          isActive: team.season!.isActive ?? false,
        },
      };
    });

    return formattedTeams;
  }

  async updateTeam(
    teamId: string,
    data: Partial<TeamWithSeason>,
  ): Promise<TeamWithSeason> {
    const updatedTeam = await this.drizzle_db
      .update(teams)
      .set(data)
      .where(eq(teams.id, teamId))
      .returning();

    if (!updatedTeam || updatedTeam.length === 0) {
      throw new Error("Failed to update team");
    }

    // Fetch the complete team with season relation
    return this.getTeamById(teamId);
  }
}
