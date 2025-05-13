"use client";

import { useCompanies } from "@/features/Companies/useCompanies";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { fetchCompanyById } from "@/services/parameters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, {
    message: "Obrigatório",
  }),
  code: z.string().min(1, {
    message: "Obrigatório",
  }),
  address: z.string().nullable(),
  cityId: z.string().nullable(),
  stateId: z.string().nullable(),
  countryId: z.string().nullable(),
  regionId: z.string().nullable(),
  isSupplier: z.boolean().default(false),
  city: z
    .object({
      name: z.string().nullable(),
    })
    .nullable(),
  state: z
    .object({
      name: z.string().nullable(),
    })
    .nullable(),
  country: z
    .object({
      name: z.string().nullable(),
    })
    .nullable(),
  region: z
    .object({
      name: z.string().nullable(),
    })
    .nullable(),
});
export type CompanyFormType = z.infer<typeof companySchema>;

export const useCompaniesDialog = () => {
  const { refreshList } = useCompanies();
  const methods = useForm<CompanyFormType>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      code: "",
      address: "",
      cityId: null,
      stateId: null,
      countryId: null,
      regionId: null,
      isSupplier: false,
      city: null,
      state: null,
      country: null,
      region: null,
    },
  });
  const { addToast } = useToast();
  const [handleCompany, { error: errorCompany }] = useFetch();

  const [hash, setHash] = useHash();

  const isToAddCompany = !!(hash as string)?.match(/#add-company/)?.[0];
  const companyId = (hash as string)?.match(/#company-id-(.+)/)?.[1];

  const {
    data: company,
    error,
    isLoading,
  } = useSWR<CompanyFormType>(
    companyId ? { url: `company-${companyId}`, id: companyId } : null,
    fetchCompanyById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (companyId) {
          methods.reset({
            name: data.name,
            code: data.code,
            address: data.address,
            cityId: data.cityId,
            stateId: data.stateId,
            countryId: data.countryId,
            regionId: data.regionId,
            isSupplier: data.isSupplier,
            city: data.city ? { name: data.city.name } : null,
            state: data.state ? { name: data.state.name } : null,
            country: data.country ? { name: data.country.name } : null,
            region: data.region ? { name: data.region.name } : null,
          });
          return;
        }
        methods.reset({});
      },
      onError: () => {
        console.error(error);
      },
    },
  );

  const handleSubmit = async (data: CompanyFormType) => {
    if (isToAddCompany) {
      const body = {
        ...data,
        country: undefined,
        state: undefined,
        city: undefined,
        region: undefined,
      };
      await handleCompany("/Companies", body, {
        method: "post",
        onSuccess: () => {
          addToast("Empresa adicionada com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar empresa.", { type: "error" });
          console.error(errorCompany);
        },
      });
      return;
    }
    if (companyId) {
      const body = {
        ...data,
        id: companyId,
        country: undefined,
        state: undefined,
        city: undefined,
        region: undefined,
      };

      await handleCompany("/Companies", body, {
        method: "put",
        onSuccess: () => {
          addToast("Empresa atualizada com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar empresa.", { type: "error" });
          console.error(errorCompany);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddCompany) {
      methods.reset();
    }
  }, [methods.reset, isToAddCompany]);
  console.log(methods.formState.errors);
  return {
    isToAddCompany,
    companyId,
    methods,
    company,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
