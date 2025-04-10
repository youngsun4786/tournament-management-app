import type { MakeOptional } from "~/lib/utils/make-optional-type";

export type Player = {
    player_id: string;
    team_name: string;
    team_id: string;
    name: string;
    jersey_number: number | null;
    height: string | null;
    weight: string | null;
    position: string | null;
    player_url: string | null;
  };

  export type PlayerInsert = MakeOptional<Player, "team_name" | "player_id" | "jersey_number" | "height" | "weight" | "position" | "player_url">;
  export type PlayerUpdate = Partial<Player>;