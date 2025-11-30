import React from "react";
import { Game } from "~/src/types/game";
import { TeamGameStatsWithTeam } from "~/src/types/team-game-stats";
import {
  GlossaryItem,
  StatsGlossary,
} from "~/lib/components/ui/stats-glossary";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "~/lib/components/ui/table";

interface StatAverages {
  gp: number;
  min: string;
  pts: string;
  w: number;
  l: number;
  win_pct: string;
  fgm: string;
  fga: string;
  fgp: string;
  tpm: string;
  tpa: string;
  tpp: string;
  ftm: string;
  fta: string;
  ftp: string;
  oreb: string;
  dreb: string;
  reb: string;
  ast: string;
  tov: string;
  stl: string;
  blk: string;
  pf: string;
  plus_minus: string;
}

interface StatsBreakdown {
  overall: StatAverages;
  home: StatAverages | null;
  away: StatAverages | null;
  wins: StatAverages | null;
  losses: StatAverages | null;
  months: Record<string, StatAverages>;
}

interface TeamOverallStatsTableProps {
  teamName: string;
  teamStats: TeamGameStatsWithTeam[];
  games: Game[];
  teamId: string;
}

export const TeamOverallStatsTable = ({
  teamName,
  teamStats,
  games,
  teamId,
}: TeamOverallStatsTableProps) => {
  if (!teamStats || teamStats.length === 0 || !games || games.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500">No stats available for this team.</p>
      </div>
    );
  }

  // Map games by their IDs for faster lookups
  const gamesById: Record<string, Game> = {};
  games.forEach((game) => {
    if (game.id) {
      gamesById[game.id] = game;
    }
  });

  // Create filtered sets of stats with proper win/loss determination
  const homeGames: TeamGameStatsWithTeam[] = [];
  const awayGames: TeamGameStatsWithTeam[] = [];
  const winGames: TeamGameStatsWithTeam[] = [];
  const lossGames: TeamGameStatsWithTeam[] = [];
  const monthlyGames: Record<string, TeamGameStatsWithTeam[]> = {};

  // Process stats with associated games
  const validStats = teamStats.filter((stat) => {
    // Only include stats that have a corresponding game and the game_id is not null
    return (
      stat.game_id !== null &&
      typeof stat.game_id === "string" &&
      gamesById[stat.game_id]
    );
  });

  validStats.forEach((stat) => {
    // We already filtered out null game_ids
    const gameId = stat.game_id as string;
    const game = gamesById[gameId];
    if (!game) return;

    // Home or Away
    if (game.home_team_id === teamId) {
      homeGames.push(stat);
    } else {
      awayGames.push(stat);
    }

    // Win or Loss - use actual game score comparison
    const isHome = game.home_team_id === teamId;
    const teamScore = isHome ? game.home_team_score : game.away_team_score;
    const opponentScore = isHome ? game.away_team_score : game.home_team_score;

    if (teamScore > opponentScore) {
      winGames.push(stat);
    } else if (teamScore < opponentScore) {
      lossGames.push(stat);
    }
    // Note: We don't handle ties here as they're uncommon in basketball

    // Month grouping
    const date = new Date(game.game_date);
    const month = date.toLocaleString("default", { month: "long" });
    if (!monthlyGames[month]) {
      monthlyGames[month] = [];
    }
    monthlyGames[month].push(stat);
  });

  // Calculate averages for each group
  const calculateAverages = (
    stats: TeamGameStatsWithTeam[],
    wins = 0,
    losses = 0
  ): StatAverages => {
    if (!stats || stats.length === 0) {
      return {
        gp: 0,
        min: "0.0",
        pts: "0.0",
        w: 0,
        l: 0,
        win_pct: ".000",
        fgm: "0.0",
        fga: "0.0",
        fgp: "0.0",
        tpm: "0.0",
        tpa: "0.0",
        tpp: "0.0",
        ftm: "0.0",
        fta: "0.0",
        ftp: "0.0",
        oreb: "0.0",
        dreb: "0.0",
        reb: "0.0",
        ast: "0.0",
        tov: "0.0",
        stl: "0.0",
        blk: "0.0",
        pf: "0.0",
        plus_minus: "0.0",
      };
    }

    const totals = {
      min: 0,
      pts: 0,
      fgm: 0,
      fga: 0,
      tpm: 0,
      tpa: 0,
      ftm: 0,
      fta: 0,
      oreb: 0,
      dreb: 0,
      reb: 0,
      ast: 0,
      tov: 0,
      stl: 0,
      blk: 0,
      pf: 0,
      plus_minus: 0,
    };

    stats.forEach((stat) => {
      // Assuming a standard game length if minutes played is not available
      totals.min += 48; // Standard game length
      totals.pts += stat.points || 0;
      totals.fgm += stat.field_goals_made || 0;
      totals.fga += stat.field_goals_attempted || 0;
      totals.tpm += stat.three_pointers_made || 0;
      totals.tpa += stat.three_pointers_attempted || 0;
      totals.ftm += stat.free_throws_made || 0;
      totals.fta += stat.free_throws_attempted || 0;
      totals.oreb += stat.offensive_rebounds || 0;
      totals.dreb += stat.defensive_rebounds || 0;
      totals.reb += stat.total_rebounds || 0;
      totals.ast += stat.assists || 0;
      totals.tov += stat.turnovers || 0;
      totals.stl += stat.steals || 0;
      totals.blk += stat.blocks || 0;
      totals.pf += stat.team_fouls || 0;

      // Calculate plus/minus using game data
      if (
        stat.game_id &&
        typeof stat.game_id === "string" &&
        gamesById[stat.game_id]
      ) {
        const game = gamesById[stat.game_id];
        const isHome = game.home_team_id === teamId;
        const teamScore = isHome ? game.home_team_score : game.away_team_score;
        const opponentScore = isHome
          ? game.away_team_score
          : game.home_team_score;
        totals.plus_minus += teamScore - opponentScore;
      }
    });

    const count = stats.length;
    const winPercentage = wins + losses > 0 ? wins / (wins + losses) : 0;

    return {
      gp: count,
      min: (totals.min / count).toFixed(1),
      pts: (totals.pts / count).toFixed(1),
      w: wins,
      l: losses,
      win_pct: winPercentage.toFixed(3).replace("0.", "."),
      fgm: (totals.fgm / count).toFixed(1),
      fga: (totals.fga / count).toFixed(1),
      fgp:
        totals.fga > 0 ? ((totals.fgm / totals.fga) * 100).toFixed(1) : "0.0",
      tpm: (totals.tpm / count).toFixed(1),
      tpa: (totals.tpa / count).toFixed(1),
      tpp:
        totals.tpa > 0 ? ((totals.tpm / totals.tpa) * 100).toFixed(1) : "0.0",
      ftm: (totals.ftm / count).toFixed(1),
      fta: (totals.fta / count).toFixed(1),
      ftp:
        totals.fta > 0 ? ((totals.ftm / totals.fta) * 100).toFixed(1) : "0.0",
      oreb: (totals.oreb / count).toFixed(1),
      dreb: (totals.dreb / count).toFixed(1),
      reb: (totals.reb / count).toFixed(1),
      ast: (totals.ast / count).toFixed(1),
      tov: (totals.tov / count).toFixed(1),
      stl: (totals.stl / count).toFixed(1),
      blk: (totals.blk / count).toFixed(1),
      pf: (totals.pf / count).toFixed(1),
      plus_minus: (totals.plus_minus / count).toFixed(1),
    };
  };

  // Calculate stats with actual win/loss records
  const statsBreakdown: StatsBreakdown = {
    overall: calculateAverages(validStats, winGames.length, lossGames.length),
    home:
      homeGames.length > 0
        ? calculateAverages(
            homeGames,
            homeGames.filter((stat) => winGames.includes(stat)).length,
            homeGames.filter((stat) => lossGames.includes(stat)).length
          )
        : null,
    away:
      awayGames.length > 0
        ? calculateAverages(
            awayGames,
            awayGames.filter((stat) => winGames.includes(stat)).length,
            awayGames.filter((stat) => lossGames.includes(stat)).length
          )
        : null,
    wins:
      winGames.length > 0
        ? calculateAverages(winGames, winGames.length, 0)
        : null,
    losses:
      lossGames.length > 0
        ? calculateAverages(lossGames, 0, lossGames.length)
        : null,
    months: {},
  };

  // Calculate monthly stats with proper win/loss numbers
  Object.entries(monthlyGames).forEach(([month, monthStats]) => {
    statsBreakdown.months[month] = calculateAverages(
      monthStats,
      monthStats.filter((stat) => winGames.includes(stat)).length,
      monthStats.filter((stat) => lossGames.includes(stat)).length
    );
  });

  // Column definitions
  const columns = [
    { key: "gp", label: "GP" },
    { key: "min", label: "MIN" },
    { key: "pts", label: "PTS" },
    { key: "w", label: "W" },
    { key: "l", label: "L" },
    { key: "win_pct", label: "WIN%" },
    { key: "fgm", label: "FGM" },
    { key: "fga", label: "FGA" },
    { key: "fgp", label: "FG%" },
    { key: "tpm", label: "3PM" },
    { key: "tpa", label: "3PA" },
    { key: "tpp", label: "3P%" },
    { key: "ftm", label: "FTM" },
    { key: "fta", label: "FTA" },
    { key: "ftp", label: "FT%" },
    { key: "oreb", label: "OREB" },
    { key: "dreb", label: "DREB" },
    { key: "reb", label: "REB" },
    { key: "ast", label: "AST" },
    { key: "tov", label: "TOV" },
    { key: "stl", label: "STL" },
    { key: "blk", label: "BLK" },
    { key: "pf", label: "PF" },
    { key: "plus_minus", label: "+/-" },
  ];

  // Convert columns to GlossaryItems for the tooltip
  const glossaryItems: GlossaryItem[] = columns.map((col) => ({
    key: col.key,
    label: col.label,
  }));

  // Helper for determining if a stat should be higher or lower
  const isHigherBetter = (key: string) => {
    return !["tov", "pf", "l"].includes(key);
  };

  // Sort months chronologically
  const sortedMonths = Object.keys(statsBreakdown.months).sort((a, b) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months.indexOf(a) - months.indexOf(b);
  });

  // Data for each section
  const sections = [
    {
      title: "OVERALL",
      rows: [
        {
          label: `${teamName} ${new Date().getFullYear()}`,
          stats: statsBreakdown.overall,
        },
      ],
    },
    {
      title: "LOCATION",
      rows: [
        { label: "Home", stats: statsBreakdown.home || statsBreakdown.overall },
        { label: "Road", stats: statsBreakdown.away || statsBreakdown.overall },
      ],
    },
    {
      title: "WINS/LOSSES",
      rows: [
        { label: "Wins", stats: statsBreakdown.wins || statsBreakdown.overall },
        {
          label: "Losses",
          stats: statsBreakdown.losses || statsBreakdown.overall,
        },
      ],
    },
    {
      title: "MONTH",
      rows: sortedMonths.map((month) => ({
        label: month,
        stats: statsBreakdown.months[month],
      })),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-2">
        <StatsGlossary items={glossaryItems} title="Team Stats Glossary" />
      </div>
      <Table>
        <TableBody>
          {sections.map((section, sectionIndex) => (
            <React.Fragment key={`section-${sectionIndex}`}>
              {/* Header row for each section */}
              <TableRow key={`${sectionIndex}-header`} className="bg-muted/50">
                <TableCell className="text-md py-1 text-gray-500">
                  {section.title}
                </TableCell>
                {columns.map((column) => {
                  return (
                    <TableCell
                      key={column.key}
                      className="text-center text-gray-500"
                    >
                      {column.label}
                    </TableCell>
                  );
                })}
              </TableRow>

              {/* Data rows for each section */}
              {section.rows.map((row, rowIndex) => (
                <TableRow
                  key={`${sectionIndex}-${rowIndex}`}
                  className={
                    rowIndex < section.rows.length - 1 ? "border-b" : ""
                  }
                >
                  <TableCell className="sticky left-0 bg-background font-medium">
                    {row.label}
                  </TableCell>
                  {columns.map((column) => {
                    const value = row.stats[column.key as keyof StatAverages];

                    // Highlight values that stand out in their section
                    let isHighlight = false;
                    if (section.rows.length > 1 && isHigherBetter(column.key)) {
                      if (
                        column.key === "w" ||
                        column.key === "l" ||
                        column.key === "gp"
                      ) {
                        // For integers, just show the value
                      } else if (typeof value === "string" && value !== "0.0") {
                        // Try to find the max value in this section for this column
                        const values = section.rows
                          .map((r) =>
                            parseFloat(
                              r.stats[
                                column.key as keyof StatAverages
                              ] as string
                            )
                          )
                          .filter((v) => !isNaN(v));

                        if (values.length > 0) {
                          const maxValue = Math.max(...values);
                          const currentValue = parseFloat(value as string);

                          if (
                            !isNaN(currentValue) &&
                            currentValue === maxValue
                          ) {
                            isHighlight = true;
                          }
                        }
                      }
                    }

                    return (
                      <TableCell
                        key={column.key}
                        className={`text-center ${isHighlight ? "text-blue-600 font-semibold" : ""}`}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}

              {/* Add space after each section except the last one */}
              {sectionIndex < sections.length - 1 && (
                <TableRow key={`${sectionIndex}-spacer`} className="h-6">
                  <TableCell colSpan={columns.length + 1}></TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
