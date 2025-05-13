import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { PaginatedResponse } from "@/interfaces/pagination";
import { Attribution } from "@/interfaces/parameters";
import { fetchAttribuitions } from "@/services/parameters";
import useSWRInfinite from "swr/infinite";

export const useAttribution = () => {
  const { addToast } = useToast();
  const [deleteAttribution, { loading: isLoadingDelete, error: deleteError }] =
    useFetch();
  const [hash, setHash] = useHash();
  const isToAddAttribution = (hash as string)?.match(/#add-attribution/);

  const handleAddAttribution = () => {
    setHash("#add-attribution");
  };
  const handleEditAttribution = (id: string) => {
    setHash(`#attribution-id-${id}`);
  };
  const handleClose = () => setHash("");

  const attributionId = (hash as string)?.match(/#attribution-id-(.+)/)?.[1];

  const getKey = (pageIndex: number, params: Attribution) => {
    return {
      url: "/attributions",
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
  } = useSWRInfinite<PaginatedResponse<Attribution>>(
    getKey,
    fetchAttribuitions,
    {
      revalidateFirstPage: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      onError: () => {
        addToast("Erro ao carregar registros.", { type: "error" });
      },
    },
  );

  const attribution = data?.map((page) => page.data).flat() || [];
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

  const handleDeleteAttribution = async (id: string) => {
    return await deleteAttribution(`/Attribution/${id}`, id, {
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
    attribution,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteAttribution,
    isLoadingDelete,
    isEmpty,
    isToAddAttribution,
    attributionId,
    handleAddAttribution,
    handleEditAttribution,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
