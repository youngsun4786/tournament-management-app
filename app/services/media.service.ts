import { SupabaseClient } from "@supabase/supabase-js";
import { Media, MediaInsert, MediaUpdate, Video, VideoInsert, ImageInsert } from "~/app/types/media";
import { supabaseServer } from "~/lib/utils/supabase-server";

export interface IMediaService {
  addMedia(data: MediaInsert): Promise<Media>;
  deleteMedia(id: string): Promise<void>;
  updateMedia(id: string, params: MediaUpdate): Promise<Media>;
  addVideo(data: VideoInsert): Promise<Video>;
  getVideos(gameId: string): Promise<Video[]>;
  uploadImage(data: ImageInsert): Promise<{ url: string, error: string }>;
}

export class MediaService implements IMediaService {
  private supabase: SupabaseClient;

  constructor() {
    // Only initialize Supabase client when needed (not during SSR hydration)
    this.supabase = supabaseServer;
  }

  async addMedia(data: MediaInsert): Promise<Media> {
    const { data: media, error } = await this.supabase
      .from('media')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return media;
  }

  async deleteMedia(id: string): Promise<void> {
    // First get the image data to check if it's stored in our storage
    const { data: image, error: fetchError } = await this.supabase
      .from('media')
      .select('file_name, file_path')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // If the image has a storage path, delete it from storage first
    if (image?.file_path) {
      const { error: storageError } = await this.supabase.storage
        .from('media-images')
        .remove([image.file_path]);
      
      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
        // Continue with deletion from the database even if storage deletion fails
      }
    }

    // Delete the image record from the database
    const { error } = await this.supabase
      .from('media')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async updateMedia(id: string, params: MediaUpdate): Promise<Media> {
    const { data, error } = await this.supabase
      .from('media')
      .update(params)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }


  async addVideo(data: VideoInsert): Promise<Video> {
    console.log("Adding video", data);
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
  async uploadImage(data: ImageInsert): Promise<{ url: string, error: string }> {
    // // Ensure this method is only called in the browser

    // // Generate a unique file name to avoid collisions
    // const fileName = `${folderPath}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    // // Upload the file to storage
    // const { data, error } = await this.supabase.storage
    //   .from('media-images')
    //   .upload(fileName, file, {
    //     cacheControl: '3600',
    //     upsert: false,
    //   });
    
    // if (error) throw error;
    
    // // Get the public URL for the uploaded file
    // const { data: publicUrlData } = this.supabase.storage
    //   .from('media-images')
    //   .getPublicUrl(data.path);
    
    // return {
    //   url: publicUrlData.publicUrl,
    //   path: data.path
    // };
  }
} 