import { Link } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { format, isAfter, isBefore, isSameDay, parseISO } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Game } from "~/app/domains/types";
import { Badge } from "~/lib/components/ui/badge";
import { Button } from "~/lib/components/ui/button";
import { convert24to12 } from "~/lib/date";

export const columns: ColumnDef<Game>[] = [
  {
    accessorKey: "game_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = parseISO(row.getValue("game_date"));
      return (
        <div className="font-medium">{format(date, "EEE, MMM d, yyyy")}</div>
      );
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "start_time",
    header: "Time",
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          {convert24to12(row.getValue("start_time"))}
        </div>
      );
    },
  },
  {
    id: "matchup",
    header: "Matchup",
    cell: ({ row }) => {
      const game = row.original;

      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Link
              to={`/teams/$teamName`}
              params={{ teamName: game.home_team_name }}
              className="flex items-center gap-2 hover:underline"
            >
              {game.home_team_logo ? (
                <img
                  src={`/team_logos/${game.home_team_logo}`}
                  alt={`${game.home_team_name} logo`}
                  className="h-6 w-6"
                />
              ) : (
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              )}
              <span className="font-medium">{game.home_team_name}</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/teams/$teamName`}
              params={{ teamName: game.away_team_name }}
              className="flex items-center gap-2 hover:underline"
            >
              {game.away_team_logo ? (
                <img
                  src={`/team_logos/${game.away_team_logo}`}
                  alt={`${game.away_team_name} logo`}
                  className="h-6 w-6"
                />
              ) : (
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              )}
              <span className="font-medium">{game.away_team_name}</span>
            </Link>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const location = row.getValue("location") as string;
      const court = row.original.court;

      return (
        <div className="text-sm">
          <div>{location}</div>
          {court && <div className="text-muted-foreground">Court: {court}</div>}
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const game = row.original;

      if (game.is_completed) {
        const homeWon = game.home_team_score > game.away_team_score;
        const awayWon = game.away_team_score > game.home_team_score;

        return (
          <div className="text-center">
            <div className="flex justify-center space-x-2">
              <span className={homeWon ? "font-bold" : ""}>
                {game.home_team_score}
              </span>
              <span>-</span>
              <span className={awayWon ? "font-bold" : ""}>
                {game.away_team_score}
              </span>
            </div>
            <Badge variant="outline" className="mt-1">
              Final
            </Badge>
          </div>
        );
      }

      const gameDate = parseISO(game.game_date);
      const today = new Date();

      if (isSameDay(gameDate, today)) {
        // Check if game is happening now
        const [hours, minutes] = game.start_time.split(":");
        const gameTime = new Date(gameDate);
        gameTime.setHours(parseInt(hours), parseInt(minutes));

        const twoHoursLater = new Date(gameTime);
        twoHoursLater.setHours(gameTime.getHours() + 2);

        if (isAfter(today, gameTime) && !isAfter(today, twoHoursLater)) {
          return (
            <span className="px-2 py-1 text-xs font-medium rounded-full text-red-800 bg-red-100 dark:text-red-100 dark:bg-red-800 animate-pulse">
              Live
            </span>
          );
        }

        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full text-blue-800 bg-blue-100 dark:text-blue-100 dark:bg-blue-800">
            Today
          </span>
        );
      }

      if (isBefore(gameDate, today)) {
        return (
          <Badge
            variant="outline"
            className="text-yellow-800 bg-yellow-100 dark:text-yellow-100 dark:bg-yellow-800"
          >
            Completed
          </Badge>
        );
      }

      return (
        <Badge className="bg-green-600 hover:bg-green-700">Upcoming</Badge>
      );
    },
  },
];
