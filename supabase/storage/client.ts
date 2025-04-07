import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import { supabaseServer } from "~/lib/utils/supabase-server";
export function getStorageClient() {
  const { storage } = supabaseServer;
    return storage;
}

type UploadImageProps = {
  file: File;
  bucket: string;
  folder?: string;
};

export async function uploadImage({ file, bucket, folder }: UploadImageProps) {
    const fileName = file.name;
    const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);
    const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExtension}`;

    try {
        file = await imageCompression(file, {
            maxSizeMB: 1,
        });
    } catch (error) {
        console.error(error);
        return {imageUrl: "", error: "Failed to compress image"};
    }

    const storage = getStorageClient();
    const { data, error } = await storage.from(bucket).upload(path, file);

    if (error) {
        console.error(error);
        return {imageUrl: "", error: "Failed to upload image"};
    }

    const imageUrl = `${process.env.SUPABASE_URL!}/storage/v1/object/public/${bucket}/${data?.path}`;
    return {imageUrl: imageUrl, error: null};
}
