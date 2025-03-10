import { useRouteContext } from "@tanstack/react-router";
import { GameCard } from "./games/game-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

interface Game {
  game_id: string;
  game_date: string;
  start_time: string;
  location: string;
  court: string | null;
  is_completed: boolean;
  home_team_id: string;
  home_team_name: string;
  home_team_logo: string | null;
  away_team_id: string;
  away_team_name: string;
  away_team_logo: string | null;
}

export function CarouselSpacing() {
  // Get the games data from the route loader
  const { games } = useRouteContext({ from: "/" }) as { games: Game[] };

  // Get only upcoming games
  const upcomingGames = games
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
          {upcomingGames.map((game) => (
            <CarouselItem
              key={game.game_id}
              className="pl-4 md:basis-1/3 lg:basis-1/4"
            >
              <div className="h-full">
                <GameCard
                  gameDate={game.game_date}
                  startTime={game.start_time}
                  location={game.location}
                  court={game.court}
                  isCompleted={game.is_completed}
                  homeTeamName={game.home_team_name}
                  homeTeamLogo={game.home_team_logo}
                  awayTeamName={game.away_team_name}
                  awayTeamLogo={game.away_team_logo}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
