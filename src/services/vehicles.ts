import { VehiclePlanningsResponse } from "@/interfaces/vehicle";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export interface FetchTruckParams {
  pageSize?: number;
  licensePlate?: string;
}

export async function fetchTruck({ args }: { args: FetchTruckParams }) {
  try {
    const params = {
      PageSize: args.pageSize,
      filter1String: args.licensePlate?.toUpperCase?.(),
    };

    const response = await axios.get("/Truck", { params });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export interface FetchFleetGroupParams {
  pageSize?: number;
  code?: string;
}

export async function fetchFleetGroup({
  args: params,
}: {
  args: FetchFleetGroupParams;
}) {
  try {
    const fleetGroupParams = {
      PageSize: params.pageSize,
      filter1String: params.code?.toUpperCase(),
    };
    const response = await axios.get("/FleetGroup", {
      params: fleetGroupParams,
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}
export type FetchVehiclePlanningsParams = {
  fleetGroupId?: string;
  locationGroupId?: string;
  driverId?: string;
  tripDate: string;
  licensePlate?: string;
  fleetCode?: string;
  pageSize?: number;
  pageNumber?: number;
};

export async function fetchVehiclePlannings({
  args,
}: {
  args: FetchVehiclePlanningsParams;
}) {
  try {
    const params = {
      filter1Id: args.locationGroupId,
      filter2Id: args.fleetGroupId,
      filter3Id: args.driverId,
      filter1String: args.tripDate,
      filter2String: args.licensePlate,
      filter3String: args.fleetCode,
      pageSize: args.pageSize,
      pageNumber: args.pageNumber,
    };

    const response = await axios.get(`/TruckAssignmentPlan`, {
      params,
    });
    const pagination = response.headers["x-pagination"]
      ? JSON.parse(response.headers["x-pagination"])
      : {};
    const normalizeData: VehiclePlanningsResponse = {
      currentPage: pagination.CurrentPage || 1,
      hasNext: pagination.HasNext,
      hasPrevious: pagination.HasPrevious,
      pageSize: pagination.PageSize,
      totalPages: pagination.TotalPages,
      vehiclePlannings: response.data,
      totalCount: pagination.TotalCount,
    };
    return normalizeData;
  } catch (err) {
    throw new Error();
  }
}

export type FetchVehiclePlanningDetailParams = {
  id: string;
};

export async function fetchVehiclePlanningDetails({
  args,
}: {
  args: FetchVehiclePlanningDetailParams;
}) {
  try {
    const response = await axios.get(`/TruckAssignmentPlan/${args.id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}
export type FetchTruckAssignmentParams = {
  id: string;
};

export const fetchTruckAssignment = async ({
  args,
}: {
  args: FetchTruckAssignmentParams;
}) => {
  try {
    const response = await axios.get(`/TruckAssignment/${args.id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
