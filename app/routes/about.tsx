import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="container m-auto p-4"></div>
      <div className="flex justify-center items-center">In development...</div>
    </div>
  );
}
