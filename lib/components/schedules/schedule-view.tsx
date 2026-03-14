import { format } from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
} from "lucide-react";
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
import { useScheduleFilters } from "~/lib/hooks/use-schedule-filters";
import { Game } from "~/src/types/game";
import { GameCard } from "~/lib/components/games/game-card";
import { CalendarView } from "./calendar-view";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface ScheduleViewProps {
  games: Game[];
}

export function ScheduleView({ games }: ScheduleViewProps) {
  const {
    today,
    currentDate,
    viewMode,
    setViewMode,
    teamFilter,
    setTeamFilter,
    showTodayOnly,
    teams,
    filteredGames,
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    handleStatusChange,
  } = useScheduleFilters(games);

  return (
    <>
      <Card className="mb-6 p-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:justify-between gap-2">
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

          <div className="flex space-x-2">
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
        <Button
          variant={showTodayOnly ? "default" : "outline"}
          className="flex items-center gap-2"
          onClick={handleToday}
        >
          <Calendar className="h-4 w-4" />
          <span>Today</span>
        </Button>
        {showTodayOnly && (
          <div className="text-sm text-muted-foreground">
            Showing games for {format(today, "MMMM d, yyyy")} only
          </div>
        )}
      </div>

      {viewMode === "list" ? (
        <DataTable
          columns={columns}
          data={filteredGames as Game[]}
          renderMobileItem={(game) => <GameCard game={game} />}
        />
      ) : (
        <CalendarView
          games={filteredGames as Game[]}
          currentDate={currentDate}
        />
      )}
    </>
  );
}
