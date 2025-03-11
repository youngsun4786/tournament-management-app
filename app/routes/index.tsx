import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { CarouselSpacing } from "../../lib/components/carousel-spacing";
import { getGames } from "../services/games.api";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const games = await getGames();
    return {
      games,
    };
  },
  component: Index,
});

function Index() {
  const { teams: teamInfo } = useRouteContext({ from: "__root__" });
  const teams = teamInfo!.teams.filter((team) => team.name !== "TBD");
  return (
    <div>
      <div className="container m-auto py-4 px-6">
        <h1 className="text-xl font-bold">Upcoming Games</h1>
      </div>
      <div className="flex justify-center items-center bg-slate-100 h-1/5">
        <CarouselSpacing></CarouselSpacing>
      </div>
      <div className="grid grid-cols-3 gap-2 m-auto py-4 px-16">
        <div className="col-span-2 pr-10 pl-5 pb-10">
          <AspectRatio ratio={16 / 9}>
            <img src="game_display/home_1.jpg" alt="display game" />
          </AspectRatio>
        </div>
        <div className="container py-4 px-6 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-bold">Team Rankings</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Rank</th>
                <th className="py-2">Team</th>
                <th className="py-2">Win</th>
                <th className="py-2">Lose</th>
                <th className="py-2">PCT</th>
                <th className="py-2">GB</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr key={team.id} className="border-t">
                  <td className="py-2 text-center">{index + 1}</td>
                  <td className="py-2 flex items-center">
                    <img
                      src={`team_logos/${team.logo_url}`}
                      alt={team.name}
                      className="w-6 h-6 mr-2"
                    />
                    {team.name}
                  </td>
                  <td className="py-2 text-center">--</td>
                  <td className="py-2 text-center">--</td>
                  <td className="py-2 text-center">--</td>
                  <td className="py-2 text-center">--</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
