import { db as drizzle_db } from "~/db";
import { getSupabaseServerClient } from "~/lib/utils/supabase-server";
import type { Game, GameInsert, GameUpdate } from "~/src/types/game";

export interface IGameService {
  getById(id: Game["id"]): Promise<Game>;
  create(data: { game: GameInsert; userId: string }): Promise<Game>;
  update(data: GameUpdate): Promise<Game>;
  updateScore(data: GameUpdate): Promise<Game>;
  delete(data: { id: Game["id"]; userId: string }): Promise<Game>;
  getWithTeams(): Promise<Game[]>;
  getGamesForTeams(teamIds: string[]): Promise<Game[]>;
}

export class GameService implements IGameService {
  private drizzle_db: typeof drizzle_db;

  private get supabase() {
    return getSupabaseServerClient();
  }

  constructor() {
    this.drizzle_db = drizzle_db;
  }

  async getById(id: Game["id"]): Promise<Game> {
    const game = await this.drizzle_db.query.games.findFirst({
      where: {
        id,
      },
      with: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (!game) {
      throw new Error("Game not found");
    }

    if (!game.homeTeam || !game.awayTeam) {
      throw new Error("Teams not found");
    }

    return {
      id: game.id,
      gameDate: game.gameDate,
      startTime: game.startTime,
      location: game.location,
      court: game.court,
      isCompleted: game.isCompleted ?? false,
      homeTeamScore: game.homeTeamScore,
      awayTeamScore: game.awayTeamScore,
      homeTeamId: game.homeTeamId,
      homeTeamName: game.homeTeam.name,
      homeTeamLogo: game.homeTeam.logoUrl,
      awayTeamId: game.awayTeamId,
      awayTeamName: game.awayTeam.name,
      awayTeamLogo: game.awayTeam.logoUrl,
    };
  }

  async getWithTeams(): Promise<Game[]> {
    // Query games with their related teams
    const games = await this.drizzle_db.query.games.findMany({
      orderBy: (games, { asc }) => [asc(games.gameDate), asc(games.startTime)],
      with: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    // Transform the result to match the SQL query structure
    const gamesWithTeams = games.map((game) => {
      return {
        id: game.id,
        gameDate: game.gameDate,
        startTime: game.startTime,
        location: game.location,
        court: game.court,
        isCompleted: game.isCompleted ?? false,
        homeTeamScore: game.homeTeamScore,
        awayTeamScore: game.awayTeamScore,
        homeTeamId: game.homeTeamId,
        homeTeamName: game.homeTeam?.name,
        homeTeamLogo: game.homeTeam?.logoUrl,
        awayTeamId: game.awayTeamId,
        awayTeamName: game.awayTeam?.name,
        awayTeamLogo: game.awayTeam?.logoUrl,
      };
    });
    return gamesWithTeams;
  }

  async getGamesForTeams(teamIds: string[]): Promise<Game[]> {
    const gamesList = await this.drizzle_db.query.games.findMany({
      where: {
        homeTeamId: {
          in: teamIds,
        },
        awayTeamId: {
          in: teamIds,
        },
      },
      with: {
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: (games, { asc }) => [asc(games.gameDate), asc(games.startTime)],
    });

    // Transform the result to match the SQL query structure
    const gamesWithTeams = gamesList.map((game) => {
      return {
        id: game.id,
        gameDate: game.gameDate,
        startTime: game.startTime,
        location: game.location,
        court: game.court,
        isCompleted: game.isCompleted ?? false,
        homeTeamScore: game.homeTeamScore,
        awayTeamScore: game.awayTeamScore,
        homeTeamId: game.homeTeamId,
        homeTeamName: game.homeTeam?.name,
        homeTeamLogo: game.homeTeam?.logoUrl,
        awayTeamId: game.awayTeamId,
        awayTeamName: game.awayTeam?.name,
        awayTeamLogo: game.awayTeam?.logoUrl,
      };
    });

    return gamesWithTeams;
  }

  async create(): Promise<Game> {
    return {} as Game;
  }

  async update(data: GameUpdate): Promise<Game> {
    if (!data.id) throw new Error("Game ID is required");
    const { data: updated, error } = await this.supabase
      .from("games")
      .update({
        game_date: data.gameDate,
        start_time: data.startTime,
        location: data.location,
        court: data.court,
        is_completed: data.isCompleted,
        home_team_score: data.homeTeamScore,
        away_team_score: data.awayTeamScore,
      })
      .eq("id", data.id)
      .select()
      .single();

    if (!updated || error) {
      throw new Error("Failed to update game", { cause: error });
    }

    // Fetch properly with drizzle to match type
    return this.getById(updated.id);
  }

  async updateScore(data: GameUpdate): Promise<Game> {
    if (!data.id) throw new Error("Game ID is required");
    const { data: updated, error } = await this.supabase
      .from("games")
      .update({
        home_team_score: data.homeTeamScore,
        away_team_score: data.awayTeamScore,
        is_completed: data.isCompleted,
      })
      .eq("id", data.id)
      .select()
      .single();
    if (!updated || error) {
      throw new Error("Failed to update game score", { cause: error });
    }
    return this.getById(updated.id);
  }

  async delete(): Promise<Game> {
    return {} as Game;
  }
}
