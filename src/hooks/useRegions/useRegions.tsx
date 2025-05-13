import { PaginatedResponse } from "@/interfaces/pagination";
import { Region } from "@/interfaces/parameters";
import { fetchRegions, FetchRegionsParams } from "@/services/parameters";
import useSWR, { SWRConfiguration } from "swr";

export const useRegions = (
  params?: FetchRegionsParams,
  options?: SWRConfiguration,
) => {
  const { data, error, isLoading } = useSWR<PaginatedResponse<Region>>(
    { url: "/regions", args: params },
    fetchRegions,
    options,
  );

  const regions = data?.data || [];
  return {
    regions,
    error,
    isLoading,
  };
};
