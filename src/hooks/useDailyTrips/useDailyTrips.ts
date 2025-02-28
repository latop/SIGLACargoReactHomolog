import { SWRConfiguration } from "swr";
import useSWRInfinite from "swr/infinite";
import { fetchDailyTrips } from "@/services/daily-trips";
import { DailyTripResponse } from "@/interfaces/daily-trip";
import { useSearchParams } from "next/navigation";

export const useDailyTrips = (options?: SWRConfiguration) => {
  const searchParams = useSearchParams();
  const params = {
    fleetGroupCode: searchParams.get("fleetGroupCode"),
    fleetGroupId: searchParams.get("fleetGroupId"),
    locationDestId: searchParams.get("locationDestId"),
    locationOrigId: searchParams.get("locationOrigId"),
    tripDate: searchParams.get("tripDate"),
    sto: searchParams.get("sto"),
    flgStatus: searchParams.get("flgStatus"),
  };

  const getKey = (pageIndex: number, previousPageData: DailyTripResponse) => {
    if (!params.tripDate) return null;
    if (previousPageData && !previousPageData.hasNext) return null;
    return {
      url: "/daily-trips",
      args: { ...params, pageSize: 10, pageNumber: pageIndex + 1 },
    };
  };
  const { data, error, isLoading, mutate, size, setSize, isValidating } =
    useSWRInfinite<DailyTripResponse>(getKey, fetchDailyTrips, {
      revalidateFirstPage: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      ...options,
    });

  const dailyTrips = data?.map((page) => page.dailyTrips).flat() || [];

  const isEmpty = !isLoading && dailyTrips?.length === 0 && !error;

  const isLoadingMore = isValidating;
  const hasNext = data?.[data.length - 1]?.hasNext;
  const isReachingEnd = !hasNext && !isEmpty;

  const loadMoreDailyTrips = (page: number) => {
    if (hasNext && !isLoadingMore) {
      setSize(page);
    }
  };

  const totalCount = data?.[0]?.totalCount || 0;

  const hasData = !isEmpty && !isLoading && !error && !isLoadingMore;
  return {
    dailyTrips,
    error,
    isEmpty,
    hasData,
    mutate,
    loadMoreDailyTrips,
    size,
    isReachingEnd,
    isLoading: isLoadingMore || isLoading,
    setSize,
    isValidating,
    totalCount,
  };
};
