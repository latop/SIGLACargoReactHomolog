import { fetchFleetGroup, FetchFleetGroupParams } from "@/services/vehicles";
import { FleetGroup } from "@/interfaces/vehicle";
import useSWR from "swr";
import { PaginatedResponse } from "@/interfaces/parameters";

export const useFleetGroup = (params: FetchFleetGroupParams) => {
  const { data, error, isLoading } = useSWR<PaginatedResponse<FleetGroup>>(
    { url: "/fleet-group", args: params },
    fetchFleetGroup,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  const fleetGroups = data?.data || [];
  return {
    fleetGroups,
    error,
    isLoading,
  };
};
