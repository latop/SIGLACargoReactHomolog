import axios from "axios";
import api from "../configs/api";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export type FetchDailyTripsParams = {
  startDate: string;
  endDate: string;
  fleetGroupId?: string;
  locationDestId?: string;
  locationOrigId?: string;
  tripDate?: string;
  sto?: string;
  flgStatus?: string;
  licensePlate?: string;
  tripTypeId?: string;
  pageSize?: number;
  pageNumber?: number;
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
  pageSize = 15,
}: FetchDailyTripsParams) => {
  const params = {
    filter1Id: fleetGroupId || undefined,
    filter2Id: locationOrigId || undefined,
    filter3Id: locationDestId || undefined,
    Filter4Id: tripTypeId || undefined,
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
        const response = await api.get("/DailyTrip", {
          params,
        });
        console.log("response", response);
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
        console.log("response", response);
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
