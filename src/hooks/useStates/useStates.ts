import { PaginatedResponse } from "@/interfaces/pagination";
import { State } from "@/interfaces/parameters";
import { fetchStates, FetchStatesParams } from "@/services/parameters";
import useSWR, { SWRConfiguration } from "swr";

export const useStates = (
  params?: FetchStatesParams,
  options?: SWRConfiguration,
) => {
  const { data, error, isLoading } = useSWR<PaginatedResponse<State>>(
    { url: "/states", args: params },
    fetchStates,
    options,
  );

  const states = data?.data || [];
  return {
    states,
    error,
    isLoading,
  };
};
