import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "~/lib/components/page-layout";
import { TeamRankings } from "~/lib/components/standings/team-rankings";
import { seasonQueries } from "~/src/queries";

export const Route = createFileRoute("/standings/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(seasonQueries.list());
  },
  component: RouteComponent,
});

function RouteComponent() {
  
  return (
    <PageLayout title="Standings">
      <div className="mt-4">
        <TeamRankings />
      </div>
    </PageLayout>
  );
}
