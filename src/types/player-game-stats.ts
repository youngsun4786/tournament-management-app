import type { MakeOptional } from "~/lib/utils/make-optional-type";
import type { Player } from "./player";

export type PlayerGameStats = {
  id: string;
  gameId: string | null;
  playerId: string | null;
  minutesPlayed: number | null;
  points: number | null;
  fieldGoalsMade: number | null;
  fieldGoalsAttempted: number | null;
  fieldGoalPercentage: string | null;
  twoPointersMade: number | null;
  twoPointersAttempted: number | null;
  twoPointPercentage: number | null;
  threePointersMade: number | null;
  threePointersAttempted: number | null;
  threePointPercentage: string | null;
  freeThrowsMade: number | null;
  freeThrowsAttempted: number | null;
  freeThrowPercentage: string | null;
  offensiveRebounds: number | null;
  defensiveRebounds: number | null;
  totalRebounds: number | null;
  assists: number | null;
  steals: number | null;
  blocks: number | null;
  turnovers: number | null;
  personalFouls: number | null;
  plusMinus: number | null;
  updatedAt: Date | null;
};

export type PlayerGameStatsTotal = {
  player: Omit<Player, "height" | "weight">;
  totalPoints: number;
  totalRebounds: number;
  totalAssists: number;
  totalSteals: number;
  totalBlocks: number;
  totalTurnovers: number;
  totalPersonalFouls: number;
  totalPlusMinus: number;
  // percentages
  totalFieldGoalPercentage: number;
  totalTwoPointPercentage: number;
  totalThreePointPercentage: number;
  totalFreeThrowPercentage: number;
  // attempts per game
  totalFieldGoalAttempts: number;
  totalTwoPointAttempts: number;
  totalThreePointAttempts: number;
  totalFreeThrowAttempts: number;
  // made per game
  totalFieldGoalsMade: number;
  totalTwoPointersMade: number;
  totalThreePointersMade: number;
  totalFreeThrowsMade: number;
  gamesPlayed: number;
};

export type PlayerGameStatsAverage = {
  player: Omit<Player, "height" | "weight">;
  pointsPerGame: number;
  reboundsPerGame: number;
  assistsPerGame: number;
  stealsPerGame: number;
  blocksPerGame: number;
  turnoversPerGame: number;
  personalFoulsPerGame: number;
  plusMinusPerGame: number;
  // percentages
  fieldGoalPercentage: number;
  twoPointPercentage: number;
  threePointPercentage: number;
  freeThrowPercentage: number;
  // attempts per game
  fieldGoalAttemptsPerGame: number;
  twoPointAttemptsPerGame: number;
  threePointAttemptsPerGame: number;
  freeThrowAttemptsPerGame: number;
  // made per game
  fieldGoalsMadePerGame: number;
  twoPointersMadePerGame: number;
  threePointersMadePerGame: number;
  freeThrowsMadePerGame: number;
  gamesPlayed: number;
};

export type PlayerGameStatsWithPlayer = PlayerGameStats & {
  player: Omit<Player, "height" | "weight">;
};

export type PlayerGameStatsInsert = MakeOptional<
  PlayerGameStats,
  | "id"
  | "fieldGoalPercentage"
  | "threePointPercentage"
  | "freeThrowPercentage"
  | "twoPointPercentage"
  | "totalRebounds"
  | "updatedAt"
>;

export type PlayerGameStatsUpdate = Partial<PlayerGameStats>;
