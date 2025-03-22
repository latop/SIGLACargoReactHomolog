"use client";

import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { FetchLocationsParams } from "@/interfaces/trip";
import { useDeleteLocationMution } from "@/services/mutation/trips";
import { useGetLocationsQuery } from "@/services/query/trips";
import { getOperationValue } from "@/utils";
import { useSearchParams } from "next/navigation";

export const useLocations = () => {
  const params = useSearchParams();
  const parameters: Partial<FetchLocationsParams> = {
    codeIntegration2: params.get("integrationCode2") || "",
    codeIntegration1: params.get("integrationCode") || "",
    locationTypeId: params.get("locationTypeId") || "",
    locationGroupId: params.get("locationGroupId") || "",
    code: params.get("locationCode") || "",
    isOperation: getOperationValue(params.get("isOperation")),
    isEnabled: params.has("submitted"),
  };
  const [hash, setHash] = useHash();
  const { addToast } = useToast();
  const handleAddLocation = () => {
    setHash("add-location");
  };

  const isToAddLocation = (hash as string)?.match(/#add-location/);
  const locationId = (hash as string)?.match(/#location-id-(.+)/)?.[1];

  const payload = () => {
    Object.entries(parameters).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        delete parameters[key as keyof FetchLocationsParams];
      }
    });
    return parameters;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch: refetchLocations,
    isError,
  } = useGetLocationsQuery(payload());
  const { mutateAsync: mutationDeleteLocation, isPending: isLoadingDelete } =
    useDeleteLocationMution();

  const locations = data?.pages.flatMap((page) => page.data) || [];
  const currentPage = data?.pages[data.pages.length - 1]?.currentPage || 1;

  const loadMoreLines = () => {
    if (!hasNextPage && isFetchingNextPage) return;
    fetchNextPage();
  };

  const handleEditLocation = (id: string) => {
    setHash(`location-id-${id}`);
  };

  const handleCloseDialog = () => {
    setHash("");
  };

  const handleDeleteLocation = async (id: string) => {
    await mutationDeleteLocation(id, {
      onSuccess: () => {
        addToast("Localização apagada com sucesso!", { type: "success" });
      },
      onError: () => {
        addToast("Erro ao apagar localização...", { type: "error" });
      },
    });
  };

  return {
    locations,
    currentPage,
    isEmpty: locations.length === 0,
    hasData: locations.length > 0,
    loadMoreLines,
    totalCount: data?.pages[0]?.totalCount || 0,
    isLoading: isLoading,
    isError,
    refetchLocations,
    handleEditLocation,
    handleAddLocation,
    locationId,
    isToAddLocation,
    handleCloseDialog,
    handleDeleteLocation,
    isLoadingDelete,
    isFetchingNextPage,
  };
};
