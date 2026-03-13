import { createFileRoute } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { ButtonLink } from "~/lib/components/button-link";
import { PageLayout } from "~/lib/components/page-layout";

export const Route = createFileRoute("/unauthenticated")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout title="Authentication Required">
      <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
        <LogIn className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">
          You must be logged in to view this content. Please sign in to continue.
        </p>
        <ButtonLink to="/sign-in">Sign in</ButtonLink>
      </div>
    </PageLayout>
  );
}
