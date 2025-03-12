import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import {
  FetchTrucksParams,
  useGetTrucksQuery,
} from "@/services/query/vehicles";
import { useSearchParams } from "next/navigation";

export const useTrucks = () => {
  const params = useSearchParams();
  const parameters: FetchTrucksParams = {
    fleetCode: params.get("fleetCode") || "",
    fleetGroupId: params.get("fleetGroupId") || "",
    fleetTypeId: params.get("fleetTypeId") || "",
    licensePlate: params.get("licensePlate") || "",
    locationGroupId: params.get("locationGroupId") || "",
    isEnabled: params.has("submitted"),
  };
  const [deleteTruck, { loading: loadingDeleteTruck }] = useFetch();
  const { addToast } = useToast();
  const [hash, setHash] = useHash();
  const handleAddTruck = () => {
    setHash("add-truck");
  };

  const handleCloseDialog = () => {
    setHash("");
  };

  const handleEditTruck = (id: string) => {
    setHash(`truck-id-${id}`);
  };

  const addTruck = (hash as string)?.match(/#add-truck/);
  const truckId = (hash as string)?.match(/#truck-id-(.+)/)?.[1];

  const payload = () => {
    Object.entries(parameters).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        delete parameters[key as keyof FetchTrucksParams];
      }
    });
    return parameters;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    hasPreviousPage,
    isError,
    refetch: refetchTrucks,
  } = useGetTrucksQuery(payload());

  const trucks = data?.pages.flatMap((page) => page.data) || [];
  const currentPage = data?.pages[data.pages.length - 1]?.currentPage || 1;

  const loadMoreLines = () => {
    if (!hasNextPage && isFetchingNextPage) return;
    fetchNextPage();
  };

  const handleDeleteTruck = async ({ truckId }: { truckId: string }) => {
    return await deleteTruck(
      `/Truck/${truckId}`,
      { id: truckId },
      {
        method: "delete",
        onSuccess: () => {
          addToast("Caminhão apagado com sucesso!", { type: "success" });
          refetchTrucks();
        },
        onError: () => {
          addToast("Error ao apagar caminhão.", { type: "error" });
        },
      },
    );
  };

  return {
    trucks,
    currentPage,
    hasData: trucks.length > 0,
    isEmpty: trucks.length === 0,
    isLoading: isFetching || isFetchingNextPage,
    isFetchingNextPage,
    loadMoreLines,
    status,
    hasNextPage,
    totalCount: data?.pages[0]?.totalCount || 0,
    hasPreviousPage,
    isError,
    addTruck,
    handleAddTruck,
    handleDeleteTruck,
    loadingDeleteTruck,
    handleCloseDialog,
    handleEditTruck,
    truckId,
    refetchTrucks,
  };
};
