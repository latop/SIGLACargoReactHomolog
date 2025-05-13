import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { PaginatedResponse } from "@/interfaces/pagination";
import { LocationType } from "@/interfaces/trip";
import { fetchLocationType } from "@/services/trips";
import useSWRInfinite from "swr/infinite";

export const useLocationType = () => {
  const { addToast } = useToast();
  const [deleteLocationType, { loading: isLoadingDelete, error: deleteError }] =
    useFetch();
  const [hash, setHash] = useHash();
  const isToAddLocationType = (hash as string)?.match(/#add-location-type/);

  const handleAddLocationType = () => {
    setHash("#add-location-type");
  };
  const handleEditLocationType = (id: string) => {
    setHash(`#location-type-id-${id}`);
  };
  const handleClose = () => setHash("");

  const locationTypeId = (hash as string)?.match(/#location-type-id-(.+)/)?.[1];

  const getKey = (
    pageIndex: number,
    params: PaginatedResponse<LocationType>,
  ) => {
    return {
      url: "/location-type",
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
  } = useSWRInfinite<PaginatedResponse<LocationType>>(
    getKey,
    fetchLocationType,
    {
      revalidateFirstPage: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      onError: () => {
        addToast("Erro ao carregar registros.", { type: "error" });
      },
    },
  );

  const locationType = data?.map((page) => page.data).flat() || [];
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

  const handleDeleteLocationType = async (id: string) => {
    return await deleteLocationType(`/LocationType/${id}`, id, {
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
    locationType,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteLocationType,
    isLoadingDelete,
    isEmpty,
    isToAddLocationType,
    locationTypeId,
    handleAddLocationType,
    handleEditLocationType,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
