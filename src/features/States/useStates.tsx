import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { State } from "@/interfaces/parameters";
import { fetchStates } from "@/services/parameters";
import { useSearchParams } from "next/navigation";
import useSWRInfinite from "swr/infinite";

export const useStates = () => {
  const { addToast } = useToast();
  const [deleteState, { loading: isLoadingDelete, error: deleteError }] =
    useFetch();
  const [hash, setHash] = useHash();
  const isToAddState = (hash as string)?.match(/#add-state/);

  const handleAddState = () => {
    setHash("#add-state");
  };
  const handleEditState = (id: string) => {
    setHash(`#state-id-${id}`);
  };
  const handleClose = () => setHash("");

  const stateId = (hash as string)?.match(/#state-id-(.+)/)?.[1];

  const filterParams = useSearchParams();
  const stateName = filterParams.get("stateName");

  const getKey = (pageIndex: number, params: State) => {
    return {
      url: "/states",
      args: {
        ...params,
        pageSize: 15,
        pageNumber: pageIndex + 1,
        stateName,
      },
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
  } = useSWRInfinite(getKey, fetchStates, {
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    onError: () => {
      addToast("Erro ao carregar registros.", { type: "error" });
    },
  });

  const states = data?.map((page) => page.data).flat() || [];
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

  const handleDeleteState = async (id: string) => {
    return await deleteState(`/States/${id}`, id, {
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
    states,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteState,
    isLoadingDelete,
    isEmpty,
    isToAddState,
    stateId,
    handleAddState,
    handleEditState,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
