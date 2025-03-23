import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getGamesForTeams } from "~/app/controllers/game.api";
import { getTeamsBySeason } from "~/app/controllers/team.api";
import type { Season } from "~/app/types/season";
import type { Game } from "~/app/types/game";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/lib/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";
import { supabaseServer } from "~/lib/utils/supabase-server";
// Define a more flexible game type that matches what comes from the database

type TeamStanding = {
  id: string;
  name: string;
  logo_url: string | null;
  wins: number;
  losses: number;
  winPercentage: number;
  homeWins: number;
  homeLosses: number;
  awayWins: number;
  awayLosses: number;
  pointsScored: number;
  pointsAllowed: number;
  streak: {
    type: "W" | "L";
    count: number;
  };
  last10: string; // e.g. "8-2"
};

// Function to fetch seasons
const fetchSeasons = async (): Promise<Season[]> => {
  const { data, error } = await supabaseServer
    .from("seasons")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching seasons:", error);
    throw new Error("Failed to fetch seasons");
  }

  return data as Season[];
};

// Define type for the team data we receive
type TeamData = {
  id: string;
  name: string;
  logo_url: string;
  season_id: string | null;
  wins: number;
  losses: number;
  created_at: string;
  updated_at: string | null;
};

const calculateTeamStandings = (
  teams: TeamData[],
  games: Game[]
): TeamStanding[] => {
  const standings: { [key: string]: TeamStanding } = {};

  // Initialize standings for all teams
  teams.forEach((team) => {
    standings[team.id] = {
      id: team.id,
      name: team.name,
      logo_url: team.logo_url,
      wins: 0,
      losses: 0,
      winPercentage: 0,
      homeWins: 0,
      homeLosses: 0,
      awayWins: 0,
      awayLosses: 0,
      pointsScored: 0,
      pointsAllowed: 0,
      streak: {
        type: "W",
        count: 0,
      },
      last10: "0-0",
    };
  });

  // Process completed games
  const completedGames = games.filter((game) => game.is_completed === true);

  // Sort games by date (oldest first)
  completedGames.sort(
    (a, b) => new Date(a.game_date).getTime() - new Date(b.game_date).getTime()
  );

  // Calculate win/loss records
  completedGames.forEach((game) => {
    const homeTeam = standings[game.home_team_id];
    const awayTeam = standings[game.away_team_id];

    if (homeTeam && awayTeam) {
      // Home team won
      if (game.home_team_score > game.away_team_score) {
        homeTeam.wins++;
        homeTeam.homeWins++;
        awayTeam.losses++;
        awayTeam.awayLosses++;
      }
      // Away team won
      else {
        awayTeam.wins++;
        awayTeam.awayWins++;
        homeTeam.losses++;
        homeTeam.homeLosses++;
      }

      // Update points
      homeTeam.pointsScored += game.home_team_score;
      homeTeam.pointsAllowed += game.away_team_score;
      awayTeam.pointsScored += game.away_team_score;
      awayTeam.pointsAllowed += game.home_team_score;
    }
  });

  // Calculate streak and last10
  teams.forEach((team) => {
    const teamGames = completedGames.filter(
      (game) => game.home_team_id === team.id || game.away_team_id === team.id
    );

    // Sort team games by date (most recent first)
    teamGames.sort(
      (a, b) =>
        new Date(b.game_date).getTime() - new Date(a.game_date).getTime()
    );

    // Calculate streak
    let currentStreak = 0;
    let streakType: "W" | "L" | null = null;

    for (const game of teamGames) {
      const isHomeTeam = game.home_team_id === team.id;
      const homeWon = game.home_team_score > game.away_team_score;
      const teamWon = isHomeTeam ? homeWon : !homeWon;

      if (streakType === null) {
        streakType = teamWon ? "W" : "L";
        currentStreak = 1;
      } else if (
        (streakType === "W" && teamWon) ||
        (streakType === "L" && !teamWon)
      ) {
        currentStreak++;
      } else {
        break;
      }
    }

    if (streakType) {
      standings[team.id].streak = {
        type: streakType,
        count: currentStreak,
      };
    }

    // Calculate last10
    const last10Games = teamGames.slice(0, 10);
    const wins = last10Games.filter((game) => {
      const isHomeTeam = game.home_team_id === team.id;
      const homeWon = game.home_team_score > game.away_team_score;
      return isHomeTeam ? homeWon : !homeWon;
    }).length;

    const losses = last10Games.length - wins;
    standings[team.id].last10 = `${wins}-${losses}`;

    // Calculate win percentage
    const totalGames = standings[team.id].wins + standings[team.id].losses;
    standings[team.id].winPercentage =
      totalGames > 0
        ? parseFloat((standings[team.id].wins / totalGames).toFixed(3))
        : 0;
  });

  // Convert object to array and sort
  return Object.values(standings).sort((a, b) => {
    // Sort by win percentage (descending)
    if (b.winPercentage !== a.winPercentage) {
      return b.winPercentage - a.winPercentage;
    }
    // Tiebreaker: head-to-head record (would need more complex logic)
    // For now, just use point differential as tiebreaker
    const aDiff = a.pointsScored - a.pointsAllowed;
    const bDiff = b.pointsScored - b.pointsAllowed;
    return bDiff - aDiff;
  });
};

export const ScoreBoard = () => {
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);

  // Query to fetch seasons
  const seasonsQuery = useQuery({
    queryKey: ["seasons"],
    queryFn: fetchSeasons,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Set initial season when seasons are loaded
  useEffect(() => {
    if (
      seasonsQuery.data &&
      seasonsQuery.data.length > 0 &&
      !selectedSeasonId
    ) {
      const activeSeason = seasonsQuery.data.find((season) => season.is_active);
      setSelectedSeasonId(activeSeason?.id || seasonsQuery.data[0].id);
    }
  }, [seasonsQuery.data, selectedSeasonId]);

  // Query to fetch teams for the selected season
  const teamsQuery = useQuery({
    queryKey: ["teamsBySeason", selectedSeasonId],
    queryFn: async () => {
      if (!selectedSeasonId) return [];
      try {
        // Directly call the API with the same structure expected
        const teams = await getTeamsBySeason({
          data: { seasonId: selectedSeasonId },
        });
        return teams as TeamData[];
      } catch (error) {
        console.error("Error fetching teams:", error);
        return [] as TeamData[];
      }
    },
    enabled: !!selectedSeasonId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query to fetch games for the selected teams
  const gamesQuery = useQuery({
    queryKey: ["gamesForTeams", teamsQuery.data?.map((team) => team.id)],
    queryFn: async () => {
      if (!teamsQuery.data?.length) return [];
      try {
        // Directly call the API with the same structure expected
        const games = await getGamesForTeams({
          data: { teamIds: teamsQuery.data.map((team) => team.id) },
        });
        return games as Game[];
      } catch (error) {
        console.error("Error fetching games:", error);
        return [] as Game[];
      }
    },
    enabled: !!teamsQuery.data && teamsQuery.data.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Compute standings based on teams and games
  const standings =
    teamsQuery.data && gamesQuery.data
      ? calculateTeamStandings(teamsQuery.data, gamesQuery.data)
      : [];

  const isLoading =
    seasonsQuery.isLoading || teamsQuery.isLoading || gamesQuery.isLoading;

  const handleSeasonChange = (value: string) => {
    setSelectedSeasonId(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Season Standings</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Season:</span>
          <Select
            value={selectedSeasonId || ""}
            onValueChange={handleSeasonChange}
            disabled={isLoading || !seasonsQuery.data?.length}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {seasonsQuery.data?.map((season) => (
                <SelectItem key={season.id} value={season.id}>
                  {season.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading standings...</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">Rank</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-center">W</TableHead>
                <TableHead className="text-center">L</TableHead>
                <TableHead className="text-center">Win%</TableHead>
                <TableHead className="text-center">Home</TableHead>
                <TableHead className="text-center">Away</TableHead>
                <TableHead className="text-center">Last 10</TableHead>
                <TableHead className="text-center">Streak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((team, index) => (
                <TableRow key={team.id}>
                  <TableCell className="text-center font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {team.logo_url && (
                        <img
                          src={team.logo_url}
                          alt={`${team.name} logo`}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span>{team.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{team.wins}</TableCell>
                  <TableCell className="text-center">{team.losses}</TableCell>
                  <TableCell className="text-center">
                    {team.winPercentage.toFixed(3)}
                  </TableCell>
                  <TableCell className="text-center">
                    {team.homeWins}-{team.homeLosses}
                  </TableCell>
                  <TableCell className="text-center">
                    {team.awayWins}-{team.awayLosses}
                  </TableCell>
                  <TableCell className="text-center">{team.last10}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        team.streak.type === "W"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {team.streak.type} {team.streak.count}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {standings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    No standings data available for this season.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Debug information - remove in production */}
      {teamsQuery.data && gamesQuery.data && (
        <div className="mt-8 p-4 bg-gray-100 rounded-md text-xs">
          <p>Teams in this season: {teamsQuery.data.length}</p>
          <p>Games involving these teams: {gamesQuery.data.length}</p>
          <p>
            Completed games:{" "}
            {gamesQuery.data.filter((g) => g.is_completed === true).length}
          </p>
        </div>
      )}
    </div>
  );
};
