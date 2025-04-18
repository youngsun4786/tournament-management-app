import { Separator } from "@radix-ui/react-separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, Upload, User, UserRound } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { updateUser } from "~/app/controllers/auth.api";
import { authQueries, useAuthenticatedUser } from "~/app/queries";
import { uploadImageToStorage } from "~/supabase/storage/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function ProfileCard() {
  const {
    data: { user },
  } = useAuthenticatedUser();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateUserMutation = useMutation({
    mutationFn: (data: Parameters<typeof updateUser>[0]) => updateUser(data),
    onSuccess: () => {
      toast.success("Your profile has been updated.");
      queryClient.invalidateQueries(authQueries.user());
      // Clear the preview and new avatar URL after successful update
      setPreviewUrl(null);
      setNewAvatarUrl(null);
    },
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const teamId = user.meta.teamId!;
    // If there's a new avatar URL, include it in the user update
    const userData = {
      firstName,
      lastName,
      teamId,
      ...(newAvatarUrl && { avatarUrl: newAvatarUrl }),
    };

    updateUserMutation.mutate({ data: userData });
  };

  const handleAvatarClick = () => {
    // Trigger the hidden file input click
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    if (e.target.files.length > 1) {
      toast.error("Please select one image");
      return;
    }

    const file = e.target.files[0];

    // Only allow image files
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Create a preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      setIsUploading(true);

      // Upload to storage
      const uploadResult = await uploadImageToStorage({
        file,
        bucket: "avatars",
        folder: "users",
      });

      if (uploadResult.error || !uploadResult.image_url) {
        toast.error(`Failed to upload image: ${uploadResult.error ?? "ERROR"}`);
        return;
      }

      if (uploadResult.image_url) {
        // Store the URL but don't update the database yet
        setNewAvatarUrl(uploadResult.image_url);
        toast.success(
          "Image uploaded successfully. Click 'Save Changes' to update your profile."
        );
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // The current display URL - either the preview, the existing avatar, or the placeholder
  const displayAvatarUrl =
    previewUrl || user.meta.avatarUrl || "/placeholder.svg";

  // Whether to show changes are pending
  const hasUnsavedChanges = newAvatarUrl !== null;

  return (
    <form onSubmit={onSubmit} className="w-full max-w-lg mx-auto my-8">
      <Card className="shadow-lg border-0 bg-gradient-to-r from-slate-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden">
        <CardHeader className="pb-4 relative">
          <div className="relative z-10 flex flex-col items-center pt-4">
            <div className="relative group">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />

              <Avatar
                className={`h-24 w-24 ring-4 ${
                  hasUnsavedChanges
                    ? "ring-rose-400 dark:ring-rose-600"
                    : "ring-white dark:ring-gray-800"
                } shadow-xl transition-all duration-200 relative`}
              >
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full z-10">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                <AvatarImage
                  src={displayAvatarUrl}
                  alt={`${user.meta.firstName} ${user.meta.lastName}`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-rose-400 to-red-600 text-white">
                  <UserRound className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>

              <Button
                type="button"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-slate-900 hover:bg-slate-700 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                variant="outline"
                size="icon"
                disabled={isUploading}
                onClick={handleAvatarClick}
              >
                <Upload className="h-4 w-4 text-white" />
              </Button>
            </div>
            {hasUnsavedChanges && (
              <span className="text-xs text-rose-600 dark:text-rose-400 mt-4">
                New avatar selected, click Save Changes to update
              </span>
            )}
            <CardTitle className="mt-4 text-2xl font-bold">
              {user.meta.firstName} {user.meta.lastName}
            </CardTitle>
            <CardDescription className="text-sm opacity-80">
              Manage your personal information
            </CardDescription>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="firstName"
                className="text-sm font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4 opacity-70" />
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                defaultValue={user.meta.firstName}
                placeholder="Enter first name"
                className="focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="lastName"
                className="text-sm font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4 opacity-70" />
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                defaultValue={user.meta.lastName}
                placeholder="Enter last name"
                className="focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 opacity-70" />
              Email
              <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">
                Verified
              </span>
            </Label>
            <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              {user.email}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-2 pb-6">
          <Button
            type="submit"
            className={`${
              hasUnsavedChanges
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800"
            } shadow-md transition-all duration-200`}
            disabled={updateUserMutation.isPending}
          >
            {updateUserMutation.isPending ? (
              <>
                Updating <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
