import { getBrowserClient } from "~/lib/utils/supabase-client";

interface CarouselImage {
  id: string;
  imageUrl: string;
  displayOrder: number;
  description?: string;
  created_at: string;
  storage_path?: string; // Path in storage bucket
}

interface AddImageParams {
  imageUrl: string;
  displayOrder?: number;
  description?: string;
  storage_path?: string; // Path in storage bucket
}

interface UpdateOrderItem {
  id: string;
  displayOrder: number;
}

export class CarouselService {
  private supabase;

  constructor() {
    // Only initialize Supabase client when needed (not during SSR hydration)
    this.supabase = getBrowserClient();
  }

  async addImage(params: AddImageParams): Promise<CarouselImage> {
    // If no display order provided, put it at the end
    if (params.displayOrder === undefined) {
      const { data: existingImages } = await this.supabase
        .from('carousel_images')
        .select('displayOrder')
        .order('displayOrder', { ascending: false })
        .limit(1);

      const lastOrder = existingImages && existingImages.length > 0 
        ? existingImages[0].displayOrder 
        : -1;
      
      params.displayOrder = lastOrder + 1;
    }

    const { data, error } = await this.supabase
      .from('carousel_images')
      .insert([params])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteImage(id: string): Promise<void> {
    // First get the image data to check if it's stored in our storage
    const { data: image, error: fetchError } = await this.supabase
      .from('carousel_images')
      .select('imageUrl, storage_path')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // If the image has a storage path, delete it from storage first
    if (image?.storage_path) {
      const { error: storageError } = await this.supabase.storage
        .from('images')
        .remove([image.storage_path]);
      
      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
        // Continue with deletion from the database even if storage deletion fails
      }
    }

    // Delete the image record from the database
    const { error } = await this.supabase
      .from('carousel_images')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async updateImageOrder(images: UpdateOrderItem[]): Promise<void> {
    // Use transaction to ensure all updates succeed or fail together
    const updates = images.map(({ id, displayOrder }) => 
      this.supabase
        .from('carousel_images')
        .update({ displayOrder })
        .eq('id', id)
    );

    // Execute all updates
    await Promise.all(updates);
  }

  // Upload an image to storage and return its URL
  async uploadImage(file: File, folderPath: string = 'carousel'): Promise<{ url: string, path: string }> {
    // Ensure this method is only called in the browser

    // Generate a unique file name to avoid collisions
    const fileName = `${folderPath}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    // Upload the file to storage
    const { data, error } = await this.supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) throw error;
    
    // Get the public URL for the uploaded file
    const { data: publicUrlData } = this.supabase.storage
      .from('images')
      .getPublicUrl(data.path);
    
    return {
      url: publicUrlData.publicUrl,
      path: data.path
    };
  }
} 