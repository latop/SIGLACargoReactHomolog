import { ReleaseDriverResponse } from "@/interfaces/release-driver";
import { fetchReleaseDriver } from "@/services/release-driver";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { SWRConfiguration } from "swr";
import useSWRInfinite from "swr/infinite";

export const useReleaseDriver = (options?: SWRConfiguration) => {
  const params = useSearchParams();
  const searchParams = {
    dtRef: params.get("dtRef")
      ? dayjs(params.get("dtRef")).format("YYYY-MM-DD")
      : null,
    nickName: params.get("nickName"),
    fleetCode: params.get("fleetCode"),
    demand: params.get("demand"),
    locOrig: params.get("locOrig"),
    releaseStatus: params.get("releaseStatus"),
  };

  const getKey = (
    pageIndex: number,
    previousPageData: ReleaseDriverResponse | null,
  ) => {
    if (!searchParams.dtRef && !searchParams.locOrig) return null;
    if (previousPageData && !previousPageData.hasNext) return null;
    return {
      url: "/release-driver",
      args: { ...searchParams, pageSize: 15, pageNumber: pageIndex + 1 },
    };
  };

  const { data, error, isLoading, size, setSize, isValidating, mutate } =
    useSWRInfinite<ReleaseDriverResponse>(getKey, fetchReleaseDriver, {
      revalidateFirstPage: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      ...options,
    });

  const hasContent = data?.[0]?.drivers && data?.[0]?.drivers.length > 0;
  const isEmpty = !isLoading && !hasContent && !params.get("locOrig")?.length;
  const hasNext = data?.[data.length - 1]?.hasNext;
  const isReachingEnd = !hasNext && !isEmpty;
  const isLoadingMore = isValidating;
  const showContent = data !== undefined && !isEmpty;

  const loadMore = (page: number) => {
    if (hasNext && !isLoadingMore) {
      setSize(page);
    }
  };
  const totalCount = data?.[0]?.totalCount || 0;
  const drivers = data?.map((page) => page.drivers).flat() || [];
  const driversMap = new Map(
    drivers.map((driver) => [driver.dailyTripSectionId, driver]),
  );

  return {
    showContent,
    drivers,
    driversMap,
    error,
    isEmpty,
    isLoading: isLoadingMore || isLoading,
    origem: searchParams?.locOrig,
    isReachingEnd,
    loadMore,
    size,
    totalCount,
    hasNext,
    mutate,
  };
};
