import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "~/db/schema";

const connectionString = process.env.DB_CONNECTION_STRING!;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });

export default db;

// // Games queries
//   export const getGames = async () => {
//     return db.query.games.findMany({
//       with: {
//         homeTeam: true,
//         awayTeam: true
//       },
//       orderBy: (games, { asc }) => [asc(games.game_date), asc(games.start_time)]
//     });
//   };
  
//   export const getGameById = async (id: string) => {
//     return db.query.games.findFirst({
//       where: eq(schema.games.id, id),
//       with: {
//         homeTeam: true,
//         awayTeam: true
//       }
//     });
//   };
  
//   export const getGamesByTeamId = async (teamId: string) => {
//     return db.query.games.findMany({
//       where: or(
//         eq(schema.games.home_team_id, teamId),
//         eq(schema.games.away_team_id, teamId)
//       ),
//       with: {
//         homeTeam: true,
//         awayTeam: true
//       },
//       orderBy: (games, { asc }) => [asc(games.game_date)]
//     });
//   };
  
  
//   export const getUpcomingGames = async (limit = 5) => {
//     return db.query.games.findMany({
//       where: and(
//         eq(schema.games.is_completed, false),
//         sql`${schema.games.game_date} >= CURRENT_DATE`
//       ),
//       with: {
//         homeTeam: true,
//         awayTeam: true
//       },
//       orderBy: (games, { asc }) => [asc(games.game_date), asc(games.start_time)],
//       limit
//     });
//   };
  
//   export const getRecentResults = async (limit = 5) => {
//     return db.query.games.findMany({
//       where: eq(schema.games.is_completed, true),
//       with: {
//         homeTeam: true,
//         awayTeam: true
//       },
//       orderBy: (games, { desc }) => [desc(games.game_date), desc(games.start_time)],
//       limit
//     });
//   };
  
//   // Seasons queries
//   export const getActiveSeasons = async () => {
//     return db.query.seasons.findMany({
//       where: eq(schema.seasons.is_active, true)
//     });
//   };
