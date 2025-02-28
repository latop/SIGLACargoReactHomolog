import useSWR from "swr";
import { fetchLocations, FetchLocationParams } from "@/services/trips";
import { Location } from "@/interfaces/trip";

export const useLocation = (params: FetchLocationParams) => {
  const { data, error, isLoading } = useSWR<Location[]>(
    { url: "/location", args: params },
    fetchLocations,
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
