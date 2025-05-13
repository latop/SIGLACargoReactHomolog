import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { FleetGroup } from "@/interfaces/vehicle";
import { fetchFleetGroup } from "@/services/vehicles";
import useSWRInfinite from "swr/infinite";

export const useFleetGroup = () => {
  const { addToast } = useToast();
  const [deleteFleetGroup, { loading: isLoadingDelete, error: deleteError }] =
    useFetch();
  const [hash, setHash] = useHash();
  const isToAddFleetGroup = (hash as string)?.match(/#add-fleet-group/);

  const handleAddFleetGroup = () => {
    setHash("#add-fleet-group");
  };
  const handleEditFleetGroup = (id: string) => {
    setHash(`#fleet-group-id-${id}`);
  };
  const handleClose = () => setHash("");

  const fleetGroupId = (hash as string)?.match(/#fleet-group-id-(.+)/)?.[1];

  const getKey = (pageIndex: number, params: FleetGroup) => {
    return {
      url: "/fleet-groups",
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
  } = useSWRInfinite(getKey, fetchFleetGroup, {
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    onError: () => {
      addToast("Erro ao carregar registros.", { type: "error" });
    },
  });

  const fleetGroups = data?.map((page) => page.data).flat() || [];
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

  const handleDeleteFleetGroup = async (id: string) => {
    return await deleteFleetGroup(`/FleetGroup/${id}`, id, {
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
    fleetGroups,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteFleetGroup,
    isLoadingDelete,
    isEmpty,
    isToAddFleetGroup,
    fleetGroupId,
    handleAddFleetGroup,
    handleEditFleetGroup,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
