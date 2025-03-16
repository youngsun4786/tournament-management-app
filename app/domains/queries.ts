import { queryOptions, useQuery, useSuspenseQuery, UseSuspenseQueryResult } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getUser } from "~/app/domains/controllers/auth.api";
import { getGames } from "~/app/domains/controllers/game.api";
import { getPlayers } from "~/app/domains/controllers/player.api";
import { getTeamByName, getTeams } from "~/app/domains/controllers/team.api";


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
      queryFn: ({signal}) => getGames({signal})})
}


export const playerQueries = {
  all: ["players"],
  list: () =>
    queryOptions({
      queryKey: [...playerQueries.all, "list"],
      queryFn: ({signal}) => getPlayers({signal}),
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