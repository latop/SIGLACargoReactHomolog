import { Location } from "@/interfaces/trip";
import { FetchLocationParams, fetchLocationsRelease } from "@/services/trips";
import useSWR from "swr";

export const useLocationRelease = (params: FetchLocationParams) => {
  const { data, error, isLoading } = useSWR<Location[]>(
    { url: "/Location/GetLocationRelease", args: params },
    fetchLocationsRelease,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  return {
    locations: data,
    error,
    isLoading,
  };
};
