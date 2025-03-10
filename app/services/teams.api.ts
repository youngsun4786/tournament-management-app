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

    // Process each team to get the full public URL for its logo
    const teamsWithPublicUrls = teams.map(team => {
        // If no logo_url is set, return team as is
        if (!team.logo_url) {
            return team;
        }
        
        // Get public URL for the logo
        // and that all logos are stored in the logos directory
        const { data } = supabaseServer.storage.from('media-images').getPublicUrl(`logos/${team.logo_url}`);
        
        // Return team with full public URL
        return {
            ...team,
            logo_url: data.publicUrl
        };
    });

    return teamsWithPublicUrls ?? [];
    
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

    // Process team to get the full public URL for its logo
    if (team.logo_url) {
        const { data } = supabaseServer.storage.from('media-images').getPublicUrl(`logos/${team.logo_url}`);
        
        // Return team with full public URL
        return {
            ...team,
            logo_url: data.publicUrl
        };
    }

    return team;
    
}
);