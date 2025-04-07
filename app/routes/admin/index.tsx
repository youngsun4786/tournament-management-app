import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useGetTeams } from "~/app/queries";
import { CarouselManager } from "~/lib/components/admin/carousel-manager";
import { ButtonLink } from "~/lib/components/button-link";
import { Layout } from "~/lib/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/lib/components/ui/select";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
  beforeLoad: async ({ context }) => {
    if (!context.authState.isAuthenticated) {
      throw redirect({ to: "/" });
    }

    if (context.authState.user.role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
});

function AdminPage() {
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const { data: teams, isLoading: isTeamsLoading } = useGetTeams();

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  const handleManageTeam = () => {
    if (!selectedTeamId) {
      toast.error("Please select a team first");
      return;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Welcome to the admin area. This page is only visible to admin users.
        </p>

        <div className="grid grid-cols-1 gap-8 w-full max-w-6xl">
          {/* Admin tools section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Card className="w-full bg-white dark:bg-gray-800 shadow-md">
              <CardHeader>
                <CardTitle className="font-bold text-xl mb-3 text-rose-600 dark:text-rose-400">
                  Game Results Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Manage game results and player stats
                </p>
                <div className="mt-auto pt-2">
                  <ButtonLink
                    variant="outline"
                    to="/edit-games"
                    className="text-sm font-medium text-rose-600 dark:text-rose-400 hover:underline hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900"
                  >
                    Open →
                  </ButtonLink>
                </div>
              </CardContent>
            </Card>

            {/* Team Selection Component */}
            <Card className="w-full bg-white dark:bg-gray-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-rose-600 dark:text-rose-400">
                  Team Access Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Select a team to edit players:
                  </p>
                  <div className="flex items-center gap-4">
                    <Select
                      value={selectedTeamId}
                      onValueChange={handleTeamSelect}
                      disabled={isTeamsLoading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams &&
                          teams.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <ButtonLink
                      variant="outline"
                      to="/edit-teams/$teamId"
                      onClick={handleManageTeam}
                      params={{ teamId: selectedTeamId }}
                      disabled={!selectedTeamId}
                      className="bg-rose-600 hover:bg-rose-700 text-white"
                    >
                      Manage Team
                    </ButtonLink>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Carousel Manager */}
          <div className="w-full">
            <CarouselManager />
          </div>
        </div>
      </div>
    </Layout>
  );
}
