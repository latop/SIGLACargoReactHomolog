import { useState } from "react";
import { fetchDailyTripJourneyDetails } from "@/services/schedule";
import useSWR, { SWRConfiguration } from "swr";

export interface DailyTripDetailsParams {
  demand?: string;
  lineCode?: string;
  isReturn?: boolean;
  idTask?: number;
}

export const useDailyTripJourneyDetails = (options?: SWRConfiguration) => {
  const [params, setParams] = useState<DailyTripDetailsParams>({});
  const { data, error, isLoading } = useSWR(
    params.demand || params.lineCode || params.idTask
      ? { url: "/daily-trip-journey-detail", args: params }
      : null,
    fetchDailyTripJourneyDetails,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      ...options,
      onSuccess: (...args) => {
        setParams({});
        options?.onSuccess?.(...args);
      },
    },
  );

  const fetchDailyTrip = (params: DailyTripDetailsParams) => {
    if (params.demand || params.lineCode || params.idTask) {
      setParams(params);
    }
  };

  return [
    fetchDailyTrip,
    {
      dailyTripDetail: data,
      error,
      isLoading,
    },
  ] as const;
};
