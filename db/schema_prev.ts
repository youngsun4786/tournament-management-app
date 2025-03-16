import { sql } from "drizzle-orm";
import { boolean, date, foreignKey, integer, pgPolicy, pgTable, text, time, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";


export const games = pgTable("games", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	home_team_id: uuid().defaultRandom().notNull(),
	away_team_id: uuid().defaultRandom().notNull(),
	home_team_score: integer().default(0).notNull(),
	away_team_score: integer().default(0).notNull(),
	game_date: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	start_time: time().notNull(),
	location: text(),
	court: text(),
	is_completed: boolean().default(false),
}, (table) => [
	foreignKey({
			columns: [table.away_team_id],
			foreignColumns: [teams.id],
			name: "games_away_team_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.home_team_id],
			foreignColumns: [teams.id],
			name: "games_home_team_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const seasons = pgTable("seasons", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: text().default('').notNull(),
	start_date: date().notNull(),
	end_date: date().notNull(),
	is_active: boolean().default(false),
});

export const teams = pgTable("teams", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	name: text().default('').notNull(),
	logo_url: text(),
}, (table) => [
	unique("teams_name_key").on(table.name),
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

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