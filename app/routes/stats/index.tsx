import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/stats/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="container m-auto p-4">
        <h1 className="text-2xl font-bold">Stats</h1>
      </div>
      <div className="flex justify-center items-center">In development...</div>
    </div>
  );
}
