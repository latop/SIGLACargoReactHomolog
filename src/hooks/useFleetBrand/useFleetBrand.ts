import { PaginatedResponse } from "@/interfaces/parameters";
import { FleetBrand } from "@/interfaces/vehicle";
import { FetchFleetBrandParams, fetchFleetBrands } from "@/services/vehicles";
import useSWR from "swr";

export const useFleetBrand = (params: FetchFleetBrandParams) => {
  const { data, error, isLoading } = useSWR<PaginatedResponse<FleetBrand>>(
    { url: "/fleet-brand", args: params },
    fetchFleetBrands,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  const fleetBrands = data?.data || [];

  return {
    fleetBrands,
    error,
    isLoading,
  };
};
