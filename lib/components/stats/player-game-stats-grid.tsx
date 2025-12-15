import { useSuspenseQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { playerGameStatsQueries } from "~/src/queries";
import type { Player } from "~/src/types/player";
import type {
    PlayerGameStatsAverage,
    PlayerGameStatsTotal,
} from "~/src/types/player-game-stats";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PlayerGameStatsModal } from "./player-game-stats-modal";

// Define a type that matches what the API is actually returning
type PlayerStatsAverageResponse = Omit<PlayerGameStatsAverage, "player"> & {
  player: Partial<Omit<Player, "height" | "weight">> | null;
};

type PlayerStatsTotalResponse = Omit<PlayerGameStatsTotal, "player"> & {
  player: Partial<Omit<Player, "height" | "weight">> | null;
};

// Define a type with common properties for both response types
type PlayerStatsCommon = {
  player: Partial<Omit<Player, "height" | "weight">> | null;
  [key: string]: unknown;
};

// Create a stats section for a specific category
const StatsCard = <T extends PlayerStatsCommon>({
  title,
  data,
  valueProp,
  valueFormatter = (value: number) => value.toFixed(1),
}: {
  title: string;
  data: T[];
  valueProp: keyof T;
  valueFormatter?: (value: number) => string;
}) => (
  <Card className="h-full w-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-md">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {data.map((stat, index) => (
          <div
            key={`${stat.player?.name || "unknown"}-${index}`}
            className="flex justify-between items-center py-1"
          >
            <div className="flex items-center">
              <span className="text-sm mr-2 font-medium">{index + 1}.</span>
{stat.player?.player_id ? (
                <Link
                  className="hover:underline"
                  to="/players/$playerId"
                  params={{ playerId: stat.player.player_id }}
                >
                  <span className="font-medium">
                    {stat.player?.name || "Unknown Player"}
                  </span>
                </Link>
              ) : (
                <span className="font-medium">
                  {stat.player?.name || "Unknown Player"}
                </span>
              )}
              <span className="text-xs text-gray-500 ml-2">
                {stat.player?.team_name &&
                  `(${stat.player.team_name.substring(0, 3).toUpperCase()})`}
              </span>
            </div>
            <div className="font-semibold">
              {valueFormatter(stat[valueProp] as number)}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const PlayerGameStatsGrid = () => {
  const [activeTab, setActiveTab] = useState<string>("all_time");

  // Fetch all player stats averages
  const [{ data: playerStatsAverageQuery }, { data: playerStatsTotalsQuery }] =
    useSuspenseQueries({
      queries: [
        playerGameStatsQueries.playerGameStatsAverages(),
        playerGameStatsQueries.playerGameStatsTotals(),
      ],
    });
  // Filter out stats with null player info
  const playerStatsAverage = (
    (playerStatsAverageQuery as PlayerStatsAverageResponse[]) || []
  ).filter((stat) => stat.player !== null);

  const playerStatsTotals = (
    (playerStatsTotalsQuery as PlayerStatsTotalResponse[]) || []
  ).filter((stat) => stat.player !== null);

  if (!playerStatsAverage || playerStatsAverage.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-gray-500">No player statistics available yet.</p>
        </CardContent>
      </Card>
    );
  }

  if (!playerStatsTotals || playerStatsTotals.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-gray-500">No player statistics available yet.</p>
        </CardContent>
      </Card>
    );
  }

  // Get top 5 players for each stat category
  const getTopPlayersAverage = (
    data: PlayerStatsAverageResponse[],
    key: keyof PlayerStatsAverageResponse,
    limit: number = 5
  ) => {
    return [...data]
      .filter((stat) => stat.games_played > 0 && stat.player !== null) // Ensure they've played at least one game and player data exists
      .sort((a, b) => {
        const aValue = a[key] as number;
        const bValue = b[key] as number;
        return bValue - aValue;
      })
      .slice(0, limit);
  };

  const getTopPlayersTotal = (
    data: PlayerStatsTotalResponse[],
    key: keyof PlayerStatsTotalResponse,
    limit: number = 5
  ) => {
    return [...data]
      .sort((a, b) => (b[key] as number) - (a[key] as number))
      .slice(0, limit);
  };

  // Define the statistical categories to display
  const pointsAverageLeaders = getTopPlayersAverage(
    playerStatsAverage,
    "points_per_game"
  );
  const reboundsAverageLeaders = getTopPlayersAverage(
    playerStatsAverage,
    "rebounds_per_game"
  );
  const assistsAverageLeaders = getTopPlayersAverage(
    playerStatsAverage,
    "assists_per_game"
  );
  const stealsAverageLeaders = getTopPlayersAverage(
    playerStatsAverage,
    "steals_per_game"
  );
  const blocksAverageLeaders = getTopPlayersAverage(
    playerStatsAverage,
    "blocks_per_game"
  );
  const turnoversAverageLeaders = getTopPlayersAverage(
    playerStatsAverage,
    "turnovers_per_game"
  );
  const freeThrowsMadeAverageLeaders = getTopPlayersAverage(
    playerStatsAverage,
    "free_throws_made_per_game"
  );
  const twoPointersMadeAverageLeaders = getTopPlayersAverage(
    playerStatsAverage,
    "two_pointers_made_per_game"
  );
  const threePointersMadeAverageLeaders = getTopPlayersAverage(
    playerStatsAverage,
    "three_pointers_made_per_game"
  );

  const pointsLeaders = getTopPlayersTotal(playerStatsTotals, "total_points");
  const reboundsLeaders = getTopPlayersTotal(
    playerStatsTotals,
    "total_rebounds"
  );
  const assistsLeaders = getTopPlayersTotal(playerStatsTotals, "total_assists");
  const stealsLeaders = getTopPlayersTotal(playerStatsTotals, "total_steals");
  const blocksLeaders = getTopPlayersTotal(playerStatsTotals, "total_blocks");
  const turnoversLeaders = getTopPlayersTotal(
    playerStatsTotals,
    "total_turnovers"
  );
  const freeThrowsMadeLeaders = getTopPlayersTotal(
    playerStatsTotals,
    "total_free_throws_made"
  );
  const twoPointersMadeLeaders = getTopPlayersTotal(
    playerStatsTotals,
    "total_two_pointers_made"
  );
  const threePointersMadeLeaders = getTopPlayersTotal(
    playerStatsTotals,
    "total_three_pointers_made"
  );

  // Define the grid layout for both tabs to ensure consistent sizing
  const gridLayout = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">PLAYERS</h2>
        <PlayerGameStatsModal
          playerStatsAverage={playerStatsAverage}
          playerStatsTotals={playerStatsTotals}
          trigger={
            <Button
              variant="outline"
              className="text-blue-600 hover:text-blue-800"
            >
              See All Player Stats
            </Button>
          }
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="season" className="flex-1">
            SEASON LEADERS
          </TabsTrigger>
          <TabsTrigger value="all_time" className="flex-1">
            ALL TIME LEADERS
          </TabsTrigger>
        </TabsList>

        {activeTab === "season" && (
          <div className="text-xs text-gray-500 mt-4 mb-2">
            *Showing the average (per game)
          </div>
        )}

        <TabsContent value="season" className="mt-2">
          <div className={gridLayout}>
            <StatsCard
              title="POINTS PER GAME"
              data={pointsAverageLeaders}
              valueProp="points_per_game"
            />
            <StatsCard
              title="REBOUNDS PER GAME"
              data={reboundsAverageLeaders}
              valueProp="rebounds_per_game"
            />
            <StatsCard
              title="ASSISTS PER GAME"
              data={assistsAverageLeaders}
              valueProp="assists_per_game"
            />
            <StatsCard
              title="STEALS PER GAME"
              data={stealsAverageLeaders}
              valueProp="steals_per_game"
            />
            <StatsCard
              title="BLOCKS PER GAME"
              data={blocksAverageLeaders}
              valueProp="blocks_per_game"
            />
            <StatsCard
              title="TURNOVERS PER GAME"
              data={turnoversAverageLeaders}
              valueProp="turnovers_per_game"
            />
            <StatsCard
              title="FREE THROWS MADE PER GAME"
              data={freeThrowsMadeAverageLeaders}
              valueProp="free_throws_made_per_game"
            />
            <StatsCard
              title="2 POINTERS MADE PER GAME"
              data={twoPointersMadeAverageLeaders}
              valueProp="two_pointers_made_per_game"
            />
            <StatsCard
              title="3 POINTERS MADE PER GAME"
              data={threePointersMadeAverageLeaders}
              valueProp="three_pointers_made_per_game"
            />
          </div>
        </TabsContent>

        <TabsContent value="all_time" className="mt-2">
          <div className={gridLayout}>
            <StatsCard
              title="TOTAL POINTS"
              data={pointsLeaders}
              valueProp="total_points"
            />
            <StatsCard
              title="TOTAL REBOUNDS"
              data={reboundsLeaders}
              valueProp="total_rebounds"
            />
            <StatsCard
              title="TOTAL ASSISTS"
              data={assistsLeaders}
              valueProp="total_assists"
            />
            <StatsCard
              title="TOTAL STEALS"
              data={stealsLeaders}
              valueProp="total_steals"
            />
            <StatsCard
              title="TOTAL BLOCKS"
              data={blocksLeaders}
              valueProp="total_blocks"
            />
            <StatsCard
              title="TOTAL TURNOVERS"
              data={turnoversLeaders}
              valueProp="total_turnovers"
            />
            <StatsCard
              title="TOTAL FREE THROWS MADE"
              data={freeThrowsMadeLeaders}
              valueProp="total_free_throws_made"
            />
            <StatsCard
              title="TOTAL 2 POINTERS MADE"
              data={twoPointersMadeLeaders}
              valueProp="total_two_pointers_made"
            />
            <StatsCard
              title="TOTAL 3 POINTERS MADE"
              data={threePointersMadeLeaders}
              valueProp="total_three_pointers_made"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
