import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { Navbar } from "lib/components/navbar";
import { SponsorSidebar } from "lib/components/sponsor-sidebar";
import { Toaster } from "lib/components/ui/sonner";
import type { ReactNode } from "react";
import { lazy, Suspense } from "react";
import { authQueries, gameQueries, teamQueries } from "~/src/queries";

import "sonner/dist/styles.css";
import appCss from "../styles.css?url";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import("@tanstack/react-router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Calgary Chinese Basketball Club",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "ccbc_logo.png" },
    ],
  }),
  beforeLoad: async ({ context }) => {
    const teams = await context.queryClient.ensureQueryData(teamQueries.list());
    const games = await context.queryClient.ensureQueryData(gameQueries.list());
    const authState = await context.queryClient.ensureQueryData(
      authQueries.user(),
    );
    return {
      teams,
      games,
      authState,
    };
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <div className="flex flex-col h-screen dark:bg-black/95 dark:text-white">
        <Navbar />

        {/* Place the actual root in this layout */}
        <div className="flex-1 overflow-auto">
          <div className="flex flex-row min-h-full">
            {/* Left Sponsor Slot */}
            <SponsorSidebar side="left" />

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <Outlet />
            </main>

            {/* Right Sponsor Slot */}
            <SponsorSidebar side="right" />
          </div>
        </div>
      </div>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
        <Toaster />
        <Suspense>
          <ReactQueryDevtools buttonPosition="bottom-left" />
          <TanStackRouterDevtools position="bottom-right" />
        </Suspense>
      </body>
    </html>
  );
}
