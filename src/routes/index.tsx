import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ScheduleCard } from "~/lib/components/games/schedule-card";
import { Badge } from "~/lib/components/ui/badge";
import { Button } from "~/lib/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/lib/components/ui/pagination";
import { gameQueries, seasonQueries } from "~/src/queries";

const ITEMS_PER_PAGE = 5;

export const Route = createFileRoute("/")({
  component: TournamentSchedule,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(gameQueries.list());
    await context.queryClient.ensureQueryData(seasonQueries.active());
  },
});

function TournamentSchedule() {
  const { data: games } = useQuery(gameQueries.list());
  const [currentPage, setCurrentPage] = useState(1);
  const { data: activeSeason } = useQuery(seasonQueries.active());

  // Filter games by active season if available
  const seasonGames =
    games?.filter((g) =>
      // If we have an active season, filter by it.
      // If not, maybe show all (or none? user asked for active season only).
      // If activeSeason is null, we might want to default to empty or show all.
      // Assuming if activeSeason exists, we strictly filter.
      activeSeason ? g.seasonId === activeSeason.id : false,
    ) || [];

  const upcomingGames = seasonGames.filter((g) => !g.isCompleted) || [];
  const completedGames = seasonGames.filter((g) => g.isCompleted) || [];

  const totalPages = Math.ceil(upcomingGames.length / ITEMS_PER_PAGE);
  const paginatedGames = upcomingGames.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-10 text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-red-500">
          Tournament Schedule
        </h1>
        {activeSeason && (
          <p className="text-muted-foreground text-lg">{activeSeason.name}</p>
        )}
        {!activeSeason && (
          <p className="text-muted-foreground text-lg">
            Season 5 Matchups & Results
          </p>
        )}
      </div>

      {!seasonGames || seasonGames.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
          <h2 className="text-2xl font-bold text-muted-foreground">
            No games scheduled for the active season
          </h2>
          <p className="text-muted-foreground/80 mt-2">
            Check back later for the upcoming season schedule.
          </p>
        </div>
      ) : (
        <>
          {upcomingGames.length > 0 && (
            <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-md">
                  Upcoming Games
                </span>
              </h2>
              <div className="space-y-4">
                {paginatedGames.map((game) => (
                  <ScheduleCard key={game.id} game={game} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage((p) => p - 1);
                          }}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === i + 1}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(i + 1);
                            }}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages)
                              setCurrentPage((p) => p + 1);
                          }}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              <div className="mt-8 text-center">
                <Button asChild variant="outline" size="lg">
                  <Link to="/schedule">See all schedule</Link>
                </Button>
              </div>
            </div>
          )}

          {completedGames.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="bg-muted text-muted-foreground px-3 py-1 rounded-md">
                  Completed Games
                </span>
                <Badge variant="outline" className="px-2">
                  {completedGames.length}
                </Badge>
              </h2>
              <div className="space-y-4 opacity-90">
                {completedGames.map((game) => (
                  <ScheduleCard key={game.id} game={game} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
