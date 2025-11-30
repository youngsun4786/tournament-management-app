import { getSupabaseServerClient } from "~/lib/utils/supabase-server";
import { Image, ImageInsert, Video, VideoInsert } from "~/src/types/media";

export interface IMediaService {
  addVideo(data: VideoInsert): Promise<Video>;
  getVideos(gameId: string): Promise<Video[]>;
  addImage(data: ImageInsert): Promise<Image>;
  getSpecificImages(folder: string): Promise<Image[]>;
}

export class MediaService implements IMediaService {
  private get supabase() {
    return getSupabaseServerClient();
  }

  constructor() {
  }

  async addVideo(data: VideoInsert): Promise<Video> {
    const { data: video, error } = await this.supabase
      .from("videos")
      .insert({
        game_id: data.game_id,
        quarter: data.quarter,
        youtube_url: data.youtube_url,
        description: data.description})
      .select()
      .single<Video>();
    if (!video || error) {
      throw new Error("Failed to add video", {cause: error});
    }

    return video;
  }

  async getVideos(gameId: string): Promise<Video[]> {
    const { data: videos, error } = await this.supabase
      .from('videos')
      .select('*')
      .eq('game_id', gameId);

    if (!videos || error) {
      throw new Error("Failed to get videos", {cause: error});
    }

    return videos as Video[];
  }

  // Upload an image to storage and return its URL
  async addImage(data: ImageInsert): Promise<Image> {
    const { data: image, error } = await this.supabase
      .from('images')
      .insert(data)
      .select()
      .single<Image>();
    if (!image || error) {
      throw new Error("Failed to add image", {cause: error});
    }
    return image;
  }


  async getSpecificImages(folder: string): Promise<Image[]> {
    const { data: images, error } = await this.supabase
      .from('images')
      .select('*')
      .eq('folder', folder)
      .order('created_at', { ascending: false });

    if (!images || error) {
      throw new Error(`Failed to get images from ${folder}`, {cause: error});
    }
    return images as Image[];
  }

}


