import axios from "axios";
import api from "../configs/api";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import dayjs from "dayjs";
import { PaginatedResponse } from "@/interfaces/pagination";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export type FetchDailyTripsParams = {
  fleetGroupId?: string;
  locationDestId?: string;
  locationOrigId?: string;
  tripDate?: string;
  sto?: string;
  flgStatus?: string;
  licensePlate?: string;
  tripTypeId?: string;
  companyId?: string;
  nickName?: string;
  lineId?: string;
  pageSize?: number;
  pageNumber?: number;
};

export type FetchDailyTrips = {
  dailyTripId: string;
  tripDate: string;
  sto: string;
  status: string;
  origin: string;
  destination: string;
  startPlanned: string;
  endPlanned: string;
  tripType: string;
  licensePlate: string;
  drivers: string;
};

export const initialDataDailyTripsParams = {
  startDate: "",
  endDate: "",
  fleetGroupId: "",
  locationDestId: "",
  locationOrigId: "",
  tripDate: "",
  sto: "",
  flgStatus: "N",
  pageSize: 15,
  pageNumber: 1,
};

export const useGetDailyTripsQuery = ({
  fleetGroupId,
  locationOrigId,
  locationDestId,
  sto,
  tripDate,
  flgStatus,
  licensePlate,
  tripTypeId,
  pageNumber,
  lineId,
  companyId,
  pageSize = 15,
}: FetchDailyTripsParams): UseQueryResult<
  PaginatedResponse<FetchDailyTrips>,
  Error
> => {
  const params = {
    filter1Id: fleetGroupId || undefined,
    filter2Id: locationOrigId || undefined,
    filter3Id: locationDestId || undefined,
    Filter4Id: tripTypeId || undefined,
    Filter5Id: companyId || undefined,
    filter6Id: lineId || undefined,
    filter1String: sto || undefined,
    filter2String:
      dayjs(tripDate?.toString()).format("ddd, MMM D, YYYY") + " 03:00:00 GMT",
    filter3String: flgStatus,
    Filter4String: licensePlate?.replace(/-/gm, ""),
    pageSize,
    pageNumber,
  };

  const runQuery = !tripDate;

  return useQuery({
    queryKey: ["daily-trips", { params }],
    queryFn: async () => {
      try {
        const response = await api.get("/DailyTrip/getdailytrips", {
          params,
        });

        return response.data;
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    enabled: !runQuery,
    staleTime: 0,
  });
};

export interface FetchDailyTripDetailsParams {
  dailyTripId?: string;
  lineId?: string;
  startTime?: string;
}
export const useGetDailyTripDetailQuery = (
  params: FetchDailyTripDetailsParams,
) => {
  return useQuery({
    queryKey: ["daily-trip_detail", { params }],
    queryFn: async () => {
      try {
        const response = await api.get("/DailyTrip/getdailytripdetail", {
          params,
        });
        return response.data;
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    enabled: params?.dailyTripId ? true : false,
    staleTime: 0,
  });
};
