import { createServerFn } from "@tanstack/react-start";
import { eq, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/db";
import { players, teams } from "~/db/schema";

export const getPlayersByGameId = createServerFn({
  method: "GET",
}).inputValidator(z.object({
  gameId: z.string().uuid(),
})).handler(async ({ data }) => {
  try {
    const gameId = data.gameId;

    // First get the home and away team IDs for the game
    const game = await db.query.games.findFirst({
      where: {
        id: gameId
      },
      columns: {
        homeTeamId: true,
        awayTeamId: true,
      },
    });

    if (!game) {
      throw new Error("Game not found");
    }

    // Now fetch all players from both teams
    const gamePlayers = await db
      .select({
        id: players.id,
        name: players.name,
        jerseyNumber: players.jerseyNumber,
        teamId: players.teamId,
        teamName: teams.name,
        teamType: sql<string>`
          CASE 
            WHEN ${players.teamId} = ${game.homeTeamId} THEN 'home'
            WHEN ${players.teamId} = ${game.awayTeamId} THEN 'away'
          END
        `.as("team_type"),
      })
      .from(players)
      .innerJoin(teams, eq(players.teamId, teams.id))
      .where(
        or(
          eq(players.teamId, game.homeTeamId),
          eq(players.teamId, game.awayTeamId)
        )
      )
      .orderBy(sql`team_type`, players.jerseyNumber);

    return gamePlayers;
  } catch (error) {
    console.error("Error fetching game players:", error);
    throw new Error("Failed to fetch players");
  }
}); 