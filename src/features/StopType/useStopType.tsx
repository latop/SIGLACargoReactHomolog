import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { PaginatedResponse } from "@/interfaces/pagination";
import { StopType } from "@/interfaces/trip";
import { fetchStopTypeList } from "@/services/trips";
import useSWRInfinite from "swr/infinite";

export const useStopType = () => {
  const { addToast } = useToast();
  const [deleteStopType, { loading: isLoadingDelete, error: deleteError }] =
    useFetch();
  const [hash, setHash] = useHash();
  const isToAddStopType = (hash as string)?.match(/#add-stop-type/);

  const handleAddStopType = () => {
    setHash("#add-stop-type");
  };
  const handleEditStopType = (id: string) => {
    setHash(`#stop-type-id-${id}`);
  };
  const handleClose = () => setHash("");

  const stopTypeId = (hash as string)?.match(/#stop-type-id-(.+)/)?.[1];

  const getKey = (pageIndex: number, params: PaginatedResponse<StopType>) => {
    return {
      url: "/stop-type",
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
  } = useSWRInfinite<PaginatedResponse<StopType>>(getKey, fetchStopTypeList, {
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    onError: () => {
      addToast("Erro ao carregar registros.", { type: "error" });
    },
  });

  const stopType = data?.map((page) => page.data).flat() || [];
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

  const handleDeleteStopType = async (id: string) => {
    return await deleteStopType(`/StopType/${id}`, id, {
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
    stopType,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteStopType,
    isLoadingDelete,
    isEmpty,
    isToAddStopType,
    stopTypeId,
    handleAddStopType,
    handleEditStopType,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
