import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { JustificationType } from "@/interfaces/parameters";
import { fetchJustifications } from "@/services/parameters";
import useSWRInfinite from "swr/infinite";

type JustificationResponse = {
  currentPage?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  pageSize?: number;
  totalPages?: number;
  data: JustificationType[];
  totalCount?: number;
};

export const useJustifications = () => {
  const { addToast } = useToast();
  const [
    deleteJustification,
    { loading: isLoadingDelete, error: deleteError },
  ] = useFetch();
  const [hash, setHash] = useHash();
  const isToAddJustification = (hash as string)?.match(
    /#add-justifications/,
  )?.[0];
  console.log(isToAddJustification);
  const handleAddJustification = () => {
    setHash("#add-justifications");
  };
  const handleEditJustification = (id: string) => {
    setHash(`#justification-id-${id}`);
  };
  const handleClose = () => setHash("");

  const justificationId = (hash as string)?.match(
    /#justification-id-(.+)/,
  )?.[1];

  const getKey = (pageIndex: number, params: JustificationResponse) => {
    return {
      url: "/justifications",
      args: { ...params, pageSize: 10, pageNumber: pageIndex + 1 },
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
  } = useSWRInfinite<JustificationResponse>(getKey, fetchJustifications, {
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    onError: () => {
      addToast("Erro ao carregar registros.", { type: "error" });
    },
  });
  const justifications = data?.map((page) => page.data).flat() || [];

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

  const handleDeleteJustification = async (id: string) => {
    return await deleteJustification(`/Justification/${id}`, id, {
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
    justifications,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteJustification,
    isLoadingDelete,
    isEmpty,
    isToAddJustification,
    justificationId,
    handleAddJustification,
    handleEditJustification,
    totalCount,
    handleClose,
    refreshList,
  };
};
