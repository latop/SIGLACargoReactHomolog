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
    { url: "/attribution", args: params },
    fetchAttribuitions,
    options,
  );

  return {
    attribution: data as unknown,
    error,
    isLoading,
  };
};
