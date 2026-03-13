import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { SignInForm } from "~/lib/components/auth/sign-in-form";
import { PageLayout } from "~/lib/components/page-layout";

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.authState.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <PageLayout title="Sign In" maxWidth="md">
      <div className="flex flex-col items-center gap-2">
        <SignInForm />
        <small>
          <Link to="/sign-up" className="group">
            Do not have an account?{" "}
            <span className="underline group-hover:no-underline">Sign Up</span>
          </Link>
        </small>
      </div>
    </PageLayout>
  );
}
