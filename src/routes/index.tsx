// import { useQuery } from "@tanstack/react-query";
// import { createFileRoute, Link } from "@tanstack/react-router";
// import { useState } from "react";
// import { ScheduleCard } from "~/lib/components/games/schedule-card";
// import { Badge } from "~/lib/components/ui/badge";
// import { Button } from "~/lib/components/ui/button";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "~/lib/components/ui/pagination";
// import { gameQueries, seasonQueries } from "~/src/queries";

// const ITEMS_PER_PAGE = 5;

// export const Route = createFileRoute("/")({
//   component: TournamentSchedule,
//   loader: async ({ context }) => {
//     await context.queryClient.ensureQueryData(gameQueries.list());
//     await context.queryClient.ensureQueryData(seasonQueries.active());
//   },
// });

// function TournamentSchedule() {
//   const { data: games } = useQuery(gameQueries.list());
//   const [currentPage, setCurrentPage] = useState(1);
//   const { data: activeSeason } = useQuery(seasonQueries.active());

//   // Filter games by active season if available
//   const seasonGames =
//     games?.filter((g) =>
//       // If we have an active season, filter by it.
//       // If not, maybe show all (or none? user asked for active season only).
//       // If activeSeason is null, we might want to default to empty or show all.
//       // Assuming if activeSeason exists, we strictly filter.
//       activeSeason ? g.seasonId === activeSeason.id : false,
//     ) || [];

//   const upcomingGames = seasonGames.filter((g) => !g.isCompleted) || [];
//   const completedGames = seasonGames.filter((g) => g.isCompleted) || [];

//   const totalPages = Math.ceil(upcomingGames.length / ITEMS_PER_PAGE);
//   const paginatedGames = upcomingGames.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE,
//   );

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-5xl">
//       <div className="mb-10 text-center space-y-2">
//         <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-red-500">
//           Tournament Schedule
//         </h1>
//         {activeSeason && (
//           <p className="text-muted-foreground text-lg">{activeSeason.name}</p>
//         )}
//         {!activeSeason && (
//           <p className="text-muted-foreground text-lg">
//             Season 5 Matchups & Results
//           </p>
//         )}
//       </div>

//       {!seasonGames || seasonGames.length === 0 ? (
//         <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
//           <h2 className="text-2xl font-bold text-muted-foreground">
//             No games scheduled for the active season
//           </h2>
//           <p className="text-muted-foreground/80 mt-2">
//             Check back later for the upcoming season schedule.
//           </p>
//         </div>
//       ) : (
//         <>
//           {upcomingGames.length > 0 && (
//             <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
//               <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
//                 <span className="bg-primary/10 text-primary px-3 py-1 rounded-md">
//                   Upcoming Games
//                 </span>
//               </h2>
//               <div className="space-y-4">
//                 {paginatedGames.map((game) => (
//                   <ScheduleCard key={game.id} game={game} />
//                 ))}
//               </div>

//               {totalPages > 1 && (
//                 <div className="mt-8">
//                   <Pagination>
//                     <PaginationContent>
//                       <PaginationItem>
//                         <PaginationPrevious
//                           href="#"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             if (currentPage > 1) setCurrentPage((p) => p - 1);
//                           }}
//                           className={
//                             currentPage === 1
//                               ? "pointer-events-none opacity-50"
//                               : "cursor-pointer"
//                           }
//                         />
//                       </PaginationItem>

//                       {Array.from({ length: totalPages }).map((_, i) => (
//                         <PaginationItem key={i}>
//                           <PaginationLink
//                             href="#"
//                             isActive={currentPage === i + 1}
//                             onClick={(e) => {
//                               e.preventDefault();
//                               setCurrentPage(i + 1);
//                             }}
//                           >
//                             {i + 1}
//                           </PaginationLink>
//                         </PaginationItem>
//                       ))}

//                       <PaginationItem>
//                         <PaginationNext
//                           href="#"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             if (currentPage < totalPages)
//                               setCurrentPage((p) => p + 1);
//                           }}
//                           className={
//                             currentPage === totalPages
//                               ? "pointer-events-none opacity-50"
//                               : "cursor-pointer"
//                           }
//                         />
//                       </PaginationItem>
//                     </PaginationContent>
//                   </Pagination>
//                 </div>
//               )}

//               <div className="mt-8 text-center">
//                 <Button asChild variant="outline" size="lg">
//                   <Link to="/schedule">See all schedule</Link>
//                 </Button>
//               </div>
//             </div>
//           )}

//           {completedGames.length > 0 && (
//             <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
//               <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
//                 <span className="bg-muted text-muted-foreground px-3 py-1 rounded-md">
//                   Completed Games
//                 </span>
//                 <Badge variant="outline" className="px-2">
//                   {completedGames.length}
//                 </Badge>
//               </h2>
//               <div className="space-y-4 opacity-90">
//                 {completedGames.map((game) => (
//                   <ScheduleCard key={game.id} game={game} />
//                 ))}
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }


import { createFileRoute } from "@tanstack/react-router";
import {
  format,
  getMonth,
  isSameDay,
  isSameMonth,
  isSameYear,
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
import { getGames } from "~/src/controllers/game.api";
import { Game } from "~/src/types/game";
import { ButtonLink } from "~/lib/components/button-link";
// Define filter status type
type StatusFilterType = "all" | "upcoming" | "completed" | "live";
type GameTypeFilter = "all" | "regular" | "playoff";
type ViewMode = "list" | "calendar";

export const Route = createFileRoute("/")({
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
        { id: game.homeTeamId, name: game.homeTeamName || "Unknown" },
        { id: game.awayTeamId, name: game.awayTeamName || "Unknown" },
      ]),
    ),
  ].reduce(
    (unique, team) => {
      // Check if team is already in the unique array by id
      if (!unique.some((t) => t.id === team.id)) {
        unique.push(team);
      }
      return unique;
    },
    [] as { id: string; name: string }[],
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
    const gameDate = new Date(game.gameDate);

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
    if (statusFilter === "upcoming" && game.isCompleted) return false;
    if (statusFilter === "completed" && !game.isCompleted) return false;

    // Team filter
    if (teamFilter !== "all") {
      return game.homeTeamId === teamFilter || game.awayTeamId === teamFilter;
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
      </div>
    </div>
  );
}

function GameCard({ game }: { game: Game }) {
  const isCompleted = game.isCompleted;
  const homeWon = isCompleted && game.homeTeamScore > game.awayTeamScore;
  const awayWon = isCompleted && game.awayTeamScore > game.homeTeamScore;

  const today = new Date();
  let statusBadge = (
    <span className="inline-flex items-center rounded-full border border-transparent bg-green-600 px-2 py-0.5 text-xs font-semibold text-white hover:bg-green-700">
      Upcoming
    </span>
  );

  if (isCompleted) {
    statusBadge = (
      <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-100">
        Completed
      </span>
    );
  } else if (isSameDay(game.gameDate, today)) {
    const [hours, minutes] = game.startTime.split(":");
    const gameTime = new Date(game.gameDate);
    gameTime.setHours(parseInt(hours), parseInt(minutes));

    const twoHoursLater = new Date(gameTime);
    twoHoursLater.setHours(gameTime.getHours() + 2);

    if (
      (isSameDay(today, gameTime) &&
        today.getHours() >= gameTime.getHours() &&
        today.getMinutes() >= gameTime.getMinutes()) ||
      (isSameDay(today, gameTime) &&
        today.getHours() > gameTime.getHours() &&
        today.getHours() < twoHoursLater.getHours())
    ) {
      statusBadge = (
        <span className="inline-flex animate-pulse items-center rounded-full border border-transparent bg-red-600 px-2 py-0.5 text-xs font-semibold text-white hover:bg-red-700">
          Live
        </span>
      );
    } else {
      statusBadge = (
        <span className="inline-flex items-center rounded-full border border-transparent bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white hover:bg-blue-700">
          Today
        </span>
      );
    }
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col p-4">
        {/* Header: Date, Time, Status */}
        <div className="mb-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-medium text-foreground">
              {format(new Date(game.gameDate), "MM.dd")}
            </span>
            <span>{format(new Date(game.gameDate), "EEE")}</span>
            <span>•</span>
            <span>
              {new Date(`2000-01-01T${game.startTime}`).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
          {statusBadge}
        </div>

        {/* Matchup */}
        <div className="mb-4 flex flex-col gap-3">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {game.homeTeamLogo ? (
                <img
                  src={
                    game.homeTeamName === "TBD"
                      ? "/team_logos/ccbc_logo.png"
                      : `/team_logos/${game.homeTeamLogo}`
                  }
                  alt={game.homeTeamName || "Home Team"}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-muted" />
              )}
              <span
                className={`font-medium ${homeWon ? "font-bold text-blue-600" : ""}`}
              >
                {game.homeTeamName || "TBD"}
              </span>
            </div>
            {isCompleted && (
              <span
                className={`text-lg font-semibold ${homeWon ? "text-blue-600" : ""}`}
              >
                {game.homeTeamScore}
              </span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {game.awayTeamLogo ? (
                <img
                  src={
                    game.awayTeamName === "TBD"
                      ? "/team_logos/ccbc_logo.png"
                      : `/team_logos/${game.awayTeamLogo}`
                  }
                  alt={game.awayTeamName || "Away Team"}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-muted" />
              )}
              <span
                className={`font-medium ${awayWon ? "font-bold text-blue-600" : ""}`}
              >
                {game.awayTeamName || "TBD"}
              </span>
            </div>
            {isCompleted && (
              <span
                className={`text-lg font-semibold ${awayWon ? "text-blue-600" : ""}`}
              >
                {game.awayTeamScore}
              </span>
            )}
          </div>
        </div>

        {/* Footer: Venue & Actions */}
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex flex-col text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{game.location}</span>
            {game.court && <span>{game.court}</span>}
          </div>
          <div className="flex gap-2">
            <ButtonLink
              to="/games/$gameId"
              params={{ gameId: game.id }}
              search={{ section: "" }}
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
            >
              Details
            </ButtonLink>
            <ButtonLink
              to="/games/$gameId"
              params={{ gameId: game.id }}
              search={{ section: "video-section" }}
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
            >
              Highlights
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
