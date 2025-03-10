import { relations } from "drizzle-orm/relations";
import { teams, games } from "./schema";

export const gamesRelations = relations(games, ({one}) => ({
	team_away_team_id: one(teams, {
		fields: [games.away_team_id],
		references: [teams.id],
		relationName: "games_away_team_id_teams_id"
	}),
	team_home_team_id: one(teams, {
		fields: [games.home_team_id],
		references: [teams.id],
		relationName: "games_home_team_id_teams_id"
	}),
}));

export const teamsRelations = relations(teams, ({many}) => ({
	games_away_team_id: many(games, {
		relationName: "games_away_team_id_teams_id"
	}),
	games_home_team_id: many(games, {
		relationName: "games_home_team_id_teams_id"
	}),
}));