import { createFileRoute } from "@tanstack/react-router";
import {
  format,
  getMonth,
  isSameDay,
  isSameMonth,
  isSameYear,
  parseISO,
  setMonth,
} from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Game } from "~/app/types/game";
import { getGames } from "~/app/controllers/game.api";
import { CalendarView } from "~/lib/components/schedules/calendar-view";
import { columns } from "~/lib/components/schedules/columns";
import { DataTable } from "~/lib/components/schedules/data-table";
import { Button } from "~/lib/components/ui/button";
import { Card } from "~/lib/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/lib/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "~/lib/components/ui/tabs";
// Define filter status type
type StatusFilterType = "all" | "upcoming" | "completed" | "live";
type GameTypeFilter = "all" | "regular" | "playoff";
type ViewMode = "list" | "calendar";

export const Route = createFileRoute("/schedule/")({
  loader: async () => {
    const games = await getGames();
    return {
      games,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { games } = Route.useLoaderData();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [gameType, setGameType] = useState<GameTypeFilter>("all");
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  // Extract unique teams from games for the dropdown
  const teams = [
    ...new Set(
      games!.flatMap((game) => [
        { id: game.home_team_id, name: game.home_team_name },
        { id: game.away_team_id, name: game.away_team_name },
      ])
    ),
  ].reduce(
    (unique, team) => {
      // Check if team is already in the unique array by id
      if (!unique.some((t) => t.id === team.id)) {
        unique.push(team);
      }
      return unique;
    },
    [] as { id: string; name: string }[]
  );

  // Sort teams alphabetically
  teams.sort((a, b) => a.name.localeCompare(b.name));

  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => setMonth(prevDate, getMonth(prevDate) - 1));
    setShowTodayOnly(false); // Reset today filter when changing months
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => setMonth(prevDate, getMonth(prevDate) + 1));
    setShowTodayOnly(false); // Reset today filter when changing months
  };

  // Set date to today and filter for today only
  const handleToday = () => {
    setCurrentDate(new Date());
    setShowTodayOnly(true);
  };

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    // Validate that the value is a valid StatusFilterType
    if (
      value === "all" ||
      value === "upcoming" ||
      value === "completed" ||
      value === "live"
    ) {
      setStatusFilter(value);
    }
  };

  // Filter games based on selected filters
  const filteredGames = games!.filter((game) => {
    const gameDate = parseISO(game.game_date);

    // Today Only filter (higher priority)
    if (showTodayOnly) {
      return isSameDay(gameDate, today);
    }

    // Month/Year filter (applied to both calendar and list view)
    const monthYearMatch =
      isSameMonth(gameDate, currentDate) && isSameYear(gameDate, currentDate);
    if (!monthYearMatch) {
      return false;
    }

    // Status filter
    if (statusFilter === "upcoming" && game.is_completed) return false;
    if (statusFilter === "completed" && !game.is_completed) return false;

    // Team filter
    if (teamFilter !== "all") {
      return (
        game.home_team_id === teamFilter || game.away_team_id === teamFilter
      );
    }

    return true;
  });

  // Reset "Today Only" filter when changing tabs
  useEffect(() => {
    setShowTodayOnly(false);
  }, [statusFilter, teamFilter, gameType]);

  return (
    <div>
      <div className="container m-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Schedules & Scores</h1>
          <div className="text-sm text-muted-foreground">
            {format(today, "EEEE, MMMM d, yyyy")}
          </div>
        </div>

        {/* Main filtering area */}
        <Card className="mb-6 p-4">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:justify-between gap-2">
            {/* Team filter */}
            <div className="flex-1">
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All team</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Month and year selector - centered */}
            <div className="flex items-center justify-center space-x-2">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div
                className={`text-lg font-medium ${showTodayOnly ? "opacity-50" : ""}`}
              >
                {format(currentDate, "yyyy. MM")}
              </div>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Game type and view selection */}
            <div className="flex space-x-2">
              <Select
                defaultValue="all"
                value={gameType}
                onValueChange={(value: GameTypeFilter) => setGameType(value)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All game</SelectItem>
                  <SelectItem value="regular">Regular Season</SelectItem>
                  <SelectItem value="playoff">Playoff</SelectItem>
                </SelectContent>
              </Select>
              <div className="border rounded-md flex">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("calendar")}
                  className="rounded-l-none border-l"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Status filter tabs */}
        <div className="mb-6">
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={handleStatusChange}
          >
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="my-4 flex items-center justify-between">
          {/* Today quick button */}
          <Button
            variant={showTodayOnly ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={handleToday}
          >
            <Calendar className="h-4 w-4" />
            <span>Today</span>
          </Button>

          {/* Filter info */}
          {showTodayOnly && (
            <div className="text-sm text-muted-foreground">
              Showing games for {format(today, "MMMM d, yyyy")} only
            </div>
          )}
        </div>

        {viewMode === "list" ? (
          <DataTable columns={columns} data={filteredGames as Game[]} />
        ) : (
          <CalendarView
            games={filteredGames as Game[]}
            currentDate={currentDate}
          />
        )}
      </div>
    </div>
  );
}
