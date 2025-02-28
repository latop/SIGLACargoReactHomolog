import { State } from "@/interfaces/parameters";
import { fetchStates, FetchStatesParams } from "@/services/parameters";
import useSWR, { SWRConfiguration } from "swr";

export const useStates = (
  params?: FetchStatesParams,
  options?: SWRConfiguration,
) => {
  const { data, error, isLoading } = useSWR<State[]>(
    { url: "/states", args: params },
    fetchStates,
    options,
  );

  return {
    states: data,
    error,
    isLoading,
  };
};
