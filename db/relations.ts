import { relations } from "drizzle-orm/relations";
import { teams, players, profiles, user_roles, usersInAuth, games, seasons } from "./schema";

export const playersRelations = relations(players, ({one}) => ({
	team: one(teams, {
		fields: [players.team_id],
		references: [teams.id]
	}),
}));

export const teamsRelations = relations(teams, ({one, many}) => ({
	players: many(players),
	profiles: many(profiles),
	games_away_team_id: many(games, {
		relationName: "games_away_team_id_teams_id"
	}),
	games_home_team_id: many(games, {
		relationName: "games_home_team_id_teams_id"
	}),
	season: one(seasons, {
		fields: [teams.season_id],
		references: [seasons.id]
	}),
}));

export const user_rolesRelations = relations(user_roles, ({one}) => ({
	profile: one(profiles, {
		fields: [user_roles.user_id],
		references: [profiles.id]
	}),
}));

export const profilesRelations = relations(profiles, ({one, many}) => ({
	user_roles: many(user_roles),
	usersInAuth: one(usersInAuth, {
		fields: [profiles.id],
		references: [usersInAuth.id]
	}),
	team: one(teams, {
		fields: [profiles.team_id],
		references: [teams.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	profiles: many(profiles),
}));

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

export const seasonsRelations = relations(seasons, ({many}) => ({
	teams: many(teams),
}));