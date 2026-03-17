export type SkillRatingKey =
  | "points"
  | "rebounds"
  | "assists"
  | "steals"
  | "blocks";

export const SKILL_RATING_KEYS: SkillRatingKey[] = [
  "points",
  "rebounds",
  "assists",
  "steals",
  "blocks",
];

export const SKILL_RATING_LABELS: Record<SkillRatingKey, string> = {
  points: "Scoring",
  rebounds: "Rebounding",
  assists: "Playmaking",
  steals: "Steals",
  blocks: "Shot Blocking",
};

export type SkillRatings = Record<SkillRatingKey, number>;

export const DEFAULT_RATINGS: SkillRatings = {
  points: 50,
  rebounds: 50,
  assists: 50,
  steals: 50,
  blocks: 50,
};

export type PlayerSkillRatings = {
  id: string;
  playerId: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  updatedBy: string;
  updatedAt: Date;
};
