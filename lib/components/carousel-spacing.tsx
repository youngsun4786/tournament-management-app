import { useRouteContext } from "@tanstack/react-router";
import { GameCard } from "./games/game-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

type Game = {
  game_id: string;
  game_date: string;
  start_time: string;
  location: string | null;
  court: string | null;
  is_completed: boolean | null;
  home_team_id: string;
  home_team_name: string;
  home_team_logo: string | null;
  away_team_id: string;
  away_team_name: string;
  away_team_logo: string | null;
};

interface CarouselSpacingProps {
  filter?: (game: Game) => boolean;
}

export function CarouselSpacing({ filter }: CarouselSpacingProps) {
  // Get the games data from the route loader
  const { games } = useRouteContext({ from: "__root__" }) as { games: Game[] };

  const selectedGames = filter ? games.filter(filter) : games;

  // Get only upcoming games
  const upcomingGames = selectedGames
    .filter((game) => !game.is_completed)
    .sort(
      (a, b) =>
        new Date(a.game_date).getTime() - new Date(b.game_date).getTime()
    )
    .slice(0, 12); // Limit to 12 games

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
                key={game.game_id}
                className="pl-4 md:basis-1/3 lg:basis-1/4"
              >
                <div className="h-full">
                  <GameCard
                    gameDate={game.game_date}
                    startTime={game.start_time}
                    location={game.location!}
                    court={game.court}
                    isCompleted={game.is_completed!}
                    homeTeamName={game.home_team_name}
                    homeTeamLogo={game.home_team_logo}
                    awayTeamName={game.away_team_name}
                    awayTeamLogo={game.away_team_logo}
                  />
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
