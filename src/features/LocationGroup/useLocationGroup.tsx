import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { PaginatedResponse } from "@/interfaces/parameters";
import { LocationGroup } from "@/interfaces/trip";
import { fetchLocationGroup } from "@/services/trips";
import useSWRInfinite from "swr/infinite";

export const useLocationGroup = () => {
  const { addToast } = useToast();
  const [
    deleteLocationGroup,
    { loading: isLoadingDelete, error: deleteError },
  ] = useFetch();
  const [hash, setHash] = useHash();
  const isToAddLocationGroup = (hash as string)?.match(/#add-location-group/);

  const handleAddLocationGroup = () => {
    setHash("#add-location-group");
  };
  const handleEditLocationGroup = (id: string) => {
    setHash(`#location-group-id-${id}`);
  };
  const handleClose = () => setHash("");

  const locationGroupId = (hash as string)?.match(
    /#location-group-id-(.+)/,
  )?.[1];

  const getKey = (
    pageIndex: number,
    params: PaginatedResponse<LocationGroup>,
  ) => {
    return {
      url: "/location-group",
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
  } = useSWRInfinite<PaginatedResponse<LocationGroup>>(
    getKey,
    fetchLocationGroup,
    {
      revalidateFirstPage: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      onError: () => {
        addToast("Erro ao carregar registros.", { type: "error" });
      },
    },
  );

  const locationGroup = data?.map((page) => page.data).flat() || [];
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

  const handleDeleteLocationGroup = async (id: string) => {
    return await deleteLocationGroup(`/LocationGroup/${id}`, id, {
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
    locationGroup,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteLocationGroup,
    isLoadingDelete,
    isEmpty,
    isToAddLocationGroup,
    locationGroupId,
    handleAddLocationGroup,
    handleEditLocationGroup,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
