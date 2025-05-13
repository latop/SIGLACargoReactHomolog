"use client";

import { useCities } from "@/features/Cities/useCities";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { City } from "@/interfaces/parameters";
import { fetchCityById } from "@/services/parameters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const citySchema = z.object({
  code: z
    .string()
    .max(3, {
      message: "Máximo 3 caracteres.",
    })
    .nullable()
    .default(""),
  name: z.string().min(1, {
    message: "Obrigatório",
  }),
  stateId: z.string().min(1, {
    message: "Obrigatório",
  }),
  countryId: z.string().min(1, {
    message: "Obrigatório",
  }),
  capital: z.boolean().default(false),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  state: z.any(),
  country: z.any(),
});

export type CityFormType = z.infer<typeof citySchema>;

export const useCitiesDialog = () => {
  const { refreshList } = useCities();
  const methods = useForm<CityFormType>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      code: "",
      name: "",
      stateId: "",
      countryId: "",
      capital: false,
      latitude: 0,
      longitude: 0,
      state: {},
      country: {},
    },
  });
  const { addToast } = useToast();
  const [handleCity, { error: errorCity }] = useFetch();

  const [hash, setHash] = useHash();

  const isToAddCity = !!(hash as string)?.match(/#add-city/)?.[0];
  const cityId = (hash as string)?.match(/#city-id-(.+)/)?.[1];

  const {
    data: city,
    error,
    isLoading,
  } = useSWR<City>(
    cityId ? { url: `city-${cityId}`, id: cityId } : null,
    fetchCityById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (cityId) {
          methods.reset({
            code: data.code,
            name: data.name,
            stateId: data.stateId,
            countryId: data.countryId,
            capital: data.capital,
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            state: data.state,
            country: data.country,
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

  const handleSubmit = async (data: CityFormType) => {
    if (isToAddCity) {
      const body = {
        ...data,
        stateId: data.stateId,
        countryId: data.countryId,
        state: undefined,
        country: undefined,
        // id: "00000000-0000-0000-0000-000000000000",
      };
      await handleCity("/Cities", body, {
        method: "post",
        onSuccess: () => {
          addToast("Cidade adicionada com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar cidade.", { type: "error" });
          console.error(errorCity);
        },
      });
      return;
    }
    if (cityId) {
      const body = {
        ...data,
        id: city?.id,
        stateId: data.stateId,
        countryId: data.countryId,
        state: undefined,
        country: undefined,
      };

      await handleCity("/Cities", body, {
        method: "put",
        onSuccess: () => {
          addToast("Cidade atualizada com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar cidade.", { type: "error" });
          console.error(errorCity);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddCity) {
      methods.reset();
    }
  }, [methods.reset, isToAddCity]);

  return {
    isToAddCity,
    cityId,
    methods,
    city,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
