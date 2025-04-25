import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { FleetType } from "@/interfaces/vehicle";
import { fetchFleetTypes } from "@/services/vehicles";
import useSWRInfinite from "swr/infinite";

export const useFleetType = () => {
  const { addToast } = useToast();
  const [deleteFleetType, { loading: isLoadingDelete, error: deleteError }] =
    useFetch();
  const [hash, setHash] = useHash();
  const isToAddFleetType = (hash as string)?.match(/#add-fleet-type/);

  const handleAddFleetType = () => {
    setHash("#add-fleet-type");
  };
  const handleEditFleetType = (id: string) => {
    setHash(`#fleet-type-id-${id}`);
  };
  const handleClose = () => setHash("");

  const fleetTypeId = (hash as string)?.match(/#fleet-type-id-(.+)/)?.[1];

  const getKey = (pageIndex: number, params: FleetType) => {
    return {
      url: "/fleet-types",
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
  } = useSWRInfinite(getKey, fetchFleetTypes, {
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    onError: () => {
      addToast("Erro ao carregar registros.", { type: "error" });
    },
  });
  console.log(data);

  const fleetTypes = data?.map((page) => page.data).flat() || [];
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

  const handleDeleteFleetType = async (id: string) => {
    return await deleteFleetType(`/FleetType/${id}`, id, {
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
    fleetTypes,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteFleetType,
    isLoadingDelete,
    isEmpty,
    isToAddFleetType,
    fleetTypeId,
    handleAddFleetType,
    handleEditFleetType,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
