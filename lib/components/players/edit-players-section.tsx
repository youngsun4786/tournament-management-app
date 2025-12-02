import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { convertBlobUrlToFile } from "~/lib/utils";
import {
  createPlayer,
  deletePlayer,
  updatePlayer,
} from "~/src/controllers/player.api";
import { playerQueries } from "~/src/queries";
import { Player } from "~/src/types/player";
import { Team } from "~/src/types/team";
import { uploadImageToStorage } from "~/supabase/storage/client";
import { Link } from "@tanstack/react-router";

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
  const queryClient = useQueryClient();

  // Create player mutation
  const createPlayerMutation = useMutation({
    mutationFn: (data: Parameters<typeof createPlayer>[0]) =>
      createPlayer(data),
    onSuccess: async () => {
      toast.success("Player added successfully");
      queryClient.invalidateQueries(playerQueries.teamPlayers(teamId));
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
    onSuccess: async () => {
      toast.success("Player updated successfully");
      queryClient.invalidateQueries(playerQueries.teamPlayers(teamId));
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
    onSuccess: () => {
      toast.success("Player removed successfully");
      queryClient.invalidateQueries(playerQueries.teamPlayers(teamId));
      setIsEditDialogOpen(false);
      setSelectedPlayer(null);
    },
    onError: (error) => {
      toast.error(`Failed to remove player: ${error.message}`);
    },
  });

  // Display avatar URL
  const displayAvatarUrl =
    previewUrl || selectedPlayer?.player_url || "/placeholder.svg";

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
        team_id: teamId,
        name,
        jersey_number: jerseyNumber,
        position: position || undefined,
        height: height || undefined,
        weight: weight || undefined,
        // Avatar will be handled in the onSuccess callback
        ...(newAvatarUrl && { player_url: newAvatarUrl }),
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
          player_id: selectedPlayer.player_id,
          team_id: teamId,
          name,
          jersey_number: jerseyNumber,
          position: position || undefined,
          height: height || undefined,
          weight: weight || undefined,
          ...(newAvatarUrl && { player_url: newAvatarUrl }),
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
    if (player.player_url) {
      setNewAvatarUrl(player.player_url);
    } else {
      setNewAvatarUrl(null);
    }

    setIsEditDialogOpen(true);
  };

  const handleAvatarUpload = async () => {
    if (!newAvatarFile) return;

    try {
      setIsUploading(true);
      const uploadResult = await uploadImageToStorage({
        file: newAvatarFile,
        bucket: "media-images",
        folder: "players",
      });

      if (uploadResult.error || !uploadResult.image_url) {
        toast.error(
          `Failed to upload player's profile image: ${uploadResult.error ?? "ERROR"}`
        );
      } else if (uploadResult.image_url) {
        setNewAvatarUrl(uploadResult.image_url);
        toast.success(
          "Image uploaded successfully. Click 'Save Changes' to update player's profile."
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
            {newAvatarUrl && (
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

            {newAvatarUrl && (
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

  return (
    <>
      {/* Team Header with Logo */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-md">
          {team?.logo_url ? (
            <img
              src={`/team_logos/${team.logo_url}`}
              alt={`${team?.name} logo`}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <User className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{team?.name || "Team"}</h1>
          {showCaptainInfo && captain && (
            <p className="text-gray-500 dark:text-gray-400">
              Captain: {captain.firstName} {captain.lastName}
            </p>
          )}
        </div>
      </div>

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
              {players && players.length > 0 ? (
                players.map((player) => (
                  <TableRow key={player.player_id}>
                    <TableCell className="font-medium">
                      {player.jersey_number !== null
                        ? player.jersey_number
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/players/$playerId`}
                        params={{
                          playerId: player.player_id,
                        }}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={player.player_url || "/placeholder.svg"}
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
                              onClick={() =>
                                handleDeletePlayer(player.player_id)
                              }
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
                  <TableCell colSpan={6} className="text-center py-4">
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
                defaultValue={selectedPlayer?.jersey_number || ""}
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
