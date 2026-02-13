import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  date,
  integer,
  numeric,
  pgEnum,
  pgPolicy,
  pgSchema,
  pgTable,
  smallint,
  text,
  time,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const appRole = pgEnum("app_role", [
  "admin",
  "score-keeper",
  "player",
  "captain",
]);

/* -- Supabase -- */
// 💡 We are not creating any schema here, just declaring it to be able to reference user id

const SupabaseAuthSchema = pgSchema("auth");

export const SupabaseAuthUsers = SupabaseAuthSchema.table("users", {
  id: uuid("id").primaryKey().notNull(),
});

/* -- User -- */
export const usersInAuth = pgTable("user", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .references(() => SupabaseAuthUsers.id, { onDelete: "cascade" }),
});

export const games = pgTable.withRLS(
  "games",
  {
    id: uuid().defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    homeTeamId: uuid("home_team_id")
      .defaultRandom()
      .notNull()
      .references(() => teams.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    awayTeamId: uuid("away_team_id")
      .defaultRandom()
      .notNull()
      .references(() => teams.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    seasonId: uuid("season_id")
      .notNull()
      .references(() => seasons.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    homeTeamScore: integer("home_team_score").default(0).notNull(),
    awayTeamScore: integer("away_team_score").default(0).notNull(),
    gameDate: timestamp("game_date", { withTimezone: true }).notNull(),
    startTime: time("start_time").notNull(),
    location: text(),
    court: text(),
    isCompleted: boolean("is_completed").default(false),
  },
  (table) => [
    pgPolicy("Allow read access for all users on games", {
      for: "select",
      using: sql`true`,
    }),

    pgPolicy("Allow score-keeper and admin to insert games", {
      for: "insert",
      to: ["authenticated"],
      withCheck: sql`(EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = ANY (ARRAY['score-keeper'::app_role, 'admin'::app_role])))))`,
    }),

    pgPolicy("Allow score-keeper and admin to update games", {
      for: "update",
      to: ["authenticated"],
      using: sql`(EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = ANY (ARRAY['score-keeper'::app_role, 'admin'::app_role])))))`,
      withCheck: sql`(EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = ANY (ARRAY['score-keeper'::app_role, 'admin'::app_role])))))`,
    }),
  ],
);

export const images = pgTable.withRLS(
  "images",
  {
    imageId: uuid("image_id").defaultRandom().primaryKey(),
    gameId: uuid("game_id").references(() => games.id),
    imageUrl: text("image_url").notNull(),
    folder: text().notNull(),
    description: text(),
    createdAt: timestamp("created_at", { withTimezone: true }).default(
      sql`now()`,
    ),
  },
  (table) => [
    pgPolicy("Enable insert for admins and score-keepers", {
      for: "insert",
      to: ["authenticated"],
      withCheck: sql`(EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = ANY (ARRAY['score-keeper'::app_role, 'admin'::app_role])))))`,
    }),

    pgPolicy("Enable read access for all users", {
      for: "select",
      using: sql`true`,
    }),

    pgPolicy("Enable update for admins and score-keepers", {
      for: "update",
      using: sql`(EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = ANY (ARRAY['score-keeper'::app_role, 'admin'::app_role])))))`,
      withCheck: sql`(EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = ANY (ARRAY['score-keeper'::app_role, 'admin'::app_role])))))`,
    }),
  ],
);

export const playerGameStats = pgTable.withRLS(
  "player_game_stats",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey(),
    gameId: uuid("game_id").references(() => games.id),
    playerId: uuid("player_id").references(() => players.id, {
      onDelete: "cascade",
    }),
    minutesPlayed: integer("minutes_played").default(0),
    points: integer().default(0),
    fieldGoalsMade: integer("field_goals_made").default(0),
    fieldGoalsAttempted: integer("field_goals_attempted").default(0),
    fieldGoalPercentage: numeric("field_goal_percentage", {
      precision: 5,
      scale: 2,
    }),
    threePointersMade: integer("three_pointers_made").default(0),
    threePointersAttempted: integer("three_pointers_attempted").default(0),
    threePointPercentage: numeric("three_point_percentage", {
      precision: 5,
      scale: 2,
    }),
    freeThrowsMade: integer("free_throws_made").default(0),
    freeThrowsAttempted: integer("free_throws_attempted").default(0),
    freeThrowPercentage: numeric("free_throw_percentage", {
      precision: 5,
      scale: 2,
    }),
    offensiveRebounds: integer("offensive_rebounds").default(0),
    defensiveRebounds: integer("defensive_rebounds").default(0),
    totalRebounds: integer("total_rebounds").default(0),
    assists: integer().default(0),
    steals: integer().default(0),
    blocks: integer().default(0),
    turnovers: integer().default(0),
    personalFouls: integer("personal_fouls").default(0),
    plusMinus: integer("plus_minus").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).default(
      sql`now()`,
    ),
    updatedAt: timestamp("updated_at", { withTimezone: true }).default(
      sql`now()`,
    ),
    twoPointPercentage: numeric("two_point_percentage", {
      mode: "number",
      precision: 5,
      scale: 2,
    }).default(0),
    twoPointersAttempted: integer("two_pointers_attempted").default(0),
    twoPointersMade: integer("two_pointers_made").default(0),
  },
  (table) => [
    unique("player_game_stats_game_id_player_id_key").on(
      table.gameId,
      table.playerId,
    ),
    pgPolicy("Allow read access for all users on player_game_stats", {
      for: "select",
      using: sql`true`,
    }),

    pgPolicy("Allow score-keeper to insert player game stats", {
      for: "insert",
      to: ["authenticated"],
      withCheck: sql`(EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'score-keeper'::app_role))))`,
    }),

    pgPolicy("Allow score-keeper to update player game stats", {
      for: "update",
      to: ["authenticated"],
      using: sql`(EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'score-keeper'::app_role))))`,
      withCheck: sql`(EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::app_role))))`,
    }),
  ],
);

export const players = pgTable.withRLS(
  "players",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey(),
    name: text().notNull(),
    jerseyNumber: integer("jersey_number"),
    position: text(),
    height: text(),
    weight: text(),
    teamId: uuid("team_id").references(() => teams.id),
    createdAt: timestamp("created_at", { withTimezone: true }).default(
      sql`now()`,
    ),
    updatedAt: timestamp("updated_at", { withTimezone: true }).default(
      sql`now()`,
    ),
    playerUrl: text("player_url"),
    isCaptain: boolean("is_captain").default(false).notNull(),
    waiverUrl: text("waiver_url"),
  },
  (table) => [
    pgPolicy("Allow captain to insert players", {
      for: "insert",
      to: ["authenticated"],
      withCheck: sql`(EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = ANY (ARRAY['captain'::app_role, 'admin'::app_role])))))`,
    }),

    pgPolicy("Allow captain to update players", {
      for: "update",
      to: ["authenticated"],
      using: sql`(EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = ANY (ARRAY['captain'::app_role, 'admin'::app_role])))))`,
      withCheck: sql`(EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = ANY (ARRAY['captain'::app_role, 'admin'::app_role])))))`,
    }),

    pgPolicy("Allow read access for all users on players", {
      for: "select",
      using: sql`true`,
    }),

    pgPolicy("Enable delete for admins and captains", {
      for: "delete",
      to: ["authenticated"],
      using: sql`(EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = ANY (ARRAY['captain'::app_role, 'admin'::app_role])))))`,
    }),
  ],
);

export const profiles = pgTable.withRLS(
  "profiles",
  {
    id: uuid()
      .primaryKey()
      .references(() => usersInAuth.id, { onDelete: "cascade" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    firstName: text("first_name"),
    lastName: text("last_name"),
    email: text().notNull(),
    avatarUrl: text("avatar_url"),
    teamId: uuid("team_id").references(() => teams.id),
    createdAt: timestamp("created_at", { withTimezone: true }).default(
      sql`now()`,
    ),
  },
  (table) => [
    pgPolicy("Allow read access for all users on profiles", {
      for: "select",
      using: sql`true`,
    }),

    pgPolicy("Allow users to insert their own profile", {
      for: "insert",
      to: ["authenticated"],
      withCheck: sql`(auth.uid() = id)`,
    }),

    pgPolicy("Allow users to update their own profile", {
      for: "update",
      to: ["authenticated"],
      using: sql`(auth.uid() = id)`,
      withCheck: sql`(auth.uid() = id)`,
    }),
  ],
);

export const seasons = pgTable.withRLS(
  "seasons",
  {
    id: uuid().defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    name: text().default("").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    isActive: boolean("is_active").default(false),
  },
  (table) => [
    pgPolicy("Enable read access for all users", {
      for: "select",
      using: sql`true`,
    }),
  ],
);

export const teamGameStats = pgTable.withRLS(
  "team_game_stats",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey(),
    gameId: uuid("game_id").references(() => games.id),
    teamId: uuid("team_id").references(() => teams.id),
    totalPoints: integer("total_points").default(0),
    fieldGoalsMade: integer("field_goals_made").default(0),
    fieldGoalsAttempted: integer("field_goals_attempted").default(0),
    fieldGoalPercentage: numeric("field_goal_percentage", {
      precision: 5,
      scale: 2,
    }),
    threePointersMade: integer("three_pointers_made").default(0),
    threePointersAttempted: integer("three_pointers_attempted").default(0),
    threePointPercentage: numeric("three_point_percentage", {
      precision: 5,
      scale: 2,
    }),
    freeThrowsMade: integer("free_throws_made").default(0),
    freeThrowsAttempted: integer("free_throws_attempted").default(0),
    freeThrowPercentage: numeric("free_throw_percentage", {
      precision: 5,
      scale: 2,
    }),
    offensiveRebounds: integer("offensive_rebounds").default(0),
    defensiveRebounds: integer("defensive_rebounds").default(0),
    totalRebounds: integer("total_rebounds").default(0),
    assists: integer().default(0),
    steals: integer().default(0),
    blocks: integer().default(0),
    turnovers: integer().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).default(
      sql`now()`,
    ),
    updatedAt: timestamp("updated_at", { withTimezone: true }).default(
      sql`now()`,
    ),
    teamFouls: integer("team_fouls").default(0),
    twoPointPercentage: numeric("two_point_percentage", {
      precision: 5,
      scale: 2,
    }),
    twoPointersAttempted: integer("two_pointers_attempted").default(0),
    twoPointersMade: integer("two_pointers_made").default(0),
  },
  (table) => [
    unique("team_game_stats_game_id_team_id_key").on(
      table.gameId,
      table.teamId,
    ),
    pgPolicy("Enable read access for all users", {
      for: "select",
      using: sql`true`,
    }),
  ],
);

export const teams = pgTable.withRLS(
  "teams",
  {
    id: uuid().defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
    name: text().default("").notNull(),
    logoUrl: text("logo_url"),
    seasonId: uuid("season_id").references(() => seasons.id),
    losses: smallint().default(0).notNull(),
    wins: smallint().default(0).notNull(),
    isActive: boolean("is_active").default(false).notNull(),
    imageUrl: text("image_url"),
  },
  (table) => [
    unique("teams_name_key").on(table.name),
    pgPolicy("Enable insert access for all users (temporary)", {
      for: "insert",
      withCheck: sql`true`,
    }),

    pgPolicy("Enable read access for all users", {
      for: "select",
      using: sql`true`,
    }),
    check("teams_is_active_check", sql`(is_active = ANY (ARRAY[true, false]))`),
  ],
);

export const userRoles = pgTable.withRLS(
  "user_roles",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    role: appRole().notNull(),
  },
  (table) => [
    unique("user_roles_user_id_role_key").on(table.userId, table.role),
    pgPolicy("Enable insert for authenticated users only", {
      for: "insert",
      to: ["authenticated"],
      withCheck: sql`true`,
    }),

    pgPolicy("Enable read access for authenticated users", {
      for: "select",
      to: ["authenticated"],
      using: sql`(user_id = auth.uid())`,
    }),
  ],
);

export const videos = pgTable.withRLS(
  "videos",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    quarter: integer().notNull(),
    description: text(),
    youtubeUrl: text("youtube_url").notNull(),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => [
    pgPolicy("Enable read access for all users", {
      for: "select",
      using: sql`true`,
    }),

    pgPolicy("Enable video update for admins and score-keepers", {
      for: "update",
      using: sql`(EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = ANY (ARRAY['score-keeper'::app_role, 'admin'::app_role])))))`,
      withCheck: sql`(EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = ANY (ARRAY['score-keeper'::app_role, 'admin'::app_role])))))`,
    }),

    pgPolicy("Enable videos insert for admin and score-keepers", {
      for: "insert",
      to: ["authenticated"],
      withCheck: sql`(EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = ANY (ARRAY['score-keeper'::app_role, 'admin'::app_role])))))`,
    }),
    check("videos_quarter_check", sql`((quarter >= 1) AND (quarter <= 4))`),
  ],
);
