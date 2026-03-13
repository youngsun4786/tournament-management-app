import {
  getMonth,
  isSameDay,
  isSameMonth,
  isSameYear,
  setMonth,
} from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { Game } from "~/src/types/game";

type StatusFilterType = "all" | "upcoming" | "completed" | "live";
type GameTypeFilter = "all" | "regular" | "playoff";
type ViewMode = "list" | "calendar";

export function useScheduleFilters(games: Game[]) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [gameType, setGameType] = useState<GameTypeFilter>("all");
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  const teams = useMemo(() => {
    const uniqueTeams = games
      .flatMap((game) => [
        { id: game.homeTeamId, name: game.homeTeamName || "Unknown" },
        { id: game.awayTeamId, name: game.awayTeamName || "Unknown" },
      ])
      .reduce(
        (acc, team) => {
          if (!acc.some((t) => t.id === team.id)) {
            acc.push(team);
          }
          return acc;
        },
        [] as { id: string; name: string }[],
      );
    return uniqueTeams.sort((a, b) => a.name.localeCompare(b.name));
  }, [games]);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => setMonth(prev, getMonth(prev) - 1));
    setShowTodayOnly(false);
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => setMonth(prev, getMonth(prev) + 1));
    setShowTodayOnly(false);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setShowTodayOnly(true);
  };

  const handleStatusChange = (value: string) => {
    if (
      value === "all" ||
      value === "upcoming" ||
      value === "completed" ||
      value === "live"
    ) {
      setStatusFilter(value);
    }
  };

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const gameDate = new Date(game.gameDate);

      if (showTodayOnly) {
        return isSameDay(gameDate, today);
      }

      const monthYearMatch =
        isSameMonth(gameDate, currentDate) &&
        isSameYear(gameDate, currentDate);
      if (!monthYearMatch) return false;

      if (statusFilter === "upcoming" && game.isCompleted) return false;
      if (statusFilter === "completed" && !game.isCompleted) return false;

      if (teamFilter !== "all") {
        return (
          game.homeTeamId === teamFilter || game.awayTeamId === teamFilter
        );
      }

      return true;
    });
  }, [games, showTodayOnly, currentDate, statusFilter, teamFilter, today]);

  useEffect(() => {
    setShowTodayOnly(false);
  }, [statusFilter, teamFilter, gameType]);

  return {
    today,
    currentDate,
    viewMode,
    setViewMode,
    statusFilter,
    teamFilter,
    setTeamFilter,
    gameType,
    setGameType,
    showTodayOnly,
    teams,
    filteredGames,
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    handleStatusChange,
  };
}
