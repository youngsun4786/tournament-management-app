import { eq, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/db";
import { games, players, teams } from "~/db/schema";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id;

    // First get the home and away team IDs for the game
    const game = await db.query.games.findFirst({
      where: eq(games.id, gameId),
      columns: {
        home_team_id: true,
        away_team_id: true,
      },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
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

    return NextResponse.json(gamePlayers);
  } catch (error) {
    console.error("Error fetching game players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
} 