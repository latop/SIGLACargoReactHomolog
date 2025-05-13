"use client";

import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { PaginatedResponse } from "@/interfaces/pagination";
import { TimezoneValue } from "@/interfaces/parameters";
import { fetchTimezoneValues } from "@/services/parameters";
import useSWRInfinite from "swr/infinite";

export const useTimezoneValue = () => {
  const { addToast } = useToast();
  const [
    deleteTimezoneValue,
    { loading: isLoadingDelete, error: deleteError },
  ] = useFetch();
  const [hash, setHash] = useHash();
  const isToAddTimezoneValue = (hash as string)?.match(/#add-timezone-value/);

  const handleAddTimezoneValue = () => {
    setHash("#add-timezone-value");
  };
  const handleEditTimezoneValue = (id: string) => {
    setHash(`#timezone-value-id-${id}`);
  };
  const handleClose = () => setHash("");

  const timezoneValueId = (hash as string)?.match(
    /#timezone-value-id-(.+)/,
  )?.[1];

  const getKey = (pageIndex: number, params: TimezoneValue) => {
    return {
      url: "/timezone-value",
      args: {
        ...params,
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
  } = useSWRInfinite<PaginatedResponse<TimezoneValue>>(
    getKey,
    fetchTimezoneValues,
    {
      revalidateFirstPage: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      onError: () => {
        addToast("Erro ao carregar registros.", { type: "error" });
      },
    },
  );

  const timezoneValues = data?.map((page) => page.data).flat() || [];
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

  const handleDeleteTimezoneValue = async (id: string) => {
    return await deleteTimezoneValue(`/TimezoneValue/${id}`, id, {
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
    timezoneValues,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteTimezoneValue,
    isLoadingDelete,
    isEmpty,
    isToAddTimezoneValue,
    timezoneValueId,
    handleAddTimezoneValue,
    handleEditTimezoneValue,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
