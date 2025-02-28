import { DailyTripDetailsResponse } from "@/interfaces/daily-trip";
import { fetchDailyTripDetails } from "@/services/schedule";
import useSWR, { SWRConfiguration } from "swr";
import { useFetch } from "../useFetch";

export interface DailyTripDetailsParams {
  dailyTripId?: string;
  lineId?: string;
  startTime?: string;
}

export const useDailyTripDetails = (
  params?: DailyTripDetailsParams,
  options?: SWRConfiguration,
) => {
  const [postDailyTripDetails] = useFetch();
  const { data, error, isLoading } = useSWR<DailyTripDetailsResponse>(
    Object.values(params ?? {}).length
      ? { url: "/daily-trip-detail", args: params }
      : null,
    fetchDailyTripDetails,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      ...options,
    },
  );

  const updateDailyTripDetails = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ) => {
    return postDailyTripDetails("/DailyTrip/updatedailyTrip", body, {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    });
  };

  return {
    dailyTripDetails: data?.dailyTrip,
    dailyTripSections: data?.dailyTripSections,
    updateDailyTripDetails,
    error,
    isLoading,
  };
};
