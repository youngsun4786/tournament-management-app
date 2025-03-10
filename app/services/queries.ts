import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getGames } from "./games.api";
import { getTeams } from "./teams.api";


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



// export const teamQueries = {
//     all: ["teams"],
//     list: () => {
//         queryOptions({
//             queryKey: [...teamQueries.all, "list"],
//             queryFn: () => getTeams(),
//         })
//     }
// }