"use client";

import { useCountries } from "@/features/Countries/useCountries";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { Country } from "@/interfaces/parameters";
import { fetchCountryById } from "@/services/parameters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const countrySchema = z.object({
  code: z
    .string()
    .min(1, {
      message: "Obrigatório",
    })
    .max(3, {
      message: "Máximo 3 caracteres.",
    }),
  name: z
    .string()
    .min(1, {
      message: "Obrigatório",
    })
    .max(100, {
      message: "Máximo 100 caracteres.",
    }),
  codeAlpha3: z
    .string()
    .min(1, {
      message: "Obrigatório",
    })
    .max(3, {
      message: "Máximo 3 caracteres.",
    }),
});

export type CountryFormType = z.infer<typeof countrySchema>;

export const useCountriesDialog = () => {
  const { refreshList } = useCountries();
  const methods = useForm<CountryFormType>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      code: "",
      name: "",
      codeAlpha3: "",
    },
  });
  const { addToast } = useToast();
  const [handleCountry, { error: errorCountry }] = useFetch();

  const [hash, setHash] = useHash();

  const isToAddCountry = !!(hash as string)?.match(/#add-country/)?.[0];
  const countryId = (hash as string)?.match(/#country-id-(.+)/)?.[1];

  const {
    data: country,
    error,
    isLoading,
  } = useSWR<Country>(
    countryId ? { url: `country-${countryId}`, id: countryId } : null,
    fetchCountryById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (countryId) {
          methods.reset({
            code: data.code,
            name: data.name,
            codeAlpha3: data.codeAlpha3,
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

  const handleSubmit = async (data: CountryFormType) => {
    if (isToAddCountry) {
      const body = {
        ...data,
      };
      await handleCountry("/Countries", body, {
        method: "post",
        onSuccess: () => {
          addToast("País adicionado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar país.", { type: "error" });
          console.error(errorCountry);
        },
      });
      return;
    }
    if (countryId) {
      const body = {
        ...data,
        id: country?.id,
      };

      await handleCountry("/Countries", body, {
        method: "put",
        onSuccess: () => {
          addToast("País atualizado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar país.", { type: "error" });
          console.error(errorCountry);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddCountry) {
      methods.reset();
    }
  }, [methods.reset, isToAddCountry]);
  return {
    isToAddCountry,
    countryId,
    methods,
    country,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
