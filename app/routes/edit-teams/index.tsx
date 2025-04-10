import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  useAuthenticatedUser,
  useGetPlayersByTeamId,
  useGetTeamById,
} from "~/app/queries";
import { Layout } from "~/lib/components/layout";
import { EditPlayersSection } from "~/lib/components/players/edit-players-section";

export const Route = createFileRoute("/edit-teams/")({
  component: EditTeamsPage,
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
});

function EditTeamsPage() {
  const {
    data: { user },
  } = useAuthenticatedUser();
  const teamId = user.meta.teamId;

  // Get team information
  const { data: team, isLoading: isTeamLoading } = useGetTeamById(
    teamId! as string
  );

  // Get players for this team
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersByTeamId(
    teamId! as string
  );

  if (!teamId) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold mb-4">Team Management</h1>
          <p className="text-gray-600 mb-8">
            You are not assigned to any team. Please contact an administrator.
          </p>
        </div>
      </Layout>
    );
  }

  if (isTeamLoading || isPlayersLoading) {
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
          <EditPlayersSection
            teamId={teamId}
            team={team}
            players={players}
            isPlayersLoading={isPlayersLoading}
            captain={{
              firstName: user.meta.firstName,
              lastName: user.meta.lastName,
            }}
            showCaptainInfo={true}
          />
        </div>
      </div>
    </Layout>
  );
}
