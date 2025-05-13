import useSWR, { SWRConfiguration } from "swr";
import {
  FetchActivitiesParams,
  fetchActivityType,
} from "@/services/parameters";
import { ActivityType } from "@/interfaces/parameters";
import { PaginatedResponse } from "@/interfaces/pagination";

export const useActivityTypes = (
  params?: FetchActivitiesParams,
  options?: SWRConfiguration,
) => {
  const { data, error, isLoading } = useSWR<PaginatedResponse<ActivityType>>(
    {
      url: "/activityTypes",
      args: params,
    },
    fetchActivityType,
    options,
  );

  const activityTypes = data?.data || [];

  return {
    activityTypes,
    error,
    isLoading,
  };
};
