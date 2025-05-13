import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { PaginatedResponse } from "@/interfaces/pagination";
import { ActivityTruck } from "@/interfaces/parameters";
import { fetchActivityTrucks } from "@/services/parameters";
import useSWRInfinite from "swr/infinite";

export const useActivityTruck = () => {
  const { addToast } = useToast();
  const [
    deleteActivityTruck,
    { loading: isLoadingDelete, error: deleteError },
  ] = useFetch();
  const [hash, setHash] = useHash();
  const isToAddActivityTruck = (hash as string)?.match(/#add-activity-truck/);

  const handleAddActivityTruck = () => {
    setHash("#add-activity-truck");
  };
  const handleEditActivityTruck = (id: string) => {
    setHash(`#activity-truck-id-${id}`);
  };
  const handleClose = () => setHash("");

  const activityTruckId = (hash as string)?.match(
    /#activity-truck-id-(.+)/,
  )?.[1];

  const getKey = (pageIndex: number, params: ActivityTruck) => {
    return {
      url: "/activity-trucks",
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
  } = useSWRInfinite<PaginatedResponse<ActivityTruck>>(
    getKey,
    fetchActivityTrucks,
    {
      revalidateFirstPage: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      onError: () => {
        addToast("Erro ao carregar registros.", { type: "error" });
      },
    },
  );

  const activityTrucks = data?.map((page) => page.data).flat() || [];
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

  const handleDeleteActivityTruck = async (id: string) => {
    return await deleteActivityTruck(`/ActivityTruck/${id}`, id, {
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
    activityTrucks,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteActivityTruck,
    isLoadingDelete,
    isEmpty,
    isToAddActivityTruck,
    activityTruckId,
    handleAddActivityTruck,
    handleEditActivityTruck,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
