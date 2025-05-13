import { FleetType } from "@/interfaces/vehicle";
import { FetchFleetTypeParams, fetchFleetTypes } from "@/services/vehicles";
import useSWR from "swr";

export const useFleetType = (params: FetchFleetTypeParams) => {
  const { data, error, isLoading } = useSWR(
    { url: "/fleetType", args: params },
    fetchFleetTypes,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );
  const fleetTypes: FleetType[] = data?.data || [];

  return {
    fleetTypes,
    error,
    isLoading,
  };
};
