import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getGamesForTeams } from "~/app/controllers/game.api";
import { getTeamsBySeason } from "~/app/controllers/team.api";
import { useGetSeasons } from "~/app/queries";
import type { Game } from "~/app/types/game";
import type { TeamWithSeason } from "~/app/types/team";
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
  last5: string; // e.g. "8-2"
};

const calculateTeamStandings = (
  teams: TeamWithSeason[],
  games: Game[]
): TeamStanding[] => {
  // Filter to only completed games
  const completedGames = games.filter((game) => game.is_completed === true);

  // Create map for tracking which teams have actually played games
  const teamsWithGames = new Set<string>();

  // Add teams to the set if they've played games
  completedGames.forEach((game) => {
    teamsWithGames.add(game.home_team_id);
    teamsWithGames.add(game.away_team_id);
  });

  // Only include teams that are in the game data (have actually played games)
  const activeTeams = teams.filter((team) => teamsWithGames.has(team.id));

  // Initialize standings object
  const standings: { [key: string]: TeamStanding } = {};

  // Initialize standings for teams that have actually played games
  activeTeams.forEach((team) => {
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
      last5: "0-0",
    };
  });

  // Sort games by date (oldest first) for accurate streak calculation
  completedGames.sort(
    (a, b) => new Date(a.game_date).getTime() - new Date(b.game_date).getTime()
  );

  // Calculate win/loss records
  completedGames.forEach((game) => {
    const homeTeam = standings[game.home_team_id];
    const awayTeam = standings[game.away_team_id];
    console.log(game.game_date)
    console.log("home team: ", homeTeam.name);
    console.log("home score: ", game.home_team_score);
    console.log("away team: ", awayTeam.name);
    console.log("away score: ", game.away_team_score);
    console.log("\n")

    if (homeTeam && awayTeam && (game.home_team_score > 0 && game.away_team_score > 0)) {
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

  // For teams that exist in the standings, calculate streak and last5
  Object.keys(standings).forEach((teamId) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;

    const teamGames = completedGames.filter(
      (game) => game.home_team_id === teamId || game.away_team_id === teamId
    );

    if (teamGames.length === 0) return; // Skip if no games played

    // Sort team games by date (most recent first)
    teamGames.sort(
      (a, b) =>
        new Date(b.game_date).getTime() - new Date(a.game_date).getTime()
    );

    // Calculate streak
    let currentStreak = 0;
    let streakType: "W" | "L" | null = null;

    for (const game of teamGames) {
      const isHomeTeam = game.home_team_id === teamId;
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
      standings[teamId].streak = {
        type: streakType,
        count: currentStreak,
      };
    }

    // Calculate last5
    const last5Games = teamGames.slice(0, 5);
    const wins = last5Games.filter((game) => {
      const isHomeTeam = game.home_team_id === teamId;
      const homeWon = game.home_team_score > game.away_team_score;
      return isHomeTeam ? homeWon : !homeWon;
    }).length;

    const losses = last5Games.length - wins;
    standings[teamId].last5 = `${wins}-${losses}`;

    // Calculate win percentage
    const totalGames = standings[teamId].wins + standings[teamId].losses;
    standings[teamId].winPercentage =
      totalGames > 0
        ? parseFloat((standings[teamId].wins / totalGames).toFixed(3))
        : 0;
  });

  // Add teams that haven't played any games yet
  teams.forEach((team) => {
    if (!standings[team.id]) {
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
          type: "L",
          count: 0,
        },
        last5: "0-0",
      };
    }
  });

  // Convert object to array and sort
  return Object.values(standings).sort((a, b) => {
    // Sort by win percentage (descending)
    if (b.winPercentage !== a.winPercentage) {
      return b.winPercentage - a.winPercentage;
    }

    // If same win percentage, sort by total wins
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }

    // If same wins, sort by point differential
    const aDiff = a.pointsScored - a.pointsAllowed;
    const bDiff = b.pointsScored - b.pointsAllowed;

    if (bDiff !== aDiff) {
      return bDiff - aDiff;
    }

    // If still tied, alphabetically by name
    return a.name.localeCompare(b.name);
  });
};

export const ScoreBoard = () => {
  // Query to fetch seasons
  const seasonsQuery = useGetSeasons();
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  
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
        return teams as TeamWithSeason[];
      } catch (error) {
        console.error("Error fetching teams:", error);
        return [] as TeamWithSeason[];
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


  const teams = teamsQuery.data?.filter((team) => team.name !== "TBD");
  const games = gamesQuery.data;
  const activeSeason = seasonsQuery.data?.filter((season) => season.is_active)[0];

  // Compute standings based on teams and games
  const standings =
    teams && games
      ? calculateTeamStandings(teams, games)
      : [];

  const isLoading =
    seasonsQuery.isLoading || teamsQuery.isLoading || gamesQuery.isLoading;

  const handleSeasonChange = (value: string) => {
    setSelectedSeasonId(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div/>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Season:</span>
          <Select
            defaultValue={activeSeason?.id}
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
                <TableHead className="text-center">Last 5</TableHead>
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
                          src={`/team_logos/${team.logo_url}`}
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
                  <TableCell className="text-center">{team.last5}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        team.streak.type === "W"
                          ? "text-green-600"
                          : team.streak.count === 0
                            ? "text-gray-400"
                            : "text-red-600"
                      }
                    >
                      {team.streak.count > 0
                        ? `${team.streak.type} ${team.streak.count}`
                        : "-"}
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
      {/* {teamsQuery.data && gamesQuery.data && (
        <div className="mt-8 p-4 bg-gray-100 rounded-md text-xs">
          <p>Active teams this season: {teamsQuery.data.length}</p>
          <p>Total games: {gamesQuery.data.length}</p>
          <p>
            Completed games:{" "}
            {gamesQuery.data.filter((g) => g.is_completed === true).length}
          </p>
        </div>
      )} */}
    </div>
  );
};
