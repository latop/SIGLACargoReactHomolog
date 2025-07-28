import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import api from "../configs/api";
import { FetchBasicParams } from "./trips";
import { Truck } from "@/interfaces/vehicle";

export const useGetFleetGroupQuery = ({
  pageSize = 20,
  code,
}: FetchBasicParams) => {
  return useQuery({
    queryKey: ["fleet_group", code],
    queryFn: async () => {
      try {
        const response = await api.get("/FleetGroup", {
          params: {
            PageSize: pageSize,
            filter1String: code?.toUpperCase(),
          },
        });
        return response.data;
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    staleTime: 86400,
  });
};
export const useGetFleetTypeQuery = ({
  pageSize = 20,
  code,
}: FetchBasicParams) => {
  return useQuery({
    queryKey: ["fleet_group", code],
    queryFn: async () => {
      try {
        const response = await api.get("/FleetType", {
          params: {
            PageSize: pageSize,
            filter1String: code?.toUpperCase(),
          },
        });
        return response.data;
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    staleTime: 0,
    placeholderData: !code && {},
  });
};

export interface FetchTrucksFilterParams {
  filter1Id?: string;
  filter2Id?: string;
  filter3Id?: string;
  filter1String?: string;
  filter2String?: string;
  filter3String?: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface FetchTrucksParams {
  pageSize?: number;
  pageNumber?: number;
  fleetTypeId?: string;
  fleetGroupId?: string;
  locationGroupId?: string;
  licensePlate?: string;
  fleetCode?: string;
  isEnabled?: boolean;
}

interface TruckPaginationResponse {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  totalPages: number;
  data: Truck[];
  totalCount: number;
}

export const useGetTrucksQuery = (params: FetchTrucksParams) => {
  const hasAdditionalParameters = Object.entries(params).some(
    ([key, value]) =>
      key !== "isEnabled" &&
      value !== undefined &&
      value !== null &&
      value !== "",
  );

  return useInfiniteQuery<TruckPaginationResponse>({
    queryKey: ["trucks", params],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const response = await api.get("/Truck", {
          params: {
            PageSize: params?.pageSize || 15,
            PageNumber: pageParam || 0,
            filter1Id: params?.fleetTypeId,
            filter2Id: params?.fleetGroupId,
            filter3Id: params?.locationGroupId,
            filter1String: params?.licensePlate?.toUpperCase(),
            filter2String: params?.fleetCode,
          },
        });

        return response?.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNext) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.hasPrevious) {
        return firstPage.currentPage - 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 60 * 1000 * 5,
    enabled: !!params.isEnabled || hasAdditionalParameters || false,
  });
};

export const useGetTruckQuery = (id?: string) => {
  return useQuery({
    queryKey: ["truck", { id }],
    queryFn: async () => {
      try {
        const response = await api.get(`/Truck/${id}`);
        return response.data;
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    refetchOnMount: true,
    placeholderData: !id && {},
    staleTime: 86400,
    enabled: !!id,
  });
};
