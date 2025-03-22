import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import {
  ActivityTypeResponse,
  ResponsibleSectorResponse,
} from "@/interfaces/parameters";
import { fetchActivityType } from "@/services/parameters";
import useSWRInfinite from "swr/infinite";

export const useActivityType = () => {
  const { addToast } = useToast();
  const [
    deleteResponsibleSector,
    { loading: isLoadingDelete, error: deleteError },
  ] = useFetch();
  const [hash, setHash] = useHash();
  const isToAddActivityType = (hash as string)?.match(/#add-activity-type/);

  const handleAddActivityType = () => {
    setHash("#add-activity-type");
  };
  const handleEditActivityType = (id: string) => {
    setHash(`#activity-type-id-${id}`);
  };
  const handleClose = () => setHash("");

  const activityTypeId = (hash as string)?.match(/#activity-type-id-(.+)/)?.[1];
  console.log(activityTypeId);
  const getKey = (pageIndex: number, params: ResponsibleSectorResponse) => {
    return {
      url: "/activity-type",
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
  } = useSWRInfinite<ActivityTypeResponse>(getKey, fetchActivityType, {
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    onError: () => {
      addToast("Erro ao carregar registros.", { type: "error" });
    },
  });

  const activityType = data?.map((page) => page.data).flat() || [];
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

  const handleDeleteActivityType = async (id: string) => {
    return await deleteResponsibleSector(`/ActivityType/${id}`, id, {
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
    activityType,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteActivityType,
    isLoadingDelete,
    isEmpty,
    isToAddActivityType,
    activityTypeId,
    handleAddActivityType,
    handleEditActivityType,
    totalCount,
    handleClose,
    refreshList,
  };
};
