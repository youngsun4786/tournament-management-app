import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { games, players, seasons, teams } from "./schema";

// Select types (what you get when querying)
export type Season = InferSelectModel<typeof seasons>;
export type Team = InferSelectModel<typeof teams>;
export type Game = InferSelectModel<typeof games>;
export type Player = InferSelectModel<typeof players>;

// Insert types (what you use when creating new records)
export type NewSeason = InferInsertModel<typeof seasons>;
export type NewTeam = InferInsertModel<typeof teams>;
export type NewGame = InferInsertModel<typeof games>;
export type NewPlayer = InferInsertModel<typeof players>;

// Extended types for joined data
export type GameWithTeams = Game & {
  homeTeam: Team;
  awayTeam: Team;
};

export type TeamWithGames = Team & {
  homeGames: Game[];
  awayGames: Game[];
};

export type TeamWithPlayers = Team & {
  players: Player[];
};
