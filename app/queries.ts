import { queryOptions, useQuery, useSuspenseQuery, UseSuspenseQueryResult } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getUser } from "~/app/controllers/auth.api";
import { getGames } from "~/app/controllers/game.api";
import { getPlayerGameStatsByGameId } from "~/app/controllers/player-game-stats.api";
import { getPlayers } from "~/app/controllers/player.api";
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
      queryFn: () => getGames() // We'll filter the game in the component
    })
}


export const playerQueries = {
  all: ["players"],
  list: () =>
    queryOptions({
      queryKey: [...playerQueries.all, "list"],
      queryFn: ({signal}) => getPlayers({signal}),
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
  byGame: (gameId: string) =>
    queryOptions({
      queryKey: [...teamGameStatsQueries.all, "byGame", gameId],
      queryFn: () => {
        // Since we don't have a dedicated API for team stats yet, we'll calculate them
        // from player stats in the component
        return getPlayerGameStatsByGameId({ data: { gameId: gameId } });
      },
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