import type { MakeOptional } from "~/lib/utils/make-optional-type";

// Game type from API response
export type Game = {
  id: string;
  seasonId: string;
  gameDate: Date;
  startTime: string;
  location: string | null;
  court: string | null;
  isCompleted: boolean;
  homeTeamScore: number;
  awayTeamScore: number;
  homeTeamId: string;
  homeTeamName?: string;
  homeTeamLogo?: string | null;
  awayTeamId: string;
  awayTeamName?: string;
  awayTeamLogo?: string | null;
};

export type GameInsert = MakeOptional<
  Game,
  | "id"
  | "isCompleted"
  | "court"
  | "location"
  | "homeTeamLogo"
  | "awayTeamLogo"
  | "homeTeamName"
  | "awayTeamName"
>;

export type GameUpdate = Partial<Game>;
