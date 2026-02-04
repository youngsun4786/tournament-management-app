import type { MakeOptional } from "~/lib/utils/make-optional-type";

export type Player = {
  id: string;
  teamName: string;
  teamId: string;
  name: string;
  jerseyNumber: number | null;
  height: string | null;
  weight: string | null;
  position: string | null;
  playerUrl: string | null;
  waiverUrl: string | null;
  isCaptain: boolean;
};

export type PlayerInsert = MakeOptional<
  Player,
  | "teamName"
  | "id"
  | "jerseyNumber"
  | "height"
  | "weight"
  | "position"
  | "playerUrl"
  | "waiverUrl"
  | "isCaptain"
>;
export type PlayerUpdate = Partial<Player>;
