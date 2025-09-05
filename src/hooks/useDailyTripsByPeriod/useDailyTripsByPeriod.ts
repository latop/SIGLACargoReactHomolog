import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { fetchDailyTripsByPeriod } from "@/services/schedule";
import { DailyTripsByPeriodResponse } from "@/interfaces/schedule";
import useSWRInfinite from "swr/infinite";
import { SWRConfiguration } from "swr";

export const useDailyTripsByPeriod = (options?: SWRConfiguration) => {
  const params = useSearchParams();
  const searchParams = {
    startDate: params.get("startDate")
      ? dayjs(params.get("startDate")).format("YYYY-MM-DD")
      : null,
    endDate: params.get("endDate")
      ? dayjs(params.get("endDate")).format("YYYY-MM-DD")
      : null,
    fleetGroupCode: params.get("fleetGroupCode"),
    locationGroupCode: params.get("locationGroupCode") || "",
    licensePlate: params.get("licensePlate")?.toLocaleUpperCase() || "",
    showTruckAssignment: params.get("showTruckAssignment") || false,
  };

  const getKey = (
    pageIndex: number,
    previousPageData: DailyTripsByPeriodResponse,
  ) => {
    if (!Object.values(searchParams).some(Boolean)) return null;
    if (previousPageData && !previousPageData.hasNext) return null;
    return {
      url: "/journeys-by-period",
      args: { ...searchParams, pageSize: 50, pageNumber: pageIndex + 1 },
    };
  };
  const { data, error, isLoading, mutate, size, setSize, isValidating } =
    useSWRInfinite<DailyTripsByPeriodResponse>(
      getKey,
      fetchDailyTripsByPeriod,
      {
        refreshInterval: 30 * 60 * 1000, // 30min
        ...options,
      },
    );

  const trips = data?.map((page) => page.trips).flat() || [];
  const trucks = data?.map((page) => page.trucks).flat();
  const hasNext = data?.[data.length - 1]?.hasNext;

  const refetch = () => {
    if (isValidating || isLoading) return;
    mutate(undefined, true);
  };

  return {
    trips,
    trucks,
    hasNext,
    error,
    isLoading,
    mutate,
    refetch,
    isValidating,
    size,
    setSize,
  };
};
