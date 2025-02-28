import useSWR, { SWRConfiguration } from "swr";
import { FetchTripTypeParams, fetchTripTypes } from "@/services/trips";
import { TripType } from "@/interfaces/trip";

export const useTripType = (
  params?: FetchTripTypeParams,
  options?: SWRConfiguration,
) => {
  const { data, error, isLoading } = useSWR<TripType[]>(
    { url: "/trip-type", args: params },
    fetchTripTypes,
    options,
  );

  return {
    tripTypes: data,
    error,
    isLoading,
  };
};
