import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { mediaService } from "~/app/container";

export const addVideo = createServerFn({
  method: "POST",
}).validator(
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

export const getVideosByGameId = createServerFn({
    method: "GET",
}).validator(
    z.object({
        game_id: z.string().uuid(),
    })
).handler(async ({ data }) => {
    const videos = await mediaService.getVideos(data.game_id);
    return videos;
});

