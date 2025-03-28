import { State } from "@/interfaces/parameters";
import { fetchStates, FetchStatesParams } from "@/services/parameters";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useStatesQuery = (
  params: FetchStatesParams,
  options?: UseQueryOptions<State[], Error>,
) => {
  return useQuery<State[], Error>({
    queryKey: ["states", params],
    queryFn: async () => await fetchStates({ args: params }),
    ...options,
  });
};
