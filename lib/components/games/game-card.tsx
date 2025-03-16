import { format } from "date-fns";
import { Heart } from "lucide-react";
import { Button } from "~/lib/components/ui/button";
import { Card, CardContent } from "~/lib/components/ui/card";
import { convert24to12 } from "~/lib/date";
interface GameCardProps {
  gameDate: string;
  startTime: string;
  location: string;
  court?: string | null;
  isCompleted: boolean;
  homeTeamName: string;
  homeTeamLogo?: string | null;
  awayTeamName: string;
  awayTeamLogo?: string | null;
}

export function GameCard({
  gameDate,
  startTime,
  location,
  court,
  isCompleted,
  homeTeamName,
  homeTeamLogo,
  awayTeamName,
  awayTeamLogo,
}: GameCardProps) {
  // Format date: "25.03.10 Mon, 19:00"
  const dateObj = new Date(gameDate);
  const formattedDate = format(dateObj, " EEEE MM/dd");
  // Parse the venue if possible
  const venue = court ? `${location} ${court}` : location;

  return (
    <Card className="h-full">
      <CardContent className="flex flex-col h-full">
        {/* Date, Venue and Favorite Button */}
        <div className="flex justify-between mb-2">
          <div className="text-xs text-gray-600">
            <div className="flex gap-1 text-black font-bold">
              <p>{formattedDate}</p>
              <p>{convert24to12(startTime)}</p>
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
              {homeTeamLogo ? (
                <img
                  src={`/team_logos/${homeTeamLogo}`}
                  alt={homeTeamName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                  {homeTeamName.substring(0, 2)}
                </div>
              )}
            </div>
            <div className="font-semibold text-sm">{homeTeamName}</div>
          </div>

          {/* Away Team */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 mr-2">
              {awayTeamLogo ? (
                <img
                  src={`/team_logos/${awayTeamLogo}`}
                  alt={awayTeamName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                  {awayTeamName.substring(0, 2)}
                </div>
              )}
            </div>
            <div className="font-semibold text-sm">{awayTeamName}</div>
          </div>
        </div>

        {/* Status and See details */}
        <div className="mt-3 flex justify-between items-center">
          <div
            className={`py-1 px-2 text-xs border border-blue-600 text-blue-600 rounded ${isCompleted ? "bg-green-500 text-green-500" : ""}`}
          >
            {isCompleted ? "Completed" : "Scheduled"}
          </div>
          <div>
            <Button size="sm" variant="outline" className="text-xs">
              game details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
