import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Layout } from "~/lib/components/layout";
import { EditPlayersSection } from "~/lib/components/players/edit-players-section";
import { getTeam } from "~/src/controllers/team.api";
import {
  teamQueries,
  useAuthenticatedUser,
  useGetPlayersByTeamId,
} from "~/src/queries";

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

function EditTeamByIdPage() {
  const { teamId, team: initialTeam } = Route.useLoaderData();
  const { data: team } = useSuspenseQuery({
    ...teamQueries.getTeamById(teamId),
    initialData: initialTeam,
  });
  const {
    data: { user },
  } = useAuthenticatedUser();

  // Get players for this team
  const { data: players, isLoading: isPlayersLoading } =
    useGetPlayersByTeamId(teamId);

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
          <EditPlayersSection
            teamId={teamId}
            team={team}
            players={players}
            isPlayersLoading={isPlayersLoading}
            captain={
              user.role === "captain"
                ? {
                    firstName: user.meta.firstName,
                    lastName: user.meta.lastName,
                  }
                : undefined
            }
            showCaptainInfo={user.role === "captain"}
          />
        </div>
      </div>
    </Layout>
  );
}
