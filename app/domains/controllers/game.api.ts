import { createServerFn } from "@tanstack/react-start";
import { gameService } from "~/app/container";

// Get all games with team information
export const getGames = createServerFn({ method: "GET" }).handler(async () => {
  // Query games with their related teams
  try {
    const gamesWithTeams = await gameService.getWithTeams();
    return gamesWithTeams;
  } catch (error) {
    throw new Error("Failed to fetch games with teams information");
  }  
});

// // Get games for a specific team
// export const getTeamGames = createServerFn({
//   method: "GET",
//   schemas: {
//     params: z.object({
//       teamId: z.string().uuid()
//     })
//   }
// }).handler(async ({ params }) => {
//   const { teamId } = params;
//   const supabase = getSupabaseServerClient();
  
//   const { data: games, error } = await supabase
//     .from("games")
//     .select(`
//       *,
//       home_team:home_team_id(*),
//       away_team:away_team_id(*)
//     `)
//     .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
//     .order('game_date', { ascending: true });

//   if (error) {
//     error.message = `Failed to fetch games for team ${teamId}`;
//     throw error;
//   }

//   // Process teams to get full logo URLs
//   const gamesWithTeamLogos = games?.map(game => {
//     const processTeam = (team: any) => {
//       if (!team || !team.logo_url) return team;
      
//       const { data } = supabase.storage
//         .from('media-images')
//         .getPublicUrl(`logos/${team.logo_url}`);
      
//       return {
//         ...team,
//         logo_url: data.publicUrl
//       };
//     };

//     return {
//       ...game,
//       home_team: processTeam(game.home_team),
//       away_team: processTeam(game.away_team)
//     };
//   });

//   return gamesWithTeamLogos ?? [];
// });

// // Get a single game by ID
// export const getGameById = createServerFn({
//   method: "GET",
//   schemas: {
//     params: z.object({
//       id: z.string().uuid()
//     })
//   }
// }).handler(async ({ params }) => {
//   const { id } = params;
//   const supabase = getSupabaseServerClient();
  
//   const { data: game, error } = await supabase
//     .from("games")
//     .select(`
//       *,
//       home_team:home_team_id(*),
//       away_team:away_team_id(*)
//     `)
//     .eq('id', id)
//     .single();

//   if (error) {
//     error.message = `Failed to fetch game ${id}`;
//     throw error;
//   }

//   if (!game) {
//     throw new Error(`Game with ID ${id} not found`);
//   }

//   // Process teams to get full logo URLs
//   const processTeam = (team: any) => {
//     if (!team || !team.logo_url) return team;
    
//     const { data } = supabase.storage
//       .from('media-images')
//       .getPublicUrl(`logos/${team.logo_url}`);
    
//     return {
//       ...team,
//       logo_url: data.publicUrl
//     };
//   };

//   return {
//     ...game,
//     home_team: processTeam(game.home_team),
//     away_team: processTeam(game.away_team)
//   };
// });

// // Create a new game
// export const createGame = createServerFn({
//   method: "POST",
//   schemas: {
//     body: GameInputSchema
//   }
// }).handler(async ({ body }) => {
//   const supabase = getSupabaseServerClient();
  
//   const { data, error } = await supabase
//     .from("games")
//     .insert(body)
//     .select()
//     .single();

//   if (error) {
//     error.message = "Failed to create game";
//     throw error;
//   }

//   return data;
// });

// // Update a game
// export const updateGame = createServerFn({
//   method: "PATCH",
//   schemas: {
//     params: z.object({
//       id: z.string().uuid()
//     }),
//     body: GameInputSchema.partial()
//   }
// }).handler(async ({ params, body }) => {
//   const { id } = params;
//   const supabase = getSupabaseServerClient();
  
//   const { data, error } = await supabase
//     .from("games")
//     .update(body)
//     .eq('id', id)
//     .select()
//     .single();

//   if (error) {
//     error.message = `Failed to update game ${id}`;
//     throw error;
//   }

//   return data;
// });

// // Delete a game
// export const deleteGame = createServerFn({
//   method: "DELETE",
//   schemas: {
//     params: z.object({
//       id: z.string().uuid()
//     })
//   }
// }).handler(async ({ params }) => {
//   const { id } = params;
//   const supabase = getSupabaseServerClient();
  
//   const { error } = await supabase
//     .from("games")
//     .delete()
//     .eq('id', id);

//   if (error) {
//     error.message = `Failed to delete game ${id}`;
//     throw error;
//   }

//   return { success: true, id };
// });

// // Update game scores
// export const updateGameScore = createServerFn({
//   method: "PATCH",
//   schemas: {
//     params: z.object({
//       id: z.string().uuid()
//     }),
//     body: z.object({
//       home_team_score: z.number().int().min(0),
//       away_team_score: z.number().int().min(0),
//       is_completed: z.boolean().optional()
//     })
//   }
// }).handler(async ({ params, body }) => {
//   const { id } = params;
//   const supabase = getSupabaseServerClient();
  
//   const { data, error } = await supabase
//     .from("games")
//     .update(body)
//     .eq('id', id)
//     .select()
//     .single();

//   if (error) {
//     error.message = `Failed to update game score for ${id}`;
//     throw error;
//   }

//   return data;
// });