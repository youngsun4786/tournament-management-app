import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { playerQueries } from "~/src/queries";
import { columns } from "~/lib/components/players/columns";
import { DataTable } from "~/lib/components/players/data-table";

export const Route = createFileRoute("/players/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: players } = useSuspenseQuery(playerQueries.list());

  const teams = useMemo(
    () =>
      Array.from(
        new Set(
          players?.map((player) => player.team_name).filter((team) => !!team)
        )
      ),
    [players]
  );
  const positions = useMemo(
    () =>
      Array.from(
        new Set(
          players
            ?.map((player) => player.position!)
            .filter((position) => !!position)
        )
      ),
    [players]
  );

  return (
    <div>
      <div className="container m-auto p-4">
        <h1 className="text-2xl font-bold">Players</h1>
      </div>
      <div className="container m-auto p-4">
        <DataTable
          columns={columns}
          data={players}
          teams={teams}
          positions={positions}
        />
      </div>
    </div>
  );
}
