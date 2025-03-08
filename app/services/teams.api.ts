import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "~/lib/utils/supabase-server";


export const getTeams = createServerFn({ method: "GET"}).handler(async () => {
    const supabase = getSupabaseServerClient();
    const { data: teams, error } = await supabase.from("teams").select("*");

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
        const { data } = supabase.storage.from('media-images').getPublicUrl(`logos/${team.logo_url}`);
        
        // Return team with full public URL
        return {
            ...team,
            logo_url: data.publicUrl
        };
    });

    return teamsWithPublicUrls ?? [];
    
})