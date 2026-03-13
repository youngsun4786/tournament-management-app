import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { PageLayout } from "~/lib/components/page-layout";
import { ScheduleView } from "~/lib/components/schedules/schedule-view";
import { getGames } from "~/src/controllers/game.api";

export const Route = createFileRoute("/schedule/")({
  loader: async () => {
    const games = await getGames();
    return { games };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { games } = Route.useLoaderData();

  return (
    <PageLayout
      title="Schedules & Scores"
      actions={
        <div className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </div>
      }
    >
      <ScheduleView games={games!} />
    </PageLayout>
  );
}
