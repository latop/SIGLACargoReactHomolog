import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { Country } from "@/interfaces/parameters";
import { fetchCountries } from "@/services/parameters";
import useSWRInfinite from "swr/infinite";

export const useCountries = () => {
  const { addToast } = useToast();
  const [deleteCountry, { loading: isLoadingDelete, error: deleteError }] =
    useFetch();
  const [hash, setHash] = useHash();
  const isToAddCountry = (hash as string)?.match(/#add-country/);

  const handleAddCountry = () => {
    setHash("#add-country");
  };
  const handleEditCountry = (id: string) => {
    setHash(`#country-id-${id}`);
  };
  const handleClose = () => setHash("");

  const countryId = (hash as string)?.match(/#country-id-(.+)/)?.[1];

  const getKey = (pageIndex: number, params: Country) => {
    return {
      url: "/countries",
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
  } = useSWRInfinite(getKey, fetchCountries, {
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    onError: () => {
      addToast("Erro ao carregar registros.", { type: "error" });
    },
  });

  const countries = data?.map((page) => page.data).flat() || [];
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

  const handleDeleteCountry = async (id: string) => {
    return await deleteCountry(`/Countries/${id}`, id, {
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
    countries,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteCountry,
    isLoadingDelete,
    isEmpty,
    isToAddCountry,
    countryId,
    handleAddCountry,
    handleEditCountry,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
