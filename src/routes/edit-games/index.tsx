import {
  createFileRoute,
  redirect,
  useRouteContext,
} from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { format, isAfter, isBefore, isSameDay } from "date-fns";
import { ArrowUpDown, Edit } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "~/lib/components/button-link";
import { DataTable } from "~/lib/components/schedules/data-table";
import { Badge } from "~/lib/components/ui/badge";
import { Button } from "~/lib/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/lib/components/ui/select";
import { convert24to12 } from "~/lib/utils/date";
import { Game } from "~/src/types/game";

export const Route = createFileRoute("/edit-games/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.authState.isAuthenticated) {
      throw redirect({ to: "/" });
    }

    if (
      context.authState.user.role !== "admin" &&
      context.authState.user.role !== "score-keeper"
    ) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  const { games } = useRouteContext({ from: "__root__" });
  const [selectedTeam, setSelectedTeam] = useState<string>("All team");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  // Get unique team names for the dropdown
  const teamNames = [
    "All team",
    ...Array.from(
      new Set(games.flatMap((game) => [game.homeTeamName, game.awayTeamName])),
    ),
  ].sort();

  // Filter games based on selection
  const filteredGames = games.filter((game) => {
    const teamFilter =
      selectedTeam === "All team" ||
      game.homeTeamName === selectedTeam ||
      game.awayTeamName === selectedTeam;

    const statusFilter =
      selectedFilter === "All" ||
      (selectedFilter === "Completed" && game.isCompleted);

    return teamFilter && statusFilter;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Player Stats</h1>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-4">
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Team" />
            </SelectTrigger>
            <SelectContent>
              {teamNames.map((team) => (
                <SelectItem key={team} value={team!}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex overflow-x-auto rounded-lg border">
          <Button
            variant={selectedFilter === "All" ? "default" : "ghost"}
            className="rounded-none"
            onClick={() => setSelectedFilter("All")}
          >
            All
          </Button>
          <Button
            variant={selectedFilter === "Completed" ? "default" : "ghost"}
            className="rounded-none"
            onClick={() => setSelectedFilter("Completed")}
          >
            Completed
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable columns={columns} data={filteredGames} />
      </div>
    </div>
  );
}

const columns: ColumnDef<Game>[] = [
  {
    accessorKey: "gameDate",
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
      const date = row.getValue("gameDate") as Date;
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
    accessorKey: "startTime",
    header: "Time",
    meta: {
      className: "text-center",
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <div className="font-medium">
            {convert24to12(row.getValue("startTime") as string)}
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
      const isCompleted = game.isCompleted;
      const homeWon = isCompleted && game.homeTeamScore > game.awayTeamScore;
      const awayWon = isCompleted && game.awayTeamScore > game.homeTeamScore;

      return (
        <div className="flex items-center justify-items-center gap-2 w-full px-6 py-2">
          <div className="flex flex-col items-end gap-2 min-w-[130px]">
            <span
              className={`font-medium text-right ${homeWon ? "font-bold text-blue-600" : ""}`}
            >
              {game.homeTeamName}
            </span>
          </div>

          {isCompleted ? (
            <div className="flex flex-col items-center justify-center min-w-[70px]">
              <div className="flex items-center justify-center gap-1 text-xl font-bold">
                <span className={homeWon ? "text-blue-600" : ""}>
                  {game.homeTeamScore}
                </span>
                <span>:</span>
                <span className={awayWon ? "text-blue-600" : ""}>
                  {game.awayTeamScore}
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
            <span
              className={`font-medium text-left ${awayWon ? "font-bold text-blue-600" : ""}`}
            >
              {game.awayTeamName}
            </span>
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

      if (game.isCompleted) {
        return (
          <Badge
            variant="outline"
            className="text-green-800 bg-green-100 dark:text-green-100 dark:bg-green-800"
          >
            Completed
          </Badge>
        );
      }

      const today = new Date();

      if (isSameDay(game.gameDate, today)) {
        // Check if game is happening now
        const [hours, minutes] = game.startTime.split(":");
        const gameTime = new Date(game.gameDate);
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

      if (isBefore(game.gameDate, today)) {
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
        <div className="flex justify-center">
          <ButtonLink
            variant="outline"
            to="/edit-games/$gameId"
            params={{ gameId: game.id }}
            className="w-24 flex gap-1 items-center justify-center"
          >
            <Edit className="h-3 w-3" />
            <span>Edit Stats</span>
          </ButtonLink>
        </div>
      );
    },
  },
];
