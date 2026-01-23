import { db as drizzle_db } from "~/db";
import { getSupabaseServerClient } from "~/lib/utils/supabase-server";
import { Player, PlayerInsert, PlayerUpdate } from "~/src/types/player";

export interface IPlayerService {
  create(data: PlayerInsert): Promise<Player>;
  update(data: PlayerUpdate): Promise<Player>;
  delete(data: { playerId: Player["id"] }): Promise<Player>;
  getPlayers(): Promise<Player[]>;
  getPlayerById(playerId: string): Promise<Player>;
  getPlayersByTeamId(teamId: string): Promise<Player[]>;
}

export class PlayerService implements IPlayerService {
  private drizzle_db: typeof drizzle_db;

  private get supabase() {
    return getSupabaseServerClient();
  }

  constructor() {
    this.drizzle_db = drizzle_db;
  }

  async create(data: PlayerInsert): Promise<Player> {
    const { data: player, error } = await this.supabase
      .from("players")
      .insert({
        name: data.name,
        jersey_number: data.jerseyNumber,
        height: data.height,
        weight: data.weight,
        position: data.position,
        team_id: data.teamId,
        player_url: data.playerUrl,
      })
      .select()
      .single();



    if (!player || error) {
      throw new Error("Failed to create player", { cause: error });
    }
    // Need to return Player type, but supabase returns snake_case.
    // And we need teamName (optional/joined).
    // Best to just map what we have.
    return {
      id: player.id,
      teamId: player.team_id,
      teamName: "", // Not returned by insert
      name: player.name,
      jerseyNumber: player.jersey_number,
      height: player.height,
      weight: player.weight,
      position: player.position,
      playerUrl: player.player_url,
      isCaptain: player.is_captain ?? false,
    };
  }

  async update(data: PlayerUpdate): Promise<Player> {
    const { data: player, error } = await this.supabase
      .from("players")
      .update({
        name: data.name,
        jersey_number: data.jerseyNumber,
        height: data.height,
        weight: data.weight,
        position: data.position,
        player_url: data.playerUrl,
      })
      .eq("id", data.id)
      .select()
      .single();
    if (!player || error) {
      throw new Error("Failed to update player", { cause: error });
    }
    return {
      id: player.id,
      teamId: player.team_id,
      teamName: "",
      name: player.name,
      jerseyNumber: player.jersey_number,
      height: player.height,
      weight: player.weight,
      position: player.position,
      playerUrl: player.player_url,
      isCaptain: player.is_captain ?? false,
    };
  }

  async delete(data: { playerId: Player["id"] }): Promise<Player> {
    const { data: player, error } = await this.supabase
      .from("players")
      .delete()
      .eq("id", data.playerId)
      .select()
      .single();
    if (!player || error) {
      throw new Error("Failed to delete player", { cause: error });
    }
    return {
      id: player.id,
      teamId: player.team_id,
      teamName: "",
      name: player.name,
      jerseyNumber: player.jersey_number,
      height: player.height,
      weight: player.weight,
      position: player.position,
      playerUrl: player.player_url,
      isCaptain: player.is_captain ?? false,
    };
  }

  async getPlayers(): Promise<Player[]> {
    // Query all players with their related teams
    const playersData = await this.drizzle_db.query.players.findMany({
      with: {
        team: true,
      },
      orderBy: (players, { asc }) => [asc(players.jerseyNumber)],
    });

    // Transform the result to match the SQL query structure
    const playersWithTeams = playersData.map((player) => {
      const team = player.team as any;
      return {
        id: player.id,
        teamId: team?.id || "",
        teamName: team?.name || "",
        name: player.name,
        jerseyNumber: player.jerseyNumber,
        height: player.height,
        weight: player.weight,
        position: player.position,
        playerUrl: player.playerUrl,
        isCaptain: player.isCaptain,
      };
    });

    return playersWithTeams;
  }

  async getPlayerById(playerId: string): Promise<Player> {
    // Use Drizzle to get consistent casing and joins if needed
    const player = await this.drizzle_db.query.players.findFirst({
      where: {
        id: playerId,
      },
      with: { team: true },
    });

    if (!player) {
      throw new Error("Failed to get player");
    }

    const team = player.team as any;

    return {
      id: player.id,
      teamId: player.teamId || "",
      teamName: team?.name || "",
      name: player.name,
      jerseyNumber: player.jerseyNumber,
      height: player.height,
      weight: player.weight,
      position: player.position,
      playerUrl: player.playerUrl,
      isCaptain: player.isCaptain,
    };
  }

  async getPlayersByTeamId(teamId: string): Promise<Player[]> {
    // Query players by team ID with their related team info
    const teamPlayers = await this.drizzle_db.query.players.findMany({
      where: {
        teamId,
      },
      with: {
        team: true,
      },
      orderBy: (players, { asc }) => [asc(players.jerseyNumber)],
    });

    // Transform the result to match the expected structure
    const playersWithTeams = teamPlayers.map((player) => {
      const team = player.team as any;
      return {
        id: player.id,
        teamId: team?.id || "",
        teamName: team?.name || "",
        name: player.name,
        jerseyNumber: player.jerseyNumber,
        height: player.height,
        weight: player.weight,
        position: player.position,
        playerUrl: player.playerUrl,
        isCaptain: player.isCaptain,
      };
    });

    return playersWithTeams;
  }
}
