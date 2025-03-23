import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Chart as ChartJS,
  Legend,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import { playerGameStatsQueries, playerQueries } from "~/app/queries";
import type { PlayerGameStatsWithPlayer } from "~/app/types/player-game-stats";

// Register ChartJS components
ChartJS.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export const Route = createFileRoute("/players/$playerId")({
  beforeLoad: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      playerGameStatsQueries.playerGameStatsAverage(params.playerId)
    );
    await context.queryClient.ensureQueryData(
      playerGameStatsQueries.playerGameStatsByPlayerId(params.playerId)
    );
    await context.queryClient.ensureQueryData(
      playerQueries.detail(params.playerId)
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { playerId } = Route.useParams();
  const [recentGames, setRecentGames] = useState<PlayerGameStatsWithPlayer[]>(
    []
  );

  const [
    {
      data: playerGameStatsAverage,
      isLoading: isLoadingPlayerGameStatsAverage,
      isError: isErrorPlayerGameStatsAverage,
    },
    {
      data: playerGameStats,
      isLoading: isLoadingPlayerGameStats,
      isError: isErrorPlayerGameStats,
    },
    { data: player, isLoading: isLoadingPlayer, isError: isErrorPlayer },
  ] = useSuspenseQueries({
    queries: [
      playerGameStatsQueries.playerGameStatsAverage(playerId),
      playerGameStatsQueries.playerGameStatsByPlayerId(playerId),
      playerQueries.detail(playerId),
    ],
  });

  // Move the sorting and state update to useEffect to avoid infinite renders
  useEffect(() => {
    if (playerGameStats && playerGameStats.length > 0) {
      const sortedGames = [...playerGameStats].sort((a, b) => {
        // Sort by updated_at if available, otherwise just take the first 5
        if (a.updated_at && b.updated_at) {
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        }
        return 0;
      });
      setRecentGames(sortedGames.slice(0, 5));
    }
  }, [playerGameStats]);

  // Format stats for the radar chart
  const radarData = {
    labels: ["Points", "Rebounds", "Assists", "Steals", "Blocks"],
    datasets: [
      {
        label: "Player Stats",
        data: playerGameStatsAverage
          ? [
              playerGameStatsAverage.points_per_game,
              playerGameStatsAverage.rebounds_per_game,
              playerGameStatsAverage.assists_per_game,
              playerGameStatsAverage.steals_per_game,
              playerGameStatsAverage.blocks_per_game,
            ]
          : [0, 0, 0, 0, 0],
        fill: true,
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgb(99, 102, 241)",
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(99, 102, 241)",
      },
    ],
  };

  if (
    isLoadingPlayerGameStatsAverage ||
    isLoadingPlayerGameStats ||
    isLoadingPlayer
  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (
    isErrorPlayerGameStatsAverage ||
    isErrorPlayerGameStats ||
    isErrorPlayer
  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 font-medium">
          Error loading player data
        </div>
      </div>
    );
  }

  if (!player || !playerGameStatsAverage.player) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 font-medium">Player data not found</div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Player Header Section */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-md mb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              {/* Player image placeholder */}
              <div className="bg-white/10 backdrop-blur-sm rounded-full h-32 w-32 flex items-center justify-center text-5xl font-bold text-white shadow-lg ring-4 ring-white/30">
                {player.name.charAt(0)}
              </div>
            </div>

            <div className="text-center md:text-left text-white">
              {/* Player info */}
              <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-4">
                <h1 className="text-4xl font-bold">{player.name}</h1>
                <div className="flex items-center gap-3">
                  <span className="text-xl px-2 py-0.5 bg-white/20 rounded-md">
                    #{player.jersey_number || "00"}
                  </span>
                  <span className="text-xl">{player.position || "POS"}</span>
                </div>
              </div>

              <h2 className="text-xl mt-1 opacity-90">
                {playerGameStatsAverage.player.team_name || "Team Unknown"}
              </h2>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 divide-x">
          <StatCard
            label="PPG"
            value={playerGameStatsAverage.points_per_game.toFixed(1)}
            icon="🏀"
          />
          <StatCard
            label="RPG"
            value={playerGameStatsAverage.rebounds_per_game.toFixed(1)}
            icon="🔄"
          />
          <StatCard
            label="APG"
            value={playerGameStatsAverage.assists_per_game.toFixed(1)}
            icon="👐"
          />
          <StatCard
            label="Games"
            value={playerGameStatsAverage.games_played.toString()}
            icon="📊"
          />
        </div>
      </div>

      {/* Stats Charts and Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Performance Overview
          </h2>
          <div className="h-64">
            <Radar
              data={radarData}
              options={{
                scales: {
                  r: {
                    min: 0,
                    ticks: {
                      stepSize: 5,
                      backdropColor: "transparent",
                    },
                    angleLines: {
                      color: "rgba(0, 0, 0, 0.1)",
                    },
                    grid: {
                      color: "rgba(0, 0, 0, 0.1)",
                    },
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Shooting Efficiency
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <ShootingStatCard
              label="FG"
              made={playerGameStatsAverage.field_goals_made_per_game.toFixed(1)}
              attempts={playerGameStatsAverage.field_goal_attempts_per_game.toFixed(
                1
              )}
              percentage={(
                playerGameStatsAverage.field_goal_percentage * 100
              ).toFixed(1)}
            />
            <ShootingStatCard
              label="3P"
              made={playerGameStatsAverage.three_pointers_made_per_game.toFixed(
                1
              )}
              attempts={playerGameStatsAverage.three_point_attempts_per_game.toFixed(
                1
              )}
              percentage={(
                playerGameStatsAverage.three_point_percentage * 100
              ).toFixed(1)}
            />
            <ShootingStatCard
              label="2P"
              made={playerGameStatsAverage.two_pointers_made_per_game.toFixed(
                1
              )}
              attempts={playerGameStatsAverage.two_point_attempts_per_game.toFixed(
                1
              )}
              percentage={(
                playerGameStatsAverage.two_point_percentage * 100
              ).toFixed(1)}
            />
            <ShootingStatCard
              label="FT"
              made={playerGameStatsAverage.free_throws_made_per_game.toFixed(1)}
              attempts={playerGameStatsAverage.free_throw_attempts_per_game.toFixed(
                1
              )}
              percentage={(
                playerGameStatsAverage.free_throw_percentage * 100
              ).toFixed(1)}
            />
          </div>
        </div>
      </div>

      {/* Recent Games */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Recent Games</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <TableHead>Date</TableHead>
                <TableHead>Min</TableHead>
                <TableHead>PTS</TableHead>
                <TableHead>REB</TableHead>
                <TableHead>AST</TableHead>
                <TableHead>STL</TableHead>
                <TableHead>BLK</TableHead>
                <TableHead>FG</TableHead>
                <TableHead>3P</TableHead>
                <TableHead>FT</TableHead>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentGames.length > 0 ? (
                recentGames.map((game, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      {game.updated_at
                        ? new Date(game.updated_at).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>{game.minutes_played || 0}</TableCell>
                    <TableCell className="font-medium">
                      {game.points || 0}
                    </TableCell>
                    <TableCell>{game.total_rebounds || 0}</TableCell>
                    <TableCell>{game.assists || 0}</TableCell>
                    <TableCell>{game.steals || 0}</TableCell>
                    <TableCell>{game.blocks || 0}</TableCell>
                    <TableCell>
                      {game.field_goals_made || 0}/
                      {game.field_goals_attempted || 0}
                    </TableCell>
                    <TableCell>
                      {game.three_pointers_made || 0}/
                      {game.three_pointers_attempted || 0}
                    </TableCell>
                    <TableCell>
                      {game.free_throws_made || 0}/
                      {game.free_throws_attempted || 0}
                    </TableCell>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No recent games found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) => (
  <div className="text-center py-4">
    <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
    <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  </div>
);

// Shooting Stat Card Component
const ShootingStatCard = ({
  label,
  made,
  attempts,
  percentage,
}: {
  label: string;
  made: string;
  attempts: string;
  percentage: string;
}) => {
  // Calculate a color based on the percentage
  const getColorClass = (pct: number) => {
    if (pct >= 50) return "bg-green-100 text-green-800";
    if (pct >= 40) return "bg-blue-100 text-blue-800";
    if (pct >= 30) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const pct = parseFloat(percentage);
  const colorClass = getColorClass(pct);

  return (
    <div className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-800">{label}</span>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${colorClass}`}
        >
          {percentage}%
        </span>
      </div>
      <div className="text-gray-500 text-sm">
        {made}/{attempts}
      </div>
    </div>
  );
};

// Table components for cleaner code
const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const TableCell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <td
    className={`px-4 py-3 whitespace-nowrap text-sm text-gray-700 ${className}`}
  >
    {children}
  </td>
);
