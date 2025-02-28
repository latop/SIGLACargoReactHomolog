import { fetchDrivers, FetchDriversParams } from "@/services/drivers";
import { Driver } from "@/interfaces/driver";
import useSWRImmutable from "swr/immutable";
import { SWRConfiguration } from "swr";

export const useDrivers = (
  params?: FetchDriversParams,
  options?: SWRConfiguration,
) => {
  const { data, error, isLoading } = useSWRImmutable<Driver[]>(
    { url: "/drivers", args: params },
    fetchDrivers,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      ...options,
    },
  );

  return {
    drivers: data,
    error,
    isLoading,
  };
};
