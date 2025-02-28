import useSWR, { SWRConfiguration } from "swr";
import { fetchStopType, FetchTripTypeParams } from "@/services/trips";
import { StopType } from "@/interfaces/trip";

export const useStopType = (
  params?: FetchTripTypeParams,
  options?: SWRConfiguration,
) => {
  const { data, error, isLoading } = useSWR<StopType[]>(
    { url: "/stop-type", args: params },
    fetchStopType,
    options,
  );

  return {
    stopTypes: data,
    error,
    isLoading,
  };
};
