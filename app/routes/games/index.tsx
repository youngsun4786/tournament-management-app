import { createFileRoute } from "@tanstack/react-router";
import {
  endOfDay,
  format,
  isAfter,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfToday,
} from "date-fns";
import { useMemo, useState } from "react";
import { useGetGames } from "~/app/services/queries";
import { DateSelector } from "~/lib/components/date-selector";
import { GamesTable } from "~/lib/components/games/game-table";

export const Route = createFileRoute("/games/")({
  component: GamesPage,
});

// Define the game type based on the API response structure
type Game = {
  game_id: string;
  game_date: string;
  start_time: string;
  location: string | null;
  court: string | null;
  is_completed: boolean | null;
  home_team_score: number;
  away_team_score: number;
  home_team_id: string;
  home_team_name: string;
  home_team_logo: string | null;
  away_team_id: string;
  away_team_name: string;
  away_team_logo: string | null;
};

function GamesPage() {
  // Get the games data from the route loader
  const { data: games = [], isLoading, isError } = useGetGames();
  const [selectedDate, setSelectedDate] = useState(startOfToday());

  // Filter games based on selected date
  const filteredGames = useMemo(() => {
    // If we're on the today view (default), show from today onward
    if (isSameDay(selectedDate, startOfToday())) {
      const today = startOfToday();
      return games.filter((game) => {
        const gameDate = startOfDay(parseISO(game.game_date));
        return !isAfter(today, gameDate); // Include today and future dates
      });
    } else {
      // Otherwise, only show games for the selected date
      return games.filter((game) => {
        const gameDate = parseISO(game.game_date);
        return isWithinInterval(gameDate, {
          start: startOfDay(selectedDate),
          end: endOfDay(selectedDate),
        });
      });
    }
  }, [games, selectedDate]);

  // Group games by date for display
  const gamesByDate = useMemo(() => {
    const grouped = filteredGames.reduce(
      (acc, game) => {
        const dateKey = format(parseISO(game.game_date), "yyyy-MM-dd");
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(game);
        return acc;
      },
      {} as Record<string, Game[]>
    );

    // Sort dates
    return Object.entries(grouped).sort(([dateA], [dateB]) =>
      dateA.localeCompare(dateB)
    );
  }, [filteredGames]);

  // For each date group, create a separate table
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Games & Scores</h1>
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Games & Scores</h1>
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Failed to load games. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (filteredGames.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Games & Scores</h1>
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          <p>No games scheduled for the selected date.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Games & Scores</h1>

      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {gamesByDate.map(([dateStr, dateGames]) => (
            <GamesTable key={dateStr} dateStr={dateStr} games={dateGames} />
          ))}
        </div>
      </div>
    </div>
  );
}
