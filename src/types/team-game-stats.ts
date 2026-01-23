import type { MakeOptional } from "~/lib/utils/make-optional-type";
import type { Team } from "./team";

export type TeamGameStats = {
  id: string; // was tgs_id
  gameId: string | null;
  teamId: string | null;
  points: number | null;
  fieldGoalsMade: number | null;
  fieldGoalsAttempted: number | null;
  fieldGoalPercentage: string | null;
  twoPointersMade: number | null;
  twoPointersAttempted: number | null;
  twoPointPercentage: string | null;
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
  teamFouls: number | null;
};

export type TeamGameStatsWithTeam = TeamGameStats & {
  team: Omit<Team, "logoUrl" | "seasonId" | "createdAt" | "updatedAt">; // Omit props should match Team keys (CamelCase)
};

export type TeamGameStatsInsert = MakeOptional<
  TeamGameStats,
  | "id"
  | "fieldGoalPercentage"
  | "threePointPercentage"
  | "freeThrowPercentage"
  | "twoPointPercentage"
  | "totalRebounds"
>;

export type TeamGameStatsUpdate = Partial<TeamGameStats>;
