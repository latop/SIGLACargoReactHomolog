import { PaginatedResponse } from "@/interfaces/pagination";
import { Country } from "@/interfaces/parameters";
import { FetchCompanyParams, fetchCountries } from "@/services/parameters";
import useSWR, { SWRConfiguration } from "swr";

export const useCountries = (
  params?: FetchCompanyParams,
  options?: SWRConfiguration,
) => {
  const { data, error, isLoading } = useSWR<PaginatedResponse<Country>>(
    { url: "/countries", args: params },
    fetchCountries,
    options,
  );
  const countries = data?.data;

  return {
    countries,
    error,
    isLoading,
  };
};
