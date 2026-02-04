import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { getBrowserClient } from "~/lib/utils/supabase-client";

export function getStorageClient() {
  const { storage } = getBrowserClient();
  return storage;
}

type UploadImageProps = {
  file: File;
  bucket: string;
  folder?: "avatars" | "gallery" | "players" | "games" | "users" | "teams" | "players/waivers";
};

// Re-export specific upload function or rename generic?
// Let's make a generic one and keep the old one for backward compatibility if needed, OR refactor it.
// The file is named `client.ts` but the function is `uploadImageToStorage`.
// I'll add `uploadFileToStorage` and update `uploadImageToStorage` to use it or behave similarly.

export async function uploadFileToStorage({
  file,
  bucket,
  folder,
}: UploadImageProps) {
  const fileName = file.name;
  const fileExtension = fileName.split(".").pop();
  const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExtension}`;

  // Only compress images
  if (file.type.startsWith("image/")) {
    try {
      file = await imageCompression(file, {
        maxSizeMB: 1,
      });
    } catch (error) {
      console.error(error);
      return { image_url: "", image_id: "", error: "Failed to compress image" };
    }
  }

  const storage = getStorageClient();
  const { data, error } = await storage.from(bucket).upload(path, file);

  if (error) {
    console.error(error);
    return { image_url: "", image_id: "", error: "Failed to upload file" };
  }

  const image_url = `${import.meta.env.VITE_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${data?.path}`;
  // keeping 'image_url' key for compatibility but it's really a file_url
  return { image_url: image_url, image_id: data?.id, error: null };
}

// Alias for backward compatibility if needed, or just replace functionality
export { uploadFileToStorage as uploadImageToStorage };
