import useSWR, { SWRConfiguration } from "swr";
import { Company } from "@/interfaces/parameters";
import { FetchCompanyParams, fetchCompanies } from "@/services/parameters";

export const useCompany = (
  params?: FetchCompanyParams,
  options?: SWRConfiguration,
) => {
  const { data, error, isLoading } = useSWR<Company[]>(
    { url: "/company", args: params },
    fetchCompanies,
    options,
  );

  return {
    companies: data,
    error,
    isLoading,
  };
};
