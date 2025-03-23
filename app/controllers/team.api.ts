import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { supabaseServer } from "~/lib/utils/supabase-server";

export const getTeams = createServerFn({ method: "GET" }).handler(async () => {
    const { data: teams, error } = await supabaseServer.from("teams").select("*");

    if (error) {
        error.message = "Failed to fetch teams";
        throw error;
    }

    // If no teams found, return empty array
    if (!teams || teams.length === 0) {
        return [];
    }

    // Transform the database response - maintain the original id
    return teams.map(team => ({
        id: team.id,
        name: team.name,
        logo_url: team.logo_url || "",
        season_id: team.season_id,
        wins: team.wins || 0,
        losses: team.losses || 0,
        created_at: team.created_at,
        updated_at: team.updated_at || team.created_at
    }));
});

export const getTeamsBySeason = createServerFn({ method: "GET" })
.validator(z.object({ seasonId: z.string() }))
.handler(async ({ data }) => {
    const { seasonId } = data;
    const { data: teams, error } = await supabaseServer
        .from("teams")
        .select("*")
        .eq("season_id", seasonId);

    if (error) {
        error.message = "Failed to fetch teams for season";
        throw error;
    }

    // If no teams found, return empty array
    if (!teams || teams.length === 0) {
        return [];
    }

    // Transform the database response - maintain the original id
    return teams.map(team => ({
        id: team.id,
        name: team.name,
        logo_url: team.logo_url || "",
        season_id: team.season_id,
        wins: team.wins || 0,
        losses: team.losses || 0,
        created_at: team.created_at,
        updated_at: team.updated_at || team.created_at
    }));
});

export const getTeam = createServerFn({ method: "GET" }).handler(async ({ params }) => {
    const { teamId } = params;
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
        updated_at: team.updated_at || team.created_at
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
        updated_at: team.updated_at || team.created_at
    };
});