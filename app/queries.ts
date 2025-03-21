import { queryOptions, useQuery, useSuspenseQuery, UseSuspenseQueryResult } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getUser } from "~/app/controllers/auth.api";
import { getGameById, getGames } from "~/app/controllers/game.api";
import { getPlayerGameStatsByGameId } from "~/app/controllers/player-game-stats.api";
import { getPlayers, getPlayersByTeamId } from "~/app/controllers/player.api";
import { getTeamStats, getTeamStatsByGameId, getTeamStatsByTeamId } from "~/app/controllers/team-game-stats.api";
import { getTeamByName, getTeams } from "~/app/controllers/team.api";

export const useGetTeams = () => {
    return useQuery({
        queryKey: ["teams"],
        queryFn: useServerFn(getTeams),
    });
};


export const useGetGames = () => {
    return useQuery({
        queryKey: ["games"],
        queryFn: useServerFn(getGames),
    })
}

export const useGetTeamStats = () => {
    return useQuery({
        queryKey: ["teamStats"],
        queryFn: useServerFn(getTeamStats),
    })
}

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
      // queryFn: ({signal}) => getPlayerGameStats({signal}),
    }),
  detail: (gameId: string) =>
    queryOptions({
      queryKey: [...playerGameStatsQueries.all, "detail", gameId],
      queryFn: () => getPlayerGameStatsByGameId({ data: { gameId: gameId } }),
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