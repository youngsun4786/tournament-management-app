import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "lib/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "lib/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "lib/components/ui/form";
import { Input } from "lib/components/ui/input";
import { Textarea } from "lib/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { convertBlobUrlToFile } from "~/lib/utils/index";

type UploadImageProps = {
  folderType: "avatars" | "gallery" | "players" | "games" | "users";
  handleUpload?: (data: z.infer<typeof formSchema>) => void;
  setPreviewUrls?: (urls: string[]) => void;
};

export type UploadImageFormSchema = z.infer<typeof formSchema>;

const formSchema = z.object({
  files: z.array(z.instanceof(File)),
  description: z.string().optional(),
  bucket: z.string(),
  folder: z.enum(["avatars", "gallery", "players", "games", "users"]),
});

export function UploadImage({
  folderType,
  handleUpload,
  setPreviewUrls,
}: UploadImageProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
      description: "",
      bucket: "media-images",
      folder: folderType,
    },
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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
      form.setValue("files", filesArray);
    }
  };

  const handleImageSubmit = async (data: z.infer<typeof formSchema>) => {
    setUploading(true);
    try {
      const files: File[] = [];
      for (const url of imageUrls) {
        const imageFile = await convertBlobUrlToFile(url);
        files.push(imageFile);
      }

      // Pass data to parent component via handleUpload if provided
      if (handleUpload) {
        // Set the uploadedUrls as the file property to be used by the parent component
        const formData = {
          ...data,
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upload New Image</CardTitle>
        <CardDescription>Upload images to the gallery</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleImageSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="files"
              render={() => (
                <FormItem>
                  <FormLabel>Select Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple={folderType !== "avatars"}
                      onChange={handleImageChange}
                      className="cursor-pointer"
                      disabled={uploading}
                      ref={fileRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {folderType !== "avatars" && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter image description"
                        className="resize-none"
                        disabled={uploading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
        </Form>
      </CardContent>
    </Card>
  );
}
