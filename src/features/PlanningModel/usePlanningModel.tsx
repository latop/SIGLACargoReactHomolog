import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { PaginatedResponse } from "@/interfaces/pagination";
import { PlanningModel } from "@/interfaces/planning";
import { fetchPlanningModelList } from "@/services/planning";
import useSWRInfinite from "swr/infinite";

export const usePlanningModel = () => {
  const { addToast } = useToast();
  const [
    deletePlanningModel,
    { loading: isLoadingDelete, error: deleteError },
  ] = useFetch();
  const [hash, setHash] = useHash();
  const isToAddPlanningModel = (hash as string)?.match(/#add-planning-model/);

  const handleAddPlanningModel = () => {
    setHash("#add-planning-model");
  };
  const handleEditPlanningModel = (id: string) => {
    setHash(`#planning-model-id-${id}`);
  };
  const handleClose = () => setHash("");

  const planningModelId = (hash as string)?.match(
    /#planning-model-id-(.+)/,
  )?.[1];

  const getKey = (pageIndex: number, params: PlanningModel) => {
    return {
      url: "/PlanningModel",
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
  } = useSWRInfinite<PaginatedResponse<PlanningModel>>(
    getKey,
    fetchPlanningModelList,
    {
      revalidateFirstPage: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      onError: () => {
        addToast("Erro ao carregar registros.", { type: "error" });
      },
    },
  );

  const planningModels = data?.map((page) => page.data).flat() || [];
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

  const handleDeletePlanningModel = async (id: string) => {
    return await deletePlanningModel(`/PlanningModel/${id}`, id, {
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
    planningModels,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeletePlanningModel,
    isLoadingDelete,
    isEmpty,
    isToAddPlanningModel,
    planningModelId,
    handleAddPlanningModel,
    handleEditPlanningModel,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
