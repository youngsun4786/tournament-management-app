import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "~/lib/components/page-layout";
import { ButtonLink } from "~/lib/components/button-link";

export const Route = createFileRoute("/unauthorized")({
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  return (
    <PageLayout title="Access Denied">
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-6 rounded">
          <p>You don't have permission to access this resource.</p>
        </div>
        <p className="text-gray-600 mb-8">
          If you believe this is an error, please contact your administrator.
        </p>
        <ButtonLink
          to="/"
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Return Home
        </ButtonLink>
      </div>
    </PageLayout>
  );
}
