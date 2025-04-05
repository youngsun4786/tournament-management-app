import { queryOptions, useQuery, useSuspenseQuery, UseSuspenseQueryResult } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getUser } from "~/app/controllers/auth.api";
import { getGameById, getGames } from "~/app/controllers/game.api";
import {
  getAveragePlayerStatsAllPlayers,
  getAveragePlayerStatsByPlayerId,
  getPlayerGameStatsByGameId,
  getPlayerGameStatsByPlayerId,
  getPlayerStatsAllPlayers,
  getTotalPlayerStatsAllPlayers,
} from "~/app/controllers/player-game-stats.api";
import { getPlayerById, getPlayers, getPlayersByTeamId } from "~/app/controllers/player.api";
import { getTeamStats, getTeamStatsByGameId, getTeamStatsByTeamId } from "~/app/controllers/team-game-stats.api";
import { getTeam, getTeamByName, getTeams } from "~/app/controllers/team.api";
import { getVideosByGameId } from "./controllers/media.api";
import { getSeasons } from "./controllers/season.api";

export const useGetGames = () => {
    return useQuery({
        queryKey: ["games"],
        queryFn: useServerFn(getGames),
    })
}

export const useGetTeamStats = () => {
  return useSuspenseQuery(teamGameStatsQueries.list());
}

export const useGetSeasons = () => {
    return useQuery({
        queryKey: ["seasons"],
        queryFn: useServerFn(getSeasons),
        staleTime: 60 * 60 * 1000, // 1 hour
    })
}

export const useGetTeams = () => {
  return useSuspenseQuery(teamQueries.list());
};

export const useGetTeamById = (teamId: string) => {
  return useSuspenseQuery(teamQueries.getTeamById(teamId));
};

// --------- PLAYERS ---------
export const useGetPlayersByTeamId = (teamId: string) => {
  return useSuspenseQuery(playerQueries.teamPlayers(teamId));
};

export const teamQueries = {
  all: ["teams"],
  list: () =>
    queryOptions({
      queryKey: [...teamQueries.all, "list"],
      queryFn: ({signal}) => getTeams({signal}),
    }),
  detail: (teamName: string) =>
    queryOptions({
      queryKey: [...teamQueries.all, "detail", teamName],
      queryFn: () => getTeamByName({ data: { name: teamName } }),
    }),
  getTeamById: (teamId: string) =>
    queryOptions({
      queryKey: [...teamQueries.all, "getTeamById", teamId],
      queryFn: () => getTeam({ data: { teamId: teamId } }),
    }),
}

export const gameQueries = {
  all: ["games"],
  list: () => 
    queryOptions({
      queryKey: [...gameQueries.all, "list"],
      queryFn: ({signal}) => getGames({signal})
    }),
  detail: (gameId: string) =>
    queryOptions({
      queryKey: [...gameQueries.all, "detail", gameId],
      queryFn: () => getGameById({ data: { gameId: gameId } }) // We'll filter the game in the component
    }),
  teamGames: (teamId: string) =>
    queryOptions({
      queryKey: [...gameQueries.all, "teamGames", teamId],
      queryFn: ({signal}) => getGames({signal}).then(games => 
        games.filter(game => 
          game.home_team_id === teamId || game.away_team_id === teamId
        )
      )
    })
}

export const playerQueries = {
  all: ["players"],
  list: () =>
    queryOptions({
      queryKey: [...playerQueries.all, "list"],
      queryFn: ({signal}) => getPlayers({signal}),
    }),

  detail: (playerId: string) =>
    queryOptions({
      queryKey: [...playerQueries.all, "detail", playerId],
      queryFn: () => getPlayerById({ data: { playerId: playerId } }),
    }),
    
  teamPlayers: (teamId: string) =>
    queryOptions({
      queryKey: [...playerQueries.all, "teamPlayers", teamId],
      queryFn: () => getPlayersByTeamId({ data: { teamId: teamId } }),
    }),
}

export const playerGameStatsQueries = {
  all: ["playerGameStats"],
  list: () =>
    queryOptions({
      queryKey: [...playerGameStatsQueries.all, "list"],
      queryFn: ({signal}) => getPlayerStatsAllPlayers({signal}),
    }),

  detail: (gameId: string) =>
    queryOptions({
      queryKey: [...playerGameStatsQueries.all, "detail", gameId],
      queryFn: ({signal}) => getPlayerGameStatsByGameId({signal, data: { gameId: gameId } }),
    }),

  playerGameStatsByPlayerId: (playerId: string) => (
    queryOptions({
      queryKey: [...playerGameStatsQueries.all, "playerGameStatsByPlayerId", playerId],
      queryFn: ({signal}) => getPlayerGameStatsByPlayerId({signal, data: { playerId: playerId } })
    })
  ),

  playerGameStatsAverage: (playerId: string) => (
    queryOptions({
      queryKey: [...playerGameStatsQueries.all, "playerGameStatsAverage", playerId],
      queryFn: ({signal}) => getAveragePlayerStatsByPlayerId({signal, data: { playerId: playerId } })
    })
  ),

  playerGameStatsAverages: () => ({
      queryKey: [...playerGameStatsQueries.all, "playerGameStatsAverages"],
      queryFn: async () => getAveragePlayerStatsAllPlayers()
    }),

  playerGameStatsTotals: () => ({
      queryKey: [...playerGameStatsQueries.all, "playerGameStatsTotals"],
      queryFn: async () => getTotalPlayerStatsAllPlayers()
    }),

  playerGameStatsAveragesByTeam: (teamId: string) => ({
      queryKey: [...playerGameStatsQueries.all, "playerGameStatsAveragesByTeam", teamId],
      queryFn: async () => {
        const allPlayerStats = await getAveragePlayerStatsAllPlayers();

        // Filter players by team_id with careful null checking
        return allPlayerStats.filter(playerStat => {
          // Check that playerStat and playerStat.player exist
          if (!playerStat || !playerStat.player) {
            return false;
          }
          
          // Access team_id directly from the player object
          return playerStat.player.team_id === teamId;
        });
      }
    }),

}

export const teamGameStatsQueries = {
  all: ["teamGameStats"],
  list: () =>
    queryOptions({
      queryKey: [...teamGameStatsQueries.all, "list"],
      queryFn: ({signal}) => getTeamStats({signal}),
    }),
  detail: (gameId: string) =>
    queryOptions({
      queryKey: [...teamGameStatsQueries.all, "detail", gameId],
      queryFn: () => getTeamStatsByGameId({ data: { gameId: gameId } }),
    }),
  teamStats: (teamId: string) =>
    queryOptions({
      queryKey: [...teamGameStatsQueries.all, "teamStats", teamId],
      queryFn: () => getTeamStatsByTeamId({ data: { teamId: teamId } }),
    }),
}

export const mediaQueries = {
  all: ["media"],
  videosByGameId: (gameId: string) =>
    queryOptions({
      queryKey: [...mediaQueries.all, "videosByGameId", gameId],
      queryFn: ({signal}) => getVideosByGameId({signal, data: { game_id: gameId } }),
    }),
}

export const authQueries = {
    all: ["auth"],
    user: () =>
      queryOptions({
        queryKey: [...authQueries.all, "user"],
        queryFn: () => getUser(),
      }),
  }
  
export const useAuthentication = () => {
    return useSuspenseQuery(authQueries.user())
}
  
export const useAuthenticatedUser = () => {
    const authQuery = useAuthentication()
  
    if (authQuery.data.isAuthenticated === false) {
      throw new Error("User is not authenticated!")
    }
  
    return authQuery as UseSuspenseQueryResult<typeof authQuery.data>
  }