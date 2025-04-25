import { Attribution } from "@/interfaces/parameters";
import {
  FetchAttribuitionParams,
  fetchAttribuitions,
} from "@/services/parameters";
import useSWR, { SWRConfiguration } from "swr";

export const useAttribution = (
  params?: FetchAttribuitionParams,
  options?: SWRConfiguration,
) => {
  const { data, error, isLoading } = useSWR(
    { url: "/attributions", args: params },
    fetchAttribuitions,
    options,
  );

  const attribution: Attribution[] = data?.data || [];

  return {
    attribution,
    error,
    isLoading,
  };
};
