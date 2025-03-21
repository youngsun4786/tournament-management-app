import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { teamGameStatsService } from "~/app/container";


export const getTeamStatsByGameId = createServerFn({
    method: "GET",
}).validator(z.object({
    gameId: z.string().uuid(),
})).handler(async ({ data }) => {
    try {
        const teamStats = await teamGameStatsService.getByGameId(data.gameId);
        return teamStats;
    } catch (error) {
        console.error("Error fetching team stats:", error);
        throw new Error("Failed to fetch team stats");
    }
});

export const getTeamStats = createServerFn({
    method: "GET",
}).handler(async () => {
    try {
        const teamStats = await teamGameStatsService.getTeamStats();
        return teamStats;
    } catch (error) {
        console.error("Error fetching team stats:", error);
        throw new Error("Failed to fetch team stats");
    }
});

export const getTeamStatsByTeamId = createServerFn({
    method: "GET",
}).validator(z.object({
    teamId: z.string().uuid(),
})).handler(async ({ data }) => {
    try {
        const teamStats = await teamGameStatsService.getByTeamId(data.teamId);
        return teamStats;
    } catch (error) {
        console.error("Error fetching team stats:", error);
        throw new Error("Failed to fetch team stats");
    }
});

