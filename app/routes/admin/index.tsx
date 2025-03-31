import { createFileRoute, redirect } from "@tanstack/react-router";
import { requireAdmin } from "~/app/services/auth.service";
import { ButtonLink } from "~/lib/components/button-link";
import { CarouselManager } from "~/lib/components/admin/carousel-manager";
import { Layout } from "~/lib/components/layout";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
  beforeLoad: async (loaderContext) => {
      if (!loaderContext.context.authState.isAuthenticated) {
        throw redirect({ to: "/" });
      }
    // Check authentication and admin role in one function
    const userRole = await requireAdmin(loaderContext);
    return { userRole };
  },
});

function AdminPage() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Welcome to the admin area. This page is only visible to admin users.
        </p>

        <div className="grid grid-cols-1 gap-8 w-full max-w-6xl">
          {/* Admin tools section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="font-bold text-xl mb-3 text-rose-600 dark:text-rose-400">
                Game Results Management
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Manage game results and player stats
              </p>
              <div className="mt-auto pt-2">
                <ButtonLink
                  variant="outline"
                  to="/edit-games"
                  className="text-sm font-medium text-rose-600 dark:text-rose-400 hover:underline hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900"
                >
                  Open →
                </ButtonLink>
              </div>
            </div>
          </div>

          {/* Carousel Manager */}
          <div className="w-full">
            <CarouselManager />
          </div>
        </div>
      </div>
    </Layout>
  );
}