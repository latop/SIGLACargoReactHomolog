import { Country } from "@/interfaces/parameters";
import { FetchCompanyParams, fetchCountries } from "@/services/parameters";
import useSWR, { SWRConfiguration } from "swr";

export const useCountries = (
  params?: FetchCompanyParams,
  options?: SWRConfiguration,
) => {
  const { data, error, isLoading } = useSWR<Country[]>(
    { url: "/countries", args: params },
    fetchCountries,
    options,
  );

  return {
    contries: data,
    error,
    isLoading,
  };
};
