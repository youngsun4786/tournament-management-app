import { createFileRoute, redirect } from "@tanstack/react-router";
import { PageLayout } from "~/lib/components/page-layout";
import { ProfileCard } from "~/lib/components/profile-card";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.authState.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <PageLayout title="Profile">
      <ProfileCard />
    </PageLayout>
  );
}
