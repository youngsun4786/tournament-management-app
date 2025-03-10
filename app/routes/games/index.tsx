import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/games/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="container m-auto p-4">
        <h1 className="text-xl font-bold">Games & Scores</h1>
      </div>
      <div className="flex justify-center items-center"></div>
    </div>
  );
}
