import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { fetchTripTypes } from "@/services/trips"; // Import the service
import { useSearchParams } from "next/navigation";
import useSWRInfinite from "swr/infinite";

export const useTripType = () => {
  const { addToast } = useToast();
  const [deleteTripType, { loading: isLoadingDelete, error: deleteError }] =
    useFetch();
  const [hash, setHash] = useHash();

  const isToAddTripType = (hash as string)?.match(/#add-trip-type/)?.[0];
  const handleEditTripType = (id: string) => {
    setHash(`#trip-type-id-${id}`);
  };
  const handleAddTripType = () => {
    setHash("#add-trip-type");
  };
  const handleClose = () => setHash("");

  const tripTypeId = (hash as string)?.match(/#trip-type-id-(.+)/)?.[1];
  const params = useSearchParams();

  const filterParams = {
    code: params.get("code") || undefined,
  };

  const getKey = (pageIndex: number) => {
    return {
      url: "/TripType",
      args: {
        ...filterParams,
        pageSize: 15,
        pageNumber: pageIndex + 1,
      },
      isApiInstance: true,
    };
  };

  const {
    data,
    error,
    isLoading,
    size,
    setSize,
    isValidating,
    mutate: refresh,
  } = useSWRInfinite(getKey, fetchTripTypes, {
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    onError: () => {
      addToast("Erro ao carregar registros.", { type: "error" });
    },
  });

  const hasNext = data?.[0].hasNext;
  const hasData = !!data?.[0].data.length;
  const isEmpty = data?.[0].data.length === 0 || !data?.[0].data.length;
  const totalCount = data?.[0].totalCount;
  const currentPage = data?.[0].currentPage || 0;
  const tripTypes = data?.map((page) => page.data).flat() || [];

  const loadMore = (page: number) => {
    if (hasNext && !isValidating) {
      setSize(page);
    }
  };

  const handleDeleteTripType = async (id: string) => {
    return await deleteTripType(`/TripType/${id}`, id, {
      method: "delete",
      onSuccess: () => {
        refresh();
        addToast("Registro apagado com sucesso!");
      },
      onError: () => {
        addToast("Erro ao apagar registro.", { type: "error" });
        console.error(deleteError);
      },
    });
  };

  return {
    tripTypes,
    loadMore,
    isLoading,
    error,
    isLoadingDelete,
    isEmpty,
    handleDeleteTripType,
    handleClose,
    handleEditTripType,
    isToAddTripType,
    tripTypeId,
    size,
    totalCount,
    isLoadingMore: isValidating,
    currentPage,
    hasData,
    handleAddTripType,
    refresh,
  };
};
