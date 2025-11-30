import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "~/src/services/auth.service";
import { Layout } from "~/lib/components/layout";

export const Route = createFileRoute("/teams/")({
  component: TeamsIndexPage,
  loader: async (loaderContext) => {
    // Check that user is authenticated
    await requireAuth(loaderContext);
    return {};
  },
});

function TeamsIndexPage() {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Teams</h1>
        <p className="mb-4">View all teams in the league</p>

        {/* Teams list would go here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="font-bold text-xl mb-2">Team Alpha</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Coach: John Smith
            </p>
            <a
              href="/teams/alpha"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Team
            </a>
          </div>
          {/* More team cards would be dynamically generated here */}
        </div>
      </div>
    </Layout>
  );
}
