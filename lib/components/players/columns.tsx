import { Link } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { Player } from "~/src/types/player";

export const columns: ColumnDef<Player>[] = [
  {
    accessorFn: (player) => player.name,
    accessorKey: "name",
    header: "Players",
    cell: ({ row }) => {
      const player = row.original;
      return (
        <div className="ml-4 flex items-center gap-2">
          {/* Player avatar */}
          {player.player_url ? (
            <img
              src={`${player.player_url}`}
              alt={`${player.name}'s avatar`}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-600 font-medium">
                {player.name.charAt(0)}
              </span>
            </div>
          )}
{player.player_id ? (
            <Link
              to={"/players/$playerId"}
              params={{ playerId: player.player_id }}
              className="hover:underline"
            >
              <span className="font-medium">{player.name}</span>
            </Link>
          ) : (
            <span className="font-medium">{player.name}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorFn: (player) => player.team_name,
    accessorKey: "team_name",
    header: "Teams",
  },
  {
    accessorFn: (player) => player.jersey_number,
    accessorKey: "jersey_number",
    header: "Number",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("jersey_number")}</div>
    ),
  },
  {
    accessorFn: (player) => player.position,
    accessorKey: "position",
    header: "Positions",
    cell: ({ row }) => {
      const position = row.getValue("position") as string | null;
      return <div>{position ? position : "-"}</div>;
    },
  },
  {
    accessorFn: (player) => player.weight,
    accessorKey: "weight",
    header: "Weight",
    cell: ({ row }) => {
      const weight = row.getValue("weight") as string | null;
      return <div>{weight ? `${weight}kg` : "-"}</div>;
    },
  },
  {
    accessorFn: (player) => player.height,
    accessorKey: "height",
    header: "Height",
    cell: ({ row }) => {
      const height = row.getValue("height") as string | null;
      return <div>{height ? `${height}cm` : "-"}</div>;
    },
  },
];
