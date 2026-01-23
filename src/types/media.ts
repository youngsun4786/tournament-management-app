import { MakeOptional } from "~/lib/utils/make-optional-type";

export type Video = {
  id: number;
  gameId: string;
  quarter: number;
  description?: string;
  youtubeUrl: string;
  createdAt: string | null;
};

export type Image = {
  imageId: string;
  gameId?: string;
  imageUrl: string;
  folder: string;
  description?: string;
  createdAt: string | null;
};

export type VideoInsert = MakeOptional<Video, "id" | "createdAt">;
export type VideoUpdate = Partial<Video>;

export type ImageInsert = MakeOptional<Image, "imageId" | "createdAt">;
export type ImageUpdate = Partial<Image>;
