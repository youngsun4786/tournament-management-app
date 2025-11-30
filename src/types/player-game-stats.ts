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
    personal_fouls: number | null;
    plus_minus: number | null;
    updated_at: string | undefined;
}

export type PlayerGameStatsTotal = {
    player: Omit<Player, | "height" | "weight"> ;
    total_points: number;
    total_rebounds: number;
    total_assists: number;
    total_steals: number;
    total_blocks: number;
    total_turnovers: number;
    total_personal_fouls: number;
    total_plus_minus: number;
    // percentages
    total_field_goal_percentage: number;
    total_two_point_percentage: number;
    total_three_point_percentage: number;
    total_free_throw_percentage: number;
    // attempts per game
    total_field_goal_attempts: number;
    total_two_point_attempts: number;
    total_three_point_attempts: number;
    total_free_throw_attempts: number;
    // made per game
    total_field_goals_made: number;
    total_two_pointers_made: number;
    total_three_pointers_made: number;
    total_free_throws_made: number;
    games_played: number;
}

export type PlayerGameStatsAverage = {
    player: Omit<Player, | "height" | "weight"> ;
    points_per_game: number;
    rebounds_per_game: number;
    assists_per_game: number;
    steals_per_game: number;
    blocks_per_game: number;
    turnovers_per_game: number;
    personal_fouls_per_game: number;
    plus_minus_per_game: number;
    // percentages
    field_goal_percentage: number;
    two_point_percentage: number;
    three_point_percentage: number;
    free_throw_percentage: number;
    // attempts per game
    field_goal_attempts_per_game: number;
    two_point_attempts_per_game: number;
    three_point_attempts_per_game: number;
    free_throw_attempts_per_game: number;
    // made per game
    field_goals_made_per_game: number;
    two_pointers_made_per_game: number;
    three_pointers_made_per_game: number;
    free_throws_made_per_game: number;
    games_played: number;
}

export type PlayerGameStatsWithPlayer = PlayerGameStats & {
    player: Omit<Player, "height" | "weight"> ;
}

export type PlayerGameStatsInsert = MakeOptional<PlayerGameStats, 
"pgs_id" | "field_goal_percentage" | "three_point_percentage" | "free_throw_percentage" | "two_point_percentage" | "total_rebounds" | "updated_at"
>;

export type PlayerGameStatsUpdate = Partial<PlayerGameStats>;