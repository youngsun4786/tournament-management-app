import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getTeams } from "./teams.api";


export const useGetTeams = () => {
    return useQuery({
        queryKey: ["teams"],
        queryFn: useServerFn(getTeams),
    });
};



// export const teamQueries = {
//     all: ["teams"],
//     list: () => {
//         queryOptions({
//             queryKey: [...teamQueries.all, "list"],
//             queryFn: () => getTeams(),
//         })
//     }
// }