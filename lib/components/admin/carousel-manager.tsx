import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UploadImage,
  UploadImageFormSchema,
} from "lib/components/upload-image";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { addImages } from "~/app/controllers/media.api";
import { mediaQueries } from "~/app/queries";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/lib/components/ui/alert-dialog";
import { AspectRatio } from "~/lib/components/ui/aspect-ratio";
import { Button } from "~/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";
import { uploadImageToStorage } from "~/supabase/storage/client";

export function CarouselManager() {
  const [error, setError] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const queryClient = useQueryClient();

  const addGalleryMutation = useMutation({
    mutationFn: (data: Parameters<typeof addImages>[0]) => {
      return addImages(data);
    },
    onSuccess: () => {
      toast.success("Images uploaded and saved successfully");
      queryClient.resetQueries(mediaQueries.specificImages("gallery"));
      // Clear preview images
      setPreviewUrls([]);
    },
  });

  // Handle image upload via the UploadImage component
  const handleImageUpload = async (imageData: UploadImageFormSchema) => {
    setError(null);

    try {
      const uploadedUrls: string[] = [];
      const imageIds: string[] = [];

      for (const imageFile of imageData.files) {
        const uploadResult = await uploadImageToStorage({
          file: imageFile,
          bucket: imageData.bucket,
          folder: imageData.folder,
        });

        if (uploadResult.error) {
          toast.error(uploadResult.error);
          return;
        }

        if (uploadResult.image_url) {
          uploadedUrls.push(uploadResult.image_url);
          imageIds.push(uploadResult.image_id);
        }
      }

      if (
        imageData.files &&
        imageData.files.length > 0 &&
        uploadedUrls.length > 0
      ) {
        // Store the images in the database using the addImage API

        await addGalleryMutation.mutate({
          data: {
            imageUrls: uploadedUrls,
            imageIds: imageIds,
            description: imageData.description || undefined,
            folder: imageData.folder,
          },
        });
      }
      console.log("Added images", uploadedUrls);

      return Promise.resolve();
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image";
      setError(errorMessage);
      toast.error("Failed to upload image");
      return Promise.reject(error);
    }
  };

  const navigateCarousel = (direction: "next" | "prev") => {
    if (previewUrls.length === 0) return;

    if (direction === "next") {
      setCurrentImageIndex((prev) =>
        prev === previewUrls.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? previewUrls.length - 1 : prev - 1
      );
    }
  };

  const removeImage = (index: number) => {
    // In a real implementation, you would also delete from storage/database
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    if (currentImageIndex >= index && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardDescription>
          Manage images displayed in the homepage
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Add new image section */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Upload image component */}
          <UploadImage
            folderType="gallery"
            handleUpload={handleImageUpload}
            setPreviewUrls={setPreviewUrls}
          />

          {/* Image carousel preview */}
          <Card className="overflow-hidden col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
              <CardDescription>
                Preview how images will appear in the carousel
              </CardDescription>
            </CardHeader>
            <CardContent>
              {previewUrls.length > 0 ? (
                <div className="relative">
                  <AspectRatio
                    ratio={16 / 9}
                    className="bg-muted overflow-hidden rounded-md"
                  >
                    <img
                      src={previewUrls[currentImageIndex]}
                      alt={`Carousel Images-${currentImageIndex + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>

                  {previewUrls.length > 1 && (
                    <div className="absolute inset-0 flex justify-between items-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
                        onClick={() => navigateCarousel("prev")}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
                        onClick={() => navigateCarousel("next")}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Image</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this image?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeImage(currentImageIndex)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  {previewUrls.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                      {previewUrls.map((_, index) => (
                        <button
                          key={index}
                          className={`h-2 w-2 rounded-full ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border rounded-md p-8 h-[200px] bg-muted">
                  <p className="text-muted-foreground">
                    No images uploaded yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Images you upload will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
