import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar, CalendarDays, Filter } from "lucide-react";
import { gameQueries } from "~/app/queries";
import { columns } from "~/lib/components/schedules/columns";
import { DataTable } from "~/lib/components/schedules/data-table";
import { Button } from "~/lib/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/lib/components/ui/tabs";

export const Route = createFileRoute("/schedule/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: games } = useSuspenseQuery(gameQueries.list());
  const today = new Date();

  return (
    <div>
      <div className="container m-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">CCBC Schedule</h1>
          <div className="text-sm text-muted-foreground">
            {format(today, "EEEE, MMMM d, yyyy")}
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 mb-6">
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all" className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>All Games</span>
              </TabsTrigger>
              <TabsTrigger value="today" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Today</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>

        <DataTable columns={columns} data={games} />
      </div>
    </div>
  );
}
