import { JourneysByPeriodResponse } from "@/interfaces/schedule";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export type JourneysByPeriodParams = {
  startDate?: string;
  endDate?: string;
  nickName?: string;
  gpId?: string;
  locationGroupId?: string;
  demand?: string;
};

export async function fetchJourneysByPeriod(
  params: JourneysByPeriodParams,
): Promise<JourneysByPeriodResponse | unknown> {
  try {
    const response = await axios.get(`/Schedule/GetJourneysByPeriod`, {
      params,
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}
