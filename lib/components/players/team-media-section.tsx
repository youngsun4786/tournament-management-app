import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, UploadCloud, User } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";
import { updateTeam } from "~/src/controllers/team.api";
import { teamQueries } from "~/src/queries";
import { Team } from "~/src/types/team";
import { uploadFileToStorage } from "~/supabase/storage/client";

interface TeamMediaSectionProps {
  teamId: string;
  team?: Team;
}

export const TeamMediaSection = ({ teamId, team }: TeamMediaSectionProps) => {
  const teamLogoInputRef = useRef<HTMLInputElement>(null);
  const [teamLogoPreview, setTeamLogoPreview] = useState<string | null>(null);
  const [newTeamLogoFile, setNewTeamLogoFile] = useState<File | null>(null);
  const [isTeamLogoUploading, setIsTeamLogoUploading] = useState(false);

  const teamPhotoInputRef = useRef<HTMLInputElement>(null);
  const [teamPhotoPreview, setTeamPhotoPreview] = useState<string | null>(null);
  const [newTeamPhotoFile, setNewTeamPhotoFile] = useState<File | null>(null);
  const [isTeamPhotoUploading, setIsTeamPhotoUploading] = useState(false);

  const queryClient = useQueryClient();

  const updateTeamMutation = useMutation({
    mutationFn: (data: Parameters<typeof updateTeam>[0]) => updateTeam(data),
    onSuccess: () => {
      toast.success("Team logo updated successfully");
      queryClient.invalidateQueries(teamQueries.getTeamById(teamId));
      setTeamLogoPreview(null);
      setNewTeamLogoFile(null);
    },
    onError: (error) => {
      toast.error(`Failed to update team logo: ${error.message}`);
    },
  });

  const updateTeamPhotoMutation = useMutation({
    mutationFn: (data: Parameters<typeof updateTeam>[0]) => updateTeam(data),
    onSuccess: () => {
      toast.success("Team photo updated successfully");
      queryClient.invalidateQueries(teamQueries.getTeamById(teamId));
      setTeamPhotoPreview(null);
      setNewTeamPhotoFile(null);
    },
    onError: (error) => {
      toast.error(`Failed to update team photo: ${error.message}`);
    },
  });

  const handleTeamLogoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      const objectUrl = URL.createObjectURL(file);
      setTeamLogoPreview(objectUrl);
      setNewTeamLogoFile(file);
    } catch (error) {
      console.error("Error preparing team logo:", error);
      toast.error("Failed to prepare image");
    }
  };

  const handleTeamLogoUpload = async () => {
    if (!newTeamLogoFile) return;

    try {
      setIsTeamLogoUploading(true);
      const uploadResult = await uploadFileToStorage({
        file: newTeamLogoFile,
        bucket: "media-images",
        folder: "teams",
      });

      if (uploadResult.error || !uploadResult.image_url) {
        toast.error(`Failed to upload team logo: ${uploadResult.error}`);
        return;
      }

      const logoUrl = uploadResult.image_url;

      updateTeamMutation.mutate({
        data: {
          teamId,
          data: {
            logoUrl: logoUrl,
          },
        },
      });
    } catch (error) {
      console.error("Error uploading team logo:", error);
      toast.error("Failed to upload team logo");
    } finally {
      setIsTeamLogoUploading(false);
    }
  };

  const handleTeamPhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      const objectUrl = URL.createObjectURL(file);
      setTeamPhotoPreview(objectUrl);
      setNewTeamPhotoFile(file);
    } catch (error) {
      console.error("Error preparing team photo:", error);
      toast.error("Failed to prepare image");
    }
  };

  const handleTeamPhotoUpload = async () => {
    if (!newTeamPhotoFile) return;

    try {
      setIsTeamPhotoUploading(true);
      const uploadResult = await uploadFileToStorage({
        file: newTeamPhotoFile,
        bucket: "media-images",
        folder: "teams",
      });

      if (uploadResult.error || !uploadResult.image_url) {
        toast.error(`Failed to upload team photo: ${uploadResult.error}`);
        return;
      }

      const imageUrl = uploadResult.image_url;

      updateTeamPhotoMutation.mutate({
        data: {
          teamId,
          data: {
            imageUrl: imageUrl,
          },
        },
      });
    } catch (error) {
      console.error("Error uploading team photo:", error);
      toast.error("Failed to upload team photo");
    } finally {
      setIsTeamPhotoUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Logo Card */}
      <Card>
        <CardHeader>
          <CardTitle>Team Logo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-md relative group shrink-0">
              {teamLogoPreview ? (
                <img
                  src={teamLogoPreview}
                  alt="Team logo preview"
                  className="w-full h-full object-contain p-2"
                />
              ) : team?.logoUrl ? (
                <img
                  src={
                    team.logoUrl.startsWith("http")
                      ? team.logoUrl
                      : `/team_logos/${team.logoUrl}`
                  }
                  alt={`${team?.name} logo`}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}

              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white hover:bg-white/20"
                  onClick={() => teamLogoInputRef.current?.click()}
                >
                  <Upload className="h-6 w-6" />
                </Button>
              </div>
              <input
                type="file"
                ref={teamLogoInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleTeamLogoChange}
              />
            </div>
            {newTeamLogoFile && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleTeamLogoUpload}
                  disabled={isTeamLogoUploading}
                >
                  {isTeamLogoUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UploadCloud className="mr-2 h-4 w-4" />
                  )}
                  Save Logo
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTeamLogoPreview(null);
                    setNewTeamLogoFile(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Team Photo Card */}
      <Card>
        <CardHeader>
          <CardTitle>Team Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden group">
            {teamPhotoPreview ? (
              <img
                src={teamPhotoPreview}
                alt="Team Photo Preview"
                className="w-full h-full object-cover"
              />
            ) : team?.imageUrl ? (
              <img
                src={team?.imageUrl}
                alt="Team Photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Upload className="h-12 w-12 mb-2" />
                <span>Upload Team Photo</span>
              </div>
            )}

            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                onClick={() => teamPhotoInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Change Photo
              </Button>
            </div>
            <input
              type="file"
              ref={teamPhotoInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleTeamPhotoChange}
            />
          </div>
          {newTeamPhotoFile && (
            <div className="mt-4 flex gap-2">
              <Button
                onClick={handleTeamPhotoUpload}
                disabled={isTeamPhotoUploading}
              >
                {isTeamPhotoUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="mr-2 h-4 w-4" />
                )}
                Save Photo
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setTeamPhotoPreview(null);
                  setNewTeamPhotoFile(null);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
