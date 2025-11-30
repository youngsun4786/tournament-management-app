import { useSuspenseQuery } from "@tanstack/react-query";
import { teamGameStatsQueries } from "~/src/queries";
import {
  TeamGameStats,
  TeamGameStatsWithTeam,
} from "~/src/types/team-game-stats";
import {
  GlossaryItem,
  StatsGlossary,
} from "~/lib/components/ui/stats-glossary";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface TeamGameStatsTableProps {
  gameId: string;
}

export const TeamGameStatsTable = ({ gameId }: TeamGameStatsTableProps) => {
  const {
    data: teamStats,
    isLoading,
    isError,
  } = useSuspenseQuery(teamGameStatsQueries.detail(gameId));

  if (isLoading) {
    return <div className="text-center py-10">Loading team statistics...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading team stats
      </div>
    );
  }

  if (!teamStats || teamStats.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-gray-500">
            No team statistics available for this game yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group stats by team
  const teamStatsMap = teamStats.reduce(
    (acc, stat) => {
      const teamName = stat.team?.name || "Unknown Team";
      acc[teamName] = stat;
      return acc;
    },
    {} as Record<string, TeamGameStatsWithTeam>
  );

  // Get team names
  const teamNames = Object.keys(teamStatsMap);
  if (teamNames.length !== 2) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-gray-500">Team statistics data is incomplete.</p>
        </CardContent>
      </Card>
    );
  }

  const team1 = teamStatsMap[teamNames[0]];
  const team2 = teamStatsMap[teamNames[1]];

  const statsComparison = [
    { key: "points", label: "PTS" },
    { key: "field_goals_made", label: "FGM" },
    { key: "field_goals_attempted", label: "FGA" },
    { key: "field_goals_percentage", label: "FG%" },
    { key: "two_pointers_made", label: "2PM" },
    { key: "two_pointers_attempted", label: "2PA" },
    { key: "two_point_percentage", label: "2P%" },
    { key: "three_pointers_made", label: "3PM" },
    { key: "three_pointers_attempted", label: "3PA" },
    { key: "three_point_percentage", label: "3P%" },
    { key: "free_throws_made", label: "FTM" },
    { key: "free_throws_attempted", label: "FTA" },
    { key: "free_throw_percentage", label: "FT%" },
    { key: "offensive_rebounds", label: "OREB" },
    { key: "defensive_rebounds", label: "DREB" },
    { key: "total_rebounds", label: "REB" },
    { key: "assists", label: "AST" },
    { key: "steals", label: "STL" },
    { key: "blocks", label: "BLK" },
    { key: "turnovers", label: "TOV" },
    { key: "team_fouls", label: "PF" },
  ];

  // Convert statsComparison to GlossaryItems for the tooltip
  const glossaryItems: GlossaryItem[] = statsComparison.map((stat) => ({
    key: stat.key,
    label: stat.label,
  }));

  const formatStat = (value: string | number | null) => {
    if (value === null) return "-";
    if (typeof value === "string" && value.includes("%")) return value;
    if (typeof value === "string") return value;
    if (typeof value === "number" && Number.isInteger(value))
      return value.toString();
    if (typeof value === "number") return value.toFixed(1);
    return "-";
  };

  const isHigherBetter = (key: string) => {
    // Fields where lower is better
    return !["turnovers", "team_fouls"].includes(key);
  };

  const compareStats = (
    key: string,
    value1: string | number | null,
    value2: string | number | null
  ) => {
    if (value1 === null || value2 === null) return null;

    // Convert to number for comparison
    const num1 = typeof value1 === "string" ? parseFloat(value1) : value1;
    const num2 = typeof value2 === "string" ? parseFloat(value2) : value2;

    if (isNaN(num1) || isNaN(num2)) return null;

    const better = isHigherBetter(key) ? num1 > num2 : num1 < num2;
    return better ? 1 : num1 === num2 ? 0 : 2;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team Comparison</CardTitle>
          <StatsGlossary items={glossaryItems} title="Game Stats Glossary" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-left">Team</TableHead>
                  {statsComparison.map(({ label }) => (
                    <TableHead key={label} className="text-center font-medium">
                      {label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b">
                  <TableCell className="font-bold text-center">
                    {team1.team?.name}
                  </TableCell>
                  {statsComparison.map(({ key }) => {
                    const team1Value = team1[key as keyof TeamGameStats] as
                      | string
                      | number
                      | null;
                    const team2Value = team2[key as keyof TeamGameStats] as
                      | string
                      | number
                      | null;
                    const comparison = compareStats(
                      key,
                      team1Value,
                      team2Value
                    );

                    return (
                      <TableCell
                        key={key}
                        className={`text-center ${comparison === 1 ? "text-red-600 bg-red-50 dark:text-red-400 font-bold" : ""}`}
                      >
                        {formatStat(team1Value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow className="bg-muted/20">
                  <TableCell className="font-medium text-center">VS</TableCell>
                  {statsComparison.map(({ label, key }) => (
                    <TableCell
                      key={key}
                      className="text-xs text-center font-medium text-muted-foreground py-1"
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold text-center">
                    {team2.team?.name}
                  </TableCell>
                  {statsComparison.map(({ key }) => {
                    const team1Value = team1[key as keyof TeamGameStats] as
                      | string
                      | number
                      | null;
                    const team2Value = team2[key as keyof TeamGameStats] as
                      | string
                      | number
                      | null;
                    const comparison = compareStats(
                      key,
                      team1Value,
                      team2Value
                    );

                    return (
                      <TableCell
                        key={key}
                        className={`text-center ${comparison === 2 ? "text-red-600 bg-red-50 dark:text-red-400 font-bold" : ""}`}
                      >
                        {formatStat(team2Value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
