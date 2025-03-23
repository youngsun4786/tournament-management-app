import { createServerFn } from "@tanstack/react-start";
import { z } from "vinxi";
import { gameService } from "~/app/container";
// Get all games with team information
export const getGames = createServerFn({ method: "GET" }).handler(async () => {
  // Query games with their related teams
  try {
    const gamesWithTeams = await gameService.getWithTeams();
    return gamesWithTeams;
  } catch (error) {
    console.error("Error fetching games with teams information:", error);
    throw new Error("Failed to fetch games with teams information");
  }  
});


export const getGameById = createServerFn({
  method: "GET",
}).validator(
  z.object({
    gameId: z.string().uuid()
  })
).handler(async ({ data }) => {
  try {
    const game = await gameService.getById(data.gameId);
    return game;
  } catch (error) {
    console.error("Error fetching game by id:", error);
    throw new Error("Failed to fetch game by id");
  }
});


export const updateGameScore = createServerFn({
  method: "POST",
}).validator(
    z.object({
      game_id: z.string().uuid(),
      home_team_score: z.number().int().min(0),
      away_team_score: z.number().int().min(0),
      is_completed: z.boolean(),
    })
).handler(async ({ data }) => {
  try {
    const updatedGame = await gameService.updateScore({id: data.game_id, home_team_score: data.home_team_score, away_team_score: data.away_team_score, is_completed: data.is_completed});
    return updatedGame;
  } catch (error) {
    console.error("Error updating game score:", error);
    throw new Error("Failed to update game score");
  }
});

// get games for a specific team
export const getGamesForTeams = createServerFn({ method: "GET" })
.validator(z.object({ teamIds: z.array(z.string()) }))
.handler(async ({ data }) => {
  try {
    const games = await gameService.getGamesForTeams(data.teamIds);
    return games;
  } catch (error) {
    console.error("Error fetching games for teams:", error);
    throw new Error("Failed to fetch games for teams");
  }
});