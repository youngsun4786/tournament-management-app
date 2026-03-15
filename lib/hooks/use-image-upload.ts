import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { updateTeam } from "~/src/controllers/team.api";
import { teamQueries } from "~/src/queries";
import { uploadFileToStorage } from "~/supabase/storage/client";

export function useImageUpload({
  teamId,
  field,
  label,
  folder,
}: {
  teamId: string;
  field: "logoUrl" | "imageUrl";
  label: string;
  folder: "avatars" | "gallery" | "players" | "games" | "users" | "teams" | "players/waivers";
}) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof updateTeam>[0]) => updateTeam(data),
    onSuccess: () => {
      toast.success(`${label} updated successfully`);
      queryClient.invalidateQueries(teamQueries.getTeamById(teamId));
      setPreview(null);
      setFile(null);
    },
    onError: (error) => {
      toast.error(`Failed to update ${label.toLowerCase()}: ${error.message}`);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selected = e.target.files[0];
    if (!selected.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      setPreview(URL.createObjectURL(selected));
      setFile(selected);
    } catch (error) {
      console.error(`Error preparing ${label.toLowerCase()}:`, error);
      toast.error("Failed to prepare image");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      const uploadResult = await uploadFileToStorage({
        file,
        bucket: "media-images",
        folder,
      });

      if (uploadResult.error || !uploadResult.image_url) {
        toast.error(
          `Failed to upload ${label.toLowerCase()}: ${uploadResult.error}`,
        );
        return;
      }

      mutation.mutate({
        data: {
          teamId,
          data: { [field]: uploadResult.image_url },
        },
      });
    } catch (error) {
      console.error(`Error uploading ${label.toLowerCase()}:`, error);
      toast.error(`Failed to upload ${label.toLowerCase()}`);
    } finally {
      setIsUploading(false);
    }
  };

  const cancel = () => {
    setPreview(null);
    setFile(null);
  };

  return { inputRef, preview, file, isUploading, handleChange, handleUpload, cancel };
}
