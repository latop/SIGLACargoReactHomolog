import useSWR, { SWRConfiguration } from "swr";
import { fetchTruck, FetchTruckParams } from "@/services/vehicles";
import { Truck } from "@/interfaces/vehicle";

export const useTruck = (
  params?: FetchTruckParams,
  options?: SWRConfiguration,
) => {
  const { data, error, isLoading } = useSWR<Truck[]>(
    { url: "/truck", args: params },
    fetchTruck,
    options,
  );

  return {
    trucks: data,
    error,
    isLoading,
  };
};
