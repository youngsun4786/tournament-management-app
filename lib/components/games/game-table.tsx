import { Link } from "@tanstack/react-router";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { format, isAfter, isSameDay, parseISO } from "date-fns";
import { useState } from "react";
import { Game } from "~/app/types/game";
import { convert24to12 } from "~/lib/date";

interface GamesTableProps {
  dateStr: string;
  games: Game[];
}

interface DTProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const columnHelper = createColumnHelper<Game>();

export function GamesTable({ dateStr, games }: GamesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = [
    columnHelper.accessor("game_date", {
      header: "Date/Time",
      cell: (info) => {
        const game = info.row.original;
        const date = parseISO(game.game_date);
        const formattedDate = format(date, "EEE, MMM d");

        // Format time from 24h to 12h format
        const formattedTime = convert24to12(game.start_time);
        return (
          <div className="flex flex-col">
            <span className="font-semibold">{formattedDate}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formattedTime}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor("location", {
      header: "Location",
      cell: (info) => {
        const game = info.row.original;
        return (
          <div className="flex flex-col">
            <span>{game.location}</span>
            {game.court && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {game.court}
              </span>
            )}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "matchup",
      header: "Matchup",
      cell: (info) => {
        const game = info.row.original;
        if (game.away_team_name === "TBD") {
          game.away_team_logo = "ccbc_logo.png";
        }
        if (game.home_team_name === "TBD") {
          game.home_team_logo = "ccbc_logo.png";
        }

        return (
          <div className="flex items-center justify-between gap-2 min-w-[300px]">
            {/* Away Team */}
            <div className="flex flex-1 items-center justify-end">
              <Link
                // TODO: add link to team page
                to={`/`}
                className="flex items-center gap-2 hover:underline"
              >
                <span className="font-medium text-right">
                  {game.away_team_name}
                </span>
                <div className="h-8 w-8 flex-shrink-0">
                  {game.away_team_logo ? (
                    <img
                      src={`/team_logos/${game.away_team_name === "TBD" ? "ccbc_logo.png" : game.away_team_logo}`}
                      alt={`${game.away_team_name} logo`}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xs">
                        {game.away_team_name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </div>

            {/* Score or @ Symbol */}
            <div className="flex items-center justify-center w-16">
              {game.is_completed ? (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{game.away_team_score}</span>
                  <span className="text-xs">-</span>
                  <span className="font-semibold">{game.home_team_score}</span>
                </div>
              ) : (
                <span className="text-gray-500">VS</span>
              )}
            </div>

            {/* Home Team */}
            <div className="flex flex-1 items-center">
              <Link
                // TODO: add link to team page
                to={`/`}
                className="flex items-center gap-2 hover:underline"
              >
                <div className="h-8 w-8 flex-shrink-0">
                  {game.home_team_logo ? (
                    <img
                      src={`/team_logos/${game.home_team_name === "TBD" ? "ccbc_logo.png" : game.home_team_logo}`}
                      alt={`${game.home_team_name} logo`}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xs">
                        {game.home_team_name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <span className="font-medium">{game.home_team_name}</span>
              </Link>
            </div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "status",
      header: "Status",
      cell: (info) => {
        const game = info.row.original;

        if (game.is_completed) {
          return (
            <span className="px-2 py-1 text-xs font-medium rounded-full text-green-800 bg-green-100 dark:text-green-100 dark:bg-green-800">
              Final
            </span>
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

        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full text-gray-800 bg-gray-100 dark:text-gray-100 dark:bg-gray-800">
            Upcoming
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "action",
      header: "",
      cell: (info) => (
        <Link
          // TODO: add link to team page
          to={`/`}
          className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          Details
        </Link>
      ),
    }),
  ];

  const table = useReactTable({
    data: games,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const date = parseISO(dateStr);
  const formattedDateHeading = format(date, "EEEE, MMMM d, yyyy");
  const isToday = isSameDay(date, new Date());

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3 flex items-center">
        {formattedDateHeading}
        {isToday && (
          <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full text-blue-800 bg-blue-100 dark:text-blue-100 dark:bg-blue-800">
            Today
          </span>
        )}
      </h2>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className=" px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
