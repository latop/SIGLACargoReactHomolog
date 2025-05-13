"use client";

import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { Timezone } from "@/services/query/parameters";
import { fetchTimezones } from "@/services/parameters";
import useSWRInfinite from "swr/infinite";

export const useTimezone = () => {
  const { addToast } = useToast();
  const [deleteTimezone, { loading: isLoadingDelete, error: deleteError }] =
    useFetch();
  const [hash, setHash] = useHash();
  const isToAddTimezone = (hash as string)?.match(/#add-timezone/);

  const handleAddTimezone = () => {
    setHash("#add-timezone");
  };
  const handleEditTimezone = (id: string) => {
    setHash(`#timezone-id-${id}`);
  };
  const handleClose = () => setHash("");

  const timezoneId = (hash as string)?.match(/#timezone-id-(.+)/)?.[1];

  const getKey = (pageIndex: number, params: Timezone) => {
    return {
      url: "/timezone",
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
  } = useSWRInfinite(getKey, fetchTimezones, {
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    onError: () => {
      addToast("Erro ao carregar registros.", { type: "error" });
    },
  });

  const timezones = data?.map((page) => page.data).flat() || [];
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

  const handleDeleteTimezone = async (id: string) => {
    return await deleteTimezone(`/Timezone/${id}`, id, {
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
    timezones,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteTimezone,
    isLoadingDelete,
    isEmpty,
    isToAddTimezone,
    timezoneId,
    handleAddTimezone,
    handleEditTimezone,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
