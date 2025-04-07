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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { convertBlobUrlToFile } from "~/lib/utils";

type UploadImageProps = {
  isProfileImage: boolean;
  handleUpload: (data: z.infer<typeof formSchema>) => void;
};

const formSchema = z.object({
  file: z.array(z.instanceof(File)),
  description: z.string().optional(),
  bucket: z.string(),
  folder: z.string().optional(),
});

export function UploadImage({
  isProfileImage = false,
  handleUpload,
}: UploadImageProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: [],
      description: "",
      bucket: "media-images",
      folder: isProfileImage ? "avatars" : "gallery",
    },
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // allow only one file to be uploaded if it is a profile image
    if (isProfileImage && e.target.files && e.target.files.length > 1) {
      toast.error("Please select one profile image");
      return;
    }

    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setImageUrls((prev) => [...prev, ...newImageUrls]);

      // Update form value for file field
      form.setValue("file", filesArray);
    }
  };

  const handleImageSubmit = async (data: z.infer<typeof formSchema>) => {
    setUploading(true);
    const files: File[] = [];
    for (const url of imageUrls) {
      const imageFile = await convertBlobUrlToFile(url);
      // const { imageUrl, error } = await uploadImage({
      //   file: imageFile,
      //   bucket: data.bucket,
      //   folder: data.folder,
      // });
      files.push(imageFile);
    }
    const uploadData = {
      data: {
        file: files,
        description: data.description,
        bucket: data.bucket,
        folder: data.folder,
      },
    };
    // handleUpload({
    //   file: files,
    //   description: data.description,
    //   bucket: data.bucket,
    //   folder: data.folder,
    //   mediaType: mediaType,
    // });
    console.log(uploadData);
    setImageUrls([]);
    setUploading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upload New Image</CardTitle>
        <CardDescription>
          Upload an image from your device to the gallery
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleImageSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Select Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple={!isProfileImage}
                      onChange={handleImageChange}
                      className="cursor-pointer"
                      disabled={uploading}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isProfileImage && (
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
