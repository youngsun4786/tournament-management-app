import { createServerFn } from "@tanstack/react-start";
import { seasonService } from "../container";

export const getSeasons = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const seasons = await seasonService.getSeasons();
    return seasons;
  } catch (error) {
    console.error("Error fetching seasons:", error);
    throw new Error("Failed to fetch seasons");
  }
});

export const getActiveSeason = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const season = await seasonService.getActiveSeason();
    return season;
  } catch (error) {
    console.error("Error fetching active season:", error);
    throw new Error("Failed to fetch active season");
  }
});
