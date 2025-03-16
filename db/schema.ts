import { sql } from "drizzle-orm";
import { bigint, boolean, date, foreignKey, integer, pgEnum, pgPolicy, pgSchema, pgTable, text, time, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

export const app_role = pgEnum("app_role", ['admin', 'score-keeper', 'player', 'captain'])
export const role = pgEnum("role", ['captain', 'score-keeper', 'admin'])


/* -- Supabase -- */
// 💡 We are not creating any schema here, just declaring it to be able to reference user id

const SupabaseAuthSchema = pgSchema("auth");

const SupabaseAuthUsers = SupabaseAuthSchema.table("users", {
    id: uuid("id").primaryKey().notNull(),
});

/* -- User -- */
const Users = pgTable("user", {
    id: uuid("id")
        .primaryKey()
        .notNull()
        .references(() => SupabaseAuthUsers.id, { onDelete: "cascade" }),
})

export const players = pgTable("players", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	name: text().notNull(),
	jersey_number: integer(),
	position: text(),
	height: text(),
	weight: text(),
	team_id: uuid(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.team_id],
			foreignColumns: [teams.id],
			name: "players_team_id_fkey"
		}),
]);

export const user_roles = pgTable("user_roles", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "user_roles_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	user_id: uuid().notNull(),
	role: app_role().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "user_roles_user_id_fkey"
		}).onDelete("cascade"),
	unique("user_roles_user_id_role_key").on(table.user_id, table.role),
]);

export const profiles = pgTable("profiles", {
	id: uuid().primaryKey().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }),
	first_name: text(),
	last_name: text(),
	email: text().notNull(),
	avatar_url: text(),
	team_id: uuid(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [Users.id],
			name: "profiles_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.team_id],
			foreignColumns: [teams.id],
			name: "profiles_team_id_fkey"
		}),
	unique("profiles_email_key").on(table.email),
	pgPolicy("Users can update own profile.", { as: "permissive", for: "update", to: ["public"], using: sql`(( SELECT auth.uid() AS uid) = id)` }),
	pgPolicy("Users can insert their own profile.", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Public profiles are viewable by everyone.", { as: "permissive", for: "select", to: ["public"] }),
]);

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

export const teams = pgTable("teams", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	name: text().default('').notNull(),
	logo_url: text(),
	season_id: uuid(),
}, (table) => [
	foreignKey({
			columns: [table.season_id],
			foreignColumns: [seasons.id],
			name: "teams_season_id_fkey"
		}),
	unique("teams_name_key").on(table.name),
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const seasons = pgTable("seasons", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: text().default('').notNull(),
	start_date: date().notNull(),
	end_date: date().notNull(),
	is_active: boolean().default(false),
});

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
	usersInAuth: one(Users, {
		fields: [profiles.id],
		references: [Users.id]
	}),
	team: one(teams, {
		fields: [profiles.team_id],
		references: [teams.id]
	}),
}));

export const usersInAuthRelations = relations(Users, ({many}) => ({
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