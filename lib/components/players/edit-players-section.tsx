import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Loader2,
  PlusCircle,
  Upload,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/lib/components/ui/avatar";
import { Badge } from "~/lib/components/ui/badge";
import { Button } from "~/lib/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/lib/components/ui/dialog";
import { Input } from "~/lib/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";
import { convertBlobUrlToFile } from "~/lib/utils/index";
import {
  createPlayer,
  deletePlayer,
  updatePlayer,
} from "~/src/controllers/player.api";
import { updateTeam } from "~/src/controllers/team.api";
import { playerQueries, teamQueries } from "~/src/queries";
import { Player } from "~/src/types/player";
import { Team } from "~/src/types/team";
import { uploadFileToStorage } from "~/supabase/storage/client";

interface EditPlayersSectionProps {
  teamId: string;
  team?: Team;
  players?: Player[];
  isPlayersLoading: boolean;
  captain?: {
    firstName: string;
    lastName: string;
  };
  showCaptainInfo?: boolean;
}

export const EditPlayersSection = ({
  teamId,
  team,
  players,
  isPlayersLoading,
  captain,
  showCaptainInfo = false,
}: EditPlayersSectionProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

      // Update team with new logo URL (extract filename from URL if needed, or store full URL depending on implementation)
      // The current implementation seems to store the filename/path in logo_url based on edit-players-section.tsx line 429
      // but the uploadImageToStorage returns a full URL.
      // Let's check how src/routes/teams/$teamId.tsx uses it.
      // It uses `src={'/team_logos/${team.logo_url}'}`.
      // So I should probably change the logic in $teamId.tsx to handle absolute URLs too, OR just store the filename here.
      // But uploadImageToStorage returns the full URL.
      // If I look at the upload function: `path` is `folder/uuid.ext`.
      // The return image_url is fully qualified.
      // The existing code expects a local path relative to `/team_logos/`.
      // I should update the team with the FULL URL, and update the display component to handle it.

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

  // Create player mutation
  const createPlayerMutation = useMutation({
    mutationFn: (data: Parameters<typeof createPlayer>[0]) => {
      return createPlayer(data);
    },
    onSuccess: async (newPlayer) => {
      toast.success("Player added successfully");
      queryClient.invalidateQueries(playerQueries.teamPlayers(teamId));

      if (newPlayer?.id) {
        queryClient.invalidateQueries(playerQueries.detail(newPlayer.id));
      }
      setIsCreateDialogOpen(false);
      setPreviewUrl(null);
      setNewAvatarUrl(null);
      setNewAvatarFile(null);
      fileInputRef.current!.value = "";
    },
    onError: (error) => {
      toast.error(`Failed to add player: ${error.message}`);
    },
  });

  // Update player mutation
  const updatePlayerMutation = useMutation({
    mutationFn: (data: Parameters<typeof updatePlayer>[0]) => {
      try {
        return updatePlayer(data);
      } catch (error) {
        console.error("Error updating player:", error);
        throw error;
      }
    },
    onSuccess: async (updatedPlayer) => {
      toast.success("Player updated successfully");
      queryClient.invalidateQueries(playerQueries.teamPlayers(teamId));
      if (updatedPlayer?.id) {
        queryClient.invalidateQueries(playerQueries.detail(updatedPlayer.id));
      }
      setIsEditDialogOpen(false);
      setSelectedPlayer(null);
      setPreviewUrl(null);
      setNewAvatarUrl(null);
      setNewAvatarFile(null);
      fileInputRef.current!.value = "";
    },
    onError: (error) => {
      toast.error(`Failed to update player: ${error.message}`);
    },
  });

  // Delete player mutation
  const deletePlayerMutation = useMutation({
    mutationFn: (data: Parameters<typeof deletePlayer>[0]) =>
      deletePlayer(data),
    onSuccess: (deletedPlayer) => {
      toast.success("Player removed successfully");
      queryClient.invalidateQueries(playerQueries.teamPlayers(teamId));
      if (deletedPlayer?.id) {
        queryClient.invalidateQueries(playerQueries.detail(deletedPlayer.id));
      }
      setIsEditDialogOpen(false);
      setSelectedPlayer(null);
    },
    onError: (error) => {
      toast.error(`Failed to remove player: ${error.message}`);
    },
  });

  // Display avatar URL
  const displayAvatarUrl =
    previewUrl || selectedPlayer?.playerUrl || "/placeholder.svg";

  const hasUnsavedChanges = newAvatarUrl !== null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    if (e.target.files.length > 1) {
      toast.error("Please select one image");
      return;
    }

    const file = e.target.files[0];

    e.target.value = "";

    // Only allow image files
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    try {
      setIsUploading(true);
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setNewAvatarFile(await convertBlobUrlToFile(objectUrl));
      toast.success("Click 'Upload Photo' to upload player's profile image.");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // Clear avatar
  const clearAvatar = useCallback(() => {
    setNewAvatarFile(null);
    setNewAvatarUrl(null);
    setPreviewUrl(null);
    fileInputRef.current!.value = "";
  }, []);

  const handleCreatePlayer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!teamId) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const jersey_number = formData.get("jersey_number") as string;
    const position = formData.get("position") as string;
    const height = formData.get("height") as string;
    const weight = formData.get("weight") as string;

    // Convert jersey number to number type
    const jerseyNumber = jersey_number ? parseInt(jersey_number, 10) : 0;

    // Create the player without the avatar URL first
    createPlayerMutation.mutate({
      data: {
        teamId,
        name,
        jerseyNumber,
        position: position || undefined,
        height: height || undefined,
        weight: weight || undefined,
        // Avatar will be handled in the onSuccess callback
        ...(newAvatarUrl && { playerUrl: newAvatarUrl }),
      },
    });
  };

  const handleEditPlayer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPlayer) {
      console.error("No player selected for editing");
      toast.error("No player selected for editing");
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const jersey_number = formData.get("jersey_number") as string;
      const position = formData.get("position") as string;
      const height = formData.get("height") as string;
      const weight = formData.get("weight") as string;

      // Ensure jersey number is a number
      const jerseyNumber = jersey_number ? parseInt(jersey_number, 10) : 0;

      // Only send the existing player_url if no new avatar is being uploaded
      // If a new avatar is being uploaded, it will be handled in the onSuccess callback
      const updateData = {
        data: {
          id: selectedPlayer.id,
          teamId,
          name,
          jerseyNumber,
          position: position || undefined,
          height: height || undefined,
          weight: weight || undefined,
          ...(newAvatarUrl && { playerUrl: newAvatarUrl }),
        },
      };

      updatePlayerMutation.mutate(updateData);
    } catch (error) {
      console.error("Error loading player's information:", error);
      toast.error("Failed to load player's information");
    }
  };

  const handleDeletePlayer = (playerId: string) => {
    deletePlayerMutation.mutate({ data: { playerId } });
  };

  const openEditDialog = (player: Player) => {
    setSelectedPlayer(player);
    // Set avatar preview if player has an avatar
    if (player.playerUrl) {
      setNewAvatarUrl(player.playerUrl);
    } else {
      setNewAvatarUrl(null);
    }

    setIsEditDialogOpen(true);
  };

  const handleAvatarUpload = async () => {
    if (!newAvatarFile) return;

    try {
      setIsUploading(true);
      const uploadResult = await uploadFileToStorage({
        file: newAvatarFile,
        bucket: "media-images",
        folder: "players",
      });

      if (uploadResult.error || !uploadResult.image_url) {
        toast.error(
          `Failed to upload player's profile image: ${uploadResult.error ?? "ERROR"}`,
        );
      } else if (uploadResult.image_url) {
        setNewAvatarUrl(uploadResult.image_url);
        toast.success(
          "Image uploaded successfully. Click 'Save Changes' to update player's profile.",
        );
      }
    } catch (error) {
      console.error("Error uploading player's profile image:", error);
      toast.error("Failed to upload player's profile image");
    } finally {
      setIsUploading(false);
    }
  };

  const AvatarUpload = () => {
    return (
      <>
        <div className="flex flex-col items-center mb-4">
          <div className="relative group">
            {/* Hidden file input */}
            <input
              type="file"
              id="edit-avatar-upload"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            <Avatar
              className={`h-20 w-20 ring-2 ${
                newAvatarUrl
                  ? "ring-rose-400 dark:ring-rose-600"
                  : "ring-white dark:ring-gray-800"
              } shadow-md transition-all duration-200 relative`}
            >
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full z-10">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
              <AvatarImage
                src={displayAvatarUrl}
                alt={selectedPlayer?.name || "Player avatar"}
                className="object-cover"
              />
              <AvatarFallback className="bg-gray-200">
                <User className="h-10 w-10 text-gray-400" />
              </AvatarFallback>
            </Avatar>

            <Button
              type="button"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-slate-900 hover:bg-slate-700 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              variant="outline"
              size="icon"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 text-white" />
            </Button>
          </div>
          {hasUnsavedChanges && (
            <span className="text-xs text-rose-600 dark:text-rose-400 mt-4">
              New avatar selected, click Save Changes to update
            </span>
          )}
          <div className="flex items-center mt-2">
            {newAvatarFile && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-sm text-slate-600 flex items-center gap-1"
                disabled={isUploading}
                onClick={handleAvatarUpload}
              >
                <UploadCloud className="h-3 w-3" />
                Upload Photo
              </Button>
            )}

            {(newAvatarUrl || newAvatarFile) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-sm text-red-600 flex items-center gap-1"
                onClick={clearAvatar}
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </>
    );
  };

  if (isPlayersLoading) {
    return <div className="text-gray-600 mb-8">Loading players...</div>;
  }

  const captainPlayer = players?.find(
    (p) => captain && p.name === `${captain.firstName} ${captain.lastName}`,
  );

  const otherPlayers = players?.filter(
    (p) => !captain || p.name !== `${captain.firstName} ${captain.lastName}`,
  );

  return (
    <>
      {/* Team Header with Logo */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-md relative group">
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
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{team?.name || "Team"}</h1>
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
      </div>

      {/* Team Photo Section */}
      <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h2 className="font-bold text-xl mb-4">Team Photo</h2>
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden group">
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
      </div>

      {/* Captain Section */}
      {captainPlayer && (
        <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="destructive">Team Captain</Badge>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jersey</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Height</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={captainPlayer.id}>
                  <TableCell className="font-medium">
                    {captainPlayer.jerseyNumber !== null
                      ? captainPlayer.jerseyNumber
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/players/$playerId`}
                      params={{
                        playerId: captainPlayer.id,
                      }}
                      className="flex items-center gap-2 hover:underline"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={captainPlayer.playerUrl || "/placeholder.svg"}
                          alt={`${captainPlayer.name}'s avatar`}
                        />
                        <AvatarFallback className="bg-gray-200">
                          <User className="h-4 w-4 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                      {captainPlayer.name}
                    </Link>
                  </TableCell>
                  <TableCell>{captainPlayer.position || "-"}</TableCell>
                  <TableCell>
                    {captainPlayer.height || "-"}{" "}
                    {captainPlayer.height ? "cm" : ""}{" "}
                  </TableCell>
                  <TableCell>
                    {captainPlayer.weight || "-"}{" "}
                    {captainPlayer.weight ? "kg" : ""}{" "}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      onClick={() => openEditDialog(captainPlayer)}
                    >
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Player</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {captainPlayer.name}{" "}
                            from the team? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePlayer(captainPlayer.id)}
                            disabled={deletePlayerMutation.isPending}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {deletePlayerMutation.isPending
                              ? "Removing..."
                              : "Remove Player"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Players Management Section */}
      <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">Team Roster</h2>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Player
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Player</DialogTitle>
                <DialogDescription>
                  Enter the details for the new player.
                </DialogDescription>
              </DialogHeader>

              {/* Avatar Upload Preview */}
              <AvatarUpload />

              <form onSubmit={handleCreatePlayer} className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Player name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="jersey_number"
                    className="text-sm font-medium"
                  >
                    Jersey Number
                  </label>
                  <Input
                    id="jersey_number"
                    name="jersey_number"
                    type="text"
                    placeholder="0"
                    pattern="^\d*$"
                    title="Please enter a valid number"
                  />
                </div>

                <div>
                  <label htmlFor="position" className="text-sm font-medium">
                    Position
                  </label>
                  <select
                    id="position"
                    name="position"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select position</option>
                    <option value="PG">Point Guard (PG)</option>
                    <option value="SG">Shooting Guard (SG)</option>
                    <option value="SF">Small Forward (SF)</option>
                    <option value="PF">Power Forward (PF)</option>
                    <option value="C">Center (C)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="height" className="text-sm font-medium">
                      Height
                    </label>
                    <Input id="height" name="height" placeholder="e.g. 180cm" />
                  </div>
                  <div>
                    <label htmlFor="weight" className="text-sm font-medium">
                      Weight
                    </label>
                    <Input id="weight" name="weight" placeholder="e.g. 70kg" />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createPlayerMutation.isPending}
                  >
                    {createPlayerMutation.isPending
                      ? "Adding..."
                      : "Add Player"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jersey</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Height</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otherPlayers && otherPlayers.length > 0 ? (
                otherPlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">
                      {player.jerseyNumber !== null ? player.jerseyNumber : "-"}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/players/$playerId`}
                        params={{
                          playerId: player.id,
                        }}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={player.playerUrl || "/placeholder.svg"}
                            alt={`${player.name}'s avatar`}
                          />
                          <AvatarFallback className="bg-gray-200">
                            <User className="h-4 w-4 text-gray-400" />
                          </AvatarFallback>
                        </Avatar>
                        {player.name}
                      </Link>
                    </TableCell>
                    <TableCell>{player.position || "-"}</TableCell>
                    <TableCell>
                      {player.height || "-"} {player.height ? "cm" : ""}{" "}
                    </TableCell>
                    <TableCell>
                      {player.weight || "-"} {player.weight ? "kg" : ""}{" "}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-900 mr-2"
                        onClick={() => openEditDialog(player)}
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Player</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {player.name} from
                              the team? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePlayer(player.id)}
                              disabled={deletePlayerMutation.isPending}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {deletePlayerMutation.isPending
                                ? "Removing..."
                                : "Remove Player"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No players found. Add your first player to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Player Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          // Only allow closing if we're not in the middle of submitting
          if (!updatePlayerMutation.isPending) {
            setIsEditDialogOpen(open);
            if (!open) {
              clearAvatar();
            }
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
            <DialogDescription>Update player information.</DialogDescription>
          </DialogHeader>

          {/* Avatar Upload Preview */}
          <AvatarUpload />

          <form onSubmit={handleEditPlayer} className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="edit-name"
                name="name"
                placeholder="Player name"
                defaultValue={selectedPlayer?.name}
                required
              />
            </div>

            <div>
              <label
                htmlFor="edit-jersey_number"
                className="text-sm font-medium"
              >
                Jersey Number
              </label>
              <Input
                id="edit-jersey_number"
                name="jersey_number"
                type="text"
                placeholder="0"
                defaultValue={selectedPlayer?.jerseyNumber || ""}
                pattern="^\d*$"
                title="Please enter a valid number"
              />
            </div>

            <div>
              <label htmlFor="edit-position" className="text-sm font-medium">
                Position
              </label>
              <select
                id="edit-position"
                name="position"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={selectedPlayer?.position || ""}
              >
                <option value="">Select position</option>
                <option value="PG">Point Guard (PG)</option>
                <option value="SG">Shooting Guard (SG)</option>
                <option value="SF">Small Forward (SF)</option>
                <option value="PF">Power Forward (PF)</option>
                <option value="C">Center (C)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-height" className="text-sm font-medium">
                  Height
                </label>
                <Input
                  id="edit-height"
                  name="height"
                  placeholder="e.g. 180cm"
                  defaultValue={selectedPlayer?.height || ""}
                />
              </div>
              <div>
                <label htmlFor="edit-weight" className="text-sm font-medium">
                  Weight
                </label>
                <Input
                  id="edit-weight"
                  name="weight"
                  placeholder="e.g. 70kg"
                  defaultValue={selectedPlayer?.weight || ""}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updatePlayerMutation.isPending}>
                {updatePlayerMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
