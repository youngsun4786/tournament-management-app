import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/schedule/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="container m-auto p-4">
        <h1 className="text-xl font-bold">CCBC Schedule</h1>
      </div>
      <div className="flex justify-center items-center"></div>
    </div>
  );
}
