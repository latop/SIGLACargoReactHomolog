import { PaginatedResponse } from "@/interfaces/pagination";
import { City } from "@/interfaces/parameters";
import { fetchCities, FetchCitiesParams } from "@/services/parameters";
import useSWR, { SWRConfiguration } from "swr";

export const useCities = (
  params?: FetchCitiesParams,
  options?: SWRConfiguration,
) => {
  const { data, error, isLoading } = useSWR<PaginatedResponse<City>>(
    { url: "/cities", args: params },
    fetchCities,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      ...options,
    },
  );

  const cities = data?.data || [];

  return {
    cities,
    error,
    isLoading,
  };
};
