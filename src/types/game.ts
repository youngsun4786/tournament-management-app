import type { MakeOptional } from "~/lib/utils/make-optional-type";

// Game type from API response
export type Game = {
    id: string;
    game_date: string;
    start_time: string;
    location: string | null;
    court: string | null;
    is_completed: boolean | null;
    home_team_score: number;
    away_team_score: number;
    home_team_id: string;
    home_team_name: string;
    home_team_logo: string | null;
    away_team_id: string;
    away_team_name: string;
    away_team_logo: string | null;
};

export type GameInsert = MakeOptional<Game,
   "id" | "is_completed" | "court" | "location" | "home_team_logo" | "away_team_logo">;

export type GameUpdate = Partial<Game>;