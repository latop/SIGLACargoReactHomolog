import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { FleetBrand } from "@/interfaces/vehicle";
import { fetchFleetBrands } from "@/services/vehicles";
import useSWRInfinite from "swr/infinite";

export const useFleetBrand = () => {
  const { addToast } = useToast();
  const [deleteFleetBrand, { loading: isLoadingDelete, error: deleteError }] =
    useFetch();
  const [hash, setHash] = useHash();
  const isToAddFleetBrand = (hash as string)?.match(/#add-fleet-brand/);

  const handleAddFleetBrand = () => {
    setHash("#add-fleet-brand");
  };
  const handleEditFleetBrand = (id: string) => {
    setHash(`#fleet-brand-id-${id}`);
  };
  const handleClose = () => setHash("");

  const fleetBrandId = (hash as string)?.match(/#fleet-brand-id-(.+)/)?.[1];

  const getKey = (pageIndex: number, params: FleetBrand) => {
    return {
      url: "/fleet-brands",
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
  } = useSWRInfinite(getKey, fetchFleetBrands, {
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    onError: () => {
      addToast("Erro ao carregar registros.", { type: "error" });
    },
  });

  const fleetBrands = data?.map((page) => page.data).flat() || [];
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

  const handleDeleteFleetBrand = async (id: string) => {
    return await deleteFleetBrand(`/FleetBrand/${id}`, id, {
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
    fleetBrands,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteFleetBrand,
    isLoadingDelete,
    isEmpty,
    isToAddFleetBrand,
    fleetBrandId,
    handleAddFleetBrand,
    handleEditFleetBrand,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
