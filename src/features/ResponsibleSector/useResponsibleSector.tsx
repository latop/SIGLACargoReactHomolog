import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { ResponsibleSectorResponse } from "@/interfaces/parameters";
import { fetchResponsibleSectors } from "@/services/parameters";
import useSWRInfinite from "swr/infinite";

export const useResponsibleSector = () => {
  const { addToast } = useToast();
  const [
    deleteResponsibleSector,
    { loading: isLoadingDelete, error: deleteError },
  ] = useFetch();
  const [hash, setHash] = useHash();
  const isToAddResponsibleSector = (hash as string)?.match(
    /#add-responsible-sector/,
  );

  const handleAddResponsibleSector = () => {
    setHash("#add-responsible-sector");
  };
  const handleEditResponsibleSector = (id: string) => {
    setHash(`#responsible-sector-id-${id}`);
  };
  const handleClose = () => setHash("");

  const responsibleSectorId = (hash as string)?.match(
    /#responsible-sector-id-(.+)/,
  )?.[1];

  const getKey = (pageIndex: number, params: ResponsibleSectorResponse) => {
    return {
      url: "/responsible-section",
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
  } = useSWRInfinite<ResponsibleSectorResponse>(
    getKey,
    fetchResponsibleSectors,
    {
      revalidateFirstPage: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      onError: () => {
        addToast("Erro ao carregar registros.", { type: "error" });
      },
    },
  );

  const responsibleSection = data?.map((page) => page.data).flat() || [];
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

  const handleDeleteResponsibleSector = async (id: string) => {
    return await deleteResponsibleSector(`/ResponsibleSector/${id}`, id, {
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
    responsibleSection,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteResponsibleSector,
    isLoadingDelete,
    isEmpty,
    isToAddResponsibleSector,
    responsibleSectorId,
    handleAddResponsibleSector,
    handleEditResponsibleSector,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
