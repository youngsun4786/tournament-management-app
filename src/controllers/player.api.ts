import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { playerService } from "~/src/container";
import { PlayerSchema } from "~/src/schemas/player.schema";

// Get all players and their team names
export const getPlayers = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const playersWithTeams = await playerService.getPlayers();
      return playersWithTeams;
    } catch (error) {
      console.error("Error fetching players with teams information:", error);
      throw new Error("Failed to fetch players with teams information");
    }
  },
);

export const getPlayerById = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      playerId: z.string().uuid(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const player = await playerService.getPlayerById(data.playerId);
      return player;
    } catch (error) {
      console.error("Error fetching player by ID:", error);
      throw new Error("Failed to fetch player by ID");
    }
  });

export const updatePlayer = createServerFn({
  method: "POST",
})
  .inputValidator(PlayerSchema)
  .handler(async ({ data }) => {
    try {
      const player = await playerService.update({
        id: data.id!,
        name: data.name,
        jerseyNumber: data.jerseyNumber,
        height: data.height,
        weight: data.weight,
        position: data.position,
        teamId: data.teamId,
        playerUrl: data.playerUrl,
        waiverUrl: data.waiverUrl,
      });
      return player;
    } catch (error) {
      console.error("Error updating player:", error);
      throw new Error("Failed to update player");
    }
  });

export const deletePlayer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      playerId: z.string().uuid(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const player = await playerService.delete({ playerId: data.playerId });
      return player;
    } catch (error) {
      console.error("Error deleting player:", error);
      throw new Error("Failed to delete player");
    }
  });

export const createPlayer = createServerFn({
  method: "POST",
})
  .inputValidator(PlayerSchema)
  .handler(async ({ data }) => {
    try {
      const player = await playerService.create(data);
      return player;
    } catch (error) {
      console.error("Error creating player:", error);
      throw new Error("Failed to create player");
    }
  });

// Get players by team ID
export const getPlayersByTeamId = createServerFn({
  method: "GET",
})
  .inputValidator(
    z.object({
      teamId: z.string().uuid(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const players = await playerService.getPlayersByTeamId(data.teamId);
      return players;
    } catch (error) {
      console.error("Error fetching players by team ID:", error);
      throw new Error("Failed to fetch players by team");
    }
  });
