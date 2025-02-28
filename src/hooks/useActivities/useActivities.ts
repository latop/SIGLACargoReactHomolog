import useSWR, { SWRConfiguration } from "swr";
import { FetchActivitiesParams, fetchAcitivities } from "@/services/parameters";
import { Activity } from "@/interfaces/parameters";

export const useActivities = (
  params?: FetchActivitiesParams,
  options?: SWRConfiguration,
) => {
  const { data, error, isLoading } = useSWR<Activity[]>(
    { url: "/activities", args: params },
    fetchAcitivities,
    options,
  );

  return {
    activities: data,
    error,
    isLoading,
  };
};
