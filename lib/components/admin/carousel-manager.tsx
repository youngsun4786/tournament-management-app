import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { carouselService } from "~/app/container";
import {
  addCarouselImage,
  deleteCarouselImage,
  getCarouselImages,
  updateCarouselImageOrder,
} from "~/app/controllers/carousel.api";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";
import { Input } from "~/lib/components/ui/input";
import { Label } from "~/lib/components/ui/label";
import { Textarea } from "~/lib/components/ui/textarea";

interface CarouselImage {
  id: string;
  imageUrl: string;
  displayOrder: number;
  description?: string;
  storage_path?: string;
  created_at: string;
}

export function CarouselManager() {
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Query to fetch carousel images
  const { data: images = [], isLoading } = useQuery({
    queryKey: ["carouselImages"],
    queryFn: () => getCarouselImages(),
    // Add error handling for the query
    onError: (err) => {
      console.error("Error fetching carousel images:", err);
      toast.error("Failed to load carousel images");
    },
  });

  // Mutation to add an image
  const addImageMutation = useMutation({
    mutationFn: (data: Parameters<typeof addCarouselImage>[0]) =>
      addCarouselImage(data),
    onSuccess: () => {
      toast.success("Image added to carousel");
      queryClient.invalidateQueries({ queryKey: ["carouselImages"] });
      setImageUrl("");
      setDescription("");
      setFile(null);
      setError(null);
    },
    onError: (err) => {
      console.error("Error adding image:", err);
      toast.error("Failed to add image to carousel");
      setError("Failed to add image. Please try again later.");
    },
  });

  // Mutation to delete an image
  const deleteImageMutation = useMutation({
    mutationFn: (data: Parameters<typeof deleteCarouselImage>[0]) =>
      deleteCarouselImage(data),
    onSuccess: () => {
      toast.success("Image removed from carousel");
      queryClient.invalidateQueries({ queryKey: ["carouselImages"] });
    },
    onError: (err) => {
      console.error("Error deleting image:", err);
      toast.error("Failed to delete image");
    },
  });

  // Mutation to update the order of images
  const updateOrderMutation = useMutation({
    mutationFn: (data: Parameters<typeof updateCarouselImageOrder>[0]) =>
      updateCarouselImageOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carouselImages"] });
    },
    onError: (err) => {
      console.error("Error updating image order:", err);
      toast.error("Failed to update image order");
    },
  });

  // Function to move an image up or down in the order
  const moveImage = (id: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex((img) => img.id === id);
    if (currentIndex === -1) return;

    const newImages = [...images];

    if (direction === "up" && currentIndex > 0) {
      // Swap with the previous image
      const temp = newImages[currentIndex].displayOrder;
      newImages[currentIndex].displayOrder =
        newImages[currentIndex - 1].displayOrder;
      newImages[currentIndex - 1].displayOrder = temp;
    } else if (direction === "down" && currentIndex < newImages.length - 1) {
      // Swap with the next image
      const temp = newImages[currentIndex].displayOrder;
      newImages[currentIndex].displayOrder =
        newImages[currentIndex + 1].displayOrder;
      newImages[currentIndex + 1].displayOrder = temp;
    } else {
      return; // Can't move further in this direction
    }

    // Update the order in the database
    updateOrderMutation.mutate({
      images: newImages.map((img) => ({
        id: img.id,
        displayOrder: img.displayOrder,
      })),
    });
  };

  // Handle file upload to Supabase storage
  const handleFileUpload = async () => {
    if (!file) return;
    setError(null);

    try {
      setUploading(true);

      try {
        // Use the service to upload the file
        const { url, path } = await carouselService.uploadImage(file);

        // Add the image to the carousel database with the storage path
        await addImageMutation.mutateAsync({
          imageUrl: url,
          description,
          storage_path: path,
        });

        toast.success("Image uploaded successfully");
      } catch (uploadError: any) {
        if (
          uploadError?.message?.includes("Buffer") ||
          uploadError?.name === "ReferenceError"
        ) {
          setError(
            "Browser error: File upload functionality may be limited. Try using an image URL instead."
          );
          console.error("Browser compatibility error:", uploadError);
          toast.error("Browser compatibility issue with file upload");
        } else {
          throw uploadError; // rethrow other errors
        }
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setError(error?.message || "Failed to upload image");
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Handle image submission from URL
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;
    setError(null);

    addImageMutation.mutate({
      imageUrl,
      description,
      // No storage_path for external images
    });
  };

  // Handle deleting an image
  const handleDeleteImage = (id: string) => {
    deleteImageMutation.mutate({ id });
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Carousel Manager</CardTitle>
        <CardDescription>
          Manage images displayed in the homepage carousel
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Add new image section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload New Image</CardTitle>
              <CardDescription>
                Upload an image from your device to Supabase Storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file" className="block mb-2">
                  Select Image
                </Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
              </div>
              <div>
                <Label htmlFor="description" className="block mb-2">
                  Description (optional)
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter image description"
                  className="resize-none"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleFileUpload}
                disabled={!file || uploading}
                className="w-full"
              >
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
            </CardFooter>
          </Card>

          {/* Add from URL */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add from URL</CardTitle>
              <CardDescription>
                Use an external image URL (not stored in Supabase)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="imageUrl" className="block mb-2">
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="urlDescription" className="block mb-2">
                    Description (optional)
                  </Label>
                  <Textarea
                    id="urlDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter image description"
                    className="resize-none"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmit}
                disabled={!imageUrl || addImageMutation.isPending}
                className="w-full"
              >
                {addImageMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                  </>
                ) : (
                  <>
                    <ImagePlus className="mr-2 h-4 w-4" /> Add Image
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Current images list */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Current Carousel Images
          </h3>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-muted">
              <p className="text-muted-foreground">
                No images added to the carousel yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={image.imageUrl}
                      alt={image.description || "Carousel image"}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <CardContent className="p-4">
                    {image.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {image.description}
                      </p>
                    )}
                    <div className="flex items-center mb-2 text-xs text-muted-foreground">
                      <span
                        className={image.storage_path ? "text-green-500" : ""}
                      >
                        {image.storage_path
                          ? "Stored in Supabase"
                          : "External URL"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveImage(image.id, "up")}
                          disabled={
                            images.indexOf(image) === 0 ||
                            updateOrderMutation.isPending
                          }
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveImage(image.id, "down")}
                          disabled={
                            images.indexOf(image) === images.length - 1 ||
                            updateOrderMutation.isPending
                          }
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Image</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove this image from
                              the carousel?{" "}
                              {image.storage_path &&
                                "The image will also be deleted from Supabase Storage."}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteImage(image.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
