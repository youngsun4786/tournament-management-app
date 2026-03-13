import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "~/lib/components/page-layout";
import { ScoreBoard } from "~/lib/components/standings/score-board";

export const Route = createFileRoute("/standings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout title="Standings">
      <div className="mt-4">
        <ScoreBoard />
      </div>
    </PageLayout>
  );
}
