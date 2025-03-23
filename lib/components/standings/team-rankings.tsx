import { useQuery } from "@tanstack/react-query";
import { getGamesForTeams } from "~/app/controllers/game.api";
import { getTeamsBySeason } from "~/app/controllers/team.api";
import { useGetSeasons } from "~/app/queries";
import type { Game } from "~/app/types/game";
import type { TeamWithSeason } from "~/app/types/team";
import { calculateTeamStandings } from "~/lib/calculateTeamStandings";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";

export const TeamRankings = () => {
  // Query to fetch active season
  const seasonsQuery = useGetSeasons();
  const activeSeason = seasonsQuery.data?.filter(
    (season) => season.is_active
  )[0];

  // Query to fetch teams for the active season
  const teamsQuery = useQuery({
    queryKey: ["teamsBySeason", activeSeason?.id],
    queryFn: async () => {
      if (!activeSeason?.id) return [];
      try {
        const teams = await getTeamsBySeason({
          data: { seasonId: activeSeason.id },
        });
        return teams as TeamWithSeason[];
      } catch (error) {
        console.error("Error fetching teams:", error);
        return [] as TeamWithSeason[];
      }
    },
    enabled: !!activeSeason?.id,
  });

  // Query to fetch games for the selected teams
  const gamesQuery = useQuery({
    queryKey: ["gamesForTeams", teamsQuery.data?.map((team) => team.id)],
    queryFn: async () => {
      if (!teamsQuery.data?.length) return [];
      try {
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

  // show top 10 teams
  const top10Standings = standings.slice(0, 10);

  const isLoading =
    seasonsQuery.isLoading || teamsQuery.isLoading || gamesQuery.isLoading;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-bold">Team rankings</h2>
        </div>
        <div className="p-4 text-center">
          <p>Loading rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h2 className="text-lg font-bold">Team rankings</h2>
      </div>

      <div className="p-0">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-gray-50 dark:bg-gray-700 text-xs">
            <TableRow>
              <TableHead className="px-2 text-center w-[10%]">
                Rank
              </TableHead>
              <TableHead className="px-2 text-left w-[40%]">
                Team
              </TableHead>
              <TableHead className="px-2 text-center w-[15%]">
                Win
              </TableHead>
              <TableHead className="px-2 text-center w-[15%]">
                Lose
              </TableHead>
              <TableHead className="px-2 text-center w-[20%]">
                PCT
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
            {top10Standings.length > 0 ? (
              top10Standings.map((team, index) => (
                <TableRow
                  key={team.id}
                  className="text-xs hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <TableCell className="px-2text-center font-medium">
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
