import { fetchLocationGroup, FetchLocationGroupParams } from "@/services/trips";
import useSWR from "swr";
import { LocationGroup } from "@/interfaces/trip";
import { PaginatedResponse } from "@/interfaces/parameters";

export const useLocationGroup = (params: FetchLocationGroupParams) => {
  const { data, error, isLoading } = useSWR<PaginatedResponse<LocationGroup>>(
    { url: "/location-group", args: params },
    fetchLocationGroup,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  const locationGroups = data?.data || [];

  return {
    locationGroups,
    error,
    isLoading,
  };
};
