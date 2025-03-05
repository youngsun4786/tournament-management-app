import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact-us/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello contact-us!</div>;
}
