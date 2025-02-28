import { Position } from "@/interfaces/driver";
import { FetchPositionParams, fetchPositions } from "@/services/parameters";
import useSWR from "swr";

export const usePosition = (params: FetchPositionParams) => {
  const { data, error, isLoading } = useSWR<Position[]>(
    { url: "/position", args: params },
    fetchPositions,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  return {
    positions: data,
    error,
    isLoading,
  };
};
