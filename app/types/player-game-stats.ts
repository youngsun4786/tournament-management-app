import type { MakeOptional } from "~/lib/utils/make-optional-type";
import type { Player } from "./player";

export type PlayerGameStats = {
    pgs_id: string;
    game_id: string | null;
    player_id: string | null;
    minutes_played: number | null;
    points: number | null;
    field_goals_made: number | null;
    field_goals_attempted: number | null;
    field_goal_percentage: string | null;
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
    personal_fouls: number | null;
    plus_minus: number | null;
    updated_at: string | undefined;
}

export type PlayerGameStatsWithPlayer = PlayerGameStats & {
    player: Omit<Player, "player_id" | "height" | "weight"> ;
}

export type PlayerGameStatsInsert = MakeOptional<PlayerGameStats, 
"pgs_id" | "field_goal_percentage" | "three_point_percentage" | "free_throw_percentage"  | "updated_at"
>;

export type PlayerGameStatsUpdate = Partial<PlayerGameStats>;