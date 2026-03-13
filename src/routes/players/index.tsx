import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { columns } from "~/lib/components/players/columns";
import { DataTable } from "~/lib/components/players/data-table";
import { PageLayout } from "~/lib/components/page-layout";
import { playerQueries } from "~/src/queries";

export const Route = createFileRoute("/players/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    await context.queryClient.ensureQueryData(playerQueries.list());
  },
});

function RouteComponent() {
  const { data: players } = useSuspenseQuery(playerQueries.list());

  const teams = useMemo(
    () =>
      Array.from(
        new Set(
          players?.map((player) => player.teamName).filter((team) => !!team)
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
    <PageLayout title="Players">
      <DataTable
        columns={columns}
        data={players}
        teams={teams}
        positions={positions}
      />
    </PageLayout>
  );
}
