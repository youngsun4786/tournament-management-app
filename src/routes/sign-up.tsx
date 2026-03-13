import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { SignUpForm } from "~/lib/components/auth/sign-up-form";
import { PageLayout } from "~/lib/components/page-layout";

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.authState.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <PageLayout title="Sign Up" maxWidth="md">
      <div className="flex flex-col items-center gap-2">
        <SignUpForm />
        <small>
          <Link to="/sign-in" className="group">
            Do you already have an account?{" "}
            <span className="underline group-hover:no-underline">Sign In</span>
          </Link>
        </small>
      </div>
    </PageLayout>
  );
}
