import { createFileRoute, redirect } from "@tanstack/react-router";
import { PageLayout } from "~/lib/components/page-layout";
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
      <PageLayout title="Waiver Forms">
        <p className="text-gray-600">
          You are not assigned to any team. Please contact an administrator.
        </p>
      </PageLayout>
    );
  }

  if (isPlayersLoading) {
    return (
      <PageLayout title="Waiver Forms">
        <p className="text-gray-600">Loading...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Waiver Forms">
      <div className="bg-card rounded-lg shadow-sm">
        <WaiverList players={players || []} />
      </div>
    </PageLayout>
  );
}
