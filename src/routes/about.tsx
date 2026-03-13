import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "~/lib/components/page-layout";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout title="About">
      <div className="flex justify-center items-center">In development...</div>
    </PageLayout>
  );
}
