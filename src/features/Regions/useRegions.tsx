import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { Region } from "@/interfaces/parameters";
import { fetchRegions } from "@/services/parameters";
import { useSearchParams } from "next/navigation";
import useSWRInfinite from "swr/infinite";

export const useRegions = () => {
  const { addToast } = useToast();
  const [deleteRegion, { loading: isLoadingDelete, error: deleteError }] =
    useFetch();
  const [hash, setHash] = useHash();
  const isToAddRegion = (hash as string)?.match(/#add-region/);

  const handleAddRegion = () => {
    setHash("#add-region");
  };
  const handleEditRegion = (id: string) => {
    setHash(`#region-id-${id}`);
  };
  const handleClose = () => setHash("");

  const regionId = (hash as string)?.match(/#region-id-(.+)/)?.[1];

  const filterParams = useSearchParams();
  const regionName = filterParams.get("regionName");

  const getKey = (pageIndex: number, params: Region) => {
    return {
      url: "/regions",
      args: {
        ...params,
        pageSize: 15,
        pageNumber: pageIndex + 1,
        regionName,
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
  } = useSWRInfinite(getKey, fetchRegions, {
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    onError: () => {
      addToast("Erro ao carregar registros.", { type: "error" });
    },
  });

  const regions = data?.map((page) => page.data).flat() || [];
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

  const handleDeleteRegion = async (id: string) => {
    return await deleteRegion(`/Regions/${id}`, id, {
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
    regions,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteRegion,
    isLoadingDelete,
    isEmpty,
    isToAddRegion,
    regionId,
    handleAddRegion,
    handleEditRegion,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
