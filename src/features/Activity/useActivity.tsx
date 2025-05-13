"use client";

import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { PaginatedResponse } from "@/interfaces/pagination";
import { Activity } from "@/interfaces/parameters";
import { fetchActivity } from "@/services/parameters";
import { useSearchParams } from "next/navigation";
import useSWRInfinite from "swr/infinite";

interface ActivityFiltersParams {
  code?: string;
  type?: string;
  activityTypeId?: string;
  activityTypeCode?: string;
  flgActive?: "true" | "false";
  submitted?: boolean;
}

export const useActivity = () => {
  const { addToast } = useToast();
  const params = useSearchParams();
  const [deleteActivity, { loading: isLoadingDelete, error: deleteError }] =
    useFetch();
  const [hash, setHash] = useHash();
  const isToAddActivity = (hash as string)?.match(/#add-activity/);

  const handleAddActivity = () => {
    setHash("#add-activity");
  };
  const handleEditActivity = (id: string) => {
    setHash(`#activity-id-${id}`);
  };
  const handleClose = () => setHash("");

  const activityId = (hash as string)?.match(/#activity-id-(.+)/)?.[1];

  const filterParams: ActivityFiltersParams = {
    code: params.get("code") || undefined,
    type: params.get("type") || undefined,
    activityTypeCode: params.get("activityTypeCode") || undefined,
    activityTypeId: params.get("activityTypeId") || undefined,
    flgActive: (params.get("flgActive") as "true" | "false") || undefined,
    submitted: !!params.get("submitted"),
  };

  const hasFilter = Object.values(filterParams).some((value) => !!value);
  const getKey = (pageIndex: number, params: PaginatedResponse<Activity>) => {
    let url = "/activity";

    if (!hasFilter) return null;

    if (filterParams.activityTypeId) url += `-${filterParams.activityTypeId}`;
    if (filterParams.code) url += `-${filterParams.code}`;
    if (filterParams.flgActive || filterParams.flgActive === undefined)
      url += `-${filterParams.flgActive}`;

    return {
      url,
      args: {
        ...params,
        ...filterParams,
        pageSize: 15,
        pageNumber: pageIndex + 1,
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
  } = useSWRInfinite<PaginatedResponse<Activity>>(getKey, fetchActivity, {
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    onError: () => {
      addToast("Erro ao carregar registros.", { type: "error" });
    },
  });

  const activities = data?.map((page) => page.data).flat() || [];
  const hasNext = data?.[0].hasNext;
  const hasData = !!data?.[0].data?.length;
  const isEmpty = data?.[0]?.data?.length === 0 || !data?.[0]?.data?.length;
  const totalCount = data?.[0].totalCount;

  const loadMore = (page: number) => {
    if (hasNext && !isValidating) {
      setSize(page);
    }
  };
  const currentPage = data?.[0].currentPage || 0;

  const handleDeleteActivity = async (id: string) => {
    return await deleteActivity(`/Activity/${id}`, id, {
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
    activities,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteActivity,
    isLoadingDelete,
    isEmpty,
    isToAddActivity,
    activityId,
    handleAddActivity,
    handleEditActivity,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
