import { PaginatedResponse } from "@/interfaces/parameters";
import { LocationGroup } from "@/interfaces/trip";
import { fetchLocationGroup, FetchLocationGroupParams } from "@/services/trips";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useLocationGroupQuery = (
  params: FetchLocationGroupParams,
  options?: UseQueryOptions<PaginatedResponse<LocationGroup>, Error>,
) => {
  return useQuery<PaginatedResponse<LocationGroup>, Error>({
    queryKey: ["location-group", params],
    queryFn: async () => await fetchLocationGroup({ args: params }),
    ...options,
  });
};
