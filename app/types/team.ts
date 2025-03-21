import type { MakeOptional } from "~/lib/utils/make-optional-type";

export type Team = {
    team_id: string;
    name: string;
    logo_url: string;
    season_id: string;
    wins: number;
    losses: number;
    created_at: string;
    updated_at: string;
}

export type TeamInsert = MakeOptional<Team, "team_id" | "created_at" | "updated_at">;
export type TeamUpdate = Partial<Team>;

