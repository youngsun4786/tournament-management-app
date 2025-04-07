import { MakeOptional } from "~/lib/utils/make-optional-type";


export type Media = {
    id: string;
    file_name: string;
    description?: string;
    file_path?: string;
    created_at: string | null;
}

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
    description?: string;
    file_name: string;
    file_path?: string;
    created_at: string | null;
}

export type MediaInsert = MakeOptional<Media, "id" | "created_at">;
export type MediaUpdate = Partial<Media>;

export type VideoInsert = MakeOptional<Video, "video_id" | "created_at">;
export type VideoUpdate = Partial<Video>;

export type ImageInsert = MakeOptional<Image, "image_id" | "created_at">;
export type ImageUpdate = Partial<Image>;