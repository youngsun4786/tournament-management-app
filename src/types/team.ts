import type { MakeOptional } from "~/lib/utils/make-optional-type";
import type { Season } from "./season";

export type Team = {
    id: string;
    name: string;
    logo_url: string | null;
    season_id: string | null;
    wins: number;
    losses: number;
    created_at: string;
}

export type TeamInsert = MakeOptional<Team, "id" | "created_at">;
export type TeamUpdate = Partial<Team>;

export type TeamWithSeason = Team & {
    season: Season;
}
