import { DailyTripResponse } from "@/interfaces/daily-trip";
import axios from "axios";

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
  pageSize?: number;
  pageNumber?: number;
  licensePlate?: string;
};

export async function fetchDailyTrips({
  args,
}: {
  args: FetchDailyTripsParams;
}) {
  try {
    const params = {
      filter1Id: args.fleetGroupId,
      filter2Id: args.locationOrigId,
      filter3Id: args.locationDestId,
      filter1String: args.sto,
      filter2String: args.startDate.toString(),
      filter3String: args.flgStatus,
      pageSize: args.pageSize,
      pageNumber: args.pageNumber,
    };

    const response = await axios.get(`/DailyTrip`, {
      params,
    });
    const pagination = response.headers["x-pagination"]
      ? JSON.parse(response.headers["x-pagination"])
      : {};
    const normalizeData: DailyTripResponse = {
      currentPage: pagination.CurrentPage || 1,
      hasNext: pagination.HasNext,
      hasPrevious: pagination.HasPrevious,
      pageSize: pagination.PageSize,
      totalPages: pagination.TotalPages,
      dailyTrips: response.data,
      totalCount: pagination.TotalCount,
    };
    return normalizeData;
  } catch (err) {
    throw new Error();
  }
}

export type FetchDailyTripDetailsParams = {
  dailyTripId?: string;
  lineId: string;
  startTime: string;
};

export async function fetchDailyTripDetails(params: FetchDailyTripsParams) {
  try {
    const response = await axios.get(`/DailyTrip/getdailytripdetail`, {
      params,
    });
    return response.data;
  } catch (err) {
    throw new Error();
  }
}
