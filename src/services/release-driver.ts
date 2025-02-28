import { ReleaseDriverResponse } from "@/interfaces/release-driver";
import axios from "axios";
import { Dayjs } from "dayjs";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export interface ReleaseDriverTypeParams {
  dtRef: Dayjs | null;
  locOrig: string;
  demand?: string;
  nickName?: string;
  licensePlate?: string;
  fleetCode?: string;
  pageSize?: number;
  pageNumber?: number;
}
export async function fetchReleaseDriver({
  args: params,
}: {
  args: ReleaseDriverTypeParams;
}): Promise<ReleaseDriverResponse> {
  try {
    const response = await axios.get("/Journey/ReleaseDriver", { params });
    const pagination = response.headers["x-pagination"]
      ? JSON.parse(response.headers["x-pagination"])
      : {};
    const normalizeData: ReleaseDriverResponse = {
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
    throw new Error();
  }
}
