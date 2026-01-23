import { format } from "date-fns";
import { Heart } from "lucide-react";
import { Card, CardContent } from "~/lib/components/ui/card";
import { convert24to12 } from "~/lib/utils/date";
import { Game } from "~/src/types/game";
import { ButtonLink } from "../button-link";

interface GameCardProps {
  id: string;
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  // Format date: "25.03.10 Mon, 19:00"
  const dateObj = new Date(game.gameDate);
  const formattedDate = format(dateObj, " EEEE MM/dd");
  // Parse the venue if possible
  const venue = game.court ? `${game.location} ${game.court}` : game.location;

  return (
    <Card className="h-full">
      <CardContent className="flex flex-col h-full">
        {/* Date, Venue and Favorite Button */}
        <div className="flex justify-between mb-2">
          <div className="text-xs text-gray-600">
            <div className="flex gap-1 text-black font-bold">
              <p>{formattedDate}</p>
              <p>{convert24to12(game.startTime)}</p>
            </div>
            <p>{venue}</p>
          </div>
          <button className="text-gray-300 hover:text-red-500 transition-colors">
            <Heart size={16} />
          </button>
        </div>

        {/* Teams */}
        <div className="flex-grow flex flex-col justify-center space-y-3">
          {/* Home Team */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 mr-2">
              {game.homeTeamLogo ? (
                <img
                  src={`/team_logos/${game.homeTeamName === "TBD" ? "ccbc_logo.png" : game.homeTeamLogo}`}
                  alt={game.homeTeamName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                  {game.homeTeamName!.substring(0, 2)}
                </div>
              )}
            </div>
            <div className="font-semibold text-sm">{game.homeTeamName}</div>
          </div>

          {/* Away Team */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 mr-2">
              {game.awayTeamLogo ? (
                <img
                  src={`/team_logos/${game.awayTeamName === "TBD" ? "ccbc_logo.png" : game.awayTeamLogo}`}
                  alt={game.awayTeamName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                  {game.awayTeamName!.substring(0, 2)}
                </div>
              )}
            </div>
            <div className="font-semibold text-sm">{game.awayTeamName}</div>
          </div>
        </div>

        {/* Status and See details */}
        <div className="mt-3 flex justify-between items-center">
          <div
            className={`py-1 px-2 text-xs border rounded ${game.isCompleted ? "border-green-500 text-green-500" : "border-blue-600 text-blue-600"}`}
          >
            {game.isCompleted ? "Completed" : "Scheduled"}
          </div>
          <div>
            <ButtonLink
              size="sm"
              variant="outline"
              className="text-xs"
              to="/games/$gameId"
              params={{
                gameId: game.id,
              }}
              search={{
                section: "game-details",
              }}
            >
              game details
            </ButtonLink>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
