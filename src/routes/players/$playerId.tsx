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
import { PlayerGameStatsTable } from "~/lib/components/stats/player-game-stats-table";
import { playerGameStatsQueries, playerQueries } from "~/src/queries";
import type { PlayerGameStatsWithPlayer } from "~/src/types/player-game-stats";

// Register ChartJS components
ChartJS.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

export const Route = createFileRoute("/players/$playerId")({
  beforeLoad: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      playerGameStatsQueries.playerGameStatsAverage(params.playerId!),
    );
    await context.queryClient.ensureQueryData(
      playerGameStatsQueries.playerGameStatsByPlayerId(params.playerId!),
    );
    await context.queryClient.ensureQueryData(
      playerQueries.detail(params.playerId!),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { playerId } = Route.useParams();
  const [recentGames, setRecentGames] = useState<PlayerGameStatsWithPlayer[]>(
    [],
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
        // Sort by updatedAt if available, otherwise just take the first 5
        if (a.updatedAt && b.updatedAt) {
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
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
              playerGameStatsAverage.pointsPerGame,
              playerGameStatsAverage.reboundsPerGame,
              playerGameStatsAverage.assistsPerGame,
              playerGameStatsAverage.stealsPerGame,
              playerGameStatsAverage.blocksPerGame,
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

  if (!player) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 font-medium">Player does not exist</div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Player Header Section */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-md mb-8">
        <div className="bg-gradient-to-br from-rose-400 to-red-600 p-5">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Column 1: Player Info */}
            <div className="flex flex-col md:flex-row xl:flex-col items-center xl:items-start text-center xl:text-left gap-6 xl:gap-4 p-4 space-y-4">
              <div className="relative mx-auto xl:mx-0">
                {/* Player image */}
                {player.playerUrl ? (
                  <div className="h-64 w-44 xl:h-72 xl:w-48 rounded-xl overflow-hidden ring-4 ring-white/30 shadow-lg mx-auto">
                    <img
                      src={`${player.playerUrl}`}
                      alt={`${player.name}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl h-64 w-44 xl:h-72 xl:w-48 flex items-center justify-center text-7xl font-bold text-white shadow-lg ring-4 ring-white/30 mx-auto">
                    {player.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="text-white w-full">
                {/* Player info */}
                <h1 className="text-3xl xl:text-4xl font-bold mb-2 xl:mb-4">
                  {player.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center xl:justify-start gap-3 mb-2">
                  <span className="text-lg xl:text-xl px-2 py-0.5 bg-white/20 rounded-md whitespace-nowrap">
                    #{player.jerseyNumber || "00"}
                  </span>
                  <span className="text-lg xl:text-xl whitespace-nowrap">
                    {player.position || "POS"}
                  </span>
                </div>
                <h2 className="text-xl opacity-90">{player.teamName}</h2>
              </div>
            </div>

            {/* Column 2: Performance Overview */}
            <div className="bg-white pt-10 p-3 rounded-xl shadow-sm flex flex-col items-center justify-center h-full min-h-[300px]">
              <h3 className="text-sm font-bold mb-2 text-gray-800">
                Performance Overview
              </h3>
              <div className="flex-grow relative w-full flex items-center justify-center">
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

            {/* Column 3: Shooting Efficiency */}
            <div className="bg-white pt-10 p-3 rounded-xl shadow-sm flex flex-col items-center justify-center h-full">
              <h3 className="text-sm font-bold mb-3 text-gray-800">
                Shooting Efficiency
              </h3>
              <div className="grid grid-cols-2 gap-3 flex-grow content-center">
                <ShootingStatCard
                  label="FG"
                  made={playerGameStatsAverage.fieldGoalsMadePerGame.toFixed(1)}
                  attempts={playerGameStatsAverage.fieldGoalAttemptsPerGame.toFixed(
                    1,
                  )}
                  percentage={(
                    playerGameStatsAverage.fieldGoalPercentage * 100
                  ).toFixed(1)}
                />
                <ShootingStatCard
                  label="3P"
                  made={playerGameStatsAverage.threePointersMadePerGame.toFixed(
                    1,
                  )}
                  attempts={playerGameStatsAverage.threePointAttemptsPerGame.toFixed(
                    1,
                  )}
                  percentage={(
                    playerGameStatsAverage.threePointPercentage * 100
                  ).toFixed(1)}
                />
                <ShootingStatCard
                  label="2P"
                  made={playerGameStatsAverage.twoPointersMadePerGame.toFixed(
                    1,
                  )}
                  attempts={playerGameStatsAverage.twoPointAttemptsPerGame.toFixed(
                    1,
                  )}
                  percentage={(
                    playerGameStatsAverage.twoPointPercentage * 100
                  ).toFixed(1)}
                />
                <ShootingStatCard
                  label="FT"
                  made={playerGameStatsAverage.freeThrowsMadePerGame.toFixed(1)}
                  attempts={playerGameStatsAverage.freeThrowAttemptsPerGame.toFixed(
                    1,
                  )}
                  percentage={(
                    playerGameStatsAverage.freeThrowPercentage * 100
                  ).toFixed(1)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 divide-x">
          <StatCard
            label="PPG"
            value={playerGameStatsAverage.pointsPerGame.toFixed(1)}
          />
          <StatCard
            label="RPG"
            value={playerGameStatsAverage.reboundsPerGame.toFixed(1)}
          />
          <StatCard
            label="APG"
            value={playerGameStatsAverage.assistsPerGame.toFixed(1)}
          />
          <StatCard
            label="Games"
            value={playerGameStatsAverage.gamesPlayed.toString()}
          />
        </div>
      </div>

      {/* Recent Games */}
      <PlayerGameStatsTable
        playerStats={recentGames}
        isLoading={isLoadingPlayerGameStats}
        isPlayerProfile={true}
      />
    </div>
  );
}

// Stat Card Component
const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center py-4">
    <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
    <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
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
    <div className="p-3 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium text-gray-800 text-sm">{label}</span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${colorClass}`}
        >
          {percentage}%
        </span>
      </div>
      <div className="text-gray-500 text-xs flex flex-col xl:flex-row xl:gap-1">
        <span>{made} made</span>
        <span className="hidden xl:inline">|</span>
        <span>{attempts} att</span>
      </div>
    </div>
  );
};
