import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getGamesForTeams } from "~/app/controllers/game.api";
import { getTeamsBySeason } from "~/app/controllers/team.api";
import { useGetSeasons } from "~/app/queries";
import type { Game } from "~/app/types/game";
import type { TeamWithSeason } from "~/app/types/team";
import { calculateTeamStandings } from "~/lib/calculateTeamStandings";
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

export const ScoreBoard = () => {
  // Query to fetch seasons
  const seasonsQuery = useGetSeasons();
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);

  // Set the default season when seasons data is available
  useEffect(() => {
    if (
      seasonsQuery.data &&
      seasonsQuery.data.length > 0 &&
      !selectedSeasonId
    ) {
      // First try to find the active season
      const activeSeason = seasonsQuery.data.find((season) => season.is_active);

      // If there's an active season, use it; otherwise use the first season
      if (activeSeason) {
        setSelectedSeasonId(activeSeason.id);
      } else {
        setSelectedSeasonId(seasonsQuery.data[0].id);
      }
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
        return teams as TeamWithSeason[];
      } catch (error) {
        console.error("Error fetching teams:", error);
        return [] as TeamWithSeason[];
      }
    },
    enabled: !!selectedSeasonId,
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
  });

  const teams = teamsQuery.data?.filter((team) => team.name !== "TBD");
  const games = gamesQuery.data;

  // Compute standings based on teams and games
  const standings = teams && games ? calculateTeamStandings(teams, games) : [];

  const isLoading =
    seasonsQuery.isLoading || teamsQuery.isLoading || gamesQuery.isLoading;

  const handleSeasonChange = (value: string) => {
    setSelectedSeasonId(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div />
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
                    {(team.winPercentage * 100).toFixed(1)}%
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
                        team.streak.count > 1
                          ? team.streak.type === "W"
                            ? "text-green-600"
                            : "text-red-600"
                          : "text-gray-400"
                      }
                    >
                      {team.streak.count > 1
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
