import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { mediaService } from "~/src/container";

export const addVideo = createServerFn({
  method: "POST",
}).inputValidator(
    z.object({
        game_id: z.string().uuid(),
        quarter: z.number().int().min(1).max(4),
        youtube_url: z.string().url(),
        description: z.string().nullable(),
    })
).handler(async ({ data }) => {
    const video = await mediaService.addVideo({
        game_id: data.game_id,
        quarter: data.quarter,
        youtube_url: data.youtube_url,
        description: data.description || undefined,
    });
    return video;
});

export const addImages = createServerFn({
  method: "POST",
}).inputValidator(z.object({
    imageUrls: z.array(z.string()),
    imageIds: z.array(z.string()),
    description: z.string().optional(),
    folder: z.enum(["avatars", "gallery", "players", "games", "users"]).optional(),
})).handler(async ({ data }) => {

    // use promise to add images
    const images = await Promise.all(data.imageUrls.map(async (imageUrl, index) => {
        return await mediaService.addImage({
            image_url: imageUrl,
            image_id: data.imageIds[index],
            description: data.description,
            folder: data.folder!,
        });
    }));

    return images;
});

export const getVideosByGameId = createServerFn({
    method: "GET",
}).inputValidator(
    z.object({
        game_id: z.string().uuid(),
    })
).handler(async ({ data }) => {
    const videos = await mediaService.getVideos(data.game_id);
    return videos;
});

export const getSpecificImages = createServerFn({
}).inputValidator(z.object({
        folder: z.enum(["avatars", "gallery", "players", "games", "users"]),
})).handler(async ({ data }) => {
    const images = await mediaService.getSpecificImages(data.folder);
    return images;
});