import { SWRConfiguration } from "swr";
import useSWRInfinite from "swr/infinite";
import { VehiclePlanningsResponse } from "@/interfaces/vehicle";
import { useSearchParams } from "next/navigation";
import { fetchVehiclePlannings } from "@/services/vehicles";

export const useVehiclePlannings = (options?: SWRConfiguration) => {
  const searchParams = useSearchParams();
  const params = {
    fleetGroupId: searchParams.get("fleetGroupId"),
    fleetGroupCode: searchParams.get("fleetGroupCode"),
    locationGroupId: searchParams.get("locationGroupId"),
    locationGroupCode: searchParams.get("locationGroupCode"),
    driverId: searchParams.get("driverId"),
    tripDate: searchParams.get("tripDate"),
    licensePlate: searchParams.get("licensePlate"),
    fleetCode: searchParams.get("fleetCode"),
  };

  const getKey = (
    pageIndex: number,
    previousPageData: VehiclePlanningsResponse,
  ) => {
    if (!params.tripDate) return null;
    if (previousPageData && !previousPageData.hasNext) return null;
    return {
      url: "/vehicle-plannings",
      args: { ...params, pageSize: 10, pageNumber: pageIndex + 1 },
    };
  };
  const { data, error, isLoading, mutate, size, setSize, isValidating } =
    useSWRInfinite<VehiclePlanningsResponse>(getKey, fetchVehiclePlannings, {
      revalidateFirstPage: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      ...options,
    });

  const vehiclePlannings =
    data?.map((page) => page.vehiclePlannings).flat() || [];

  const isEmpty = !isLoading && vehiclePlannings?.length === 0 && !error;

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

  const refetch = () => {
    mutate();
  };

  return {
    vehiclePlannings,
    error,
    isEmpty,
    hasData,
    mutate,
    loadMore,
    size,
    isReachingEnd,
    refetch,
    isLoading: isLoadingMore || isLoading,
    setSize,
    isValidating,
    totalCount,
  };
};
