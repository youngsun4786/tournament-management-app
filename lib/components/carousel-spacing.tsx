import { useRouteContext } from "@tanstack/react-router";
import type { Game } from "~/app/types/game";
import { GameCard } from "./games/game-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

interface CarouselSpacingProps {
  filter?: (game: Game) => boolean;
  isTeamInfo?: boolean;
}

export function CarouselSpacing({ filter, isTeamInfo }: CarouselSpacingProps) {
  // Get the games data from the route loader
  const { games } = useRouteContext({ from: "__root__" });
  const selectedGames = filter ? games.filter(filter) : games;

  // Get only upcoming games
  let upcomingGames = selectedGames;
  if (!isTeamInfo) {
    upcomingGames = selectedGames
      .filter((game) => !game.is_completed)
      .sort(
        (a, b) =>
          new Date(a.game_date).getTime() - new Date(b.game_date).getTime()
      )
      .slice(0, 12); // Limit to 12 games
  }

  return (
    <div className="p-4 w-full max-w-7xl">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {upcomingGames.length > 0 ? (
            upcomingGames.map((game) => (
              <CarouselItem
                key={game.id}
                className="pl-4 md:basis-1/3 lg:basis-1/4"
              >
                <div className="h-full">
                  <GameCard id={game.id} game={game} />
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className="flex min-h-[80px] w-full basis-full">
              <div className="flex w-full items-center justify-center">
                <p className="text-lg font-light text-gray-500 dark:text-gray-400">
                  No Games scheduled
                </p>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
