import { createFileRoute, redirect } from "@tanstack/react-router";
import { Layout } from "~/lib/components/layout";
import { WaiverList } from "~/lib/components/waivers/waiver-list";
import { useAuthenticatedUser, useGetPlayersByTeamId } from "~/src/queries";

export const Route = createFileRoute("/waivers/")({
  component: WaiversPage,
  beforeLoad: async ({ context }) => {
    if (!context.authState.isAuthenticated) {
      throw redirect({ to: "/" });
    }

    if (!["admin", "captain"].includes(context.authState.user.role as string)) {
      throw redirect({ to: "/" });
    }
  },
});

function WaiversPage() {
  const {
    data: { user },
  } = useAuthenticatedUser();
  const teamId = user.meta.teamId;

  // Get players for this team
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersByTeamId(
    teamId! as string,
  );

  if (!teamId) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold mb-4">Waiver Forms</h1>
          <p className="text-gray-600 mb-8">
            You are not assigned to any team. Please contact an administrator.
          </p>
        </div>
      </Layout>
    );
  }

  if (isPlayersLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold mb-4">Waiver Forms</h1>
          <p className="text-gray-600 mb-8">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center p-4">
        <div className="w-full max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Waiver Forms</h1>
          </div>

          <div className="bg-card rounded-lg shadow-sm">
            <WaiverList players={players || []} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
