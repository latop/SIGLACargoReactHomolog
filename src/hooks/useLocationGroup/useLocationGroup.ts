import { fetchLocationGroup, FetchLocationGroupParams } from "@/services/trips";
import useSWR from "swr";
import { LocationGroup } from "@/interfaces/trip";

export const useLocationGroup = (params: FetchLocationGroupParams) => {
  const { data, error, isLoading } = useSWR<LocationGroup[]>(
    { url: "/location-group", args: params },
    fetchLocationGroup,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  return {
    locationGroups: data,
    error,
    isLoading,
  };
};
