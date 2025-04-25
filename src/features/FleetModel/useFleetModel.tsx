import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { FleetModel } from "@/interfaces/vehicle";
import { fetchFleetModels } from "@/services/vehicles";
import useSWRInfinite from "swr/infinite";

export const useFleetModel = () => {
  const { addToast } = useToast();
  const [deleteFleetModel, { loading: isLoadingDelete, error: deleteError }] =
    useFetch();
  const [hash, setHash] = useHash();
  const isToAddFleetModel = (hash as string)?.match(/#add-fleet-model/);

  const handleAddFleetModel = () => {
    setHash("#add-fleet-model");
  };
  const handleEditFleetModel = (id: string) => {
    setHash(`#fleet-model-id-${id}`);
  };
  const handleClose = () => setHash("");

  const fleetModelId = (hash as string)?.match(/#fleet-model-id-(.+)/)?.[1];

  const getKey = (pageIndex: number, params: FleetModel) => {
    return {
      url: "/fleet-models",
      args: { ...params, pageSize: 15, pageNumber: pageIndex + 1 },
    };
  };
  const {
    data,
    error,
    isLoading,
    size,
    setSize,
    isValidating,
    mutate: refreshList,
  } = useSWRInfinite(getKey, fetchFleetModels, {
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    onError: () => {
      addToast("Erro ao carregar registros.", { type: "error" });
    },
  });

  const fleetModels = data?.map((page) => page.data).flat() || [];
  const hasNext = data?.[0].hasNext;
  const hasData = !!data?.[0].data.length;
  const isEmpty = data?.[0].data.length === 0 || !data?.[0].data.length;
  const totalCount = data?.[0].totalCount;

  const loadMore = (page: number) => {
    if (hasNext && !isValidating) {
      setSize(page);
    }
  };
  const currentPage = data?.[0].currentPage || 0;

  const handleDeleteFleetModel = async (id: string) => {
    return await deleteFleetModel(`/FleetModel/${id}`, id, {
      method: "delete",
      onSuccess: () => {
        refreshList();
        addToast("Registro apagado com sucesso!");
      },
      onError: () => {
        addToast("Erro ao apagar registro.", { type: "error" });
        console.error(deleteError);
      },
    });
  };

  return {
    fleetModels,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteFleetModel,
    isLoadingDelete,
    isEmpty,
    isToAddFleetModel,
    fleetModelId,
    handleAddFleetModel,
    handleEditFleetModel,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
