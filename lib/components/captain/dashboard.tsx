import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, ClipboardList } from "lucide-react";
import { useState } from "react";
import { getGames } from "~/app/controllers/game.api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/lib/components/ui/avatar";
import { Button } from "~/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/lib/components/ui/tabs";
import { formatDate } from "~/lib/date";
import { PlayerStatsEntry } from "./player-stats-entry";
import { TeamPlayersList } from "./team-players-list";

export const CaptainDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("games");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [addingStats, setAddingStats] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const { data: games, isLoading: gamesLoading } = useQuery({
    queryKey: ["games"],
    queryFn: () => getGames(),
  });

  // Filter games to show only this captain's team games
  // In a real implementation, you would get the captain's team ID from user profile
  const teamId = "ba6b9e95-eca6-4616-8684-c6be66b6168e"; // Example team ID
  const teamGames = games?.filter(
    (game) => game.home_team_id === teamId || game.away_team_id === teamId
  );

  const handleAddStats = (gameId: string) => {
    setSelectedGame(gameId);
    setSelectedTab("players");
    setAddingStats(true);
  };

  const handleSelectPlayer = (playerId: string) => {
    setSelectedPlayer(playerId);
  };

  const handleBackToPlayers = () => {
    setSelectedPlayer(null);
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
    setAddingStats(false);
    setSelectedTab("games");
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Captain Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your team, view games, and record player statistics
          </p>
        </div>
        <Avatar className="h-12 w-12 mt-4 md:mt-0">
          <AvatarImage src="/placeholder-avatar.jpg" />
          <AvatarFallback>TC</AvatarFallback>
        </Avatar>
      </header>

      <Tabs
        defaultValue="games"
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="games" disabled={selectedPlayer !== null}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Games
          </TabsTrigger>
          <TabsTrigger value="players" disabled={selectedPlayer !== null}>
            <ClipboardList className="h-4 w-4 mr-2" />
            Players
          </TabsTrigger>
        </TabsList>

        <TabsContent value="games" className="mt-4">
          {gamesLoading ? (
            <div>Loading games...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamGames?.map((game) => (
                <Card key={game.id} className="overflow-hidden">
                  <CardHeader className="bg-muted pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        {formatDate(new Date(game.game_date))}
                      </CardTitle>
                      <span className="text-sm bg-secondary px-2 py-1 rounded-full">
                        {game.is_completed ? "Completed" : "Upcoming"}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {game.location} {game.court && `• Court ${game.court}`}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex flex-col items-center">
                        <Avatar className="h-16 w-16 mb-2">
                          <AvatarImage src={game.home_team_logo || ""} />
                          <AvatarFallback>
                            {game.home_team_name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {game.home_team_name}
                        </span>
                        <span className="text-2xl font-bold">
                          {game.home_team_score}
                        </span>
                      </div>
                      <span className="text-muted-foreground font-medium">
                        vs
                      </span>
                      <div className="flex flex-col items-center">
                        <Avatar className="h-16 w-16 mb-2">
                          <AvatarImage src={game.away_team_logo || ""} />
                          <AvatarFallback>
                            {game.away_team_name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {game.away_team_name}
                        </span>
                        <span className="text-2xl font-bold">
                          {game.away_team_score}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleAddStats(game.id)}
                        className="w-full"
                      >
                        {game.is_completed ? "View/Update Stats" : "Add Stats"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="players" className="mt-4">
          {selectedPlayer ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBackToPlayers}>
                  Back to Players
                </Button>
                <Button variant="outline" onClick={handleBackToGames}>
                  Back to Games
                </Button>
              </div>

              {selectedGame && (
                <PlayerStatsEntry
                  gameId={selectedGame}
                  playerId={selectedPlayer}
                  onSuccess={handleBackToPlayers}
                />
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {addingStats && selectedGame && (
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Select Player to Add Stats
                    </h2>
                    <p className="text-muted-foreground">
                      For Game:{" "}
                      {
                        teamGames?.find((g) => g.id === selectedGame)
                          ?.home_team_name
                      }{" "}
                      vs{" "}
                      {
                        teamGames?.find((g) => g.id === selectedGame)
                          ?.away_team_name
                      }
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleBackToGames}>
                    Back to Games
                  </Button>
                </div>
              )}
              <TeamPlayersList
                teamId={teamId}
                onSelectPlayer={handleSelectPlayer}
                showAddStats={addingStats}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
