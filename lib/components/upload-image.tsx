import { Button } from "lib/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "lib/components/ui/card";
import { Input } from "lib/components/ui/input";
import { Label } from "lib/components/ui/label";
import { Textarea } from "lib/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useAppForm } from "~/lib/form";
import { convertBlobUrlToFile } from "~/lib/utils/index";

type UploadImageProps = {
  folderType: "avatars" | "gallery" | "players" | "games" | "users";
  handleUpload?: (data: z.infer<typeof formSchema>) => void;
  setPreviewUrls?: (urls: string[]) => void;
};

export type UploadImageFormSchema = z.infer<typeof formSchema>;

const formSchema = z.object({
  files: z.array(z.instanceof(File)),
  description: z.string(),
  bucket: z.string(),
  folder: z.enum(["avatars", "gallery", "players", "games", "users"]),
});

export function UploadImage({
  folderType,
  handleUpload,
  setPreviewUrls,
}: UploadImageProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const form = useAppForm({
    defaultValues: {
      files: [] as File[],
      description: "",
      bucket: "media-images",
      folder: folderType as "avatars" | "gallery" | "players" | "games" | "users",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setUploading(true);
      try {
        const files: File[] = [];
        for (const url of imageUrls) {
          const imageFile = await convertBlobUrlToFile(url);
          files.push(imageFile);
        }

        // Pass data to parent component via handleUpload if provided
        if (handleUpload) {
          const formData = {
            ...value,
            files: files,
          };
          await handleUpload(formData);
        }

        // Clear form state
        setImageUrls([]);
        form.reset();
        if (fileRef.current) {
          fileRef.current.value = "";
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image");
        return null;
      } finally {
        setUploading(false);
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setImageUrls((prev) => [...prev, ...newImageUrls]);
      if (setPreviewUrls) {
        setPreviewUrls(newImageUrls);
      }

      // Update form value for file field
      form.setFieldValue("files", filesArray);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upload New Image</CardTitle>
        <CardDescription>Upload images to the gallery</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="files">
            {(field) => (
              <div>
                <Label htmlFor={field.name}>Select Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple={folderType !== "avatars"}
                  onChange={handleImageChange}
                  className="cursor-pointer"
                  disabled={uploading}
                  ref={fileRef}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm mt-1">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          {folderType !== "avatars" && (
            <form.Field name="description">
              {(field) => (
                <div>
                  <Label htmlFor={field.name}>Description (optional)</Label>
                  <Textarea
                    id={field.name}
                    placeholder="Enter image description"
                    className="resize-none"
                    disabled={uploading}
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>
          )}
          <Button type="submit" disabled={uploading} className="w-full mt-2">
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Upload Image
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
