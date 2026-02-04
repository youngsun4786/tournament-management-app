import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updatePlayer } from "~/src/controllers/player.api";
import { playerQueries } from "~/src/queries";
import { uploadFileToStorage } from "~/supabase/storage/client";

export function useWaiverUpload(teamId?: string) {
  const queryClient = useQueryClient();

  // Update player mutation
  const updatePlayerMutation = useMutation({
    mutationFn: (data: Parameters<typeof updatePlayer>[0]) => {
      return updatePlayer(data);
    },
    onSuccess: (updatedPlayer) => {
      toast.success("Waiver uploaded successfully");
      if (teamId) {
        queryClient.invalidateQueries(playerQueries.teamPlayers(teamId));
      }
      if (updatedPlayer?.id) {
        queryClient.invalidateQueries(playerQueries.detail(updatedPlayer.id));
      }
    },
    onError: (error) => {
      toast.error(`Failed to update player waiver: ${error.message}`);
    },
  });

  const uploadWaiver = async (file: File, playerId: string, name: string, jerseyNumber: number) => {
    try {
      const uploadResult = await uploadFileToStorage({
        file: file,
        bucket: "media-images",
        folder: "players/waivers",
      });

      if (uploadResult.error || !uploadResult.image_url) {
        toast.error(
          `Failed to upload waiver file: ${uploadResult.error || "Unknown error"}`,
        );
        return;
      }

      const waiverUrl = uploadResult.image_url;
      console.log("waiverUrl", waiverUrl);

      updatePlayerMutation.mutate({
        data: {
          teamId: teamId!,
          id: playerId,
          name: name,
          jerseyNumber: jerseyNumber,
          waiverUrl: waiverUrl,
        },
      });
    } catch (error) {
      console.error("Error uploading waiver:", error);
      toast.error("Failed to upload waiver file");
    }
  };

  return {
    uploadWaiver,
    isUploading: updatePlayerMutation.isPending,
  };
}
