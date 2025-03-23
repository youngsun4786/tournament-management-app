import { createFileRoute } from "@tanstack/react-router";
import { ScoreBoard } from "~/lib/components/standings/score-board";

export const Route = createFileRoute("/standings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="container m-auto p-4">
        <h1 className="text-2xl font-bold">Standings</h1>
        <div className="mt-4">
          <ScoreBoard />
        </div>
      </div>
    </div>
  );
}
