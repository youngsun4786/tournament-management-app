import { createFileRoute } from "@tanstack/react-router";
import { CarouselSpacing } from "../../lib/components/carousel-spacing";
import { getGames } from "../services/games.api";
import { getTeams } from "../services/teams.api";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const teams = await getTeams();
    const games = await getGames();
    return {
      teams,
      games,
    };
  },
  component: Index,
});

function Index() {
  return (
    <div>
      <div className="container m-auto p-4">
        <h1 className="text-xl font-bold">Upcoming Games</h1>
      </div>
      <div className="flex justify-center items-center bg-slate-100 h-1/5">
        <CarouselSpacing></CarouselSpacing>
      </div>
    </div>
  );
}
