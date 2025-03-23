import { Link } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Player } from "~/app/types/player";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/lib/components/ui/dropdown-menu";
import { Button } from "../ui/button";

export const columns: ColumnDef<Player>[] = [
  {
    accessorFn: (player) => player.player_id,
    accessorKey: "name",
    header: "Players",
    cell: ({ row }) => {
      const player = row.original;
      return (
        <div className="ml-4 flex items-center gap-2">
          {/* Player avatar/image placeholder */}
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            {player.name.charAt(0)}
          </div>
          <Link
            to={"/players/$playerId"}
            params={{ playerId: player.player_id }}
            className="hover:underline"
          >
            <span className="font-medium">{player.name}</span>
          </Link>
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
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const player = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
            //   onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Edit player
            </DropdownMenuItem>
            <DropdownMenuItem>Delete player</DropdownMenuItem>
            <DropdownMenuItem>View player details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
