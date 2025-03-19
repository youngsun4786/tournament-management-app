import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deletePlayerGameStats } from "~/app/controllers/player-game-stats.api";
import type { PlayerGameStats } from "~/app/types/player-game-stats";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { PlayerGameStatsForm } from "./player-game-stats-form";

interface PlayerStatsActionsProps {
  gameId: string;
  stats: PlayerGameStats;
}

export const PlayerStatsActions = ({
  gameId,
  stats,
}: PlayerStatsActionsProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await deletePlayerGameStats({
        data: { id: stats.pgs_id },
      });
    },
    onSuccess: () => {
      toast.success("Player stats deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["gamePlayerStats", gameId] });
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete player stats");
    },
  });

  return (
    <>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 text-red-500 hover:text-red-700"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>

      {/* Edit Stats Form Dialog */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Player Stats</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Close
              </Button>
            </div>
            <PlayerGameStatsForm
              gameId={gameId}
              playerId={stats.player_id!}
              initialData={stats}
              onSuccess={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              player stats from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => deleteMutation.mutate()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
