import type { MakeOptional } from "~/lib/utils/make-optional-type";
import type { Season } from "./season";

export type Team = {
  id: string;
  name: string;
  logoUrl: string | null;
  seasonId: string | null;
  wins: number;
  losses: number;
  createdAt: Date;
  isActive: boolean;
  imageUrl: string | null;
};

export type TeamInsert = MakeOptional<Team, "id" | "createdAt">;
export type TeamUpdate = Partial<Team>;

export type TeamWithSeason = Team & {
  season: Season;
};
