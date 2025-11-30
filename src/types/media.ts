import { MakeOptional } from "~/lib/utils/make-optional-type";

export type Video = {
    video_id: number;
    game_id: string;
    quarter: number;
    description?: string;
    youtube_url: string;
    created_at: string | null;
}

export type Image = {
    image_id: string;
    game_id?: string;
    image_url: string;
    folder: string;
    description?: string;
    created_at: string | null;
}

export type VideoInsert = MakeOptional<Video, "video_id" | "created_at">;
export type VideoUpdate = Partial<Video>;

export type ImageInsert = MakeOptional<Image, "image_id" | "created_at">;
export type ImageUpdate = Partial<Image>;