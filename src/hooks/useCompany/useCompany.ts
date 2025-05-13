import useSWR, { SWRConfiguration } from "swr";
import { Company } from "@/interfaces/parameters";
import { FetchCompanyParams, fetchCompanies } from "@/services/parameters";
import { PaginatedResponse } from "@/interfaces/pagination";

export const useCompany = (
  params?: FetchCompanyParams,
  options?: SWRConfiguration,
) => {
  const { data, error, isLoading } = useSWR<PaginatedResponse<Company>>(
    { url: "/company", args: params },
    fetchCompanies,
    options,
  );
  const companies = data?.data || [];

  return {
    companies,
    error,
    isLoading,
  };
};
