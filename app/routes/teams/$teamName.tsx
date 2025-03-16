import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { teamQueries } from "~/app/queries";
import { CarouselSpacing } from "~/lib/components/carousel-spacing";

export const Route = createFileRoute("/teams/$teamName")({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      teamQueries.detail(params.teamName)
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { teamName } = Route.useParams();
  const { data: team } = useQuery(teamQueries.detail(teamName));

  if (!team) {
    return <div className="p-8">Loading team information...</div>;
  }

  return (
    <div className="">
      <div className="max-w-7xl p-8 mx-auto flex items-center gap-6 mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-md">
          <img
            src={`/team_logos/${team.logo_url}`}
            alt={`${team.name} logo`}
            className="w-full h-full object-contain p-2"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">Est. 2023</p>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">All Games</h1>
      </div>
      <div className="max-w-full bg-slate-100 dark:bg-gray-800">
        <div className="container mx-auto">
          <CarouselSpacing
            filter={(game) =>
              game.home_team_name === team.name ||
              game.away_team_name === team.name
            }
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Team stats and details would go here */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Team Roster</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Player information will be displayed here.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Team Stats</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Team statistics will be displayed here.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Games</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Recent game results will be displayed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
