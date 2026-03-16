import { useRouteContext } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/lib/components/ui/select";
import { calculateTeamStandings } from "~/lib/utils/calculateTeamStandings";
import { useSuspenseQuery } from "@tanstack/react-query";
import { seasonQueries } from "~/src/queries";

export const TeamRankings = () => {
  const { teams, games } = useRouteContext({ from: "__root__" });
  const { data: seasons } = useSuspenseQuery(seasonQueries.list());

  // Default to the active season, or first season
  const defaultSeasonId =
    seasons.find((s) => s.isActive)?.id ?? seasons[0]?.id ?? null;
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(
    defaultSeasonId,
  );

  // Filter teams and games by selected season (client-side)
  const filteredTeams = useMemo(
    () => teams.filter((t) => t.isActive),
    [teams],
  );

  const filteredGames = useMemo(
    () => games.filter((g) => g.seasonId === selectedSeasonId),
    [games, selectedSeasonId],
  );

  const standings = useMemo(
    () => calculateTeamStandings(filteredTeams, filteredGames),
    [filteredTeams, filteredGames],
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
        <h2 className="text-lg font-bold">Team rankings</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Season:</span>
          <Select
            value={selectedSeasonId || ""}
            onValueChange={setSelectedSeasonId}
            disabled={!seasons.length}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season.id} value={season.id}>
                  {season.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-0">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-gray-50 dark:bg-gray-700 text-xs">
            <TableRow>
              <TableHead className="px-2 text-center w-[10%]">Rank</TableHead>
              <TableHead className="px-2 text-left w-[40%]">Team</TableHead>
              <TableHead className="px-2 text-center w-[15%]">Win</TableHead>
              <TableHead className="px-2 text-center w-[15%]">Lose</TableHead>
              <TableHead className="px-2 text-center w-[20%]">PCT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
            {standings.length > 0 ? (
              standings.map((team, index) => (
                <TableRow
                  key={team.id}
                  className="text-xs hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <TableCell className="px-2 text-center font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-2">
                    <div className="flex flex-row items-start space-x-2">
                      <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                        {team.logo_url && (
                          <img
                            src={`/team_logos/${team.logo_url}`}
                            alt={team.name}
                            className="w-6 h-6"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                      </div>
                      <span className="whitespace-normal break-words align-middle">
                        {team.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-2 text-center">
                    {team.wins}
                  </TableCell>
                  <TableCell className="px-2 text-center">
                    {team.losses}
                  </TableCell>
                  <TableCell className="px-2 text-center">
                    {(team.winPercentage * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="px-2 py-4 text-center">
                  No team rankings available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
