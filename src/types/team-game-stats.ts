import type { MakeOptional } from "~/lib/utils/make-optional-type";
import type { Team } from "./team";

export type TeamGameStats = {
    tgs_id: string;
    game_id: string | null;
    team_id: string | null;
    points: number | null;
    field_goals_made: number | null;
    field_goals_attempted: number | null;
    field_goal_percentage: string | null;
    two_pointers_made: number | null;
    two_pointers_attempted: number | null;
    two_point_percentage: string | null;
    three_pointers_made: number | null;
    three_pointers_attempted: number | null;
    three_point_percentage: string | null;
    free_throws_made: number | null;
    free_throws_attempted: number | null;
    free_throw_percentage: string | null;
    offensive_rebounds: number | null;
    defensive_rebounds: number | null;
    total_rebounds: number | null;
    assists: number | null;
    steals: number | null;
    blocks: number | null;
    turnovers: number | null;
    team_fouls: number | null;
}

export type TeamGameStatsWithTeam = TeamGameStats & {
    team: Omit<Team, "logo_url" | "season_id" | "created_at" | "updated_at"> ;
}

export type TeamGameStatsInsert = MakeOptional<TeamGameStats, 
"tgs_id" | "field_goal_percentage" | "three_point_percentage" | "free_throw_percentage" | "two_point_percentage" | "total_rebounds"
>;

export type PlayerGameStatsUpdate = Partial<TeamGameStats>;