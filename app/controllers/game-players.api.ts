import { createServerFn } from "@tanstack/react-start";
import { eq, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/db";
import { games, players, teams } from "~/db/schema";

export const getPlayersByGameId = createServerFn({
  method: "GET",
}).validator(z.object({
  gameId: z.string().uuid(),
})).handler(async ({ data }) => {
  try {
    const gameId = data.gameId;

    // First get the home and away team IDs for the game
    const game = await db.query.games.findFirst({
      where: eq(games.id, gameId),
      columns: {
        home_team_id: true,
        away_team_id: true,
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
        jersey_number: players.jersey_number,
        team_id: players.team_id,
        team_name: teams.name,
        team_type: sql<string>`
          CASE 
            WHEN ${players.team_id} = ${game.home_team_id} THEN 'home'
            WHEN ${players.team_id} = ${game.away_team_id} THEN 'away'
          END
        `.as("team_type"),
      })
      .from(players)
      .innerJoin(teams, eq(players.team_id, teams.id))
      .where(
        or(
          eq(players.team_id, game.home_team_id),
          eq(players.team_id, game.away_team_id)
        )
      )
      .orderBy(sql`team_type`, players.jersey_number);

    return gamePlayers;
  } catch (error) {
    console.error("Error fetching game players:", error);
    throw new Error("Failed to fetch players");
  }
}); 