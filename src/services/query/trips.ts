import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import api from "../configs/api";
import { FetchBasicParams } from "./types";
import {
  FetchLocationsParams,
  Locations,
  LocationsPaginationResponse,
} from "@/interfaces/trip";

const resource = "Location";

export const useGetLocationGroupQuery = {
  queryKey: ["location_group"],
  queryFn: async ({ pageSize = 15, code }: FetchBasicParams) => {
    try {
      const response = await api.get(`${resource}Group`, {
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
};

export const useGetLocationQuery = ({
  pageSize = 15,
  code,
}: FetchBasicParams) => {
  return useQuery({
    queryKey: ["location", code],
    queryFn: async () => {
      try {
        const response = await api.get(`${resource}`, {
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

export const useGetLocationReleaseQuery = ({
  pageSize = 15,
  code,
}: FetchBasicParams) => {
  return useQuery({
    queryKey: ["location_release"],
    queryFn: async () => {
      try {
        const response = await api.get(`${resource}`, {
          params: {
            PageSize: pageSize,
            filter1String: code?.toUpperCase(),
            filter1Bool: true,
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

// TODO: Implement the fetchLocations function to the right place
export const useGetTripTypesQuery = ({
  pageSize = 15,
  code,
}: FetchBasicParams) => {
  return useQuery({
    queryKey: ["trip_types"],
    queryFn: async () => {
      try {
        const response = await api.get("TripType", {
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

export const useGetOptmizedTripsQuery = {
  queryKey: ["optmized_trips"],
  queryFn: async () => {
    try {
      const response = await api.get("/Optimizer/getallotm");
      return response.data;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};

export interface GenerateScheduleCircuitParams {
  start: string;
  end: string;
  locationGroupCode: string;
}
export const useGetGenerateScheduleCircuitParamsQuery = {
  queryKey: ["generate_schedule_circuit_params"],
  queryFn: async ({
    start,
    end,
    locationGroupCode,
  }: GenerateScheduleCircuitParams) => {
    try {
      const response = await api.get("/Optimizer/GenerateScheduleCircuit", {
        params: {
          start,
          end,
          locationGroupCode,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};

export interface OptmizedTrip {
  otmId: string;
}

export const useGetOptmizedTripQuery = {
  queryKey: ["optmized_trip"],
  queryFn: async ({ otmId }: OptmizedTrip) => {
    try {
      const response = await api.get("/Optimizer/getotm", {
        params: {
          otmId,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};

interface FetchLines {
  fleetGroupId?: string;
  locationDestId?: string;
  locationOrigId?: string;
  code?: string;
  pageSize?: number;
  pageNumber?: number;
}

export const useGetLinesQuery = ({
  fleetGroupId,
  locationDestId,
  locationOrigId,
  code,
  pageSize,
  pageNumber,
}: FetchLines) => {
  return useQuery({
    queryKey: ["lines"],
    queryFn: async () => {
      try {
        const response = await api.get("/Line", {
          params: {
            filter1Id: locationOrigId,
            filter2Id: locationDestId,
            filter3Id: fleetGroupId,
            filter1String: code,
            PageSize: pageSize,
            PageNumber: pageNumber,
          },
        });
        const { data } = response.data;
        const parsedData = data.map((item: { line: unknown }) => item.line);
        response.data.data = parsedData;
        return response.data;
      } catch (error) {
        console.error(error);
        return error;
      }
    },
  });
};

interface FetchStopTypeParams {
  pageSize?: number;
  stopType: string;
}

export const useGetStopTypeQuery = ({
  pageSize = 20,
  stopType,
}: FetchStopTypeParams) => {
  return useQuery({
    queryKey: ["lines"],
    queryFn: async () => {
      try {
        const response = await api.get("/StopType", {
          params: {
            PageSize: pageSize,
            filter1String: stopType?.toUpperCase(),
          },
        });
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    staleTime: 86400,
  });
};

export const useGetLocationsQuery = (params: Partial<FetchLocationsParams>) => {
  const hasAdditionalParameters = !!Object.keys(params).filter(
    (key) => key !== "isEnabled",
  ).length;

  return useInfiniteQuery<LocationsPaginationResponse>({
    queryKey: ["locations", params],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const response = await api.get("/Location", {
          params: {
            PageSize: params?.pageSize || 10,
            PageNumber: pageParam || 0,
            filter1Id: params?.locationGroupId,
            filter2Id: params?.locationTypeId,
            filter3Id: params?.cityId,
            filter1String: params?.code,
            filter2String: params?.codeIntegration1,
            filter3String: params?.codeIntegration2,
            filter1Bool: params?.isOperation,
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
    staleTime: 86400,
    enabled: !!params.isEnabled || hasAdditionalParameters || false,
  });
};

export const useGetLocationTypeQuery = ({
  pageSize = 20,
  code,
}: FetchBasicParams) => {
  return useQuery({
    queryKey: ["location_type", code],
    queryFn: async () => {
      try {
        const response = await api.get("/LocationType", {
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
  });
};

export const useGetLocationByIdQuery = (id?: string) => {
  return useQuery<Locations>({
    queryKey: ["location", { id }],
    queryFn: async () => {
      try {
        const response = await api.get(`/Location/${id}`);
        return response.data;
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    placeholderData: id ? undefined : ({} as Locations),
    staleTime: 0,
    enabled: !!id,
  });
};
