import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { playerService } from "~/app/container";
import { PlayerSchema } from "~/app/domains/schemas/player.schema";

// Get all players and their team names
export const getPlayers = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const playersWithTeams = await playerService.getPlayers();
    return playersWithTeams;
  } catch (error) {
    throw new Error("Failed to fetch players with teams information");
  }
});

export const updatePlayer = createServerFn().validator(PlayerSchema).handler(async ({ data }) => {
  try {
    const player = await playerService.update(data);
    return player;
  } catch (error) {
    throw new Error("Failed to update player");
  }
});

export const deletePlayer = createServerFn().validator(z.string()).handler(async ({ data }) => {
  try {
    const player = await playerService.delete({playerId: data});
    return player;
  } catch (error) {
    throw new Error("Failed to delete player");
  }
});

export const createPlayer = createServerFn().validator(PlayerSchema).handler(async ({ data }) => {
  try {
    const player = await playerService.create(data);
    return player;
  } catch (error) {
    throw new Error("Failed to create player");
  }
});