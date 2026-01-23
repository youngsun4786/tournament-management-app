import {
  getDate,
  getDaysInMonth,
  getMonth,
  getYear,
  startOfMonth,
} from "date-fns";
import { cn } from "~/lib/utils/cn";
import { Game } from "~/src/types/game";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

interface CalendarViewProps {
  games: Game[];
  currentDate: Date;
}

export function CalendarView({ games, currentDate }: CalendarViewProps) {
  const currentMonth = getMonth(currentDate);
  const currentYear = getYear(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = startOfMonth(currentDate).getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Create array of day numbers for the current month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Add empty cells for the days before the first day of the month
  const calendarCells: (number | null)[] = [
    ...Array.from({ length: firstDayOfMonth }, () => null),
    ...days,
  ];

  // Group games by date
  const gamesByDate = games.reduce(
    (acc, game) => {
      // Only include games for the current month/year
      if (
        getMonth(game.gameDate) === currentMonth &&
        getYear(game.gameDate) === currentYear
      ) {
        const day = getDate(game.gameDate);
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(game);
      }

      return acc;
    },
    {} as Record<number, Game[]>
  );

  return (
    <div className="border rounded-md p-4">
      <div className="grid grid-cols-7 gap-2 text-center font-medium mb-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarCells.map((day, index) => {
          const hasGames = day !== null && gamesByDate[day]?.length > 0;

          return (
            <div
              key={index}
              className={cn(
                "min-h-[120px] border rounded-md p-2",
                day === null ? "bg-muted/20" : "bg-card",
                day === getDate(new Date()) &&
                  getMonth(new Date()) === currentMonth
                  ? "border-blue-500 border-2"
                  : ""
              )}
            >
              {day !== null && (
                <>
                  <div className="font-medium text-right mb-1">{day}</div>

                  {hasGames ? (
                    <ScrollArea className="h-[100px]">
                      <div className="space-y-2">
                        {gamesByDate[day].map((game) => (
                          <Card key={game.id} className="p-2 text-xs">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold">
                                {game.startTime.slice(0, 5)}
                              </span>
                              {game.isCompleted ? (
                                <Badge variant="outline" className="text-xs">
                                  Final
                                </Badge>
                              ) : (
                                <Badge className="bg-green-600 text-xs">
                                  Upcoming
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              {game.homeTeamLogo ? (
                                <img
                                  src={`/team_logos/${game.homeTeamLogo}`}
                                  alt={`${game.homeTeamName}`}
                                  className="h-4 w-4"
                                />
                              ) : (
                                <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                              )}
                              <span className="truncate">
                                {game.homeTeamName}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              {game.awayTeamLogo ? (
                                <img
                                  src={`/team_logos/${game.awayTeamLogo}`}
                                  alt={`${game.awayTeamName}`}
                                  className="h-4 w-4"
                                />
                              ) : (
                                <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                              )}
                              <span className="truncate">
                                {game.awayTeamName}
                              </span>
                            </div>

                            <div className="text-muted-foreground text-[10px] mt-1 truncate">
                              {game.location}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex items-center justify-center h-[80px] text-muted-foreground text-sm">
                      No games
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
