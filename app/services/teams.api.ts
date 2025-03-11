import { createServerFn } from "@tanstack/react-start";
import { supabaseServer } from "~/lib/utils/supabase-server";

export const getTeams = createServerFn({ method: "GET"}).handler(async () => {
    const { data: teams, error } = await supabaseServer.from("teams").select("*");

    if (error) {
        error.message = "Failed to fetch teams";
        throw error;
    }

    // If no teams found, return empty array
    if (!teams || teams.length === 0) {
        return [];
    }

    return teams ?? [];
});

export const getTeam = createServerFn({ method: "GET"}).handler(async ({ params }) => {
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

    return team;
});