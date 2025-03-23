import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { supabaseServer } from "~/lib/utils/supabase-server";
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
.validator(z.object({ seasonId: z.string() }))
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
.validator(z.object({ teamId: z.string() }))
.handler(async ({ data }) => {
    const { teamId } = data;
    const { data: team, error } = await supabaseServer.from("teams").select("*").eq("id", teamId).single();

    if (error) {
        error.message = "Failed to fetch team";
        throw error;
    }

    // If no team found, return null
    if (!team) {
        return null;
    }

    // Transform to match our Team type - maintain the original id
    return {
        id: team.id,
        name: team.name,
        logo_url: team.logo_url || "",
        season_id: team.season_id,
        wins: team.wins || 0,
        losses: team.losses || 0,
        created_at: team.created_at,
    };
});

export const getTeamByName = createServerFn({ method: "GET" })
.validator(z.object({ name: z.string() }))
.handler(async ({ data }) => {
    const { name } = data;
    const { data: team, error } = await supabaseServer.from("teams").select("*").eq("name", name).single();

    if (error) {
        error.message = "Failed to fetch team";
        throw error;
    }

    // If no team found, return null
    if (!team) {
        return null;
    }

    // Transform to match our Team type - maintain the original id
    return {
        id: team.id,
        name: team.name,
        logo_url: team.logo_url || "",
        season_id: team.season_id,
        wins: team.wins || 0,
        losses: team.losses || 0,
        created_at: team.created_at,
    };
});