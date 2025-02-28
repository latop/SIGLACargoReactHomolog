import useSWR, { SWRConfiguration } from "swr";
import { fetchDeparturesArrivals } from "@/services/schedule";
import { DeparturesArrivals } from "@/interfaces/schedule";
import { useSearchParams } from "next/navigation";

export const useDeparturesArrivals = (options?: SWRConfiguration) => {
  const searchParams = useSearchParams();
  const params = {
    locationCode: searchParams.get("locationCode"),
    direction: searchParams.get("direction"),
  };

  const { data, error, isLoading } = useSWR<DeparturesArrivals[]>(
    params.locationCode && params.direction
      ? { url: "/departures-arrivals", args: params }
      : null,
    fetchDeparturesArrivals,
    options,
  );

  const departuresArrivals = data?.map((item) => ({
    ...item,
    id: item.sto,
  }));

  const showContent = params.locationCode;

  const isEmpty = !isLoading && departuresArrivals?.length === 0;

  return {
    departuresArrivals,
    error,
    isEmpty,
    isLoading,
    showContent,
  };
};
