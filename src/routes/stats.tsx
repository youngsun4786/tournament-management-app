import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { PageLayout } from "~/lib/components/page-layout";

export const Route = createFileRoute("/stats")({
  component: StatsLayout,
});

const tabs = [
  { label: "Leaders", to: "/stats/leaders" },
  { label: "All Players", to: "/stats/players" },
] as const;

function StatsLayout() {
  const matches = useMatches();
  const currentPath = matches[matches.length - 1]?.fullPath;

  return (
    <PageLayout title="Stats">
      <div className="mb-6">
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          {tabs.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                currentPath === tab.to
                  ? "bg-background text-foreground shadow-sm"
                  : "hover:bg-background/50 hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
      <Outlet />
    </PageLayout>
  );
}
