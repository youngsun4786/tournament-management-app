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
import { playerQueries } from "~/src/queries";
import { Player } from "~/src/types/player";
import { Team } from "~/src/types/team";
import { uploadFileToStorage } from "~/supabase/storage/client";
import { TeamMediaSection } from "./team-media-section";

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

function PlayerFormFields({ player }: { player?: Player | null }) {
  const prefix = player ? "edit-" : "";
  return (
    <>
      <div>
        <label htmlFor={`${prefix}name`} className="text-sm font-medium">
          Name
        </label>
        <Input
          id={`${prefix}name`}
          name="name"
          placeholder="Player name"
          defaultValue={player?.name}
          required
        />
      </div>
      <div>
        <label
          htmlFor={`${prefix}jersey_number`}
          className="text-sm font-medium"
        >
          Jersey Number
        </label>
        <Input
          id={`${prefix}jersey_number`}
          name="jersey_number"
          type="text"
          placeholder="0"
          defaultValue={player?.jerseyNumber || ""}
          pattern="^\d*$"
          title="Please enter a valid number"
        />
      </div>
      <div>
        <label htmlFor={`${prefix}position`} className="text-sm font-medium">
          Position
        </label>
        <select
          id={`${prefix}position`}
          name="position"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          defaultValue={player?.position || ""}
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
          <label htmlFor={`${prefix}height`} className="text-sm font-medium">
            Height
          </label>
          <Input
            id={`${prefix}height`}
            name="height"
            placeholder="e.g. 180cm"
            defaultValue={player?.height || ""}
          />
        </div>
        <div>
          <label htmlFor={`${prefix}weight`} className="text-sm font-medium">
            Weight
          </label>
          <Input
            id={`${prefix}weight`}
            name="weight"
            placeholder="e.g. 70kg"
            defaultValue={player?.weight || ""}
          />
        </div>
      </div>
    </>
  );
}

function PlayerRow({
  player,
  onEdit,
  onDelete,
  isDeleting,
}: {
  player: Player;
  onEdit: (player: Player) => void;
  onDelete: (playerId: string) => void;
  isDeleting: boolean;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {player.jerseyNumber !== null ? player.jerseyNumber : "-"}
      </TableCell>
      <TableCell>
        <Link
          to={`/players/$playerId`}
          params={{ playerId: player.id }}
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
        {player.height || "-"} {player.height ? "cm" : ""}
      </TableCell>
      <TableCell>
        {player.weight || "-"} {player.weight ? "kg" : ""}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-900 mr-2"
          onClick={() => onEdit(player)}
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
                Are you sure you want to remove {player.name} from the team?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(player.id)}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "Removing..." : "Remove Player"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}

export const EditPlayersSection = ({
  teamId,
  team,
  players,
  isPlayersLoading,
  captain,
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

  const createPlayerMutation = useMutation({
    mutationFn: (data: Parameters<typeof createPlayer>[0]) =>
      createPlayer(data),
    onSuccess: async (newPlayer) => {
      toast.success("Player added successfully");
      queryClient.invalidateQueries(playerQueries.teamPlayers(teamId));
      if (newPlayer?.id) {
        queryClient.invalidateQueries(playerQueries.detail(newPlayer.id));
      }
      setIsCreateDialogOpen(false);
      clearAvatar();
    },
    onError: (error) => {
      toast.error(`Failed to add player: ${error.message}`);
    },
  });

  const updatePlayerMutation = useMutation({
    mutationFn: (data: Parameters<typeof updatePlayer>[0]) =>
      updatePlayer(data),
    onSuccess: async (updatedPlayer) => {
      toast.success("Player updated successfully");
      queryClient.invalidateQueries(playerQueries.teamPlayers(teamId));
      if (updatedPlayer?.id) {
        queryClient.invalidateQueries(playerQueries.detail(updatedPlayer.id));
      }
      setIsEditDialogOpen(false);
      setSelectedPlayer(null);
      clearAvatar();
    },
    onError: (error) => {
      toast.error(`Failed to update player: ${error.message}`);
    },
  });

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

  const displayAvatarUrl =
    previewUrl || selectedPlayer?.playerUrl || "/placeholder.svg";
  const hasUnsavedChanges = newAvatarUrl !== null;

  const clearAvatar = useCallback(() => {
    setNewAvatarFile(null);
    setNewAvatarUrl(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (e.target.files.length > 1) {
      toast.error("Please select one image");
      return;
    }

    const file = e.target.files[0];
    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    try {
      setIsUploading(true);
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
      } else {
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

  const parseFormData = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const jerseyNumber = parseInt(
      (formData.get("jersey_number") as string) || "0",
      10,
    );
    const position = (formData.get("position") as string) || undefined;
    const height = (formData.get("height") as string) || undefined;
    const weight = (formData.get("weight") as string) || undefined;
    return { name, jerseyNumber, position, height, weight };
  };

  const handleCreatePlayer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!teamId) return;
    const fields = parseFormData(e.currentTarget);
    createPlayerMutation.mutate({
      data: {
        teamId,
        ...fields,
        ...(newAvatarUrl && { playerUrl: newAvatarUrl }),
      },
    });
  };

  const handleEditPlayer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPlayer) return;
    const fields = parseFormData(e.currentTarget);
    updatePlayerMutation.mutate({
      data: {
        id: selectedPlayer.id,
        teamId,
        ...fields,
        ...(newAvatarUrl && { playerUrl: newAvatarUrl }),
      },
    });
  };

  const openEditDialog = (player: Player) => {
    setSelectedPlayer(player);
    setNewAvatarUrl(player.playerUrl || null);
    setIsEditDialogOpen(true);
  };

  const AvatarUpload = () => (
    <div className="flex flex-col items-center mb-4">
      <div className="relative group">
        <input
          type="file"
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
  );

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main content: roster */}
      <div className="lg:col-span-2 space-y-6">
        {/* Captain Section */}
        {captainPlayer && (
          <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
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
                  <PlayerRow
                    player={captainPlayer}
                    onEdit={openEditDialog}
                    onDelete={(id) =>
                      deletePlayerMutation.mutate({ data: { playerId: id } })
                    }
                    isDeleting={deletePlayerMutation.isPending}
                  />
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Team Roster */}
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
                <AvatarUpload />
                <form onSubmit={handleCreatePlayer} className="space-y-4">
                  <PlayerFormFields />
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
                    <PlayerRow
                      key={player.id}
                      player={player}
                      onEdit={openEditDialog}
                      onDelete={(id) =>
                        deletePlayerMutation.mutate({ data: { playerId: id } })
                      }
                      isDeleting={deletePlayerMutation.isPending}
                    />
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
      </div>

      {/* Sidebar: team media */}
      <div>
        <TeamMediaSection teamId={teamId} team={team} />
      </div>

      {/* Edit Player Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!updatePlayerMutation.isPending) {
            setIsEditDialogOpen(open);
            if (!open) clearAvatar();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
            <DialogDescription>Update player information.</DialogDescription>
          </DialogHeader>
          <AvatarUpload />
          <form onSubmit={handleEditPlayer} className="space-y-4">
            <PlayerFormFields player={selectedPlayer} />
            <DialogFooter>
              <Button type="submit" disabled={updatePlayerMutation.isPending}>
                {updatePlayerMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
