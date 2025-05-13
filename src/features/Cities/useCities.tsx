import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { City } from "@/interfaces/parameters";
import { fetchCities } from "@/services/parameters";
import { useSearchParams } from "next/navigation";
import useSWRInfinite from "swr/infinite";

export const useCities = () => {
  const { addToast } = useToast();
  const [deleteCity, { loading: isLoadingDelete, error: deleteError }] =
    useFetch();
  const [hash, setHash] = useHash();
  const isToAddCity = (hash as string)?.match(/#add-city/);

  const handleAddCity = () => {
    setHash("#add-city");
  };
  const handleEditCity = (id: string) => {
    setHash(`#city-id-${id}`);
  };
  const handleClose = () => setHash("");

  const cityId = (hash as string)?.match(/#city-id-(.+)/)?.[1];

  const filterParams = useSearchParams();
  const stateId = filterParams.get("stateId");
  const cityName = filterParams.get("cityName");

  const getKey = (pageIndex: number, params: City) => {
    if (!stateId && !cityName) return null;

    return {
      url: "/cities",
      args: {
        ...params,
        pageSize: 15,
        pageNumber: pageIndex + 1,
        stateId,
        cityName,
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
  } = useSWRInfinite(getKey, fetchCities, {
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    onError: () => {
      addToast("Erro ao carregar registros.", { type: "error" });
    },
  });

  const cities = data?.map((page) => page.data).flat() || [];
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

  const handleDeleteCity = async (id: string) => {
    return await deleteCity(`/Cities/${id}`, id, {
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
    cities,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteCity,
    isLoadingDelete,
    isEmpty,
    isToAddCity,
    cityId,
    handleAddCity,
    handleEditCity,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
