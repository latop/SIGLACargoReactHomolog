/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReportsResponse } from "@/interfaces/reports";
import { fetchReports } from "@/services/reports";
import useSWR, { SWRConfiguration } from "swr";

import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export const useReports = (options?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR<ReportsResponse[]>(
    "/reports",
    fetchReports,
    { ...options },
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
