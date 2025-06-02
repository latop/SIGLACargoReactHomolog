import { fetchNewOptmizedTrips } from "@/services/trips";
import useSWR from "swr";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type NewOptmizedTripType = {
  description: string;
  headers: string[];
  dataList: {
    [key: string]: string;
  }[];
};

export const headersMap = new Map<string, string>();

export const useNewTripOptimization = () => {
  const params = useSearchParams();

  const args = {
    locationGroupCode: params.get("locationGroupCode"),
    start: params.get("start"),
  };

  const getKey = () => {
    if (args.locationGroupCode && args.start) {
      return {
        url: "/new-trip-optimization",
        args,
      };
    }
    return null;
  };

  const {
    data: optmizedTrips,
    mutate,
    isLoading,
    error,
  } = useSWR<NewOptmizedTripType[]>(getKey, fetchNewOptmizedTrips, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
  });

  const optmizedTripsData = useMemo(() => {
    return (index: number) => optmizedTrips?.[index]?.dataList;
  }, [optmizedTrips]);

  const optmizedTripsHeaders = useMemo(() => {
    return (index: number) => optmizedTrips?.[index]?.headers;
  }, [optmizedTrips]);

  const normalizedHeaders = useMemo(() => {
    return (index: number) =>
      optmizedTripsHeaders(index)?.map((header) =>
        header
          .normalize("NFKD")
          .toLowerCase()
          .replace(/(?:^|\s)(\w)|[^\w\s]|\s+/g, (_, char) =>
            char ? char.toUpperCase() : "",
          )
          .replace(/^[A-Z]/, (char) => char.toLowerCase()),
      );
  }, [optmizedTripsHeaders]);

  const normalizedOptmizedTrips = useMemo(() => {
    return (index: number) =>
      optmizedTripsData(index)?.map((trip) =>
        Object.fromEntries(
          normalizedHeaders(index)?.map((key) => [key, trip[key]]) ?? [],
        ),
      );
  }, [optmizedTripsData, normalizedHeaders]);

  const optimizationDataInfo = useMemo(() => {
    if (!optmizedTrips) return [];

    const optimizationInfo = optmizedTrips.map((optimization, index) => {
      const headersNormalized = normalizedHeaders(index) || [];
      const originalHeaders = optimization.headers;

      headersNormalized.forEach((normalizedHeader, headerIndex) => {
        headersMap.set(
          normalizedHeader,
          originalHeaders[headerIndex] as string,
        );
      });

      return {
        description: optimization.description || "",
        headers: headersNormalized,
        data: normalizedOptmizedTrips(index) || [],
      };
    });

    return optimizationInfo;
  }, [optmizedTrips, normalizedHeaders, normalizedOptmizedTrips]);

  return {
    optimizationData: optimizationDataInfo,
    mutate,
    isLoading,
    error,
  };
};
