import { SWRConfiguration } from "swr";
import useSWRInfinite from "swr/infinite";
import { useSearchParams } from "next/navigation";
import { ScenarioResponse } from "@/interfaces/planning";
import { fetchScenarios } from "@/services/planning";

export const useScenarios = (options?: SWRConfiguration) => {
  const searchParams = useSearchParams();
  const params = {
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
  };

  const getKey = (pageIndex: number, previousPageData: ScenarioResponse) => {
    if (previousPageData && !previousPageData.hasNext) return null;
    return {
      url: "/scenario",
      args: { ...params, pageSize: 10, pageNumber: pageIndex + 1 },
    };
  };
  const { data, error, isLoading, mutate, size, setSize, isValidating } =
    useSWRInfinite<ScenarioResponse>(getKey, fetchScenarios, {
      revalidateFirstPage: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      ...options,
    });

  const scenarios = data?.map((page) => page.scenarios).flat() || [];

  const isEmpty = !isLoading && scenarios?.length === 0 && !error;

  const isLoadingMore = isValidating;
  const hasNext = data?.[data.length - 1]?.hasNext;
  const isReachingEnd = !hasNext && !isEmpty;

  const loadMore = (page: number) => {
    if (hasNext && !isLoadingMore) {
      setSize(page);
    }
  };

  const totalCount = data?.[0]?.totalCount || 0;

  const hasData = !isEmpty && !isLoading && !error && !isLoadingMore;
  return {
    scenarios,
    error,
    isEmpty,
    hasData,
    mutate,
    loadMore,
    size,
    isReachingEnd,
    isLoading: isLoadingMore || isLoading,
    setSize,
    isValidating,
    totalCount,
  };
};
