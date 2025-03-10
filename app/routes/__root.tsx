import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { lazy, Suspense } from "react";

import { createServerFn } from "@tanstack/react-start";
import { Navbar } from "lib/components/navbar";
import appCss from "~/lib/styles/app.css?url";
import { getTeams } from "../services/teams.api";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

const getTeamsInfo = createServerFn().handler(async () => {
  const teams = await getTeams();
  return {
    teams,
  };
});

const teamsQuery = queryOptions({
  queryKey: ["teams"],
  queryFn: ({ signal }) => getTeamsInfo({ signal }),
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  teams: Awaited<ReturnType<typeof getTeamsInfo>>;
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
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  beforeLoad: async ({ context }) => {
    const teams = await context.queryClient.fetchQuery(teamsQuery);
    return {
      teams,
    };
  },
  component: RootComponent,
});

function RootComponent() {

  return (
    <RootDocument>
      <Navbar />
      {/* Place the actual root in this layout */}
      <div className="dark:bg-black/95 dark:text-white h-screen">
        <Outlet />
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
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Suspense>
          <TanStackRouterDevtools position="bottom-right" />
        </Suspense>
        <Scripts />
      </body>
    </html>
  );
}
