import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { PlusCircle, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
    createPlayer,
    deletePlayer,
    updatePlayer,
} from "~/app/controllers/player.api";
import { getTeam } from "~/app/controllers/team.api";
import {
    playerQueries,
    useAuthenticatedUser,
    useGetPlayersByTeamId,
} from "~/app/queries";
import { PlayerSchema } from "~/app/schemas/player.schema";
import { Player } from "~/app/types/player";
import { Layout } from "~/lib/components/layout";
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/lib/components/ui/form";
import { Input } from "~/lib/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/lib/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/lib/components/ui/table";

export const Route = createFileRoute("/edit-teams/$teamId")({
  component: EditTeamByIdPage,
  beforeLoad: async ({ context }) => {
    if (!context.authState.isAuthenticated) {
      throw redirect({ to: "/" });
    }

    if (
      context.authState.user.role !== "captain" &&
      context.authState.user.role !== "admin"
    ) {
      throw redirect({ to: "/" });
    }
  },
  loader: async ({ params }) => {
    const team = await getTeam({ data: { teamId: params.teamId } });
    return {
        team,
        teamId: params.teamId,
    };
  },
});

type PlayerFormValues = z.infer<typeof PlayerSchema>;

function EditTeamByIdPage() {
  const { teamId, team } = Route.useLoaderData();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const queryClient = useQueryClient();
  const {
    data: { user },
  } = useAuthenticatedUser();

  // Get players for this team
  const { data: players, isLoading: isPlayersLoading } =
    useGetPlayersByTeamId(teamId);

  // Create player mutation
  const createPlayerMutation = useMutation({
    mutationFn: createPlayer,
    onSuccess: () => {
      toast.success("Player added successfully");
      queryClient.invalidateQueries(playerQueries.teamPlayers(teamId));
      setIsCreateDialogOpen(false);
      createForm.reset();
    },
    onError: (error) => {
      toast.error(`Failed to add player: ${error.message}`);
    },
  });

  // Update player mutation
  const updatePlayerMutation = useMutation({
    mutationFn: updatePlayer,
    onSuccess: () => {
      toast.success("Player updated successfully");
      queryClient.invalidateQueries(playerQueries.teamPlayers(teamId));
      setIsEditDialogOpen(false);
      setSelectedPlayer(null);
      editForm.reset();
    },
    onError: (error) => {
      toast.error(`Failed to update player: ${error.message}`);
    },
  });

  // Delete player mutation
  const deletePlayerMutation = useMutation({
    mutationFn: deletePlayer,
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

  // Create form
  const createForm = useForm<PlayerFormValues>({
    resolver: zodResolver(PlayerSchema),
    defaultValues: {
      name: "",
      jersey_number: 0,
      position: "",
      height: "",
      weight: "",
      team_id: teamId,
    },
  });

  // Edit form
  const editForm = useForm<PlayerFormValues>({
    resolver: zodResolver(PlayerSchema),
    defaultValues: {
      name: "",
      jersey_number: 0,
      position: "",
      height: "",
      weight: "",
      team_id: teamId,
    },
  });

  const handleCreatePlayer = (data: PlayerFormValues) => {
    data.jersey_number = Number(data.jersey_number);
    createPlayerMutation.mutate({
      data: {
        team_id: teamId,
        name: data.name,
        jersey_number: data.jersey_number,
        position: data.position || undefined,
        height: data.height || undefined,
        weight: data.weight || undefined,
      },
    });
  };

  const handleEditPlayer = (data: PlayerFormValues) => {
    if (!selectedPlayer) {
      console.error("No player selected for editing");
      toast.error("No player selected for editing");
      return;
    }

    try {
      // Ensure jersey number is a number
      const jerseyNumber =
        typeof data.jersey_number === "string"
          ? parseInt(data.jersey_number as string, 10)
          : data.jersey_number;

      const updateData = {
        data: {
          id: selectedPlayer.player_id,
          team_id: teamId, // This field is required in the schema but won't be used in the update
          name: data.name,
          jersey_number: jerseyNumber,
          position: data.position || undefined,
          height: data.height || undefined,
          weight: data.weight || undefined,
        },
      };

      updatePlayerMutation.mutate(updateData);
    } catch (error) {
      console.error("Error preparing data for update:", error);
      toast.error("Failed to prepare data for update");
    }
  };

  const handleDeletePlayer = (playerId: string) => {
    deletePlayerMutation.mutate({ data: playerId });
  };

  const openEditDialog = (player: Player) => {
    setSelectedPlayer(player);
    editForm.reset({
      name: player.name,
      jersey_number: player.jersey_number || 0,
      position: player.position || "",
      height: player.height || "",
      weight: player.weight || "",
      team_id: teamId,
    });
    setIsEditDialogOpen(true);
  };

  if (isPlayersLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold mb-4">Team Management</h1>
          <p className="text-gray-600 mb-8">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center p-4">
        <div className="w-full max-w-6xl">
          {/* Team Header with Logo */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-md">
              {team?.logo_url ? (
                <img
                  src={`/team_logos/${team.logo_url}`}
                  alt={`${team.name} logo`}
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
              {user.role === "captain" && (
                <p className="text-gray-500 dark:text-gray-400">
                  Captain: {user.meta.firstName} {user.meta.lastName}
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
                  <Form {...createForm}>
                    <form
                      onSubmit={createForm.handleSubmit(handleCreatePlayer)}
                      className="space-y-4"
                    >
                      <FormField
                        control={createForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Player name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="jersey_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jersey Number</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="0"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Only allow digits
                                  if (value === "" || /^\d+$/.test(value)) {
                                    field.onChange(
                                      value === "" ? "" : Number(value)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="PG">
                                  Point Guard (PG)
                                </SelectItem>
                                <SelectItem value="SG">
                                  Shooting Guard (SG)
                                </SelectItem>
                                <SelectItem value="SF">
                                  Small Forward (SF)
                                </SelectItem>
                                <SelectItem value="PF">
                                  Power Forward (PF)
                                </SelectItem>
                                <SelectItem value="C">Center (C)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={createForm.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 180cm" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={createForm.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 70kg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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
                  </Form>
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
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.position || "-"}</TableCell>
                        <TableCell>{player.height || "-"} {player.height ? "cm" : ""} </TableCell>
                        <TableCell>{player.weight || "-"} {player.weight ? "kg" : ""} </TableCell>
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
                                <AlertDialogTitle>
                                  Remove Player
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove {player.name}{" "}
                                  from the team? This action cannot be undone.
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
        </div>

        {/* Edit Player Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            // Only allow closing if we're not in the middle of submitting
            if (!updatePlayerMutation.isPending) {
              setIsEditDialogOpen(open);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Player</DialogTitle>
              <DialogDescription>Update player information.</DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  editForm.handleSubmit((data) => {
                    handleEditPlayer(data);
                  })();
                }}
                className="space-y-4"
              >
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Player name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="jersey_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jersey Number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="0"
                          value={field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Only allow digits
                            if (value === "" || /^\d+$/.test(value)) {
                              field.onChange(value === "" ? 0 : Number(value));
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PG">Point Guard (PG)</SelectItem>
                          <SelectItem value="SG">
                            Shooting Guard (SG)
                          </SelectItem>
                          <SelectItem value="SF">Small Forward (SF)</SelectItem>
                          <SelectItem value="PF">Power Forward (PF)</SelectItem>
                          <SelectItem value="C">Center (C)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 180cm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 70kg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={updatePlayerMutation.isPending}
                  >
                    {updatePlayerMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
