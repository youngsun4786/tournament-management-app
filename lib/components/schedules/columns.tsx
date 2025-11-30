import { Link } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { format, isAfter, isBefore, isSameDay, parseISO } from "date-fns";
import { ArrowUpDown, ExternalLink, PlayCircle } from "lucide-react";
import { Game } from "~/src/types/game";
import { Badge } from "~/lib/components/ui/badge";
import { Button } from "~/lib/components/ui/button";
import { convert24to12 } from "~/lib/utils/date";
import { ButtonLink } from "../button-link";

export const columns: ColumnDef<Game>[] = [
  {
    accessorKey: "game_date",
    meta: {
      className: "text-center",
    },
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
        <div className="text-center">
          <div className="font-medium">{format(date, "MM.dd")}</div>
          <div className="text-xs text-muted-foreground">
            {format(date, "EEE")}
          </div>
        </div>
      );
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "start_time",
    header: "Time",
    meta: {
      className: "text-center",
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <div className="font-medium">
            {convert24to12(row.getValue("start_time"))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Venue",
    meta: {
      className: "text-center",
    },
    cell: ({ row }) => {
      const location = row.getValue("location") as string;
      const court = row.original.court;

      return (
        <div className="text-center">
          <div className="font-medium">{location}</div>
          {court && (
            <div className="text-xs text-muted-foreground">{court}</div>
          )}
        </div>
      );
    },
  },
  {
    id: "matchup",
    header: "Matchup",
    meta: {
      className: "text-center",
    },
    cell: ({ row }) => {
      const game = row.original;
      const isCompleted = game.is_completed;
      const homeWon =
        isCompleted && game.home_team_score > game.away_team_score;
      const awayWon =
        isCompleted && game.away_team_score > game.home_team_score;

      return (
        <div className="flex items-center justify-items-center gap-2 w-full px-6 py-2">
          <div className="flex flex-col items-end gap-2 min-w-[130px]">
            <Link
              to={`/teams/$teamName`}
              params={{ teamName: game.home_team_name }}
              className="flex items-center gap-2 hover:underline"
            >
              <span
                className={`font-medium text-right ${homeWon ? "font-bold text-blue-600" : ""}`}
              >
                {game.home_team_name}
              </span>
              {game.home_team_logo ? (
                <img
                  src={
                    game.home_team_name === "TBD"
                      ? "/team_logos/ccbc_logo.png"
                      : `/team_logos/${game.home_team_logo}`
                  }
                  alt={`${game.home_team_name} logo`}
                  className="h-8 w-8"
                />
              ) : (
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              )}
            </Link>
          </div>

          {isCompleted ? (
            <div className="flex flex-col items-center justify-center min-w-[70px]">
              <div className="flex items-center justify-center gap-1 text-xl font-bold">
                <span className={homeWon ? "text-blue-600" : ""}>
                  {game.home_team_score}
                </span>
                <span>:</span>
                <span className={awayWon ? "text-blue-600" : ""}>
                  {game.away_team_score}
                </span>
              </div>
              <Badge variant="outline" className="mt-1">
                Final
              </Badge>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-w-[70px]">
              <div className="text-lg font-bold">VS</div>
            </div>
          )}

          <div className="flex flex-col items-start gap-2 min-w-[130px]">
            <Link
              to={`/teams/$teamName`}
              params={{ teamName: game.away_team_name }}
              className="flex items-center gap-2 hover:underline"
            >
              {game.away_team_logo ? (
                <img
                  src={
                    game.away_team_name === "TBD"
                      ? "/team_logos/ccbc_logo.png"
                      : `/team_logos/${game.away_team_logo}`
                  }
                  alt={`${game.away_team_name} logo`}
                  className="h-8 w-8"
                />
              ) : (
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              )}
              <span
                className={`font-medium text-left ${awayWon ? "font-bold text-blue-600" : ""}`}
              >
                {game.away_team_name}
              </span>
            </Link>
          </div>
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    meta: {
      className: "text-center",
    },
    cell: ({ row }) => {
      const game = row.original;

      if (game.is_completed) {
        return (
          <Badge
            variant="outline"
            className="text-green-800 bg-green-100 dark:text-green-100 dark:bg-green-800"
          >
            Completed
          </Badge>
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
            <Badge className="bg-red-600 hover:bg-red-700 animate-pulse">
              Live
            </Badge>
          );
        }

        return <Badge className="bg-blue-600 hover:bg-blue-700">Today</Badge>;
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
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const game = row.original;
      return (
        <div className="flex flex-col gap-2 w-full items-center justify-center">
          <ButtonLink
            variant="outline"
            to="/games/$gameId"
            search={{section: ""}}
            params={{ gameId: game.id }}
            className="w-24 flex gap-1 items-center justify-center"
          >
            <ExternalLink className="h-3 w-3" />
            <span>Details</span>
          </ButtonLink>
          <ButtonLink
            variant="outline"
            size="sm"
            to="/games/$gameId"
            search={{ section: "video-section" }}
            params={{ gameId: game.id }}
            className="w-24 flex gap-1 items-center justify-center"
          >
            <PlayCircle className="h-3 w-3" />
            <span>Highlight</span>
          </ButtonLink>
        </div>
      );
    },
  },
];
