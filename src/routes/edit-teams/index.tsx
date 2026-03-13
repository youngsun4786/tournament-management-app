import { createFileRoute, redirect } from "@tanstack/react-router";
import { PageLayout } from "~/lib/components/page-layout";
import { EditPlayersSection } from "~/lib/components/players/edit-players-section";
import {
  useAuthenticatedUser,
  useGetPlayersByTeamId,
  useGetTeamById,
} from "~/src/queries";
import { playerQueries, teamQueries } from "~/src/queries";

export const Route = createFileRoute("/edit-teams/")({
  component: EditTeamsPage,
  beforeLoad: async ({ context }) => {
    if (!context.authState.isAuthenticated) {
      throw redirect({ to: "/" });
    }

    if (!["admin", "captain"].includes(context.authState.user.role as string)) {
      throw redirect({ to: "/" });
    }
    
    const teamId = context.authState.user!.meta.teamId;
    await context.queryClient.ensureQueryData(teamQueries.getTeamById(teamId!));
    await context.queryClient.ensureQueryData(playerQueries.teamPlayers(teamId!));
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
      <PageLayout title="Team Management">
        <p className="text-gray-600">
          You are not assigned to any team. Please contact an administrator.
        </p>
      </PageLayout>
    );
  }

  if (isTeamLoading || isPlayersLoading) {
    return (
      <PageLayout title="Team Management">
        <p className="text-gray-600">Loading...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Team Management">
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
    </PageLayout>
  );
}
