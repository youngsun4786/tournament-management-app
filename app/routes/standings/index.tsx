import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/standings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="container m-auto p-4">
        <h1 className="text-2xl font-bold">Standings</h1>
      </div>
      <div className="flex justify-center items-center">In development...</div>
    </div>
  );
}
