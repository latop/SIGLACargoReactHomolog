import useSWRImmutable from "swr/immutable";
import { SWRConfiguration } from "swr";
import {
  FetchResponsibleSectionsParams,
  fetchResponsibleSectors,
} from "@/services/parameters";
import { ResponsibleSectorResponse } from "@/interfaces/parameters";

export const useResponsibleSector = (
  params?: FetchResponsibleSectionsParams,
  options?: SWRConfiguration,
) => {
  const { data, error, isLoading } = useSWRImmutable<ResponsibleSectorResponse>(
    { url: "/responsible-sector", args: params },
    fetchResponsibleSectors,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      ...options,
    },
  );

  const responsibleSectors = data?.data || [];

  return {
    responsibleSectors,
    error,
    isLoading,
  };
};
