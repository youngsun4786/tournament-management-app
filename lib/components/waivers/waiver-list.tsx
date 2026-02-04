import { CheckCircle, Eye, Loader2, Upload, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/lib/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/lib/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/lib/components/ui/tooltip";
import { useWaiverUpload } from "~/lib/hooks/use-waiver-upload";
import { Player } from "~/src/types/player";
import { uploadFileToStorage } from "~/supabase/storage/client";
import { GeneralFileUpload } from "../general-file-upload";

interface WaiverListProps {
  players: Player[];
}

export function WaiverList({ players }: WaiverListProps) {
  // Assuming all players in the list belong to the same team, we can pick the teamId from the first one
  // or pass it as a prop. For now, let's grab it from the first player if available.
  const teamId = players.length > 0 ? players[0].teamId : undefined;

  const { uploadWaiver, isUploading: isSubmitting } = useWaiverUpload(teamId);

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [waiverPreviewUrl, setWaiverPreviewUrl] = useState<string | null>(null);
  const [isWaiverUploading, setIsWaiverUploading] = useState(false);
  const [newWaiverFile, setNewWaiverFile] = useState<File | null>(null);

  const handleOpenUploadDialog = (player: Player) => {
    setSelectedPlayer(player);
    setWaiverPreviewUrl(player.waiverUrl || null);
    setNewWaiverFile(null);
    setIsUploadDialogOpen(true);
  };

  const handleWaiverUpload = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setNewWaiverFile(file);

    try {
      setIsWaiverUploading(true);
      const uploadResult = await uploadFileToStorage({
        file: file,
        bucket: "media-images",
        folder: "players/waivers",
      });

      if (uploadResult.error || !uploadResult.image_url) {
        toast.error(
          `Failed to upload waiver: ${uploadResult.error ?? "ERROR"}`,
        );
      } else if (uploadResult.image_url) {
        setWaiverPreviewUrl(uploadResult.image_url);
        toast.success(
          "Waiver uploaded successfully. Click 'Save Changes' to update.",
        );
      }
    } catch (error) {
      console.error("Error uploading waiver:", error);
      toast.error("Failed to upload waiver");
    } finally {
      setIsWaiverUploading(false);
    }
  };

  const handleSaveWaiver = async () => {
    if (!selectedPlayer || !newWaiverFile) return;
    if (newWaiverFile && selectedPlayer) {
      await uploadWaiver(
        newWaiverFile,
        selectedPlayer.id,
        selectedPlayer.name,
        selectedPlayer.jerseyNumber!,
      );
      setIsUploadDialogOpen(false);
      setNewWaiverFile(null);
      setWaiverPreviewUrl(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Waiver</DialogTitle>
            <DialogDescription>
              Upload a waiver form for {selectedPlayer?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <GeneralFileUpload
              onFilesChange={handleWaiverUpload}
              maxFiles={1}
              accept="image/*,application/pdf"
              value={newWaiverFile ? [newWaiverFile] : []}
            />

            {waiverPreviewUrl && (
              <div className="text-sm text-green-600 flex items-center gap-2 mt-1">
                <CheckCircle className="h-4 w-4" />
                <span className="truncate max-w-[200px]">Waiver uploaded</span>
                <a
                  href={waiverPreviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  View
                </a>
              </div>
            )}

            {isWaiverUploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveWaiver}
              disabled={!newWaiverFile || isSubmitting || isWaiverUploading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader className="p-10">
          <TableRow>
            <TableHead>Player Name</TableHead>
            <TableHead>Waiver Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No players found.
              </TableCell>
            </TableRow>
          ) : (
            players.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {player.playerUrl ? (
                      <img
                        src={player.playerUrl}
                        alt={`${player.name}'s avatar`}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {player.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {player.name}
                  </div>
                </TableCell>
                <TableCell>
                  {player.waiverUrl ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Uploaded</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-500">
                      <XCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Missing</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenUploadDialog(player)}
                        >
                          <Upload className="h-4 w-4" />
                          <span className="sr-only">Upload Waiver</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upload Waiver</p>
                      </TooltipContent>
                    </Tooltip>

                    {player.waiverUrl ? (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={player.waiverUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Waiver
                        </a>
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        className="opacity-50"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Waiver
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
