import { relations } from "drizzle-orm/relations";
import { games, player_game_stats, players, profiles, seasons, SupabaseAuthUsers, team_game_stats, teams, user_roles } from "./schema";

export const gamesRelations = relations(games, ({one, many}) => ({
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
	player_game_stats: many(player_game_stats),
	team_game_stats: many(team_game_stats),
}));

export const teamsRelations = relations(teams, ({one, many}) => ({
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
	players: many(players),
	profiles: many(profiles),
	team_game_stats: many(team_game_stats),
}));

export const seasonsRelations = relations(seasons, ({many}) => ({
	teams: many(teams),
}));

export const player_game_statsRelations = relations(player_game_stats, ({one}) => ({
	game: one(games, {
		fields: [player_game_stats.game_id],
		references: [games.id]
	}),
	player: one(players, {
		fields: [player_game_stats.player_id],
		references: [players.id]
	}),
}));

export const playersRelations = relations(players, ({one, many}) => ({
	player_game_stats: many(player_game_stats),
	team: one(teams, {
		fields: [players.team_id],
		references: [teams.id]
	}),
}));

export const profilesRelations = relations(profiles, ({one, many}) => ({
	usersInAuth: one(SupabaseAuthUsers, {
		fields: [profiles.id],
		references: [SupabaseAuthUsers.id]
	}),
	team: one(teams, {
		fields: [profiles.team_id],
		references: [teams.id]
	}),
	user_roles: many(user_roles),
}));

export const usersInAuthRelations = relations(SupabaseAuthUsers, ({many}) => ({
	profiles: many(profiles),
}));

export const team_game_statsRelations = relations(team_game_stats, ({one}) => ({
	game: one(games, {
		fields: [team_game_stats.game_id],
		references: [games.id]
	}),
	team: one(teams, {
		fields: [team_game_stats.team_id],
		references: [teams.id]
	}),
}));

export const user_rolesRelations = relations(user_roles, ({one}) => ({
	profile: one(profiles, {
		fields: [user_roles.user_id],
		references: [profiles.id]
	}),
}));