import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { getSupabaseServerClient } from "~/lib/utils/supabase-server";
import { teamService } from "../container";

export const getTeams = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const teams = await teamService.getTeams();
    return teams;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw new Error("Failed to fetch teams");
  }
});

export const getTeamsBySeason = createServerFn({ method: "GET" })
  .inputValidator(z.object({ seasonId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { seasonId } = data;
    try {
      const teams = await teamService.getTeamsBySeasonId(seasonId);
      return teams;
    } catch (error) {
      console.error("Error fetching teams for season:", error);
      throw new Error("Failed to fetch teams for season");
    }
  });

export const getTeam = createServerFn({ method: "GET" })
  .inputValidator(z.object({ teamId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { teamId } = data;
    try {
      const team = await teamService.getTeamById(teamId);
      return team;
    } catch (error) {
      console.error("Error fetching team:", error);
      throw new Error("Failed to fetch team");
    }
  });

export const getTeamByName = createServerFn({ method: "GET" })
  .inputValidator(z.object({ name: z.string() }))
  .handler(async ({ data }) => {
    const { name } = data;
    const supabase = getSupabaseServerClient();
    const { data: team, error } = await supabase
      .from("teams")
      .select("*")
      .eq("name", name)
      .single();

    if (error) {
      error.message = "Failed to fetch team";
      throw error;
    }

    // If no team found, return null
    if (!team) {
      console.log("no team found");
      return null;
    }

    // Transform to match our Team type - maintain the original id
    return {
      id: team.id,
      name: team.name,
      logoUrl: team.logoUrl || "",
      seasonId: team.seasonId,
      wins: team.wins || 0,
      losses: team.losses || 0,
      createdAt: team.createdAt,
    };
  });

export const updateTeam = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      teamId: z.string().uuid(),
      data: z.object({
        name: z.string().optional(),
        logoUrl: z.string().nullable().optional(),
        seasonId: z.string().uuid().nullable().optional(),
        wins: z.number().optional(),
        losses: z.number().optional(),
      }),
    })
  )
  .handler(async ({ data }) => {
    const { teamId, data: teamData } = data;
    try {
      const updatedTeam = await teamService.updateTeam(teamId, teamData);
      return updatedTeam;
    } catch (error) {
      console.error("Error updating team:", error);
      throw new Error("Failed to update team");
    }
  });
