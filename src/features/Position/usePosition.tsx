import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { PaginatedResponse } from "@/interfaces/pagination";
import { Position } from "@/interfaces/parameters";
import { fetchPositions } from "@/services/parameters";
import useSWRInfinite from "swr/infinite";

export const usePosition = () => {
  const { addToast } = useToast();
  const [deletePosition, { loading: isLoadingDelete, error: deleteError }] =
    useFetch();
  const [hash, setHash] = useHash();
  const isToAddPosition = (hash as string)?.match(/#add-position/);

  const handleAddPosition = () => {
    setHash("#add-position");
  };
  const handleEditPosition = (id: string) => {
    setHash(`#position-id-${id}`);
  };
  const handleClose = () => setHash("");

  const positionId = (hash as string)?.match(/#position-id-(.+)/)?.[1];

  const getKey = (pageIndex: number, params: Position) => {
    return {
      url: "/positions",
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
  } = useSWRInfinite<PaginatedResponse<Position>>(getKey, fetchPositions, {
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    onError: () => {
      addToast("Erro ao carregar registros.", { type: "error" });
    },
  });

  const positions = data?.map((page) => page.data).flat() || [];
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

  const handleDeletePosition = async (id: string) => {
    return await deletePosition(`/Position/${id}`, id, {
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
    positions,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeletePosition,
    isLoadingDelete,
    isEmpty,
    isToAddPosition,
    positionId,
    handleAddPosition,
    handleEditPosition,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
