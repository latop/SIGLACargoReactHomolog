import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { Company } from "@/interfaces/parameters";
import { fetchCompanies } from "@/services/parameters";
import useSWRInfinite from "swr/infinite";

export const useCompanies = () => {
  const { addToast } = useToast();
  const [deleteCompany, { loading: isLoadingDelete, error: deleteError }] =
    useFetch();
  const [hash, setHash] = useHash();
  const isToAddCompany = (hash as string)?.match(/#add-company/);

  const handleAddCompany = () => {
    setHash("#add-company");
  };
  const handleEditCompany = (id: string) => {
    setHash(`#company-id-${id}`);
  };
  const handleClose = () => setHash("");

  const companyId = (hash as string)?.match(/#company-id-(.+)/)?.[1];

  const getKey = (pageIndex: number, params: Company) => {
    return {
      url: "/companies",
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
  } = useSWRInfinite(getKey, fetchCompanies, {
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    onError: () => {
      addToast("Erro ao carregar registros.", { type: "error" });
    },
  });

  const companies = data?.map((page) => page.data).flat() || [];
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

  const handleDeleteCompany = async (id: string) => {
    return await deleteCompany(`/Companies/${id}`, id, {
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
    companies,
    loadMore,
    isLoading,
    error,
    size,
    hasData,
    currentPage,
    handleDeleteCompany,
    isLoadingDelete,
    isEmpty,
    isToAddCompany,
    companyId,
    handleAddCompany,
    handleEditCompany,
    totalCount,
    handleClose,
    refreshList,
    isLoadingMore: isValidating,
  };
};
