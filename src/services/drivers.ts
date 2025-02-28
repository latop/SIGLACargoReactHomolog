import { DriversPaginated } from "@/interfaces/driver";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export interface FetchDriversParams {
  pageSize?: number;
  pageNumber?: number;
  nickName?: string;
  integrationCode?: string;
  admission?: string;
  registration?: string;
  positionId?: string;
  fleetGroupId?: string;
  locationGroupId?: string;
}
export async function fetchDriverById({ id }: { id: string }) {
  try {
    const response = await axios.get(`/Drivers/${id}`);
    const data = response.data;

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchDrivers({
  args: params,
}: {
  args: FetchDriversParams;
}) {
  try {
    const driversParams = {
      PageSize: params.pageSize,
      filter1String: params.nickName?.toUpperCase(),
    };
    const response = await axios.get("/Drivers", { params: driversParams });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

type Entries = {
  PageSize?: number;
  PageNumber?: number;
  filter1Id?: string;
  filter2Id?: string;
  filter3Id?: string;
  filter1String?: string;
  filter2String?: string;
  filter4String?: string;
};

export async function fetchDriversPaginated({
  args,
}: {
  args: FetchDriversParams;
}): Promise<DriversPaginated> {
  try {
    const params: Entries = Object.fromEntries(
      Object.entries({
        PageSize: args.pageSize,
        PageNumber: args.pageNumber,
        filter1Id: args?.locationGroupId,
        filter2Id: args?.positionId,
        filter3Id: args?.fleetGroupId,
        filter1String: args.nickName?.toUpperCase(),
        filter2String: args.integrationCode?.toUpperCase(),
        filter3String: args.registration,
        filter4String: args.admission,
      }).filter(([, value]) => !!value),
    );

    const response = await axios.get("/Drivers", { params });

    const pagination = response.headers["x-pagination"]
      ? JSON.parse(response.headers["x-pagination"])
      : {};

    const normalizeData: DriversPaginated = {
      currentPage: pagination.CurrentPage || 1,
      hasNext: pagination.HasNext,
      hasPrevious: pagination.HasPrevious,
      pageSize: pagination.PageSize,
      totalPages: pagination.TotalPages,
      drivers: response.data,
      totalCount: pagination.TotalCount,
    };
    return normalizeData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
