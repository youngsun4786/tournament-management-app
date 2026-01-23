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
  folder?: "avatars" | "gallery" | "players" | "games" | "users" | "teams";
};

export async function uploadImageToStorage({
  file,
  bucket,
  folder,
}: UploadImageProps) {
  const fileName = file.name;
  const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);
  const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExtension}`;

  try {
    file = await imageCompression(file, {
      maxSizeMB: 1,
    });
  } catch (error) {
    console.error(error);
    return { image_url: "", image_id: "", error: "Failed to compress image" };
  }

  const storage = getStorageClient();
  const { data, error } = await storage.from(bucket).upload(path, file);

  if (error) {
    console.error(error);
    return { image_url: "", image_id: "", error: "Failed to upload image" };
  }

  const image_url = `${import.meta.env.VITE_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${data?.path}`;
  return { image_url: image_url, image_id: data?.id, error: null };
}
