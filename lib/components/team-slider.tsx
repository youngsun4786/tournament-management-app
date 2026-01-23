import { useRouteContext } from "@tanstack/react-router";
import { InfiniteSlider } from "~/lib/components/ui/infinite-slider";

export default function TeamSlider() {
  const { teams: teamInfo } = useRouteContext({ from: "__root__" });
  const teams = teamInfo!.filter(
    (team) => team.name !== "TBD" && team.name !== "Edmonton Dragons"
  );

  return (
    <InfiniteSlider gap={24} reverse className="w-full h-full bg-white">
      {
        teams.map((team) => (
          <div key={team.id} className="flex items-center justify-center">
            <img
              src={`team_logos/${team.logoUrl}`}
              alt={team.name}
              className="h-[120px] w-auto"
            />
          </div>
        ))
      }
    </InfiniteSlider>
  );
}
